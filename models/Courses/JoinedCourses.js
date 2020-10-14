const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const joinedSchema = mongoose.Schema({  
  
 user: { 
   type: Schema.Types.ObjectId,  
   ref:'User',
   required: true
 },
 
 course: {
    type: Schema.Types.ObjectId,
    ref: 'Courses',
    required: true 
  },

 meetingId: {
 type: String
 },  

 joined: {
 type: Date,  
 default: Date.now
 }
  },
  {
  timestamps: false
  }
) 

module.exports = mongoose.model('JoinedCourses', joinedSchema);