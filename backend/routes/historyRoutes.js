const express = require("express");
const router = express.Router();

const Syllabus = require("../models/Syllabus");


// ==============================
// GET ALL REPORT HISTORY
// ==============================
router.get("/", async (req, res) => {
    try {

        const reports = await Syllabus.find().sort({ createdAt: -1 });

        const formatted = reports.map(r => ({
            id: r._id,
            fileName: r.fileName,
            gapPercent: r.analysis?.gapPercent || "0%",
            totalSkills: r.analysis?.totalChecked || 0,
            createdAt: r.createdAt
        }));

        res.json(formatted);

    } catch (err) {
        res.status(500).json({
            error: "History Fetch Error",
            message: err.message
        });
    }
});


// ==============================
// GET SINGLE REPORT
// ==============================
router.get("/:id", async (req, res) => {
    try {

        const report = await Syllabus.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }

        res.json(report);

    } catch (err) {
        res.status(500).json({
            error: "Single Report Error",
            message: err.message
        });
    }
});

module.exports = router;
