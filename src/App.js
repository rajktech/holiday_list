import { useEffect, useState } from "react";
import './App.css';

function App() {
  const [date1Value, setDate1Value] = useState("");
  const [date2Value, setDate2Value] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [datesDisable, setDatesDisable] = useState(true);

  useEffect(() => {
    const sts = selectedOption === "custom" ? false : true;
    setDatesDisable(sts);

    if (selectedOption === "yesterday") {
      yesterday_dt();
    }
    if (selectedOption === "last_week") {
      setDate1Value(getParticularDayTimestamp(7));
      setDate2Value(getParticularDayTimestamp(1));
    }

    if (selectedOption === "last_month") {
      getLastMonthDates();
    }
  }, [selectedOption]);

  const dateCheck = (check) => {
    var fDate, lDate, cDate;
    fDate = Date.parse(date1Value);
    lDate = Date.parse(date2Value);
    cDate = Date.parse(check);
    if (cDate <= lDate && cDate >= fDate) {
      return true;
    }
    return false;
  };

  const yesterday_dt = () => {
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    var month = today.getMonth() + 1;
    yesterday =
      yesterday.getFullYear() +
      "-" +
      (month < 10 ? "0" : "") +
      month +
      "-" +
      yesterday.getDate();
    setDate1Value(yesterday);
    setDate2Value(yesterday);
  };

  const getParticularDayTimestamp = (lastWeekDay) => {
    var currentWeekMonday = new Date().getDate() - new Date().getDay() + 1;
    var calculatedDt = new Date(
      new Date().setDate(currentWeekMonday - lastWeekDay)
    );
    let dtNew =
      calculatedDt.getDate() < 10
        ? "0" + calculatedDt.getDate()
        : calculatedDt.getDate();
    let monthNew =
      calculatedDt.getMonth() + 1 < 10
        ? "0" + (calculatedDt.getMonth() + 1)
        : calculatedDt.getMonth() + 1;
    let calculatedDtNew = `${calculatedDt.getFullYear()}-${monthNew}-${dtNew}`;
    return calculatedDtNew;
  };

  const getLastMonthDates = () => {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

    let dtNew =
      firstDay.getDate() < 10 ? "0" + firstDay.getDate() : firstDay.getDate();
    let monthNew =
      firstDay.getMonth() + 1 < 10
        ? "0" + (firstDay.getMonth() + 1)
        : firstDay.getMonth() + 1;
    let startDate = `${firstDay.getFullYear()}-${monthNew}-${dtNew}`;

    dtNew =
      lastDay.getDate() < 10 ? "0" + lastDay.getDate() : lastDay.getDate();
    monthNew =
      lastDay.getMonth() + 1 < 10
        ? "0" + (lastDay.getMonth() + 1)
        : lastDay.getMonth() + 1;
    let endDate = `${lastDay.getFullYear()}-${monthNew}-${dtNew}`;

    setDate1Value(startDate);
    setDate2Value(endDate);
  };

  const clickHandler = () => {
    fetch("https://www.gov.uk/bank-holidays.json")
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const events = result["england-and-wales"].events;
        const selected_events = events.filter((item) => dateCheck(item.date));
        setFilteredEvents(selected_events);
      });
  };
  return (
    <div>
      <div className="container mt-3">
        <h3>Get Holidays List</h3>
        <div className="row">
          <div className="col-md-3">
            Select Date range
            <select onChange={(e) => setSelectedOption(e.target.value)} className="ml-2">
              <option>Please select</option>
              <option value="yesterday">Yesterday</option>
              <option value="last_week">Last Week</option>
              <option value="last_month">Last Month</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
          <div className="col-md-5">
            <input
              type="date"
              id="date1"
              onChange={(e) => setDate1Value(e.target.value)}
              value={date1Value}
              disabled={datesDisable}
              className="mr-1"
            />
            <input
              type="date"
              id="date2"
              onChange={(e) => setDate2Value(e.target.value)}
              value={date2Value}
              disabled={datesDisable}
            />
          </div>

          <div className="col-md-1">
            <button className="btn btn-primary btn-sm" onClick={clickHandler}>
              Click
            </button>
          </div>
        </div>

        <div className="mt-3">
          {date1Value != '' ? 
          filteredEvents.length ? (
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Notes</th>
                  <th>Bunting</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.date}</td>
                      <td>{item.notes || "-"}</td>
                      <td>{item.bunting ? "true" : "false"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div
              className="alert alert-danger"
              role="alert"
              style={{ width: "100%" }}
            >
              No Records Found
            </div>
          ) : <div
          className="alert alert-danger"
          role="alert"
          style={{ width: "100%" }}
        >
          Choose dates
        </div>}
        </div>
      </div>
    </div>
  );
}

export default App;
