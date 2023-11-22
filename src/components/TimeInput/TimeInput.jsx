import { useContext, useState } from "react";
import "./TimeInput.css";
import { updateContext } from "../../context/Context";

const TimeInput = () => {
  const { update, setUpdate } = useContext(updateContext);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const workTimeSubmit = (e) => {
    e.preventDefault();

    if (startTime === "" || endTime === "") {
      alert("Bitte beide Felder bei Zeiterfassung ausfüllen!");
      return;
    }

    // Datum erstellen
    let day = new Date(startTime).getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    let month = new Date(startTime).getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let year = new Date(startTime).getFullYear();
    let date = `${day}.${month}.${year}`;
    console.log(date);

    // Startzeit erstellen
    let startHour = new Date(startTime).getHours();
    if (startHour < 10) {
      startHour = `0${startHour}`;
    }
    let startMinute = new Date(startTime).getMinutes();
    if (startMinute < 10) {
      startMinute = `0${startMinute}`;
    }
    let startTimeString = `${startHour}:${startMinute}`;

    // Endzeit erstellen
    let endHour = new Date(endTime).getHours();
    if (endHour < 10) {
      endHour = `0${endHour}`;
    }
    let endMinute = new Date(endTime).getMinutes();
    if (endMinute < 10) {
      endMinute = `0${endMinute}`;
    }
    let endTimeString = `${endHour}:${endMinute}`;

    // Arbeitszeit berechnen
    let start = new Date(startTime);
    let end = new Date(endTime);
    let diff = end - start;
    const workDay = {
      date: date,
      start: startTimeString,
      end: endTimeString,
      duration: millisecondsToHours(diff),
    };
    console.log(workDay);
    if (!localStorage.getItem("workDays")) {
      localStorage.setItem("workDays", JSON.stringify([workDay]));
    } else {
      let workDays = JSON.parse(localStorage.getItem("workDays"));
      let newWorkDays = [...workDays, workDay];
      localStorage.setItem("workDays", JSON.stringify(newWorkDays));
    }
    setUpdate((prev) => !prev);
  };

  const millisecondsToHours = (ms) => {
    let hours = Math.floor(ms / 3600000);
    if (hours < 10) {
      hours = `0${hours}`;
    }
    let minutes = Math.floor((ms % 3600000) / 60000);
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${hours}:${minutes}`;
  };

  return (
    <section className="time-input-section">
      <h2>Zeiterfassung</h2>
      <article className="time-input-form">
        <label htmlFor="start-time">Startzeit</label>
        <input
          type="datetime-local"
          name="start-time"
          onChange={(e) => setStartTime(e.target.value)}
        />
        <label htmlFor="end-time">Endzeit</label>
        <input
          type="datetime-local"
          name="end-time"
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button onClick={workTimeSubmit}>Erfassen</button>
      </article>
    </section>
  );
};

export default TimeInput;
