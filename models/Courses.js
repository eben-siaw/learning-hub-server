const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const courseSchema = mongoose.Schema({  
  
 user: { 
   type: Schema.Types.ObjectId,  
   ref:'User',
   required: true
 },

 course_name: {
  type: String, 
  required: true
 },
 meetingId: {
 type: String
 },  

 created: {
 type: Date,
 }
  },
  {
  timestamps: false
  }
) 

module.exports = mongoose.model('Courses', courseSchema);