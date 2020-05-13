import React from "react";
import "../Styling/Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button } from "react-bootstrap";

export default class Login extends React.Component {
  state = {
    username: "",
    password: "",
    loggedin: false,
  };

  handleUsername = (event) => {
    this.setState({
      username: event.target.value,
    });
  };

  handlePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  userLoggedIn = () => {
    this.setState({
      loggedin: true,
    });
  };

  verifyLogin = () => {
    var credentials = {
      username: this.state.username,
      password: this.state.password,
    };

    fetch("/verifyLogin", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: credentials,
      }),
    })
      .then((response) => {
        console.log("Status: " + response["status"]);
        if (response["status"] == 200) {
          localStorage.setItem("Login", this.state.username);
          this.userLoggedIn();
        }
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response);
        }
      })
      .then((responseJson) => {
        console.log("Response: " + responseJson);
        window.location.replace("/PlayGame");
      })
      .catch((error) => {
        console.log(error + " is error");
        alert("Invalid Credentials. Please Try again!");
      });
  };

  componentDidMount() {
    if (localStorage.getItem("Login") != "false") {
      fetch("/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: false,
        }),
      });
      localStorage.setItem("Login", false);
      window.location.replace("/Login");
    }
  }

  render() {
    return (
      <div className="loginForm">
        <Form>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              onChange={this.handleUsername}
              type="email"
              placeholder="Username"
            />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={this.handlePassword}
              type="password"
              placeholder="Password"
            />
          </Form.Group>
          <Button
            className="button"
            onClick={this.verifyLogin}
            variant="outline-dark"
          >
            Sign In
          </Button>
        </Form>
      </div>
    );
  }
}
