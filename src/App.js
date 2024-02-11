import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { setDatabase, setActiveLevel } from "./redux/Actions"; // import the action creators
import axios from "axios";
import AppRoutes from "./components/AppRoutes";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./custom.scss";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme, defaultLevel } from "./components/Constants";

function App() {
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (password) => {
    // Replace 'adminPassword' with the actual admin password
    if (password === "adminPassword") {
      setIsAdmin(true);
    } else {
      alert("Incorrect password");
    }
  };

  useEffect(() => {
    // Fetch the database from the API
    axios
      .get("http://localhost:5000/api/database")
      .then((response) => {
        const data = response.data;
        dispatch(setDatabase(data));

        // Get the starting level after the data is fetched
        const startingLevel = data.levels[defaultLevel];

        // Dispatch setActiveLevel here
        dispatch(setActiveLevel(startingLevel));
      })
      .catch((error) => console.error("Error:", error));
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppRoutes isAdmin={isAdmin} handleLogin={handleLogin} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
