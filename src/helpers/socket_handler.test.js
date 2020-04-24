// socket_handler.test.js
//
// Unit tests for socket_handler.js.

import SocketHandler from "./socket_handler";



describe("Socket handler", () => {

  it("doesn't throws an error on init", () => {
    //const socket = SocketHandler();
    expect(SocketHandler).not.toThrowError();
  });

});



