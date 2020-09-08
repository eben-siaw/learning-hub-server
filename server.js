const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser') 
const cookieParser = require('cookie-parser');
const app = express()  
const mongoose = require("mongoose");
const port = process.env.PORT || 5050
require("dotenv").config();  

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json())
app.use(cors())
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
