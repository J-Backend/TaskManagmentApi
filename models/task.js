const mongoose = require('mongoose')
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose)

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['To-Do', 'In-Progress', 'Done'],
      default: 'To-Do',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps:true
  }
)

taskSchema.plugin(AutoIncrement,{
    inc_field:'task',
    id:'taskNums',
    start_seq:1
})

module.exports = mongoose.model('Task', taskSchema);
