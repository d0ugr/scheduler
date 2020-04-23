import React from "react";
// import { render, cleanup, prettyDOM, fireEvent, waitForElement, getByText } from "@testing-library/react";
import * as rtl from "@testing-library/react";

import Application from "components/Application";

afterEach(rtl.cleanup);



describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const ar = rtl.render(<Application />);
    await rtl.waitForElement(() => ar.getByText("Monday"));
    rtl.fireEvent.click(ar.getByText("Tuesday"));
    expect(ar.getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const ar = rtl.render(<Application />);
    await rtl.waitForElement(() => rtl.getByText(ar.container, "Archie Cohen"));
    const appointment = rtl.getAllByTestId(ar.container, "appointment")[0];
    rtl.fireEvent.click(rtl.getByAltText(appointment, "Add"));
    rtl.fireEvent.change(rtl.getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    rtl.fireEvent.click(rtl.getByAltText(appointment, "Sylvia Palmer"));
    rtl.fireEvent.click(rtl.getByText(appointment, "Save"));
    expect(rtl.getByText(appointment, "Saving...")).toBeInTheDocument();
    await rtl.waitForElement(() => rtl.getByText(appointment, "Lydia Miller-Jones"));
    console.log(rtl.prettyDOM(ar.container));
    const day = rtl.getAllByTestId(ar.container, "day").find((day) =>
      rtl.queryByText(day, "Monday")
    );
    expect(rtl.getByText(day, "/no spots remaining/i")).toBeInTheDocument();
  });

});



