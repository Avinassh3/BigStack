const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const QuestionSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"myPerson"
},
    questionHead:{
        type:String,
        required:true
    },
    questionBody:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
    postedDate:{
        type:Date,
        default:Date.now()
    },
    upVotes:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:"myPerson"
        }
        }
    ],
    answers:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:"myPerson"
                },
            text:{
            type:String,
            required:true
                },
            
            name:{
                type:String,
            },
            date:{
                type:Date,
                default:Date.now()
            }

        }

    ]
});

module.exports=Question=mongoose.model('myQuestion',QuestionSchema);