const mongoose = require('mongoose');
const {Schema} = mongoose

const projectSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
})

module.exports = mongoose.model('Project', projectSchema)