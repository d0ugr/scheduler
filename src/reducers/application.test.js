// application.test.js
//
// Unit test for application reducer errors.

import reducer from "./application";

// Application reducer tests:

describe("Application Reducer", () => {

  it("throws an error with an unsupported type", () => {
    expect(() => reducer({}, { type: null })).toThrowError(
      /unsupported action type/i
    );
  });

});
