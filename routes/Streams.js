const express = require('express');  
const cors = require("cors"); 
const streams = express.Router()

streams.use(cors()); 

const Stream = require("../models/streams/streams")

//creating 
streams.post("/createstreams", (req, res) => {
	const newStream = new Stream(req.body);
  	newStream
	.save((err, stream) => { 
        if (err) return res.status(400).json(err) 

        return res.status(200).json(stream)
    })

});

//fetching
streams.get("/getstreams", (req, res) => {
	Stream.find()  
	.populate('user')
	.exec((err, stream) => { 
        if(err) return res.status(400).json(err)
		res.json(stream);
	});
}); 

// show a stream
streams.get("/stream/:id", (req, res) => { 
    
	 Stream.findOne({ '_id': req.params.id})
	.exex((err, stream) => { 
    if(err) return res.status(400).json(err)
    res.json(stream);
	})
})

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