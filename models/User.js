const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
  },
  password: {
    type: String,
    requried: true,
  },

  passwordConfirm: {
    type: String,
    requried: true,
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  // check if pass modified
  if (!this.isModified === true) {
    next();
  }

  // encrypt password
  this.password = await bcrypt.hash(this.password, 12);

  // remove pass confirm
  this.passwordConfirm = undefined;
  next();
});

// post save remove password
userSchema.post("/find/", async function (next) {
  this.password = "";
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
