const express = require("express"); 
const router = express.Router(); 
const cors = require('cors'); 
router.use(cors()); 

const Like = require("../models/LikesDislikes/Likes"); 

const Dislike  = require("../models/LikesDislikes/Dislikes");

const Notifications = require("../models/Notifications/notifications");
const notifications = require("../models/Notifications/notifications");

router.post("/getLikes", (req, res) => {

    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId }
    } else {
        variable = { commentId: req.body.commentId }
    }

    Like.find(variable)
        .exec((err, likes) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, likes })
        })


})

router.post("/unLike", (req, res) => {

    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId , userId: req.body.userId }
    }

    Like.findOneAndDelete(variable)
        .exec((err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })

})



router.post("/upLike", (req, res) => {

    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId , userId: req.body.userId }
    }

    const like = new Like(variable); 

    //if a user click on the like icon save the like models info and in case he already disliked we decrease by 1 
    // the receiving user also gets notified if someone liked his video
    like.save((err, likeResult) => { 

     if (err) return res.json({ success: false, err }); 
        //In case disLike Button is already clicked, we need to decrease the dislike by 1 
       Dislike.findOneAndDelete(variable)
        .exec((err, disLikeResult) => { 
        if (err) return res.status(400).json({ success: false, err }); 
        res.status(200).json({ success: true })
        })  

            const notify = new Notifications({ 
                videoId: req.body.videoId, 
                sender: req.body.userId, 
                userTo: req.body.userTo
            }); 
            notify.save((err, notification) => {  

             if(err) return res.status(400).json({success: false, err}) 
            
             Notifications.find({userTo: notification.notifyTo}) 
             .populate('sender')
             .exec((err, results) => { 
                 if(err) res.json(err) 
                 res.json(results);
             })

            })

    })

})
 
router.get("/getNotifications/:user", (req, res, next) => { 
 
    Notifications.find({userTo: req.params.user})  
    .populate('sender')
    .then(notification => { 
       if(!notification) { 
           return res.json(404).json({message: "No notifications found at this moment"})
       } 
       res.json(notification);
    })
     .catch(error => { 
      console.log(error);
     })
})

module.exports = router;