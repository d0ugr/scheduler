// Appointment.test.js
//
// Jest tests for the Appointment component.

import React from "react";
import { render, cleanup } from "@testing-library/react";

import Appointment from "components/Appointment";

afterEach(cleanup);

// Appointment tests:

describe("Appointment", () => {

  it("renders without crashing", () => {
    render(<Appointment />);
  });

});
