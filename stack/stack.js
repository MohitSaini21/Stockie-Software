const fs = require("fs");
const path = require("path");

// Define the stack file path relative to the current working directory
const stackFilePath = path.join(__dirname, "stack.json");

// Function to read the stack from the file asynchronously
function getStack() {
  return new Promise((resolve, reject) => {
    fs.readFile(stackFilePath, "utf8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          // If the file does not exist, return an empty array
          resolve([]);
        } else {
          reject(`Error reading the stack file: ${err}`);
        }
      } else {
        try {
          const stack = JSON.parse(data);
          resolve(stack);
        } catch (parseErr) {
          reject(`Error parsing the stack file: ${parseErr}`);
        }
      }
    });
  });
}

// Function to write the stack to the file asynchronously
function writeStack(stack) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      stackFilePath,
      JSON.stringify(stack, null, 2),
      "utf8",
      (err) => {
        if (err) {
          reject(`Error writing the stack to the file: ${err}`);
        } else {
          resolve();
        }
      }
    );
  });
}

// Function to insert an item at the end of the stack (without deletion)
function insert(item) {
  return getStack()
    .then((stack) => {
      // Insert the item at the end of the stack
      stack.push(item);
      return writeStack(stack);
    })
    .catch((err) => {
      console.error(err);
    });
}

// Function to fetch the last 5 items from the stack (without deletion)
function fetchTable() {
  return getStack()
    .then((stack) => {
      // Fetch the last 5 items without deleting them
      const last5Items = stack.slice(-5); // Get the last 5 items (if available)
      return last5Items; // Return the last 5 items
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = { insert, fetchTable, getStack };
