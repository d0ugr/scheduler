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

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {

    const ar = render(<Application />);
    await waitForElement(() => getByText(ar.container, "Archie Cohen"));
    // 3. Click the Delete button on the appointment.
    // 4. Check that the confirmation prompt is shown.
    // 5. Click the Confirm button.
    // 6. Check that the element with the text Deleting... is displayed.
    // 7. Wait until the empty appointment with the Add button is displayed.
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".

  });

});



