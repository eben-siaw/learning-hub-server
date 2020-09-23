const mongoose = require("mongoose"); 

const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({  

 user: { 
 type: Schema.Types.ObjectId, 
 ref: 'User'  
 },
  
 postId: { 
 type: Schema.Types.ObjectId, 
 ref: 'Video'
 },     

 content: { 
 type: String, 
 },
 
}, {timeStamp: true}) 

module.exports = mongoose.model('Comment', commentSchema)