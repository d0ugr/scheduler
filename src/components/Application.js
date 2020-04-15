import React, { useState, useEffect } from "react";
import Axios from "axios";

import DayList     from "./DayList";
import Appointment from "components/Appointment";

import "components/Application.scss";



const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
    interview: {
      student: "Duuuuuuuuuuuuuuuuuuuuuuuuuuuuude",
      interviewer: {
        id: 3,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/T2WwVfS.png",
      }
    }
  },
  {
    id: 4,
    time: "3pm",
  },
  {
    id: 5,
    time: "4:20pm",
    interview: {
      student: "Towlie",
      interviewer: {
        id: 5,
        name: "Sven Jones",
        avatar: "https://i.imgur.com/twYrpay.jpg",
      }
    }
  }
];



export default function Application(_props) {

  const [ selectedDay, setDay ] = useState("Monday");
  const [ days, setDays ]       = useState([]);

  const appointmentItems = appointments.map((appointment, _index) =>
    <Appointment
      key={appointment.id}
      time={appointment.time}
      interview={appointment.interview}
    />
  );

  useEffect(() => {
    Axios.get("/api/days")
    .then((res) => setDays(res.data))
    .catch((err) => console.log(err));
  }, []);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={days}
            selectedDay={selectedDay}
            setDay={day => setDay(day)}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentItems}
      </section>
    </main>
  );

}
