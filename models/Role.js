const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  endpoints: {
    type: [String],
    required: true,
  },
});

