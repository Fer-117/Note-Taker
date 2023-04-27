const express = require("express");
const tips = require("./notes.js");

const app = express();

app.use("/notes", tips);

module.exports = app;
