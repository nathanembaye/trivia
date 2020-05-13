import React from "react";
import "./App.css";
import NavMenu from "./Components/NavMenu";
import CreateQuiz from "./Components/CreateQuiz";
import Login from "./Components/Login";
import Users from "./Components/Users";
import PlayGame from "./Components/PlayGame";
import ErrorPage from "./Components/ErrorPage";
import { BrowserRouter, Route } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Route path="/" component={NavMenu} />
          <Route path="/PlayGame" component={PlayGame} />
          <Route path="/Users" component={Users} />
          <Route path="/CreateQuiz" component={CreateQuiz} />
          <Route path="/Login" component={Login} />
          <Route path="/404" component={ErrorPage} />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
