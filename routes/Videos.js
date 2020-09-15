const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cors = require('cors');  
require('dotenv').config()
const GridFsStorage = require('multer-gridfs-storage'); 
const crypto = require('crypto')
const mongoose = require("mongoose"); 
const Video  = require("../models/videos/videos");


router.use(cors()) 

const connect = mongoose.createConnection( 
    process.env.mongoURI, 
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true } 
 );

    let gfs;

    connect.once('open', () => {
        // initialize stream
        gfs = new mongoose.mongo.GridFSBucket(connect.db, {
            bucketName: "uploads"
        });
    });


const storage = new GridFsStorage({
    url: process.env.mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  }); 

const upload = multer({ storage: storage }).single("file")

 // upload the video from onDrop
router.post("/uploadfiles", (req, res) => {

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true,  filename: res.req.file})
    })

});

// save video to the database
router.post("/saveVideo", (req, res) => {

    const video = new Video(req.body)

    video.save((err, video) => {
        if(err) return res.status(400).json({ success: false, err })
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