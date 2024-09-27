const router = require('express').Router();
const productCategoryController = require('../controllers/productCategoryController');

router.route('/').post(productCategoryController.createProductCategory);
router.route('/table/').get(productCategoryController.getProductCategoryForTable);
router.route('/:id').delete(productCategoryController.deleteProductCategory);
router.route('/:id').put(productCategoryController.updateProductCategory);
router.route('/:id').get(productCategoryController.getProductCategoryById);

module.exports = router;