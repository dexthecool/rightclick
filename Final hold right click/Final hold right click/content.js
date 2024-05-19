document.addEventListener('contextmenu', function(event) {
  // Prevent the default right-click menu
  event.preventDefault();
  console.log("Right-click detected. Preventing default menu and preparing key press emulation.");

  let isMouseDown = false;

  // Function to emulate a key press
  const emulateKeyPress = (key, keyCode) => {
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
    console.log(`Emulating key press for: ${key}`);

    // Dispatch keydown and keypress events
    const activeElement = document.activeElement;
    const downEvent = new KeyboardEvent('keydown', eventOptions);
    const pressEvent = new KeyboardEvent('keypress', eventOptions);

    const dispatchedDown = activeElement.dispatchEvent(downEvent);
    const dispatchedPress = activeElement.dispatchEvent(pressEvent);
    console.log(`Dispatched keydown event for ${key}: ${dispatchedDown}`);
    console.log(`Dispatched keypress event for ${key}: ${dispatchedPress}`);

    // Set up the mouseup event listener to release the key
    const mouseUpListener = () => {
      if (isMouseDown) {
        const upEvent = new KeyboardEvent('keyup', eventOptions);
        const dispatchedUp = activeElement.dispatchEvent(upEvent);
        console.log(`Dispatched keyup event for ${key}: ${dispatchedUp}`);
        isMouseDown = false; // Reset the flag
        document.removeEventListener('mouseup', mouseUpListener); // Clean up the event listener
      }
    };

    document.addEventListener('mouseup', mouseUpListener);
  };

  // Listen for mousedown to start key press emulation
  document.addEventListener('mousedown', function(event) {
    if (event.button === 2) { // Check if right mouse button is pressed
      isMouseDown = true;
      emulateKeyPress('ℇ', 0x2130); // 0x2130 is the Unicode for 'ℇ'
      console.log("Key press emulation started.");
    }
  });
});
