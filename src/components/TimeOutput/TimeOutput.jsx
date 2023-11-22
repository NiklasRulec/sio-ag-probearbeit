import { useContext, useEffect, useState } from "react";
import "./TimeOutput.css";
import EditIcon from "../../assets/icons/EditIcon/EditIcon";
import { updateContext } from "../../context/Context";
import DeleteIcon from "../../assets/icons/DeleteIcon/DeleteIcon";
import SafeIcon from "../../assets/icons/SafeIcon/SafeIcon";

const TimeOutput = () => {
  const { update, setUpdate } = useContext(updateContext);
  const [workDays, setWorkDays] = useState([]);
  const [editMode, setEditMode] = useState(false);

  // Updated Values
  const [updatedDate, setUpdatedDate] = useState("");
  const [updatedStart, setUpdatedStart] = useState("");
  const [updatedEnd, setUpdatedEnd] = useState("");

  // workDays laden
  useEffect(() => {
    localStorage.getItem("workDays")
      ? setWorkDays(JSON.parse(localStorage.getItem("workDays")))
      : setWorkDays([]);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("workDays")) {
      setWorkDays(JSON.parse(localStorage.getItem("workDays")));
    }
  }, [update]);

  // Löschen
  const deleteWorkDay = (index) => {
    let workDaysCopy = [...workDays];
    workDaysCopy.splice(index, 1);
    localStorage.setItem("workDays", JSON.stringify(workDaysCopy));
    setUpdate(!update);
  };

  // Geänderte Werte speichern
  const safeEditedWorkday = (index) => {
    let workDaysCopy = [...workDays];
    const originalWorkDay = workDaysCopy[index];
    // Aktualisierte Werte auf Inhalt prüfen
    if (updatedDate.trim() !== "") {
      originalWorkDay.date = updatedDate;
    }
    if (updatedStart.trim() !== "") {
      originalWorkDay.start = updatedStart;
    }
    if (updatedEnd.trim() !== "") {
      originalWorkDay.end = updatedEnd;
    }
    // Arbeitszeit neu berechnen und speichern
    const updatedWorktime = calculateDailyWorkTime(originalWorkDay);
    originalWorkDay.duration = updatedWorktime;
    workDaysCopy[index] = originalWorkDay;
    localStorage.setItem("workDays", JSON.stringify(workDaysCopy));
    setEditMode(false);
    setUpdate(!update);
    console.log("saved");
  };

  // Tägliche Arbeitszeit
  const calculateDailyWorkTime = (workDay) => {
    let hours =
      parseInt(workDay.end.split(":")[0]) -
      parseInt(workDay.start.split(":")[0]);
    let minutes =
      parseInt(workDay.end.split(":")[1]) -
      parseInt(workDay.start.split(":")[1]);
    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }
    return hours + minutes / 60;
  };

  // Durchschnittliche tägliche Arbeitszeit
  const dailyAverage = (workDays) => {
    const totalDailyWorkTime = workDays.reduce((acc, workDay) => {
      return acc + calculateDailyWorkTime(workDay);
    }, 0);

    const average =
      workDays.length > 0 ? totalDailyWorkTime / workDays.length : 0;
    return average.toFixed(2);
  };

  // Monatliche Arbeitszeit
  const monthlyWorktime = (workDays) => {
    return workDays.reduce((acc, workDay) => {
      return acc + calculateDailyWorkTime(workDay);
    }, 0);
  };

  return (
    <section className="time-output-section">
      <h2>Bisherige Arbeitszeit</h2>
      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Startzeit</th>
            <th>Endzeit</th>
            <th>Arbeitszeit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {workDays.map((workDay, index) => (
            <tr key={index}>
              {editMode ? (
                <td>
                  <input
                    type="text"
                    defaultValue={workDay.date}
                    onChange={(e) => setUpdatedDate(e.target.value)}
                  ></input>
                </td>
              ) : (
                <td>{workDay.date}</td>
              )}
              {editMode ? (
                <td>
                  <input
                    type="text"
                    defaultValue={workDay.start}
                    onChange={(e) => setUpdatedStart(e.target.value)}
                  ></input>
                </td>
              ) : (
                <td>{workDay.start}</td>
              )}
              {editMode ? (
                <td>
                  <input
                    type="text"
                    defaultValue={workDay.end}
                    onChange={(e) => setUpdatedEnd(e.target.value)}
                  ></input>
                </td>
              ) : (
                <td>{workDay.end}</td>
              )}
              <td>{workDay.duration} Std.</td>
              <td className="td-icons">
                {editMode ? (
                  <div onClick={() => safeEditedWorkday(index)}>
                    <SafeIcon />
                  </div>
                ) : (
                  <div onClick={() => setEditMode(true)}>
                    <EditIcon />
                  </div>
                )}
                <div onClick={() => deleteWorkDay(index)}>
                  <DeleteIcon />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <article>
        <h2>Gesamtarbeitszeit</h2>
        <h3>
          Durchschnittliche Tagesarbeitszeit: {dailyAverage(workDays)} Stunden
        </h3>
        <h3>Monat: {monthlyWorktime(workDays)} Stunden</h3>
      </article>
    </section>
  );
};

export default TimeOutput;
