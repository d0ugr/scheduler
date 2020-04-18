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



