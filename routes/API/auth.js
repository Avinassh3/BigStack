const express=require('express');
const router =express.Router();
const bcrypt =require('bcrypt');
const jsonwt = require('jsonwebtoken');
const passport = require('passport');
const key=require('../../setup/myurl').secret;

//import schema for person to register
const person=require('../../models/Person');


//@type :POST
//@route :/api/auth/register

router.post('/register',(req,res)=>{
    Person.findOne({email:req.body.email})
    .then(person =>{
        if(person)
        {
            return res.status(400).json({emailError:'Already exist'})
        }
        else{
            const newPerson=new Person({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
            })
            //encrypt password using bcrypt
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newPerson.password,salt,(err,hash)=>{
                    if(err) throw err;
                    newPerson.password=hash;
                    newPerson.save()
                    .then(res.json({message:"Success"}))
                    .catch(err=>{console.log(err)})
                })
            })
        }

    })
    .catch(err=>{console.log(err)});
})


router.post('/login',(req,res)=>{
    const emailR=req.body.inputEmail;
    const pass=req.body.inputPassword;
    Person.findOne({email:emailR})
    .then(person=>{
        if(!person){res.status(404).json({error:'You are not registerd'})}
        //if person exist
            bcrypt.compare(pass,person.password)
            .then(isCorrect=>{
                if(isCorrect){
                    //use payload here please refer strategy folder foe jwtStrategy.js file to understand how did we created token
                    const payload={
                        id:person.id,
                        name:person.name,
                        email:person.email
                    };
                    jsonwt.sign(payload,key,{expiresIn:3600},(err,token)=>{
                        res.json(
                            {success:true,
                             token:token
                            })
                    })
                }
                else{res.json({message:'INVALID PASSWORD'})}
            })
            .catch(err=>console.log(err))
    }
    )
    .catch(err=>{console.log(err)})
})


router.get('/',(req,res)=>{
    res.json({test:"Auth is Success"})
})

//Rou

router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        id: req.user.id,
        name:req.user.name,
        email:req.user.email,
        profilepic:req.user.profilepic
    });
    //console.log(req);
})

module.exports=router;