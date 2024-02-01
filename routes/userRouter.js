const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')


router.use(verifyJWT)

router.route('/')
    .get(userController.getAll)
    .post(userController.create)
    .patch(userController.update)
    .delete(userController.delete)


module.exports = router