const express = require("express");
const router = express.Router(); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config()
const User = require("../models/User");
const cors = require('cors');
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");  
const crypto = require("crypto");  

const sendgridTransport = require("nodemailer-sendgrid-transport"); 

const {SENDGRID_API, url} = require("../config/keys");

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: SENDGRID_API
    }
}));

router.use(cors());

router.post("/register", (req, res) => {

	User.findOne({ email: req.body.email }) 
	.then(user => {
		if (user) {
			return res.json({error: "Email already exists" });
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
						.then(user =>  { 
							transporter.sendMail({ 
								to:user.email,
								from:"edei-siaw@st.ug.edu.gh",
								subject:"Edunal - Welcome",
								html:`<p>Account successfully created!.</p> 
								 <h1> Create courses and share lessons and videos with Edunal </h1>
					     		`})
							res.json(user)
						})
						.catch(err => console.log(err));
				});
			});
		}
	});
});

router.post("/login", (req, res) => {


	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email: email }) 
	.then(user => {
		if (!user) {
			return res.json({error: "Email not found"});
		}

		bcrypt.compare(req.body.password, user.password).then(isMatch => {
			if (isMatch) {
				const payload = {
					 _id: user._id,
                    first_name: user.first_name,  
                    email: user.email,
					last_name: user.last_name, 
					country: user.country, 
					region: user.region
				};

			  let token = jwt.sign(
					payload,
					 process.env.secret,
					{
						expiresIn: 31556926
					}); 
			   	res.send(token)
			} else {
				return res.json({
					error: "Password is incorrect"
				});
			}
		});
	}) 
	.catch(error => { 
	 res.json({error: "User does not exist!"})	
	})
});

router.post('/resetPassword',(req, res)=>{ 

	crypto.randomBytes(32,(err, buffer)=>{
		if(err){
			console.log(err)
		}
		const token = buffer.toString("hex")
		User.findOne({email:req.body.email})
		.then(user=>{
			if(!user){
				return res.json({error:"User dont exists with that email"})
			}
			user.resetToken = token
			user.expireToken = Date.now() + 3600000
			user.save().then((result)=>{
				transporter.sendMail({
					to:user.email,
					from:"edei-siaw@st.ug.edu.gh",
					subject:"Edunal - Password reset",
					html:`
					<p>You requested for password reset</p>
					<h5>click on this <a href="${url}/reset-pass/${token}">link</a> to reset your password</h5>
					`
				})
				res.json({message:"A link has been sent to your email"})
			})

		})
	})
})

router.post('/new-password', (req, res)=> { 

    const newPassword = req.body.password1; 

    const password2 = req.body.password2;

    if(newPassword !== password2) { 
       res.json({error: "Passwords do not match. Check again!"});  
    }
    const sentToken = req.body.token; 

    Admin.findOne({resetToken: sentToken, expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.json({error: "Try again session expired"})
        } 

        bcrypt.hash(newPassword, 12).then(hashedpassword => { 

           user.password = hashedpassword; 

           user.resetToken = undefined 

           user.expireToken = undefined 

           user.save() 
           .then((saveduser)=>{
               res.json({message:"Your Password has been updated successfully"})
           })
        })
    }).catch(err=>{
       res.json({err: "Failed to reset password!"})
    })
})



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