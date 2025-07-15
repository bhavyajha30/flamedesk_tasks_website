import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    startedOn : {
        type : Date,
        required: true,
    },
    day : {
        type : Number,
        required : true
    },
    count : {
        type : Number,
        required : true
    },
    image : {
        type : String
    },
    isActive : {
        type : Boolean,
        required: true
    },
    ownerId : {
        type : String,
        required : true
    },
    isFailed : {
        type : Boolean,
        default : false
    },
    doneToday : {
        type : Boolean,
        default : false
    }
});

const Challenge = mongoose.model.Challenge || mongoose.model("Challenge", challengeSchema);

export default Challenge; 