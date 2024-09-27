const router = require('express').Router();
const courseCategoryController = require('../controllers/courseCategoryController');

router.route('/').post(courseCategoryController.createCourseCategory);
router.route('/table/').get(courseCategoryController.getCourseCategoryForTable);
router.route('/:id').delete(courseCategoryController.deleteCourseCategory);
router.route('/:id').put(courseCategoryController.updateCourseCategory);
router.route('/:id').get(courseCategoryController.getCourseCategoryById);

module.exports = router;