import React from "react";
import { render, cleanup } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";

import Form from "components/Appointment/Form";

afterEach(cleanup);



describe("Form", () => {

  // it("renders without crashing", () => {
  //   render(<Form />);
  // });

  const interviewers = [
    {
      id:     1,
      name:   "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />
    );
    expect(getByPlaceholderText("Enter student name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} name="Lydia Miller-Jones" />
    );
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });



  it("validates that the student name is not blank", () => {
    const onSave = (studentName, interviewerId) => console.log("onSave called:", studentName, interviewerId);
    const { getByText } = render(
      <Form interviewers={interviewers} name="" onSave={onSave} />
    );
    fireEvent.click(getByText("Save"));
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onSave function when the name is defined", () => {
    const onSave = (studentName, interviewerId) => console.log("onSave called:", studentName, interviewerId);
    const { getByText, queryByText } = render(
      <Form interviewers={interviewers} name="Lydia Miller-Jones" onSave={onSave} />
    );
    fireEvent.click(getByText("Save"));
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", null);
  });

});



