const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    bio: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
     googleId: {
  type: String,
},
    profileImage: { type: String, default: "" } // URL to the profile picture
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.password) return next();
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
