const Course = require('../models/courseModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/CatchAsyncErrors');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

// Create course with video
exports.createCourse = catchAsyncError(async (req, res, next) => {
    console.log(req.body);
    // Ensure the video has been uploaded
    // if (!req.file) {
    //     return next(new ErrorHandler("Video upload failed", 400));
    // }

    // Create the course object
    const courseData = {
        title: req.body.title,
        description: req.body.description,
        instructor_name: req.body.instructor_name,
        duration: req.body.duration,
        price: req.body.price,
        category: req.body.category,
        language: req.body.language,
        target_audience: req.body.target_audience,
        prerequisites: req.body.prerequisites,
        course_content_structure: req.body.course_content_structure,
        sec_keywords: req.body.sec_keywords,
        video: req.body.video // Store the video file ID
    };

    // Create a new course instance
    const course = await Course.create(courseData);

    // Respond with the created course
    res.status(201).json({
        success: true,
        course
    });
});

exports.getCoursesForTable = catchAsyncError (async (req, res, next) => {
    try {
        const courses = await Course.aggregate([
            {
                $project: {
                    title: {$ifNull: ["$title", "N/a"]},
                    instructor_name: {$ifNull: ["$instructor_name", "N/a"]},
                    price: {$ifNull: ["$price", "N/a"]},
                    category: {$ifNull: ["$category", "N/a"]},
                }
            }
        ]);
        return res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'something wrong happend while getting course for table'
        })
    }
});
