const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const Video = mongoose.Schema({ 
  title: { 
   type: String,
   required: true
  },   

  description: { 
  type: String, 
  required: true
  },   

  filePath: { 
  type: String
  }, 

  instructor: { 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }, 
 
}, {timestamps: true}) 

module.exports = mongoose.model('Video', Video)