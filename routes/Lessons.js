const express = require("express"); 
const router = express.Router()
const cors = require('cors');  

router.use(cors());

const Lesson = require("../models/lessons/lessons");

router.post("/savelesson", (req, res) => { 

 const lessons = new Lesson(req.body); 
  lessons.save((err, lesson) => { 
      if(err) return res.status(400).json(err) 
      return res.status(200).json({success: true, lesson})
  })

}) 

router.get("/getlessons", (req, res, next) => { 

    Lesson.find()
    .populate('instructor')
    .then(lesson => { 
     if(!lesson) return res.status(404).json({error: "No lesson found"})	   
    return res.status(200).json(lesson)
    })
    
}); 

router.get("/viewlesson/:id", (req, res, next) => { 

    Lesson.findOne({"_id": req.params.id})
    .populate('instructor')
    .then(lesson => { 
     if(!lesson) return res.status(404).json({error: "No lesson found"})	   
    return res.status(200).json(lesson)
    })
    
});

module.exports = router;