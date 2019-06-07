const express=require('express');
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const fs=require('fs');

const port=process.env.PORT||3000;
const app=express();

// setting up middleware for Authentication
const passport=require('passport');

app.use(passport.initialize());
require('./strategy/jwtStrategy')(passport);


//bring all routees
const auth=require('./routes/API/auth');
const profile=require('./routes/API/profile');
const question=require('./routes/API/question');
//middleware for bodyparser
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json());

//mongoDB config
const db=require('./setup/myurl').mongoURL;
//Attempt to connect to database 
mongoose.connect(db,{dbName: 'lcoavinassh'})
        .then(()=>{console.log("mongo DB connected succss")})
        .catch(err=>console.log(err));


app.use(express.static('./routes/public'));


//actual route for auth,profile and question.
app.use('/api/auth',auth);
app.use('/api/profile',profile);
app.use('/api/question',question);



app.get('/welcome',(req,res)=>{
    res.send(req.body)
})

app.listen(port,()=>{console.log(`Application is running in port : ${port}`)});