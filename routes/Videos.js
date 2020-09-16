const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cors = require('cors');  
require('dotenv').config()
const mongoose = require("mongoose"); 
const Video  = require("../models/videos/videos");


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
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
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

module.exports = router;