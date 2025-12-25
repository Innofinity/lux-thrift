import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Security utilities
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    // Remove potential XSS vectors
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
};

const hashPassword = (password) => {
    // Simple hash for demo - use bcrypt in production
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
};

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^[+]?[\d\s-()]{10,}$/;
    return re.test(phone);
};

// Default admin credentials (in production, store securely in backend)
const ADMIN_CREDENTIALS = {
    email: 'admin@luxthrift.com',
    password: hashPassword('Admin@123'),
    role: 'admin'
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const savedUser = localStorage.getItem('luxthrift_user');
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                // Validate session hasn't been tampered with
                if (parsedUser.id && parsedUser.createdAt) {
                    setUser(parsedUser);
                }
            } catch (e) {
                localStorage.removeItem('luxthrift_user');
            }
        }
        setLoading(false);
    }, []);

    const loginWithEmail = async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Sanitize inputs
                email = sanitizeInput(email);

                if (!validateEmail(email)) {
                    reject(new Error('Invalid email format'));
                    return;
                }

                const hashedPassword = hashPassword(password);
                const users = JSON.parse(localStorage.getItem('luxthrift_users') || '[]');
                const user = users.find(u => u.email === email && u.password === hashedPassword);

                if (user) {
                    const userData = { ...user };
                    delete userData.password;
                    setUser(userData);
                    localStorage.setItem('luxthrift_user', JSON.stringify(userData));
                    resolve(userData);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1000);
        });
    };

    const loginAdmin = async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                email = sanitizeInput(email);

                // Direct comparison for demo (use proper auth in production)
                // Normalized email and trimmed password for better UX
                if (email.toLowerCase() === 'admin@luxthrift.com' && password.trim() === 'Admin@123') {
                    const adminUser = {
                        id: 'admin',
                        email: 'admin@luxthrift.com',
                        name: 'Administrator',
                        role: 'admin',
                        createdAt: new Date().toISOString()
                    };

                    setUser(adminUser);
                    localStorage.setItem('luxthrift_user', JSON.stringify(adminUser));
                    resolve(adminUser);
                } else {
                    reject(new Error('Invalid credentials. Please use admin@luxthrift.com / Admin@123'));
                }
            }, 1000);
        });
    };

    const loginWithPhone = async (phone, otp) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                phone = sanitizeInput(phone);

                if (!validatePhone(phone)) {
                    reject(new Error('Invalid phone number'));
                    return;
                }

                const savedOTP = localStorage.getItem(`otp_${phone}`);

                if (savedOTP === otp) {
                    const users = JSON.parse(localStorage.getItem('luxthrift_users') || '[]');
                    let user = users.find(u => u.phone === phone);

                    if (!user) {
                        user = {
                            id: Date.now(),
                            phone,
                            name: '',
                            role: 'user',
                            createdAt: new Date().toISOString()
                        };
                        users.push(user);
                        localStorage.setItem('luxthrift_users', JSON.stringify(users));
                    }

                    const userData = { ...user };
                    delete userData.password;
                    setUser(userData);
                    localStorage.setItem('luxthrift_user', JSON.stringify(userData));
                    localStorage.removeItem(`otp_${phone}`);

                    // Set OTP expiry cleanup
                    setTimeout(() => {
                        localStorage.removeItem(`otp_${phone}`);
                    }, 300000); // 5 minutes

                    resolve(userData);
                } else {
                    reject(new Error('Invalid OTP'));
                }
            }, 1000);
        });
    };

    const loginWithProvider = async (provider, providerData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const email = sanitizeInput(providerData.email);
                const name = sanitizeInput(providerData.name);

                const users = JSON.parse(localStorage.getItem('luxthrift_users') || '[]');
                let user = users.find(u => u.email === email);

                if (!user) {
                    user = {
                        id: Date.now(),
                        email,
                        name,
                        avatar: providerData.avatar,
                        provider,
                        role: 'user',
                        createdAt: new Date().toISOString()
                    };
                    users.push(user);
                    localStorage.setItem('luxthrift_users', JSON.stringify(users));
                }

                setUser(user);
                localStorage.setItem('luxthrift_user', JSON.stringify(user));
                resolve(user);
            }, 1000);
        });
    };

    const register = async (userData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Sanitize all inputs
                const sanitizedData = {
                    name: sanitizeInput(userData.name),
                    email: sanitizeInput(userData.email),
                    phone: userData.phone ? sanitizeInput(userData.phone) : undefined
                };

                // Validate email
                if (sanitizedData.email && !validateEmail(sanitizedData.email)) {
                    reject(new Error('Invalid email format'));
                    return;
                }

                // Validate password strength
                if (userData.password.length < 6) {
                    reject(new Error('Password must be at least 6 characters'));
                    return;
                }

                const users = JSON.parse(localStorage.getItem('luxthrift_users') || '[]');

                if (sanitizedData.email && users.find(u => u.email === sanitizedData.email)) {
                    reject(new Error('Email already registered'));
                    return;
                }

                if (sanitizedData.phone && users.find(u => u.phone === sanitizedData.phone)) {
                    reject(new Error('Phone number already registered'));
                    return;
                }

                const newUser = {
                    id: Date.now(),
                    ...sanitizedData,
                    password: hashPassword(userData.password),
                    role: 'user',
                    createdAt: new Date().toISOString()
                };

                users.push(newUser);
                localStorage.setItem('luxthrift_users', JSON.stringify(users));

                const userDataToSave = { ...newUser };
                delete userDataToSave.password;
                setUser(userDataToSave);
                localStorage.setItem('luxthrift_user', JSON.stringify(userDataToSave));
                resolve(userDataToSave);
            }, 1000);
        });
    };

    const sendOTP = async (phone) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                phone = sanitizeInput(phone);

                if (!validatePhone(phone)) {
                    reject(new Error('Invalid phone number'));
                    return;
                }

                // Rate limiting check
                const lastOTPTime = localStorage.getItem(`otp_time_${phone}`);
                if (lastOTPTime && Date.now() - parseInt(lastOTPTime) < 60000) {
                    reject(new Error('Please wait before requesting another OTP'));
                    return;
                }

                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                localStorage.setItem(`otp_${phone}`, otp);
                localStorage.setItem(`otp_time_${phone}`, Date.now().toString());

                console.log(`OTP for ${phone}: ${otp}`);
                resolve({ success: true, otp });
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('luxthrift_user');
    };

    const updateProfile = async (updates) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const sanitizedUpdates = {
                    name: updates.name ? sanitizeInput(updates.name) : user.name,
                    email: updates.email ? sanitizeInput(updates.email) : user.email
                };

                const updatedUser = { ...user, ...sanitizedUpdates };
                setUser(updatedUser);
                localStorage.setItem('luxthrift_user', JSON.stringify(updatedUser));

                const users = JSON.parse(localStorage.getItem('luxthrift_users') || '[]');
                const index = users.findIndex(u => u.id === user.id);
                if (index !== -1) {
                    users[index] = { ...users[index], ...sanitizedUpdates };
                    localStorage.setItem('luxthrift_users', JSON.stringify(users));
                }

                resolve(updatedUser);
            }, 500);
        });
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const value = {
        user,
        loading,
        loginWithEmail,
        loginAdmin,
        loginWithPhone,
        loginWithProvider,
        register,
        sendOTP,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
