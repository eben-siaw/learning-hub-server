const mongoose = require("mongoose"); 

const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({  

 user: { 
 type: Schema.Types.ObjectId, 
 ref: 'User', 
 required: true  
 },
  
 postId: { 
 type: Schema.Types.ObjectId, 
 ref: 'Video'
 },     

 content: { 
 type: String,   
 required: true
 }, 

 createdAt : { 
  type: Date, 
  default: Date.now
 },
 
}, {timeStamp: true}) 

module.exports = mongoose.model('Comment', commentSchema)