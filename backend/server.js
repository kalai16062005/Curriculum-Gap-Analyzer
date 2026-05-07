require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const syllabusRoutes = require("./routes/syllabusRoutes");
const historyRoutes = require("./routes/historyRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/syllabus", syllabusRoutes);
app.use("/api/history", historyRoutes);

app.get("/", (req, res) => {
  res.send("Curriculum Gap Analyzer Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
