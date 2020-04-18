import EventHandler from "./useEvents";

const eh = EventHandler();



// const WS_INTERVAL_PING      = 15 * 1000;
// //const WS_TIMEOUT_PING       =  3 * 1000;
// const WS_INTERVAL_RECONNECT =  1 * 1000;
// const WS_TIMEOUT_RECONNECT  = 15 * 1000;
// const WS_MSG_ACK_TIMEOUT    = 10 * 1000;

// WebSocket close codes:

//const WS_CC_DESCRIPTION = {};

export const WS_CC_NORMAL               = 1000;
export const WS_CC_GOING_AWAY           = 1001;
export const WS_CC_PROTOCOL_ERROR       = 1002;
export const WS_CC_INVALID_DATA         = 1003;
export const WS_CC_RESERVED             = 1004;
export const WS_CC_NO_STATUS            = 1005;
export const WS_CC_ABNORMAL             = 1006;
export const WS_CC_INVALID_MESSAGE_DATA = 1007;
export const WS_CC_GENERIC              = 1008;
export const WS_CC_MESSAGE_TOO_LARGE    = 1009;
export const WS_CC_NO_EXTENSIONS        = 1010;
export const WS_CC_INTERNAL_ERROR       = 1011;
export const WS_CC_TLS_ERROR            = 1015;

//export WS_CC_DESCRIPTION[WS_CC_NORMAL               = "Normal closure";
//export WS_CC_DESCRIPTION[WS_CC_GOING_AWAY           = "Going away";
//export WS_CC_DESCRIPTION[WS_CC_PROTOCOL_ERROR       = "Protocol error";
//export WS_CC_DESCRIPTION[WS_CC_INVALID_DATA         = "Invalid data";
//export WS_CC_DESCRIPTION[WS_CC_RESERVED             = "Reserved";
//export WS_CC_DESCRIPTION[WS_CC_NO_STATUS            = "No status";
//export WS_CC_DESCRIPTION[WS_CC_ABNORMAL             = "Abnormal closure";
//export WS_CC_DESCRIPTION[WS_CC_INVALID_MESSAGE_DATA = "Invalid message data";
//export WS_CC_DESCRIPTION[WS_CC_POLICY_VIOLATION     = "Policy violation";
//export WS_CC_DESCRIPTION[WS_CC_MESSAGE_TOO_LARGE    = "Message too large";
//export WS_CC_DESCRIPTION[WS_CC_NO_EXTENSIONS        = "No extensions returned by server";
//export WS_CC_DESCRIPTION[WS_CC_INTERNAL_ERROR       = "Internal error";
//export WS_CC_DESCRIPTION[WS_CC_TLS_ERROR            = "TLS error";



const httpToWs = function(url) {
  try {
    return url
      .replace("http://",  "ws://" )
      .replace("https://", "wss://");
  } catch (err) {
    return null;
  }
}



export default function SocketHandler(url) {

  let ws        = null;
  let wsUrl     = httpToWs(url) || httpToWs(document.location.href);
  let connected = false;

  function open(url) {

    wsUrl = httpToWs(url) || wsUrl;
    ws    = new WebSocket(wsUrl);

    ws.addEventListener("open", function(_event) {
      connected = true;
      eh.trigger("open");
    });

    ws.addEventListener("close", function(_event) {
      connected = false;
      eh.trigger("close");
    });

    ws.addEventListener("message", function(event) {
      let message = null;
      try {
        message = JSON.parse(event.data);
      } catch (err) {
        message = event.data;
      }
      eh.trigger("message", message);
    });

    ws.addEventListener("error", function(event) {
      eh.trigger("error", event);
    });

  }

  // SocketHandler.close closes the socket connection.

  function close(code, reason) {

    if (typeof code   !== "number") code   = 1001;  // Going away
    if (typeof reason !== "string") reason = "";
    console.log("SocketHandler.close", `${code}, "${reason}"`);
    try {
      ws.close(code, reason);
    } catch (err) {
      console.warn("SocketHandler.close", `ws.close error:`, err);
    }
    eh.trigger("closing", code, reason);

  }

  // SocketHandler.emit sends a WebSocket message.
  //
  //    message   Any   The message to send.

  function emit(message) { // ...arguments

    //console.log("SocketHandler.emit", `readyState ${ws.readyState}`);
    if (!message)                         { console.warn("SocketHandler.emit", "Invalid message"); return; }
    if (!ws)                              { console.warn("SocketHandler.emit", "No ws object"   ); return; }
    if (ws.readyState !== WebSocket.OPEN) { console.warn("SocketHandler.emit", "Not connected"  ); return; }
    console.log("SocketHandler.emit", JSON.stringify(message));

    try {
      ws.send(JSON.stringify(message));
    } catch (err) {
      console.warn("SocketHandler.emit", `ws.send error:`, err);
    }

  }



  // SocketHandler.ping simply pings the server to keep the connection alive.

  function ping() {

    if (!ws) { console.warn("SocketHandler.ping", "Not connected"); return; }
    //console.log("SocketHandler.ping", `PING`);
    try {
      ws.send("PING");
    } catch (err) {
      console.warn("SocketHandler.ping", `ws.send error:`, err);
    }

  }



  return { open, close, connected, on: eh.on, emit, ping };

}



