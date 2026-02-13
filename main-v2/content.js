const GUI_PLAYER_SELECTOR = "div.guiPlayer";

const isEventOnGuiPlayer = (event) => {
  if (event?.target instanceof Element && event.target.closest(GUI_PLAYER_SELECTOR)) {
    return true;
  }

  if (typeof event?.clientX !== "number" || typeof event?.clientY !== "number") {
    return false;
  }

  const elementsAtPointer = document.elementsFromPoint(event.clientX, event.clientY);
  return elementsAtPointer.some(
    (element) => element instanceof Element && !!element.closest(GUI_PLAYER_SELECTOR)
  );
};

const suppressRightClickForScratch = (event) => {
  if (event.button !== 2) {
    return;
  }

  if (!isEventOnGuiPlayer(event)) {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
};

document.addEventListener(
  "contextmenu",
  (event) => {
    // Only suppress context menu when pointer is on Scratch's player container.
    if (!isEventOnGuiPlayer(event)) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    console.log("Right-click detected. Preventing default menu and preparing key press emulation.");
  },
  true
);

let isLeftMouseDown = false;
let isRightMouseDown = false;
let isMiddleMouseDown = false;
let isCtrlDown = false;
let isAltDown = false;
let isShiftDown = false;
let isEscDown = false;
let isDeleteDown = false;
let isBackspaceDown = false;
let isTabDown = false;
let isCapsLockOn = false;
let capsLockInterval;

const EMULATED_KEYS = {
  leftClick: { key: String.fromCodePoint(0x03C0), keyCode: 0x03C0, code: "Key03C0" },
  rightClick: { key: String.fromCodePoint(0x2107), keyCode: 0x2107, code: "Key2107" },
  middleClick: { key: String.fromCodePoint(0x2109), keyCode: 0x2109, code: "Key2109" },
  ctrl: { key: String.fromCodePoint(0x00A7), keyCode: 0x00A7, code: "Key00A7" },
  alt: { key: String.fromCodePoint(0x00B6), keyCode: 0x00B6, code: "Key00B6" },
  shift: { key: String.fromCodePoint(0x00A9), keyCode: 0x00A9, code: "Key00A9" },
  escape: { key: String.fromCodePoint(0x00AE), keyCode: 0x00AE, code: "Key00AE" },
  del: { key: String.fromCodePoint(0x2118), keyCode: 0x2118, code: "Key2118" },
  backspace: { key: String.fromCodePoint(0x2135), keyCode: 0x2135, code: "Key2135" },
  capsLock: { key: String.fromCodePoint(0x2112), keyCode: 0x2112, code: "Key2112" },
  tab: { key: String.fromCodePoint(0xA66E), keyCode: 0xA66E, code: "KeyA66E" }
};

const emulateKeyPress = (mapping, isKeyDown) => {
  if (!mapping || typeof mapping.key !== "string") {
    console.warn("Skipping emulation: invalid mapping", mapping);
    return;
  }

  const eventOptions = {
    key: mapping.key,
    keyCode: mapping.keyCode,
    charCode: mapping.keyCode,
    which: mapping.keyCode,
    code: mapping.code,
    bubbles: true,
    cancelable: true,
    composed: true
  };

  console.log(`${isKeyDown ? "Emulating" : "Stopping"} key press for: ${mapping.key}`);

  const activeElement = document.activeElement || document.body || document;
  const event = new KeyboardEvent(isKeyDown ? "keydown" : "keyup", eventOptions);
  const dispatched = activeElement.dispatchEvent(event);
  console.log(`Dispatched ${isKeyDown ? "keydown" : "keyup"} event for ${mapping.key}: ${dispatched}`);
};

const handleCapsLock = (isOn) => {
  if (isOn) {
    capsLockInterval = setInterval(() => {
      emulateKeyPress(EMULATED_KEYS.capsLock, true);
    }, 50);
    console.log("Caps Lock is on, key press emulation started.");
    return;
  }

  clearInterval(capsLockInterval);
  emulateKeyPress(EMULATED_KEYS.capsLock, false);
  console.log("Caps Lock is off, key press emulation stopped.");
};

document.addEventListener(
  "mousedown",
  (event) => {
    if (event.button === 0 && !isLeftMouseDown) {
      isLeftMouseDown = true;
      emulateKeyPress(EMULATED_KEYS.leftClick, true);
      console.log("Left-click key press emulation started.");
    } else if (event.button === 2 && !isRightMouseDown) {
      isRightMouseDown = true;
      emulateKeyPress(EMULATED_KEYS.rightClick, true);
      console.log("Right-click key press emulation started.");
    } else if (event.button === 1 && !isMiddleMouseDown) {
      isMiddleMouseDown = true;
      emulateKeyPress(EMULATED_KEYS.middleClick, true);
      console.log("Middle-click key press emulation started.");
    }

    suppressRightClickForScratch(event);
  },
  true
);

document.addEventListener(
  "mouseup",
  (event) => {
    if (event.button === 0 && isLeftMouseDown) {
      isLeftMouseDown = false;
      emulateKeyPress(EMULATED_KEYS.leftClick, false);
      console.log("Left-click key press emulation stopped.");
    } else if (event.button === 2 && isRightMouseDown) {
      isRightMouseDown = false;
      emulateKeyPress(EMULATED_KEYS.rightClick, false);
      console.log("Right-click key press emulation stopped.");
    } else if (event.button === 1 && isMiddleMouseDown) {
      isMiddleMouseDown = false;
      emulateKeyPress(EMULATED_KEYS.middleClick, false);
      console.log("Middle-click key press emulation stopped.");
    }

    suppressRightClickForScratch(event);
  },
  true
);

document.addEventListener(
  "click",
  (event) => {
    suppressRightClickForScratch(event);
  },
  true
);

document.addEventListener(
  "auxclick",
  (event) => {
    suppressRightClickForScratch(event);
  },
  true
);

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && !isCtrlDown) {
    isCtrlDown = true;
    emulateKeyPress(EMULATED_KEYS.ctrl, true);
    console.log("Ctrl key press emulation started.");
  }

  if (event.altKey && !isAltDown) {
    isAltDown = true;
    emulateKeyPress(EMULATED_KEYS.alt, true);
    console.log("Alt key press emulation started.");
  }

  if (event.shiftKey && !isShiftDown) {
    isShiftDown = true;
    emulateKeyPress(EMULATED_KEYS.shift, true);
    console.log("Shift key press emulation started.");
  }

  if (event.key === "Escape" && !isEscDown) {
    event.preventDefault();
    isEscDown = true;
    emulateKeyPress(EMULATED_KEYS.escape, true);
    console.log("Escape key press emulation started.");
  }

  if (event.key === "Delete" && !isDeleteDown) {
    isDeleteDown = true;
    emulateKeyPress(EMULATED_KEYS.del, true);
    console.log("Delete key press emulation started.");
  }

  if (event.key === "Backspace" && !isBackspaceDown) {
    isBackspaceDown = true;
    emulateKeyPress(EMULATED_KEYS.backspace, true);
    console.log("Backspace key press emulation started.");
  }

  if (event.key === "Tab" && !isTabDown) {
    event.preventDefault();
    isTabDown = true;
    emulateKeyPress(EMULATED_KEYS.tab, true);
    console.log("Tab key press emulation started.");
  }

  if (event.key === "CapsLock") {
    isCapsLockOn = !isCapsLockOn;
    handleCapsLock(isCapsLockOn);
  }
});

document.addEventListener("keyup", (event) => {
  if (!event.ctrlKey && isCtrlDown) {
    isCtrlDown = false;
    emulateKeyPress(EMULATED_KEYS.ctrl, false);
    console.log("Ctrl key press emulation stopped.");
  }

  if (!event.altKey && isAltDown) {
    isAltDown = false;
    emulateKeyPress(EMULATED_KEYS.alt, false);
    console.log("Alt key press emulation stopped.");
  }

  if (!event.shiftKey && isShiftDown) {
    isShiftDown = false;
    emulateKeyPress(EMULATED_KEYS.shift, false);
    console.log("Shift key press emulation stopped.");
  }

  if (event.key === "Escape" && isEscDown) {
    isEscDown = false;
    emulateKeyPress(EMULATED_KEYS.escape, false);
    console.log("Escape key press emulation stopped.");
  }

  if (event.key === "Delete" && isDeleteDown) {
    isDeleteDown = false;
    emulateKeyPress(EMULATED_KEYS.del, false);
    console.log("Delete key press emulation stopped.");
  }

  if (event.key === "Backspace" && isBackspaceDown) {
    isBackspaceDown = false;
    emulateKeyPress(EMULATED_KEYS.backspace, false);
    console.log("Backspace key press emulation stopped.");
  }

  if (event.key === "Tab" && isTabDown) {
    event.preventDefault();
    isTabDown = false;
    emulateKeyPress(EMULATED_KEYS.tab, false);
    console.log("Tab key press emulation stopped.");
  }
});

window.addEventListener("blur", () => {
  if (isLeftMouseDown) {
    isLeftMouseDown = false;
    emulateKeyPress(EMULATED_KEYS.leftClick, false);
  }

  if (isRightMouseDown) {
    isRightMouseDown = false;
    emulateKeyPress(EMULATED_KEYS.rightClick, false);
  }

  if (isMiddleMouseDown) {
    isMiddleMouseDown = false;
    emulateKeyPress(EMULATED_KEYS.middleClick, false);
  }

  if (isCtrlDown) {
    isCtrlDown = false;
    emulateKeyPress(EMULATED_KEYS.ctrl, false);
  }

  if (isAltDown) {
    isAltDown = false;
    emulateKeyPress(EMULATED_KEYS.alt, false);
  }

  if (isShiftDown) {
    isShiftDown = false;
    emulateKeyPress(EMULATED_KEYS.shift, false);
  }

  if (isEscDown) {
    isEscDown = false;
    emulateKeyPress(EMULATED_KEYS.escape, false);
  }

  if (isDeleteDown) {
    isDeleteDown = false;
    emulateKeyPress(EMULATED_KEYS.del, false);
  }

  if (isBackspaceDown) {
    isBackspaceDown = false;
    emulateKeyPress(EMULATED_KEYS.backspace, false);
  }

  if (isTabDown) {
    isTabDown = false;
    emulateKeyPress(EMULATED_KEYS.tab, false);
  }

  if (isCapsLockOn) {
    isCapsLockOn = false;
    handleCapsLock(false);
  }
});
