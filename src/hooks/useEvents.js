


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

     // if (!listeners[event]) {
     //   listeners[event] = [];
     // }
     // listeners[event].push(listener);
     listeners[event] = listener;
  }

  // trigger calls the listener for the specified event.
  //
  //    event   String   Event being triggered.
  //    args    Array    Arguments to pass to the listener.  If args is not an array, the arguments array is passed instead.

  function trigger(event, args) {
     //console.log("EventHandler.trigger", event);
     if (event && (typeof event === "string") && listeners[event]) {
        // Call the listener with no arguments:
        if (typeof args === "undefined") {
           listeners[event]();
        } else {
           // Call the listener with the args array:
           if (Array.isArray(args)) {
              listeners[event].apply(null, args);
           // Call the listener with the arguments array:
           } else {
              //const args_array = [...arguments];
              //const args_array = Array.from(arguments);
              const args_array = Array.prototype.slice.call(arguments);
              args_array.shift();
              listeners[event].apply(null, args_array);
           }
        }
     }
  }

  return { on, trigger };

}



