const mongoose = require("mongoose"); 
const Schema = mongoose.Schema; 

const notificationSchema = mongoose.Schema({ 

 videoId: { 
  type : Schema.Types.ObjectId,
  ref: 'Video'
 }, 

 sender : { 
   type: Schema.Types.ObjectId, 
   ref: 'User'
 }, 

 userTo : { 
  type: Schema.Types.ObjectId, 
  ref: 'User'
 }, 
 
  notifiedAt : { 
    type: Date, 
    default: Date.now  
  }

}) 

module.exports = mongoose.model('Notifications', notificationSchema);