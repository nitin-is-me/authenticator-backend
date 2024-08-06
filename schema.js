const mongoose=require("mongoose");
const schema=mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

const users=mongoose.model("credentials", schema);
module.exports=users