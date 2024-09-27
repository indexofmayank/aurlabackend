const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({


    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    instructor_name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    language: {
        type: String,
        required: true
    },

    target_audience: {
        type: String,
        required: true
    },

    prerequisites: {
        type: String,
        required: true
    },

    course_content_structure: {
        type: String,
        required: true
    },

    sec_keywords: {
        type: String,
        required: true
    },

    video: {
        type: String,
        required: true,
    }

});

module.exports = mongoose.model('Course', courseSchema);