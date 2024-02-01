const taskModel = require('../models/task')
const BaseController = require('../controllers/baseController')
const { parse, format } = require('date-fns')

class TaskController extends BaseController {
    constructor() {
        super(taskModel)
    }

    dateToString(entities) {
        console.log("entities at the beginning", entities)
        entities = entities.map(entity => {
            return {
                ...entity,
                dueDate: format(entity.dueDate, 'MM-dd-yyyy'),
                createdAt: format(entity.createdAt, 'MM-dd-yyyy/HH:mm:ss'),
                updatedAt: format(entity.updatedAt, 'MM-dd-yyyy/HH:mm:ss')
            }
        })
        console.log("entities at the end", entities)
        return entities
        
    }

    isValidate(data) {
        const fields = Object.keys(data)
        console.log("data in validate Tasks ", data)
        const validation = fields.every(Boolean)
        console.log("validation is ", validation)
        return validation
    }

    async packNewData(data) {
        // const values = Object.values(data)
        // const keys = Object.keys(data)

        // const newData = keys.reduce((ac,key,index)=>{
        //     key==='dueDate'
        //     ? ac[key] = parse(values[index], 'MM-dd-yyyy', new Date())
        //     : ac[key] = values[index]
        //     console.log("ac ",ac)
        //     return ac
        // },{})

        // data = newData
        // console.log("newData date ",newData)
        // console.log("newData date ",data)

        const { dueDate } = data
        // const dateType = parse(dueDate, 'MM-dd-yyyy', new Date())
        data.dueDate = this.stringToDate(dueDate)
    }

    updateData(entity, newData) {
        const { title, description, status, dueDate, project, assigneTo } = newData

        entity.title = title
        entity.description = description
        entity.status = status
        entity.dueDate = this.stringToDate(dueDate)
        entity.project = project
        entity.assigneTo = assigneTo
    }

    stringToDate(dueDate) {
        const dateFormated = parse(dueDate, 'MM-dd-yyyy', new Date())
        // data.dueDate = dateType
        return dateFormated
    }
}

module.exports = new TaskController()