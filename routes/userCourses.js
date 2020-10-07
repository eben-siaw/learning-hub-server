const express = require("express");
const router = express.Router(); 
const cors = require("cors"); 
const jwt = require("jsonwebtoken"); 
require("dotenv").config();

const Course = require("../models/Courses")

const User = require("../models/User");

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

//get all courses by instructor with meeting id
router.get("/coursehub", (req, res) => {
	Course.find().then(course => {
		res.json(course);
	});
});  

//get all instructor courses
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
router.post("/join", (req, res) => { 
 
Course.findOne({meetingId: req.body.meetingId}).then(course => { 
	if(course) {    
		const payload = {  
			_id: course._id,
			course_name : course.course_name
		}
		let token = jwt.sign(payload, process.env.secret, {
			expiresIn: 1440,
		  });
	   res.status(200).json({status: "You have joined", token});
	}   
	else { 
	  res.status(404).json({error: "Course not found "})	
	}
 }) 
   .catch(err => { 
	   res.json({error: err});
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
