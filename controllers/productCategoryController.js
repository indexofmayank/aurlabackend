const ProductCategory = require('../models/productCategoryModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/CatchAsyncErrors');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

exports.createProductCategory = catchAsyncError(async (req, res, next) => {
    try {
        let { name, image, status } = req.body;

        if (!image) {
            return next(new ErrorHandler('Image is required', 400));
        }

        const { secure_url } = await cloudinary.uploader.upload(image, {
            folder: 'tomper-wear',
        });
        image = secure_url;

        const productCategory = await ProductCategory.create({ name, status, image });
        
        if (!productCategory) {
            return next(new ErrorHandler('Failed to create product category', 500));
        }

        return res.status(201).json({
            success: true,
            message: 'Create successfully'
        });
    } catch (error) {
        console.error(error);
        return next(new ErrorHandler('Server error', 500));
    }
});

exports.getProductCategoryForTable = catchAsyncError (async (req, res, next) => {
    try {
        const productCategories = await ProductCategory.aggregate([
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
            data: productCategories
        });
    } catch (error) {
        console.error(error);
        return next(new ErrorHandler('Server error', 500));
    }
});

exports.deleteProductCategory = catchAsyncError (async (req, res, next) => {
    if(!req.params.id) {
        return next(new ErrorHandler('Category not found', 400));
    }
    const productCategory = await ProductCategory.findById(req.params.id);
    if(!productCategory) {
        return next(new ErrorHandler('Product category not found'));
    }
    await productCategory.remove();
    return res.status(200).json({
        success: true,
        message: 'Product Category Deleted'
    })
});

exports.updateProductCategory = catchAsyncError (async (req, res, next) => {
    try {
        const {id} = req.params;
        let updatedData = req.body;
        const {secure_url} = await cloudinary.uploader.upload(updatedData.image, {
            folder: 'tomper-wear'
        });
        updatedData.image = secure_url;
        const result = await ProductCategory.findByIdAndUpdate(id, updatedData, {new: true});
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

exports.getProductCategoryById = catchAsyncError (async (req, res, next) => {
    try {
        const category = await ProductCategory.aggregate([
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
            data: category[0]
        })

    } catch (error) {
        console.error(error);
        return next(new ErrorHandler('Server error', 500));
    }
});

