// util.test.js
//
// Unit test for util.js.

import * as util from "./util";

// Utility function tests:

describe("Utility functions", () => {

  it("updateState merges name and value pairs", () => {
    expect(util.updateState({}, { name: "test", value: "data" })).toStrictEqual({ "test": "data"});
  });

  it("updateState returns input on error", () => {
    expect(util.updateState({ "test": "data"}, "do_not_add_this")).toStrictEqual({ "test": "data"});
  });

});
