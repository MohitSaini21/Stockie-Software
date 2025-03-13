const express = require("express");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const dotenv = require("dotenv");

dotenv.config();

const { ConnectDB } = require("./db/config.js");
const Table = require("./db/modal.js"); // Adjust the path if necessary

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(express.static("public")); // Serve static files from the "public" directory

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  return res.render("front.ejs");
});
app.get("/home", (req, res) => {
  return res.render("home.ejs");
});

app.post("/postTable", async (req, res) => {
  try {
    console.log(req.body); // Log the incoming request data for debugging

    if (!req.body) {
      return res.json({
        success: false,
        message: "Missing File",
      });
    }

    // Check if a document with the provided uniqueID already exists
    let existingTable = await Table.findOne({ uniqueID: req.body.uniqueID });

    if (existingTable) {
      // If it exists, update the existing document with the new data
      existingTable.tableName = req.body.tableName;
      existingTable.data = req.body.data;
      existingTable.dataTypes = req.body.dataTypes;
      existingTable.lastManipulation = req.body.lastManipulation || ""; // Optional field

      // Save the updated document
      const updatedTable = await existingTable.save();

      // Send a success response with the updated document
      return res.json({
        success: true,
        message: "Table updated successfully",
        data: updatedTable,
      });
    } else {
      // If no document exists with the given uniqueID, create a new one
      const newTable = await Table.create({
        tableName: req.body.tableName,
        uniqueID: req.body.uniqueID,
        data: req.body.data,
        dataTypes: req.body.dataTypes,
        lastManipulation: req.body.lastManipulation || "", // Optional field
      });

      // Send a success response with the new document
      return res.json({
        success: true,
        message: "Table created successfully",
        data: newTable,
      });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.json({
      success: false,
      message: `Error occurred: ${error.message}`,
    });
  }
});

app.get("/getRecentTables", async (req, res) => {
  try {
    // Get the start of today and the end of today using moment.js
    const startOfToday = moment().startOf("day").toDate(); // Start of today
    const endOfToday = moment().endOf("day").toDate(); // End of today

    const tables = await Table.find({
      createdAt: {
        $gte: startOfToday, // Greater than or equal to the start of today
        $lt: endOfToday, // Less than the end of today
      },
    });

    // Send the result as a response
    res.json(tables);
  } catch (error) {
    console.error("Error fetching today's tables:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the tables.",
    });
  }
});

// POST Route to receive the date and fetch documents created on that date
app.post("/date", async (req, res) => {
  try {
    console.log("I am receiving a request");
    console.log(req.body); // You will receive the date in the request body

    const { date } = req.body; // Destructure the received date

    // Check if a date is provided
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date parameter is required.",
      });
    }

    // Convert the received date into start and end of the day using moment.js
    const startOfDay = moment(date).startOf("day").toDate(); // Start of the given date
    const endOfDay = moment(date).endOf("day").toDate(); // End of the given date

    // Query the database to find documents created within this date range
    const tables = await Table.find({
      createdAt: {
        $gte: startOfDay, // Greater than or equal to the start of the day
        $lt: endOfDay, // Less than the end of the day
      },
    });

    // If no documents are found, send an empty array
    if (tables.length === 0) {
      return res.json({
        success: false,
        message: `No tables found for the date ${date}`,
        data: [],
      });
    }

    // Send the found tables in the response
    return res.json({
      success: true,
      message: `Tables found for the date ${date}`,
      data: tables,
    });
  } catch (error) {
    console.error("Error fetching tables:", error);
    return res.status(500).json({
      success: false,
      message: `An error occurred: ${error.message}`,
    });
  }
});

// Start the server
app.listen(port, () => {
  ConnectDB();
  console.log(`Server is running at http://localhost:${port}`);
});
