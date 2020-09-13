const express = require('express');  
const cors = require("cors"); 
const streams = express.Router()

streams.use(cors()); 

const Stream = require("../models/streams/streams")

//creating 
streams.post("/:user/createstreams", (req, res) => {
	const newStream = new Stream({ 
      title: req.body.title, 
      description: req.body.description, 
      user: req.params.user  
    });
  	newStream
	.save((err, stream) => { 
        if (err) return res.status(400).json(err) 

        return res.status(200).json({success: true, stream})
    })

});

//fetching
streams.get("/getstreams", (req, res) => {
	Stream.find()  
	.populate('user')
	.exec((err, stream) => { 
        if(err) return res.status(400).json(err)
		res.status(200).json(stream);
	});
}); 

// show a stream
streams.get("/stream/:id", (req, res) => { 
    
    Stream.findOne({ "_id" : req.params.id})
    .populate('user')
    .exec((err, stream) => {
        if(err)  
        {     
        return res.status(400).send(err); 
        }
        res.status(200).json(stream)
    })
})

//updating 
streams.post("/edit/:id", (req, res) => { 
 
	Stream.findOneAndUpdate(
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

	Stream.findOneAndDelete({ _id: req.params.id })
		.then(stream => {
	 	res.json({ success: true, stream });
			 })
		.catch(err => {
		res.json({ err });
    	});
	
}) 

module.exports = streams;