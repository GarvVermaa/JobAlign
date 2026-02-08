const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    searches:[{
        company:String,
        designation:String,
        skills:[String],
        timestamp:{
            type:Date,
            default:Date.now,
        }
    }],
    createdAt:{
        type:Date,
        default:Date.now,
    }
});

module.exports=mongoose.model('User',UserSchema);