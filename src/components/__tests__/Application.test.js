import React from "react";
import {
  render, cleanup, // prettyDOM,
  fireEvent, waitForElement, getAllByTestId,
  getByText, getByAltText, getByPlaceholderText,
  queryByText, queryByAltText
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

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const ar = render(<Application />);
    await waitForElement(() => getByText(ar.container, "Archie Cohen"));
    const appointment = getAllByTestId(ar.container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"));
    expect(getByText(ar.container, /are you super duper sure/i)).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();
    await waitForElement(() => queryByAltText(appointment, "Add"));
    fireEvent.click(getByAltText(appointment, "Add"));
    const day = getAllByTestId(ar.container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const ar = render(<Application />);
    await waitForElement(() => getByText(ar.container, "Archie Cohen"));
    // 3. Click the Edit button on the appointment.
    // 4. Check that edit Form is shown.
    // 5. Change the student name.
    // 6. Click the Save button.
    // 7. Check that the element with the text Saving... is displayed.
    // 8. Wait until the updated appointment is displayed.
    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spots remaining".
    ar.debug();
  });

});



