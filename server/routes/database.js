const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Pin = require("../models/Pin");
const Level = require("../models/Level");
const Menu = require("../models/Menu");

// GET route
router.get("/", async (req, res) => {
  try {
    const pinsData = await Pin.find();
    const levelsData = await Level.find();
    const menuData = await Menu.find();

    res.json({ pins: pinsData, levels: levelsData, menus: menuData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// PUT route
router.put("/:dataType/:id", async (req, res) => {
  let Model;
  switch (req.params.dataType) {
    case "pins":
      Model = Pin;
      break;
    case "levels":
      Model = Level;
      break;
    case "menus":
      Model = Menu;
      break;
    default:
      return res.status(400).send(`Invalid data type: ${req.params.dataType}`);
  }

  try {
    const updatedDocument = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDocument) {
      return res
        .status(404)
        .send(`Document with id ${req.params.id} not found`);
    }
    res.json(updatedDocument);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send(`Validation Error: ${error.message}`);
    }
    console.error(error);
    res.status(500).send(`Server error: ${error.message}`);
  }
});

router.post("/:dataType/bulk", async (req, res) => {
  let Model;
  switch (req.params.dataType) {
    case "pins":
      Model = Pin;
      break;
    case "levels":
      Model = Level;
      break;
    case "menus":
      Model = Menu;
      break;
    default:
      return res.status(400).send(`Invalid data type: ${req.params.dataType}`);
  }

  const bulkOps = req.body.map((doc) => {
    let _id = doc._id;
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      _id = new mongoose.Types.ObjectId();
    }
    // Create a new object from doc without the _id field
    const { _id: _, ...update } = doc;
    return {
      updateOne: { filter: { _id }, update, upsert: true },
    };
  });

  try {
    await Model.bulkWrite(bulkOps);
    res.status(200).json({ message: "Bulk update successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `An error occurred during bulk update: ${error.message}`,
    });
  }
});

// POST route
router.post("/:dataType", async (req, res) => {
  let Model;
  switch (req.params.dataType) {
    case "pins":
      Model = Pin;
      break;
    case "levels":
      Model = Level;
      break;
    case "menus":
      Model = Menu;
      break;
    default:
      return res.status(400).send(`Invalid data type: ${req.params.dataType}`);
  }

  try {
    const newDocument = new Model(req.body);
    await newDocument.save();
    res.json(newDocument);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send(`Validation Error: ${error.message}`);
    }
    console.error(error);
    res.status(500).send(`Server error: ${error.message}`);
  }
});

// DELETE route
router.delete("/:dataType/:id", async (req, res) => {
  let Model;
  switch (req.params.dataType) {
    case "pins":
      Model = Pin;
      break;
    case "levels":
      Model = Level;
      break;
    case "menus":
      Model = Menu;
      break;
    default:
      return res.status(400).send("Invalid data type");
  }

  try {
    await Model.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
