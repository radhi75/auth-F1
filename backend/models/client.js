const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  motpasse: { type: String, required: true },
});

module.exports = mongoose.model("client", clientSchema);
