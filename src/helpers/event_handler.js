// event_handler.js
//
// A simple event handler that provides on and trigger functionality
//    similar to jQuery.  Useful for wrapping existing event handlers
//    to add functionality to them.
//    Currently only supports one listener per event.

const listeners = {};



export default function EventHandler() {

  // on registers the specified event.
  //
  //    event      String     Event name.
  //    listener   Function   Event handler.

  function on(event, listener) {

    if (!event || (typeof event !== "string")) {
      throw new Error(`EventHandler.on: Invalid event: "${event}"`);
    } else if (typeof listener !== "function") {
      throw new Error("EventHandler.on: Listener is not a function");
    }
    listeners[event] = listener;
    // Return whatever this is to allow on chaining:
    return this;

  }

  // trigger calls the listener for the specified event.
  //
  //    event   String   Event being triggered.

  function trigger(event) { // ...arguments

    if (event && (typeof event === "string") && listeners[event]) {
      listeners[event](...([...arguments].slice(1)));
    }

  }

  return { on, trigger };

}



