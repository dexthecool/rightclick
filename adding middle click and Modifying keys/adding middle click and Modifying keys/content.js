document.addEventListener('contextmenu', function(event) {
  // Prevent the default right-click menu
  event.preventDefault();
  console.log("Right-click detected. Preventing default menu and preparing key press emulation.");
});

let isRightMouseDown = false;
let isMiddleMouseDown = false;
let isCtrlDown = false;
let isAltDown = false;
let isShiftDown = false;
let isEscDown = false;
let isDeleteDown = false;

// Function to emulate a key press
const emulateKeyPress = (key, keyCode, isKeyDown) => {
  const eventOptions = {
    key: key,
    keyCode: keyCode,
    code: `Key${key.toUpperCase()}`,
    which: keyCode,
    bubbles: true,
    cancelable: true,
    composed: true
  };

  // Log the key being emulated
  console.log(`${isKeyDown ? 'Emulating' : 'Stopping'} key press for: ${key}`);

  // Dispatch keydown or keyup event
  const activeElement = document.activeElement;
  const event = new KeyboardEvent(isKeyDown ? 'keydown' : 'keyup', eventOptions);
  const dispatched = activeElement.dispatchEvent(event);
  console.log(`Dispatched ${isKeyDown ? 'keydown' : 'keyup'} event for ${key}: ${dispatched}`);
};

// Listen for mousedown to start key press emulation
document.addEventListener('mousedown', function(event) {
  if (event.button === 2) { // Right mouse button
    isRightMouseDown = true;
    emulateKeyPress('ℇ', 0x2130, true); // Unicode for 'ℇ'
    console.log("Right-click key press emulation started.");
  } else if (event.button === 1) { // Middle mouse button
    isMiddleMouseDown = true;
    emulateKeyPress('℉', 0x2109, true); // Unicode for '℉'
    console.log("Middle-click key press emulation started.");
  }
});

// Listen for mouseup to stop key press emulation
document.addEventListener('mouseup', function(event) {
  if (isRightMouseDown && event.button === 2) {
    isRightMouseDown = false;
    emulateKeyPress('ℇ', 0x2130, false); // Unicode for 'ℇ'
    console.log("Right-click key press emulation stopped.");
  } else if (isMiddleMouseDown && event.button === 1) {
    isMiddleMouseDown = false;
    emulateKeyPress('℉', 0x2109, false); // Unicode for '℉'
    console.log("Middle-click key press emulation stopped.");
  }
});

// Listen for keydown to start key press emulation
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && !isCtrlDown) {
    isCtrlDown = true;
    emulateKeyPress('§', 0x00A7, true); // Unicode for '§'
    console.log("Ctrl key press emulation started.");
  }
  if (event.altKey && !isAltDown) {
    isAltDown = true;
    emulateKeyPress('¶', 0x00B6, true); // Unicode for '¶'
    console.log("Alt key press emulation started.");
  }
  if (event.shiftKey && !isShiftDown) {
    isShiftDown = true;
    emulateKeyPress('©', 0x00A9, true); // Unicode for '©'
    console.log("Shift key press emulation started.");
  }
  if (event.key === 'Escape' && !isEscDown) {
    event.preventDefault(); // Prevent default action (exiting full screen)
    isEscDown = true;
    emulateKeyPress('®', 0x00AE, true); // Unicode for '®'
    console.log("Escape key press emulation started.");
  }
  if (event.key === 'Delete' && !isDeleteDown) {
    isDeleteDown = true;
    emulateKeyPress('℘', 0x2118, true); // Unicode for '℘' (Script Capital P)
    console.log("Delete key press emulation started.");
  }
});

// Listen for keyup to stop key press emulation
document.addEventListener('keyup', function(event) {
  if (!event.ctrlKey && isCtrlDown) {
    isCtrlDown = false;
    emulateKeyPress('§', 0x00A7, false); // Unicode for '§'
    console.log("Ctrl key press emulation stopped.");
  }
  if (!event.altKey && isAltDown) {
    isAltDown = false;
    emulateKeyPress('¶', 0x00B6, false); // Unicode for '¶'
    console.log("Alt key press emulation stopped.");
  }
  if (!event.shiftKey && isShiftDown) {
    isShiftDown = false;
    emulateKeyPress('©', 0x00A9, false); // Unicode for '©'
    console.log("Shift key press emulation stopped.");
  }
  if (event.key === 'Escape' && isEscDown) {
    isEscDown = false;
    emulateKeyPress('®', 0x00AE, false); // Unicode for '®'
    console.log("Escape key press emulation stopped.");
  }
  if (event.key === 'Delete' && isDeleteDown) {
    isDeleteDown = false;
    emulateKeyPress('℘', 0x2118, false); // Unicode for '℘'
    console.log("Delete key press emulation stopped.");
  }
});
