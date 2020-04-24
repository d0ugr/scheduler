// socket_handler.test.js
//
// Unit test for util.js.

import * as util from "./util";



describe("Socket handler", () => {

  it("merges name and value pairs", () => {
    expect(util.updateState({}, { name: "test", value: "data" })).toStrictEqual({ "test": "data"});
  });

  it("returns input on error", () => {
    expect(util.updateState({ "test": "data"}, "do_not_add_this")).toStrictEqual({ "test": "data"});
  });

});



