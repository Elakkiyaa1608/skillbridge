const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

/* =====================================================
   MONGODB CONNECTION
===================================================== */

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.log("❌ MONGO_URI not found in .env");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB Connected Successfully");
    })
    .catch((error) => {
      console.log("❌ MongoDB Connection Failed:");
      console.log(error.message);
    });
}

/* =====================================================
   USER SCHEMA
===================================================== */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

/* =====================================================
   COURSE PROGRESS SCHEMA
===================================================== */

const courseProgressSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    courseId: {
      type: Number,
      required: true,
    },

    progress: {
      type: Number,
      default: 0,
    },

    completedModules: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

courseProgressSchema.index(
  { email: 1, courseId: 1 },
  { unique: true }
);

const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);

/* =====================================================
   ACTIVITY SCHEMA
===================================================== */

const activitySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    icon: String,

    title: String,

    description: String,

    time: {
      type: String,
      default: "Just now",
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", activitySchema);

/* =====================================================
   APPLICATION SCHEMA
===================================================== */

const applicationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    name: String,

    opportunityId: Number,

    opportunityTitle: String,

    company: String,

    phone: String,

    resume: String,

    coverNote: String,

    status: {
      type: String,
      default: "Submitted",
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model(
  "Application",
  applicationSchema
);

/* =====================================================
   HEALTH CHECK
===================================================== */

app.get("/", (req, res) => {
  res.json({
    message: "SkillBridge Backend is Running 🚀",
  });
});

/* =====================================================
   REGISTER
===================================================== */

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields.",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful!",
    });
  } catch (error) {
    console.log("Register Error:", error);

    res.status(500).json({
      message: "Registration failed.",
    });
  }
});

/* =====================================================
   LOGIN
===================================================== */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    res.json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Login Error:", error);

    res.status(500).json({
      message: "Login failed.",
    });
  }
});

/* =====================================================
   GET USER DATA
===================================================== */

app.get("/user/:email", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();

    const user = await User.findOne(
      { email },
      { password: 0 }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const progress = await CourseProgress.find({ email }).sort({
      courseId: 1,
    });

    const activities = await Activity.find({ email })
      .sort({ createdAt: -1 })
      .limit(10);

    const applications = await Application.find({ email }).sort({
      createdAt: -1,
    });

    res.json({
      user,
      progress,
      activities,
      applications,
    });
  } catch (error) {
    console.log("Get User Error:", error);

    res.status(500).json({
      message: "Unable to load user data.",
    });
  }
});

/* =====================================================
   UPDATE PROFILE
===================================================== */

app.put("/user/profile", async (req, res) => {
  try {
    const { oldEmail, name, email } = req.body;

    if (!oldEmail || !name || !email) {
      return res.status(400).json({
        message: "Name and email are required.",
      });
    }

    const existingEmailUser = await User.findOne({
      email: email.toLowerCase(),
      _id: {
        $ne: (
          await User.findOne({
            email: oldEmail.toLowerCase(),
          })
        )?._id,
      },
    });

    if (existingEmailUser) {
      return res.status(400).json({
        message: "This email is already in use.",
      });
    }

    const user = await User.findOneAndUpdate(
      {
        email: oldEmail.toLowerCase(),
      },
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    await CourseProgress.updateMany(
      { email: oldEmail.toLowerCase() },
      { email: email.toLowerCase() }
    );

    await Activity.updateMany(
      { email: oldEmail.toLowerCase() },
      { email: email.toLowerCase() }
    );

    await Application.updateMany(
      { email: oldEmail.toLowerCase() },
      { email: email.toLowerCase() }
    );

    res.json({
      message: "Profile updated successfully!",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Profile Update Error:", error);

    res.status(500).json({
      message: "Unable to update profile.",
    });
  }
});

/* =====================================================
   SAVE COURSE PROGRESS
===================================================== */

app.put("/user/:email/progress/:courseId", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const courseId = Number(req.params.courseId);

    const {
      progress,
      completedModules,
    } = req.body;

    const savedProgress =
      await CourseProgress.findOneAndUpdate(
        {
          email,
          courseId,
        },
        {
          email,
          courseId,
          progress,
          completedModules,
        },
        {
          new: true,
          upsert: true,
        }
      );

    res.json({
      message: "Course progress saved!",
      progress: savedProgress,
    });
  } catch (error) {
    console.log("Progress Error:", error);

    res.status(500).json({
      message: "Unable to save course progress.",
    });
  }
});

/* =====================================================
   GET COURSE PROGRESS
===================================================== */

app.get("/user/:email/progress", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();

    const progress = await CourseProgress.find({ email }).sort({
      courseId: 1,
    });

    res.json(progress);
  } catch (error) {
    console.log("Get Progress Error:", error);

    res.status(500).json({
      message: "Unable to load progress.",
    });
  }
});

/* =====================================================
   SAVE ACTIVITY
===================================================== */

app.post("/user/:email/activity", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();

    const {
      icon,
      title,
      description,
      time,
    } = req.body;

    const activity = new Activity({
      email,
      icon,
      title,
      description,
      time: time || "Just now",
    });

    await activity.save();

    res.status(201).json({
      message: "Activity saved!",
      activity,
    });
  } catch (error) {
    console.log("Activity Error:", error);

    res.status(500).json({
      message: "Unable to save activity.",
    });
  }
});

/* =====================================================
   SUBMIT APPLICATION
===================================================== */

app.post("/user/:email/applications", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();

    const {
      name,
      opportunityId,
      opportunityTitle,
      company,
      phone,
      resume,
      coverNote,
    } = req.body;

    if (
      !name ||
      !opportunityId ||
      !opportunityTitle ||
      !company ||
      !phone ||
      !resume ||
      !coverNote
    ) {
      return res.status(400).json({
        message: "Please fill all application fields.",
      });
    }

    const existingApplication =
      await Application.findOne({
        email,
        opportunityId,
      });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this opportunity.",
      });
    }

    const application = new Application({
      email,
      name,
      opportunityId,
      opportunityTitle,
      company,
      phone,
      resume,
      coverNote,
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully!",
      application,
    });
  } catch (error) {
    console.log("Application Error:", error);

    res.status(500).json({
      message: "Unable to submit application.",
    });
  }
});

/* =====================================================
   GET APPLICATIONS
===================================================== */

app.get("/user/:email/applications", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();

    const applications = await Application.find({
      email,
    }).sort({
      createdAt: -1,
    });

    res.json(applications);
  } catch (error) {
    console.log("Get Applications Error:", error);

    res.status(500).json({
      message: "Unable to load applications.",
    });
  }
});

/* =====================================================
   START SERVER
===================================================== */

app.listen(PORT, () => {
  console.log(`🚀 SkillBridge Backend running on http://localhost:${PORT}`);
});