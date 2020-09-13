const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const Streams = mongoose.Schema({ 
  title: { 
   type: String
  }, 
  description: { 
  type: String
  },  
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }
}) 

module.exports = mongoose.model('Stream', Streams)