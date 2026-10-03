const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    skillsToTeach: {
        type: [String],
        default: []
    },

    skillsToLearn: {
        type: [String],
        default: []
    },

    bio: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("User", userSchema);