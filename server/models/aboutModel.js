const mongoose = require('mongoose');

const aboutSchema = mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    content: { type: String, required: true },
    mission: { type: String }
}, {
    timestamps: true
});

const About = mongoose.model('About', aboutSchema);

module.exports = About;
