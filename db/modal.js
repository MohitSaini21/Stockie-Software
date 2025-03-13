const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the "FirstTable"
const firstTableSchema = new Schema(
  {
    tableName: {
      type: String,
      required: true,
    },
    uniqueID: {
      type: String,
      required: true,
    },
    data: [
      [
        // Nested array to hold each row of data
        {
          type: String,
          default: "",
        },
      ],
    ],
    dataTypes: {
      type: [String],
      required: true,
    },
    lastManipulation: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
); // Enables createdAt and updatedAt fields automatically

// Create the model
const Table = mongoose.model("FirstTable", firstTableSchema);
// Create the index for uniqueID explicitly, even though `unique: true` does this automatically
firstTableSchema.index({ uniqueID: 1 }, { unique: true });
module.exports = Table;
