const express=require('express');
const router =express.Router();

const moongoose=require('mongoose');
const passport=require('passport');

//Load person Model and Profile Model
const Person=require('../../models/Person');
const Profile=require('../../models/Profile');


//@type: GET
//@authorization:Private
//@description:Login username and password


router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(
        profile=>{
            if(!profile){
                return res.status(404).json({profile:'Not Found'})
            }
            res.json(profile);
        }
    )
    .catch(err=>{console.log(err)})
})


//@type: POST
//@authorization:Private
//@description:Updating or Saving new Profile 


router.post('/',
    passport.authenticate('jwt',{session:false}),
    (req,res)=>{
        const profileValues={};
        profileValues.user=req.user.id;
        if(req.body.username) profileValues.username=req.body.username;
        if(req.body.website) profileValues.website=req.body.website;
        if(req.body.country) profileValues.country=req.body.country;
        if(req.body.portfolio) profileValues.portfolio=req.body.portfolio;

        if(typeof req.body.languages!==undefined)
        {
            profileValues.languages=req.body.languages.split(",");
        }
// get social links

profileValues.social={};

        if(req.body.youtube) profileValues.social.youtube=req.body.youtube;
        if(req.body.facebook) profileValues.social.facebook=req.body.facebook;
        if(req.body.instagram) profileValues.social.instagram=req.body.instagram;
        //Do Database Stuff

        Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(profile){
                Profile.findOneAndUpdate(
                    {user:req.user.id},
                    {$set:profileValues},
                    {new:true}
                ).then(profile=>res.json(profile))
                .catch(err=>console.log("problem in update"+err))
            }
            else{
                Profile.findOne({username:profileValues.username})
                .then(profile=>{
                    if(profile){res.status(400).json({username:'Username exist'})}
                    else{
                        new Profile(profileValues).save()
                        .then(profile=>{res.json(profile)})
                        .catch(err=>{console.log("Error raised during saving New User"+err)})
                    }       
                })
                .catch(err=>{console.log('Finding Username Error'+err)})
            }
        })
        .catch(err=>console.log(err))
    }
)


//@type: GET
//@authorization:public
//@description:Getting User details

router.get('/:user',(req,res)=>{
    Profile.findOne({ username:req.params.user}).populate("user",["name","profilepic","id"])
    .then(person=>{
        if(!person){res.status(404).json({UserNotFound:'No user Exist',username:req.params.user})}
        else{res.json(person)}
    })
    .catch(err=>{console.log("error caused at getting user details "+err)})
})

//@type: Delete
//@authorization:Private
//@description:Delete User

router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOneAndRemove({user:req.user.id})
    .then(
        Person.findByIdAndRemove({_id:req.user.id})
        .then(()=>{res.json({Success:true})})
        .catch(err=>{console.log("error caused during Person db deletion"+err)})
    )
    .catch(err=>{console.log("error in Profile db while deletion"+err)})
})

//@type: POST
//@authorization:Private
//@description:and user workroles

router.post('/workrole',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        if(profile){
            const newRole={}
            if(req.body.role){newRole.role=req.body.role}
            if(req.body.company){newRole.company=req.body.company}
            if(req.body.country){newRole.country=req.body.country}
            if(req.body.from){newRole.from=req.body.from}
            if(req.body.to){newRole.to=req.body.to}
            if(req.body.current){newRole.current=req.body.current}
            if(req.body.details){newRole.details=req.body.details}
            profile.workrole.push(newRole);
            profile.save()
            .then(()=>{res.json({Success:true})})
            .catch(err=>{res.json({Success:false});console.log("cant insert workrole "+err)})
        }
    })
    .catch(err=>{console.log("error during finding Id in Workrole "+err)})
})

//@type: DELETE
//@authorization:Private
//@description:Deleting particular workrole from user

router.delete('/workrole/:w_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        //finding index of given id in array object of workrole
        const remove=profile.workrole
        .map(item=>item.id)
        .indexOf(req.params.w_id);

        profile.workrole.splice(remove,1);
        profile.save()
        .then(()=>{res.json({message:"success fully removed workrole"})})
        .catch(err=>{console.log(err)})
    })
    .catch(err=>{console.log("error finding in workrole"+err)})
})

module.exports=router;