import React from "react";
import {
  render, cleanup, // prettyDOM,
  fireEvent, waitForElement, getAllByTestId,
  getByText, getByAltText, getByPlaceholderText,
  queryByText, queryByAltText
} from "@testing-library/react";
import axios from "axios";

import Application from "components/Application";

afterEach(cleanup);



describe("Application", () => {

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
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
    await waitForElement(() => getByText(appointment, "Error"));
    const day = getAllByTestId(ar.container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
    //console.log(prettyDOM(appointment));
    //ar.debug();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const ar = render(<Application />);
    await waitForElement(() => getByText(ar.container, "Archie Cohen"));
    const appointment = getAllByTestId(ar.container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"));
    expect(getByText(appointment, /are you super duper sure/i)).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Error"));
    const day = getAllByTestId(ar.container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
    //console.log(prettyDOM(appointment));
    //ar.debug();
  });

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const ar = render(<Application />);
    await waitForElement(() => ar.getByText("Monday"));
    fireEvent.click(ar.getByText("Tuesday"));
    expect(ar.getByText("Leopold Silvers")).toBeInTheDocument();
    //ar.debug();
  });

  // it("loads data, prevents form submit", async () => {
  //   const ar = render(<Application />);
  //   await waitForElement(() => getByText(ar.container, "Archie Cohen"));
  //   const appointment = getAllByTestId(ar.container, "appointment")[0];
  //   fireEvent.click(getByAltText(appointment, "Add"));
  //   fireEvent.submit();
  //   expect(queryByText(appointment, "Saving...")).not.toBeInTheDocument();
  //   //console.log(prettyDOM(appointment));
  //   //ar.debug();
  // });

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
    //console.log(prettyDOM(appointment));
    //ar.debug();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const ar = render(<Application />);
    await waitForElement(() => getByText(ar.container, "Archie Cohen"));
    const appointment = getAllByTestId(ar.container, "appointment")[1];
    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    const day = getAllByTestId(ar.container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
    //console.log(prettyDOM(appointment));
    //ar.debug();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const ar = render(<Application />);
    await waitForElement(() => getByText(ar.container, "Archie Cohen"));
    const appointment = getAllByTestId(ar.container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"));
    expect(getByText(appointment, /are you super duper sure/i)).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, /add/i));
    const day = getAllByTestId(ar.container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
    //console.log(prettyDOM(appointment));
    //ar.debug();
  });

});



