// util.js
//
// General utility helper functions.



// httpToWs converts any http/https URLs to ws/wss.
//
//    url   String   URL to convert.
//
// Returns the possibly converted URL,
//    or null if it fails (i.e. url is not a string).

export const httpToWs = function(url) {
  try {
    return url
      .replace("http://",  "ws://" )
      .replace("https://", "wss://");
  } catch (err) {
    return null;
  }
}



// updateState adds/updates properties in the given state object.
//
//    state   Object   State object to modify.
//    data    Object   Properties to update state with.
//
//    If data is not an object, nothing happens.
//    If it contains "name" and "value" properties,
//    (i.e. from <input> attributes) those are used to set the value as a
//    "name: value" property in the state object.
//    Otherwise, the object is simply copied into the state object.
//    Existing properties will be updated if they exist.
//
// Returns a copy of the state object with any updates.

export const updateState = (state, data) => {
  if (typeof data !== "object") {
    return state;
  }
  try {
    return {
      ...state,
      ...(data.name && data.value ? { [data.name]: data.value } : data)
    };
  } catch (err) {
    return state;
  }
};



