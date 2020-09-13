const express = require('express');  
const cors = require("cors"); 
const streams = express.Router()

streams.use(cors()); 

const Stream = require("../models/streams/streams")

const User = require("../models/User");

//creating 
streams.post("/:user/createstreams", (req, res) => {
    User.findOne({ _id: req.params.user }).then(user => {
	if (!user) {
	 return res.status(400).json({ message: "user does not exist" });
    } 
	 const newStream = new Stream({
    title: req.body.title, 
    description: req.body.description,
	user: user._id
	 });
  	newStream
	.save()
	.then(stream => res.json({ success: true, stream}))
	.catch(error => console.log(error));
    }); 

});

//fetching
streams.get("/:user/getstreams", (req, res) => {
	Stream.find({user: req.params.user})  
	.populate('user')
	.then(stream => {
		res.json(stream);
	});
}); 

//updating 
streams.post("/edit/:id", (req, res) => { 
 
	Stream.updateOne(
		 { _id: req.params.id },
			    {
					$set: {
						title: req.body.title
					}
				}
			)
				.then(stream => {
					res.json({success: true, stream});
				})
				.catch(err => {
					res.json({ err });
				});
})

//deleting  
streams.post("/delete/:id", (req, res) => { 


	Stream.deleteOne({ _id: req.params.id })
		.then(todo => {
	 	res.json({ success: true });
			 })
		.catch(err => {
		res.json({ err });
    	});
	
}) 

module.exports = streams;