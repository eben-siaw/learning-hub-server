const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cors = require('cors');  
require('dotenv').config()
const mongoose = require("mongoose");  

const Video  = require("../models/videos/videos");

const User = require("../models/User");

router.use(cors()) 


//upload and save video to the storage and database
router.post("/saveVideo",  (req, res, next) => { 
     
    const video = new Video(req.body)

    video.save((err, video) => {
        if(err) return res.status(400).json(err)
        return res.status(200).json({
            success: true, video 
        })
    })

});

router.get("/getVideos", (req, res) => {

    Video.find()
        .populate('instructor')
        .then(videos => { 
        if(!videos) return res.status(404).json({error: "No videos found"})	   
        return res.status(200).json(videos)
        })
});


router.post("/getVideo", (req, res) => {

    Video.findOne({ "_id" : req.body.videoId })
    .populate('instructor')
    .exec((err, video) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success: true, video })
    })
});  

router.post("/:user/removeVideo/:id", (req, res) => { 

    User.findOne({ _id: req.params.user }).then(user => {
		if (!user) {
			return res.status(400).json({ message: "user does not exist" });
		} else { 
          Video.findOneAndRemove({ _id: req.params.id })  
          .then(video => {
            res.json({ success: true,  video });
        })
        .catch(err => {
            res.json({ err });
        });  
        }
    })
}) 

router.post("/:user/updateVideo/:id", (req, res) => {  
    
    User.findOne({ _id: req.params.user }).then(user => { 

		if (!user) {
			return res.status(400).json({ message: "user does not exist" });
		} else { 
          Video.findOneAndUpdate({ _id: req.params.id })   
          .then(video => {
            res.json({ success: true,  video });
        })
        .catch(err => {
            res.json({ err });
        });  
  
    } 

   }) 

})

module.exports = router;