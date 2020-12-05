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

// private videos - get only videos by meeting id - private
router.get("/getVideos/:meetingId", (req, res) => {
    Video.find({meetingId: req.params.meetingId})
        .populate('instructor')
        .then(videos => { 
        if(!videos) return res.status(404).json({error: "No Private videos found"})	   
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

router.delete("/removeVideo/:id", (req, res) => { 

     Video.findOneAndDelete({ "_id": req.params.id })  
          .then(video => {
            res.json(video);
        })
        .catch(error => {
            res.json({ error });
        });  
        
}) 

router.patch("/updateVideo/:id", (req, res) => {  
    
     Video.findOneAndUpdate({ "_id": req.params.id }, {
        $set: {
            title: req.body.title,
            description: req.body.description
        }
    })   
     .then(video => {
      res.json({ success: true,  video });
      })
      .catch(err => {
      res.json({ err });
    });  
   
})

module.exports = router;