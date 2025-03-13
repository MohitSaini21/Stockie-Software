// Get modal, icon, and elements for dragging and resizing
const customModal = document.getElementById("custom-modal");
const customModalHeader = document.getElementById("custom-modal-header");
const customCloseBtn = document.getElementById("custom-close-btn");
const customResizeHandle = document.getElementById("custom-resize-handle");
const customDragIcon = document.getElementById("custom-drag-icon");

let isDragging = false;
let isResizing = false;
let offsetX, offsetY;
let startX, startY, startWidth, startHeight;

// Minimum width and height values
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

// Modal visibility control
let clickCount = 0;
let clickTimeout;

customDragIcon.addEventListener("click", () => {
  clickCount++;

  // Reset the click count if more than 500ms have passed
  clearTimeout(clickTimeout);
  clickTimeout = setTimeout(() => {
    clickCount = 0;
  }, 500);

  // Show modal after the third click
  if (clickCount === 3) {
    customModal.style.display = "flex"; // Show modal
    clickCount = 0; // Reset the count
  }
});

// Close button functionality
customCloseBtn.addEventListener("click", () => {
  customModal.style.display = "none"; // Hide modal
});

// Dragging functionality for the modal header
customModalHeader.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - customModal.offsetLeft;
  offsetY = e.clientY - customModal.offsetTop;

  // Change position to absolute after dragging begins
  customModal.style.position = "absolute";

  document.addEventListener("mousemove", dragModal);
  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.removeEventListener("mousemove", dragModal);
  });
});

function dragModal(e) {
  if (isDragging) {
    customModal.style.left = `${e.clientX - offsetX}px`;
    customModal.style.top = `${e.clientY - offsetY}px`;
  }
}

// Resizing functionality
customResizeHandle.addEventListener("mousedown", (e) => {
  isResizing = true;

  // Get the current modal dimensions and position
  startX = e.clientX;
  startY = e.clientY;
  startWidth = customModal.offsetWidth;
  startHeight = customModal.offsetHeight;

  document.addEventListener("mousemove", resizeModal);
  document.addEventListener("mouseup", () => {
    isResizing = false;
    document.removeEventListener("mousemove", resizeModal);
  });
});

function resizeModal(e) {
  if (isResizing) {
    const diffX = e.clientX - startX;
    const diffY = e.clientY - startY;

    // Calculate the new width and height
    let newWidth = startWidth + diffX;
    let newHeight = startHeight + diffY;

    // Ensure the width and height do not go below the minimum values
    if (newWidth < MIN_WIDTH) {
      newWidth = MIN_WIDTH;
    }
    if (newHeight < MIN_HEIGHT) {
      newHeight = MIN_HEIGHT;
    }

    // Apply the new width and height to the modal
    customModal.style.width = `${newWidth}px`;
    customModal.style.height = `${newHeight}px`;
  }
}

// Draggable icon functionality
customDragIcon.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - customDragIcon.offsetLeft;
  offsetY = e.clientY - customDragIcon.offsetTop;

  document.addEventListener("mousemove", dragIconMove);
  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.removeEventListener("mousemove", dragIconMove);
  });
});

function dragIconMove(e) {
  if (isDragging) {
    customDragIcon.style.left = `${e.clientX - offsetX}px`;
    customDragIcon.style.top = `${e.clientY - offsetY}px`;
  }
}
