const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const Syllabus = require("../models/Syllabus");

const router = express.Router();
const upload = multer({ dest: "uploads/" }).single("syllabus");

router.post("/upload", (req, res) => {
    upload(req, res, async (err) => {
        if (!req.file) return res.status(400).json({ error: "File upload missing!" });

        try {
            // 1. PDF-la irundhu text-ai automatic-ah edukkudhu
            const buffer = fs.readFileSync(req.file.path);
            const pdfData = await pdfParse(buffer);
            const cleanText = pdfData.text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');

            // 2. Master Industry Skills-ai database-la irundhu load pannudhu
            const skillsPath = path.join(__dirname, "../data/industrySkills.json");
            const industrySkills = JSON.parse(fs.readFileSync(skillsPath, "utf-8"));

            const foundSkills = [];
            const missingSkills = [];
            
           
            const domainStats = { cloud: 0, ai: 0, software: 0, cyber: 0 };

           
            industrySkills.forEach(skillObj => {
                const skillName = (typeof skillObj === 'string' ? skillObj : skillObj.name || skillObj).toLowerCase().trim();
                const domain = (typeof skillObj === 'object' && skillObj.domain ? skillObj.domain : "software").toLowerCase();

              
                if (cleanText.includes(skillName)) {
                    foundSkills.push(skillName);
                } else {
                    missingSkills.push(skillName);
                   
                    if (domain.includes("cloud")) domainStats.cloud++;
                    else if (domain.includes("data") || domain.includes("ai") || skillName.includes("machine learning") || skillName.includes("deep learning")) domainStats.ai++;
                    else if (domain.includes("cyber") || domain.includes("security") || skillName.includes("security")) domainStats.cyber++;
                    else domainStats.software++;
                }
            });

            const total = industrySkills.length;
            const matched = foundSkills.length;
            const readiness = ((matched / total) * 100).toFixed(2);
            const gapVal = ((missingSkills.length / total) * 100).toFixed(2);

            // 4. Frontend sync aagura mathiri structured data
            const analysisResult = {
                fileName: req.file.originalname,
                summary: {
                    totalSkillsChecked: total,
                    matched: matched,
                    matchedPercentage: readiness, // Progress bar color logic-ku idhu venum
                    curriculumGap: `${gapVal}%`
                },
                domainStats: domainStats, // Inge dhaan dynamic peaks generate aagum
                foundSkillsList: foundSkills,
                missingSkillsList: missingSkills
            };

            const newEntry = new Syllabus({ fileName: req.file.originalname, analysis: analysisResult });
            await newEntry.save();
            
            fs.unlinkSync(req.file.path); 
            res.json(analysisResult);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
});

module.exports = router;