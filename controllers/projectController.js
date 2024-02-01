const projectModel = require('../models/project')
const BaseController = require('../controllers/baseController')


class ProjectController extends BaseController{
    constructor() {
        super(projectModel)
    }

    isValidate(newData){
        const {title, description, users} = newData

        return title && description && Array.isArray(users) && users.length
    }

    updateData(entity, newData){
        const {title, description, users} = newData

        entity.title = title
        entity.description = description
        entity.users = users
    }
}

module.exports = new ProjectController()