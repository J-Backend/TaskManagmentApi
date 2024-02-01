const express = require('express');
const router = express.Router()
const taskController = require('../controllers/taskController')
const verifyJWT = require('../middleware/verifyJWT')


router.use(verifyJWT)

router.route('/')
    .get(taskController.getAll)
    .post(taskController.create)
    .patch(taskController.update)
    .delete(taskController.delete)

module.exports = router