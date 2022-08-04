var mongoose=require("mongoose");

var userSchema = new mongoose.Schema({
    walletAddress:{
        type:String,
        required:true,
        unique:true,
    },
    walletBalance:{
        type:Number,
        default:0
    }
},{timestamps:true});

module.exports = mongoose.model("User",userSchema)