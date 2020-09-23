const express = require('express');
const router = express.Router(); 
const cors = require('cors');

router.use(cors())

const Comment = require("../models/comments/comments");

router.post("/saveComment", (req, res) => {

   const comment = new Comment(req.body)
 
    //save comments to the database
    comment.save((err, comment) => {  

        // throw an errow if one
        if (err)  {  
         console.log(err)
         return res.json({ success: false, err }) 
        }    

        //find the id of this document and get a comment
        Comment.find({ '_id': comment._id })
        .populate('user')
        .exec((err, result) => {
            if (err) {  
            console.log(err)
            return res.json({ success: false, err }) 
         }
            return res.status(200).json({ success: true, result })
        })      
      
    })

})

//gets comments 
 router.post("/getComments", (req, res) => {

    Comment.find({ "postId": req.body.videoId })
        .populate('user')
        .exec((err, comments) => {
            if (err) {  
                console.log(err)
                return res.status(400).send(err)  
            }
            res.status(200).json({ success: true, comments })
        })

}); 



module.exports = router;