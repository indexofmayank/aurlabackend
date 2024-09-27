const router = require('express').Router();
const courseController = require('../controllers/courseController');

// Define the route for creating a course
router.route('/').post(courseController.uploadVideo, courseController.createCourse);
router.route('/table/').get(courseController.getCoursesForTable);

module.exports = router;
