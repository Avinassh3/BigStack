const express=require('express');

const router =express.Router();

//Load all data models

const Person= require("../../models/Person");
const Profile=require("../../models/Profile")
const Question=require("../../models/Question");


//loading  moongose and passport
const moongose=require("mongoose");
const passport=require('passport');



//@type: POST
//@authorization:Private
//@description:Posting new questions

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const questionValues={}
    questionValues.user=req.user.id;
    if(req.body.questionHead){questionValues.questionHead=req.body.questionHead}
    if(req.body.questionBody){questionValues.questionBody=req.body.questionBody}
    if(req.user.name){questionValues.name=req.user.name}

    Question.findOne({questionHead:questionValues.questionHead})
    .then(question=>{
        if(question){res.json({status:"QuestionExist"})}
        else{
            new Question(questionValues).save()
            .then(question=>{res.json(question)})
            .catch(err=>{console.log("error while saving question "+err)})
        }
    })
    .catch(err=>{console.log("error while tracing question "+err)})

});


//@type: GET
//@authorization:Public
//@description:Getting all questions posted

router.get('/',(req,res)=>{
    Question.find()
    .then(question=>{res.json(question)})
    .catch(err=>{res.json({requestQuestion:"No Questions Found"})})
});



//@type: POST
//@authorization:Private
//@description:Answering Posted question
//@route:api/question/answer/:id

router.post('/answer/:id',passport.authenticate("jwt",{session:false}),(req,res)=>{
    Question.findById(req.params.id)
    .then(
        question=>{
            const ans={}
            ans.user=req.user.id;
            ans.text=req.body.text;
            ans.name=req.user.name;
            question.answers.unshift(ans);
            question.save()
            .then(question=>{res.json(question)})
            .catch(err=>{res.json({error:"Cannont Submit Answer"})})
        }
    )
    .catch(err=>{console.log(err)})
})

//@type: POST
//@authorization:Private
//@description:UpVoting question
//@route:api/question/upvote/:id


router.post('/upvote/:id',passport.authenticate("jwt",{session:false}),(req,res)=>{
    Question.findById(req.params.id)
    .then(question=>{
        const up={}
        up.user=req.user.id;
        if(question.upVotes.filter(upvote=> upvote.user.toString()===req.user.id.toString()).length > 0){
            return res.status(400).json({noupvote:"USer already upvoted"})
        }
        else{
            question.upVotes.unshift(up);
            question.save().then(question=>{res.json(question)}).catch(err=>{console.log(err)})
        }
    })
    .catch(err=>{console.log(err)})
})




module.exports=router;