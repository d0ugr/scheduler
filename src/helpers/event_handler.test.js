// event_handler.test.js
//
// Unit test for event_handler.js.

import EventHandler from "./event_handler";



describe("Event handler", () => {

  it("registers and triggers an event", () => {
    const eh = EventHandler();
    let result = false;
    expect(() => eh.on("test", () => (result = true))).not.toThrowError();
    eh.trigger("not_a_test");
    expect(result).toBe(false);
    eh.trigger("test");
    expect(result).toBe(true);
  });

  it("throws an error with an invalid event name", () => {
    const eh = EventHandler();
    expect(() => eh.on(null, () => true)).toThrowError(
      /invalid event/i
    );
  });

  it("throws an error with an invalid listener function", () => {
    const eh = EventHandler();
    expect(() => eh.on("test", null)).toThrowError(
      /listener is not a function/i
    );
  });

});



