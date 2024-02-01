const userModel = require('../models/user')
const taskModel = require('../models/task')
const BaseController = require('../controllers/baseController')
const bcrypt = require('bcrypt');

class UserController extends BaseController {

    constructor() {
        super(userModel)
    }

    isValidate(data) {
        if(data.id){
            const {id, username, email} = data
            return username && email && id
        }else{
            const { username, email, password } = data
            return username && email && password
        }
    }

    async packNewData(data) {
        const hashedPwd = await bcrypt.hash(data.password, 10);
        console.log("hashedPWD ", hashedPwd)

        data.password = hashedPwd;
        console.log("data ", data)
    }

    updateData(entity, newData) {
        const { username, email, password } = newData

        entity.username = username
        entity.email = email
        entity.password = password
    }

    async checkDependencies(id, res) {
        const task = await taskModel.findOne({ user: id }).lean().exec()

        if (task) {
            return res.status(400).json({ message: 'User has assigned tasks' })
        }
    }
}

module.exports = new UserController()