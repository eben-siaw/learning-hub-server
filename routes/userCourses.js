const express = require("express");
const router = express.Router(); 

const Course = require("../models/Courses"); 

const User = require("../models/User");

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

//get all courses
router.get("/:user/courses", (req, res) => {
	Course.find({user: req.params.user }).then(course => {
		res.json(course);
	});
}); 

//join a course  
router.post("/join", (req, res) => { 
 
Course.find({meetingId: req.body.meetingId}).then(course => { 
	if(!course) { 
	  return res.status(404).json({error: "Course does not exist"})	
	} 
	return res.status(200).json({success: true, course})
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
				.then(course => res.json({ success: true, course}))
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
			Course.deleteOne({ _id: req.params.id })
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
