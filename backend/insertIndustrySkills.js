require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");

// ✅ Model import
const IndustrySkill = require("./models/IndustrySkill");

// ✅ MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    console.log("MongoDB Connected ✅");

    // ✅ JSON read
    const data = JSON.parse(
      fs.readFileSync("./data/industrySkills.json", "utf-8")
    );

    // ✅ Clean skills (empty remove)
    const skills = data
      .filter(skill => skill && skill.trim() !== "")
      .map(skill => ({ skill: skill.trim() }));

    // ✅ Insert into DB
    await IndustrySkill.insertMany(skills, { ordered: false });

    console.log("Industry Skills Inserted 🚀");

    process.exit();

  })
  .catch(err => console.log("MongoDB Error ❌", err));
