const mongoose = require('mongoose');

const themeSchema = mongoose.Schema({
    primaryColor: { type: String, default: '#ccff00' },
    backgroundColor: { type: String, default: '#000000' },
    surfaceColor: { type: String, default: '#111111' },
    headingFont: { type: String, default: 'Inter' },
    bodyFont: { type: String, default: 'Inter' }
}, {
    timestamps: true
});

const Theme = mongoose.model('Theme', themeSchema);

module.exports = Theme;
