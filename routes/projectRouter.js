const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(projectController.getAll)
    .post(projectController.create)
    .patch(projectController.update)
    .delete(projectController.delete)

module.exports = router