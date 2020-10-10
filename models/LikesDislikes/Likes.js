const mongoose = require("mongoose"); 
const Schema = mongoose.Schema; 

const LikeSchema = mongoose.Schema({ 

userId: { 
type: Schema.Types.ObjectId, 
ref: 'User'
}, 

videoId: { 
type: Schema.Types.ObjectId, 
ref: 'Video'
}

}, {timestamps: true})  

module.exports = mongoose.model('Likes', LikeSchema);

