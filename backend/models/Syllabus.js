const mongoose = require("mongoose");

const SyllabusSchema = new mongoose.Schema({

    fileName:String,
    status:String,

    analysis:{
        found:[String],
        missing:[String],
        gapPercent:String,
        totalChecked:Number
    }

},{timestamps:true});

module.exports = mongoose.model("Syllabus",SyllabusSchema);
