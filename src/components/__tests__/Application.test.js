import React from "react";
import {
  render, cleanup, prettyDOM,
  fireEvent, waitForElement, getAllByTestId,
  getByText, getByAltText, getByPlaceholderText,
  queryByText
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);



describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const ar = render(<Application />);
    await waitForElement(() => ar.getByText("Monday"));
    fireEvent.click(ar.getByText("Tuesday"));
    expect(ar.getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const ar = render(<Application />);
    await waitForElement(() => getByText(ar.container, "Archie Cohen"));
    const appointment = getAllByTestId(ar.container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    const day = getAllByTestId(ar.container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  });

});



