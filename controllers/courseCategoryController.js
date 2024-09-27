const CourseCategory = require('../models/courseCategoryModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/CatchAsyncErrors');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

exports.createCourseCategory = catchAsyncError (async (req, res, next) => {
    try {  
        let {name, image, status} = req.body;
        if(!image) {
            return next(new ErrorHandler('Image is required', 400));
        }
        const { secure_url } = await cloudinary.uploader.upload(image, {
            folder: 'tomper-wear',
        });
        image = secure_url;
        const courseCategory = await CourseCategory.create({name, status, image});
        return res.status(200).json({
            success: true,
            message: 'Create Successfully'
        });
    } catch (error) {
        console.error(error);
        return next(new ErrorHandler('Server error', 500));
    }
});

exports.getCourseCategoryForTable = catchAsyncError (async (req, res, next) => {
    try {
        const courseCategories = await CourseCategory.aggregate([
            {
                $project: {
                    name: {$ifNull: ["$name", "N/a"]},
                    image: {$ifNull: ["$image", "N/a"]},
                    status: {$ifNull: ["$status", "N/a"]}
                }
            }
        ]);
        return res.status(200).json({
            success: true,
            data: courseCategories
        });
    } catch (error) {
        console.error(error);
        return next(new ErrorHandler('Server error', 500));
    }
});

exports.deleteCourseCategory = catchAsyncError(async (req, res, next) => {
    if(!req.params.id) {
        return next(new ErrorHandler('Category not found', 400));
    }
    const courseCategory = await CourseCategory.findById(req.params.id);
    if(!courseCategory) {
        return next (new ErrorHandler('Course category not found'));
    }
    await courseCategory.remove();
    return res.status(200).json({
        success: true,
        message: 'Course category deleted'
    });
});

exports.updateCourseCategory = catchAsyncError (async (req, res, next) => {
    try {
        const {id} = req.params;
        let updatedData = req.body;
        const {secure_url} = await cloudinary.uploader.upload(updatedData.image, {
            folder: 'tomper-wear'
        });
        updatedData.image = secure_url;
        const result = await CourseCategory.findByIdAndUpdate(id, updatedData, {new: true});
        if(!result) {
            return res.status(400).json({
                success: false,
                message: 'Not able to update'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
});

exports.getCourseCategoryById = catchAsyncError (async (req, res, next) => {
    try {
        const courseCategory = await CourseCategory.aggregate([
            {
                $match: {_id: mongoose.Types.ObjectId(req.params.id)}
            },
            {
                $project: {
                    name: {$ifNull: ["$name", "N/a"]},
                    image: {$ifNull: ["$image", "N/a"]},
                    status: {$ifNull: ["$status", "N/a"]}
                }
            }
        ]);
        return res.status(200).json({
            success: true,
            data: courseCategory[0]
        });
    } catch (error) {
        console.error(error);
        return next(new ErrorHandler('Server error', 500));
    }
});

