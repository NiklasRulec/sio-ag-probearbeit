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
  const [sortedWorkDays, setSortedWorkDays] = useState([]);

  // Updated Values
  const [updatedDate, setUpdatedDate] = useState("");
  const [updatedStart, setUpdatedStart] = useState("");
  const [updatedEnd, setUpdatedEnd] = useState("");
  const [updatedDuration, setUpdatedDuration] = useState("");

  // workDays laden
  useEffect(() => {
    if (localStorage.getItem("workDays")) {
      setWorkDays(JSON.parse(localStorage.getItem("workDays")));
    } else {
      setWorkDays([]);
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
    if (updatedDate.trim() !== "") {
      originalWorkDay.date = updatedDate;
    }
    if (updatedStart.trim() !== "") {
      originalWorkDay.start = updatedStart;
      if (updatedStart < 10) {
        hours = `0${hours}`;
      }
    }
    if (updatedEnd.trim() !== "") {
      originalWorkDay.end = updatedEnd;
    }
    if (updatedDuration.trim() !== "") {
      originalWorkDay.duration = updatedDuration;
    }
    workDaysCopy[index] = originalWorkDay;
    localStorage.setItem("workDays", JSON.stringify(workDaysCopy));
    setEditMode(false);
    setUpdate(!update);
  };

  // Arbeitstage sortieren
  useEffect(() => {
    const sortedDays = workDays
      .slice()
      .sort(
        (a, b) =>
          new Date(b.date.replace(/(\d{2}).(\d{2}).(\d{4})/, "$3-$2-$1")) -
          new Date(a.date.replace(/(\d{2}).(\d{2}).(\d{4})/, "$3-$2-$1"))
      );
    setSortedWorkDays(sortedDays);
  }, [workDays]);

  // Tägliche Arbeitszeit
  const calculateDailyWorkTime = (workDay) => {
    let hours = parseInt(workDay.duration.split(":")[0]);
    let minutes = parseInt(workDay.duration.split(":")[1]);
    return hours + minutes / 60;
  };

  // Durchschnittliche tägliche Arbeitszeit
  const calculateAverageDailyWorkTime = (workDays) => {
    const totalDailyWorkTime = workDays.reduce((acc, workDay) => {
      return acc + calculateDailyWorkTime(workDay);
    }, 0);

    return workDays.length > 0 ? totalDailyWorkTime / workDays.length : 0;
  };

  // Monatliche Arbeitszeit
  const calculateMonthlyWorkTime = (workDays) => {
    return workDays.reduce((acc, workDay) => {
      return acc + calculateDailyWorkTime(workDay);
    }, 0);
  };

  return (
    <section className="time-output-section">
      <h2>Bisherige Arbeitszeit</h2>
      <div>
        <button
          onClick={() => setSortedWorkDays([...sortedWorkDays].reverse())}
        >
          Älteste-Neueste Toggle
        </button>
      </div>
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
          {sortedWorkDays.map((workDay, index) => (
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
              {editMode ? (
                <td>
                  <input
                    type="text"
                    defaultValue={workDay.duration}
                    onChange={(e) => setUpdatedDuration(e.target.value)}
                  ></input>
                </td>
              ) : (
                <td>{workDay.duration}</td>
              )}
              <td className="td-icons">
                <div onClick={() => setEditMode(!editMode)}>
                  {editMode ? (
                    <div onClick={() => safeEditedWorkday(index)}>
                      <SafeIcon />
                    </div>
                  ) : (
                    <div>
                      <EditIcon />
                    </div>
                  )}
                </div>
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
          Tag:
          {sortedWorkDays.reduce(
            (acc, curr) => acc + calculateDailyWorkTime(curr),
            0
          )}
          Stunden
        </h3>
        <h3>
          Durchschnittliche Tagesarbeitszeit:{" "}
          {calculateAverageDailyWorkTime(sortedWorkDays)} Stunden
        </h3>
        <h3>Monat: {calculateMonthlyWorkTime(sortedWorkDays)} Stunden</h3>
      </article>
    </section>
  );
};

export default TimeOutput;
