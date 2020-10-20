const express = require("express");
const router = express.Router(); 
const cors = require("cors"); 
const jwt = require("jsonwebtoken"); 
require("dotenv").config();

const Course = require("../models/Courses/Courses")

const User = require("../models/User"); 

const JoinedCourses = require("../models/Courses/JoinedCourses");

router.use(cors());

//sends a params with a userid

// get a course details created by a unique user id
router.get("/:user/course/:id", (req, res) => {
	User.findOne({ _id: req.params.user }).then(user => {
		if (!user) {
			return res.status(400).json({ message: "user does not exist" });
		} else {
			Course.findOne({ _id: req.params.id, user: req.params.user })
				.then(course => {
					res.json(course);
				})
				.catch(err => {
					return res.status(400).json({ err });
				});
		}
	});
});

//get all courses joined by user
router.get("/coursehub/:user", (req, res) => {
	JoinedCourses.find({user: req.params.user})
	.populate('course')
	.exec((err, course) => { 
		if(err) return res.status(400).send(err); 
		return res.status(200).json({success: true, course});
	})
});  


//get all Instructor courses 
router.get("/:user/courses", (req, res) => {
	Course.find({user: req.params.user }).then(course => {
		res.json(course);
	});
}); 

router.get("/:user/currentcourse", (req, res) => { 

	Course.findOne({user: req.params.user}) 
	.then(course => { 
		res.json(course);
	})
})

//join a course  
router.post("/join/:user", (req, res) => { 
  
	 Course.findOne({meetingId: req.body.meetingId}).then(result => {  
		if(result) {      
			JoinedCourses.findOne({meetingId: req.body.meetingId}) 
			.then(joined => {  
				if (joined) {   
				return res.status(400).json({message: "You have already join this course!"});  
			    }else { 
			      const userjoin = new JoinedCourses({
				  user: req.params.user,
				  meetingId: req.body.meetingId, 
				  course: result._id });

				  userjoin.save(); 

				 return res.status(200).json({status: "You have successfully joined ", result});
				 
			    } 

			});  
		 
		} else { 
		  res.status(404).json({error: "Course not found"})	
		} 

	 }).catch((error) => { 
		 console.log(error);
	   })
	
})

//create a course
router.post("/:user/addcourse", (req, res) => {

	User.findOne({'_id': req.params.user }).then(user => {
		if (!user) {
			return res.status(400).json({ message: "user does not exist" });
		} else {
			const newcourse = new Course({
                course_name: req.body.course_name, 
                meetingId: req.body.meetingId,
				user: user._id
			});

			newcourse
				.save()
				.then(course => {   
					res.json({ success: true, course})  
				})
				.catch(error => console.log(error)); 

		}
	});
});

//delete a course
router.delete("/:user/course/delete/:id", (req, res) => {
	User.findOne({ _id: req.params.user }).then(user => {
		if (!user) {
			return res.status(400).json({ message: "user does not exist" });
		} else {
			Course.findOneAndDelete({ _id: req.params.id })
				.then(course => {
					res.json({ success: true, course });
				})
				.catch(err => {
					res.json({ err });
				});
		}
	});
}); 



module.exports = router;
