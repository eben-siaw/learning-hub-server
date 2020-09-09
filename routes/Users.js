const express = require("express");
const router = express.Router(); 
const cors = require('cors')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config()
const User = require("../models/User");

const auth = require("../middleware/auth");

router.use(cors())

router.post("/register", (req, res) => {


	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			return res.status(400).json({ message: "email already exists" });
		} else {
			const newUser = new User({
                first_name: req.body.first_name, 
                last_name: req.body.last_name,
				email: req.body.email,
                password: req.body.password, 
                gender: req.body.gender, 
                country: req.body.country, 
                date_of_birth: req.body.date_of_birth, 
                region: req.body.region
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then(user => res.json(user))
						.catch(err => console.log(err));
				});
			});
		}
	});
});

router.post("/login", (req, res) => {


	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email: email }).then(user => {
		if (!user) {
			return res.status(404).json({ emailNotFound: "email not found" });
		}

		bcrypt.compare(req.body.password, user.password).then(isMatch => {
			if (isMatch) {
				const payload = {
					 _id: user._id,
                    first_name: user.first_name,  
                    email: user.email,
                    last_name: user.last_name
				};

			  let token = jwt.sign(
					payload,
					 process.env.jwtSecret,
					{
						expiresIn: 31556926
					}); 
			   	res.send(token)
			} else {
				return res.status(400).json({
					passwordIncorrect: "password incorrect"
				});
			}
		});
	});
});


router.get("/getAuth", auth, (req, res) => {
    res.status(200).json({
        id: req.user.id,
        isAuth: true,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
    });
});

module.exports = router;