const express = require('express')
const bodyParser = require('body-parser') 
const cookieParser = require('cookie-parser');
const app = express()  
const mongoose = require("mongoose");
const port = process.env.PORT || 5050
const cors = require('cors'); 
const router = require("./router");
require("dotenv").config();   

app.use(router); 

const corsOptions = {
  origin: "https://nilee.netlify.app",
  optionsSuccessStatus: 200,
};

app.use(cors()) 
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//connection 
mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => console.log('MongoDB is Connected..'))
.catch(err => console.log(err));

const Users = require('./routes/Users');  
const Courses = require("./routes/userCourses");
 
app.use('/users', Users)
app.use('/courses', Courses)

app.listen(port, function() {
  console.log('Server is running on port: ' + port)
})
