const mongoose = require('mongoose');

const courseCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true,
    },

    status: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CourseCategory', courseCategorySchema);