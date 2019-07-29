const mongoose = require('mongoose');

const hobbySchema = new mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    hobby:{
        type:String,
        required:true
    },
    place:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    describe:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
    ,email:{
        type:String,
        required:true
    }
},{
    timestamps:true
})


const Hobby = mongoose.model("Hobby",hobbySchema);

module.exports = Hobby