import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import { updateContext } from "./context/Context";
import { useState } from "react";

function App() {
  const [update, setUpdate] = useState(false);

  return (
    <>
      <div className="wrapper">
        <updateContext.Provider value={{ update, setUpdate }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </updateContext.Provider>
      </div>
    </>
  );
}

export default App;
