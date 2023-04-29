const express = require("express");
const router = express.Router();
const path = require("path");
const util = require("util");
const fs = require("fs");
const id = require("../helpers/id");

const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, dbFile) => {
  fs.readFile(dbFile, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile("../Note-Taker/db/db.json", parsedData);
    }
  });
};

// GET Route for retrieving all the tips
router.get("/", (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new UX/UI note
router.post("/", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: id(),
    };

    readAndAppend(newNote, "../Note-Taker/db/db.json");
    res.json(newNote);
  } else {
    res.error("Error in adding tip");
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const data = fs.readFileSync(path.join(__dirname, "../db/db.json"));
  let notes = JSON.parse(data);

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    writeToFile("../Note-Taker/db/db.json", notes);
    res.json(`Note withid ${id} was deleted`);
  } else {
    res.status(404).json(`Note with id ${id} not found.`);
  }
});

module.exports = router;
