const mongoose = require('mongoose');
const bcrypt = require("bcrypt")

const UserSchema = mongoose.Schema({
    first_name: {
      type: String
    },
    last_name: {
      type: String
    },
    email: {
      type: String, 
      unique: 1, 
      trim: true
    },
    password: {
      type: String, 
    },   
    gender: { 
      type: String
    }, 
    country: { 
      type: String
    }, 
    date_of_birth: { 
      type: String
    }, 
    region: { 
    type: String
    },
  
}); 


module.exports = mongoose.model('User', UserSchema);