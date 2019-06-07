const mongoose=require('mongoose');

const schema =mongoose.Schema;

const PersonSchema=new schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required: true
        },
        password:{
            type:String,
            required: true
        },
        username:{
            type:String
        },
        profilepic:{
            type:String,
            default:"https://cdn5.vectorstock.com/i/1000x1000/25/09/user-icon-man-profile-human-avatar-vector-10552509.jpg"
        },
        date:{
            type:Date,
            default:Date.now
        }
    }
);

module.exports= Person =mongoose.model("myPerson",PersonSchema);

