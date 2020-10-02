const express = require('express')
const bodyParser = require('body-parser') 
const cookieParser = require('cookie-parser');
const app = express()  
const mongoose = require("mongoose"); 
const port = process.env.PORT || 5050
const cors = require('cors'); 
const router = require("./router");
require("dotenv").config();    

const ori = "https://nilee.netlify.app" 

app.use(router); 

/* const corsOptions = {
  origin:  "http://localhost:5050",
  optionsSuccessStatus: 200,
};
*/ 

app.use(cors()) 
//app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//connection 
const conn = mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => console.log('MongoDB is Connected..'))
.catch(err => console.log(err));

const Users = require('./routes/Users');  
const Courses = require("./routes/userCourses"); 
const Lessons = require("./routes/Lessons")
const Videos = require("./routes/Videos")
const Comment = require("./routes/comments");

app.use('/users', Users)
app.use('/courses', Courses) 
app.use('/lesson', Lessons)
app.use('/video', Videos)
app.use('/comment', Comment)

app.listen(port, function() {
  console.log('Server is running on port: ' + port)
})
