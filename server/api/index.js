const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import models
const dashBoardModel = require("../models/dashboard");
const studentModel = require("../models/Student");
const sprofile = require("../models/Sprofile");
const csModel = require("../models/courseStructure");

const app = express();

// ✅ Middleware for CORS and JSON parsing
const corsOptions = {
  origin: "https://school-1rzs.vercel.app", // Allow all paths from this domain
  credential: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


app.use(express.json()); // ✅ This allows parsing of JSON request bodies

// ✅ MongoDB Connection
mongoose.connect(
  "mongodb+srv://dinu3509:diNesh%4005@cluster0.duykm.mongodb.net/dinesh?retryWrites=true&w=majority&appName=Cluster0"
);

// ✅ Root route
app.get("/", (req, res) => {
  res.json("Hi Dinesh Reddy");
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  try {
    console.log("Received Body:", req.body); // 🔴 Debugging only

    const { uid, password } = req.body;

    if (!uid || !password) {
      return res.status(400).json({ message: "Missing uid or password" });
    }

    // Fetch user from MongoDB
    const user = await studentModel.findOne({ uid });

    if (!user) {
      console.log("User not found for UID:", uid);
      return res.status(404).json({ message: "No record existed" });
    }

    if (user.password === password) {
      console.log("Password Matched ✅");
      return res.json({ message: "Success" });
    } else {
      console.log("Password Incorrect ❌");
      return res.status(401).json({ message: "Password Incorrect" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

// ✅ Home Route
app.post("/home", async (req, res) => {
  try {
    console.log("Received Home Request:", req.body); // 🔴 Debugging only

    const { uid, section } = req.body;

    if (!uid || !section) {
      return res.status(400).json({ message: "Missing uid or section" });
    }

    if (section === "profile") {
      const user = await sprofile.findOne({ uid });
      return user
        ? res.json({ message: "Profile found", user })
        : res.status(404).json({ message: "No user found" });
    }

    if (section === "dashboard") {
      const user = await dashBoardModel.findOne({ uid });
      if (!user) return res.status(404).json({ message: "No user found" });

      const user2 = await csModel.findOne({ uid });
      return user2
        ? res.json({ message: "Dashboard found", user, user2 })
        : res.status(404).json({ message: "No user2 found" });
    }
    if(section === "attendance"){
      const user = await csModel.findOne({uid});
      if(!user){ return res.status(404).json({message:"No user FOund"})}
      return user 
      ? res.json({message:"Details Found",user})
      : res.status(404).json({message:"No user found"})
    }

    res.status(400).json({ message: "Invalid section" });
  } catch (err) {
    console.error("Error during home section fetch:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});
module.exports = app;
