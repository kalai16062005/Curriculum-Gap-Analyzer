const IndustrySkill = require("../models/IndustrySkill");

async function extractSkillsFromText(text) {

  const industrySkills = await IndustrySkill.find();

  const foundSkills = [];

  const lowerText = text.toLowerCase();

  industrySkills.forEach(skill => {

    if (lowerText.includes(skill.skill.toLowerCase())) {
      foundSkills.push(skill.skill);
    }

  });

  return foundSkills;
}

module.exports = extractSkillsFromText;
