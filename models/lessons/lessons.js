const mongoose = require("mongoose"); 
const Schema = mongoose.Schema; 

const lessonSchema = mongoose.Schema({ 

 instructor: { 
  type: Schema.Types.ObjectId, 
  ref: 'User'
 }, 
 
 lessonTitle: { 
    type: String
 },

 fileUrl: { 
   type: String
 }, 
  
 meetingId: { 
    type: String
 }

}, 

{timestamp: true 

}
) 

module.exports = mongoose.model('lessons', lessonSchema)