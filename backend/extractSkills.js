const fs = require("fs");
const csv = require("csv-parser");

const skillsSet = new Set();

// 📁 FILE 1
fs.createReadStream("./data/industry-datasets/IT_Job_Roles_Skills.csv")
  .pipe(csv())
  .on("data", (row) => {
    if (row["Skills"]) {
      row["Skills"].split(",").forEach(skill => {
        skillsSet.add(skill.trim().toLowerCase());
      });
    }
  })
  .on("end", () => {
    console.log("File 1 processed ✅");
    processSecondFile();
  });

function processSecondFile() {
  fs.createReadStream("./data/industry-datasets/JobsDatasetProcessed.csv")
    .pipe(csv())
    .on("data", (row) => {
      if (row["IT Skills"]) {
        row["IT Skills"].split(",").forEach(skill => {
          skillsSet.add(skill.trim().toLowerCase());
        });
      }
    })
    .on("end", () => {
      console.log("File 2 processed ✅");

      const skillsArray = Array.from(skillsSet);

      fs.writeFileSync(
        "./data/industrySkills.json",
        JSON.stringify(skillsArray, null, 2)
      );

      console.log("Industry Skills JSON Created 🚀");
    });
}
