const mongoose = require("mongoose");

const IndustrySkillSchema = new mongoose.Schema({
    skill:String
});

module.exports = mongoose.model("IndustrySkill",IndustrySkillSchema);
