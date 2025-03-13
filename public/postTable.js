function sendPostRequest(data, selectedTable) {
  // Validate the input data before sending it
  if (
    !data ||
    !data.tableName ||
    !data.uniqueID ||
    !data.data ||
    !data.dataTypes
  ) {
    alert(
      "Missing required data. Please ensure the table name, unique ID, data, and data types are provided."
    );
    return; // Early exit if the required data is not present
  }

  fetch("https://stockie-software.onrender.com/postTable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Convert the object to JSON string
  })
    .then((response) => {
      // Check if the response is successful (status code 2xx)
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      return response.json(); // Parse the response as JSON
    })
    .then((responseData) => {
      if (responseData.success) {
        alert(responseData.message); // Alert with the success message
        selectedTable.style.display = "none";
        popFromStack(responseData.data.uniqueID);
        const html = `
          <div class="col">
                <div class="p-3">
                  <img
                    src="/473dc604-c750-41f5-b394-1b9d1799ff06.svg"
                    alt="Excel File"
                    class="img-fluid"
                    style="max-width: 100%; height: auto"
                  />
                  ${responseData.data.tableName}
                </div>
              </div>`;

        // Log and check if dbContainer exists
        const container = document.getElementById("dbContainer");
        console.log(container); // Check if container is found

        if (container) {
          // Create a temporary element and append the new content
          const tempElement = document.createElement("div");
          tempElement.innerHTML = html;

          // Ensure we're getting the first valid child (element)
          const cardElement = tempElement.firstElementChild;
          console.log(cardElement); // Check if cardElement is valid

          container.appendChild(cardElement);

          if (
            document.getElementById("uniqueID").textContent ===
            responseData.data.uniqueID
          ) {
            const tableNameTag = document.getElementById("currTableName");
            const uniqueIDTag = document.getElementById("uniqueID");
            tableNameTag.innerText = null;
            uniqueIDTag.textContent = null;
            const table = document.getElementById("dynamicTable");
            table.innerHTML = ""; // Clear any previous table
            window.location.reload();
          }
        } else {
          console.error("dbContainer not found!");
        }
      } else {
        // Handle failure case (e.g., server validation failed)
        alert(`Error: ${responseData.message}`);
      }
    })
    .catch((error) => {
      // Catch network errors or invalid responses
      console.error(error); // Log the error for debugging
      alert(`An error occurred: ${error.message}`); // Display an error alert to the user
    });
}
