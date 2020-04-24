// application.test.js
//
// Unit test for application reducer errors.

import reducer from "./application";



describe("Application Reducer", () => {

  it("thows an error with an unsupported type", () => {
    expect(() => reducer({}, { type: null })).toThrowError(
      /unsupported action type/i
    );
  });

});



