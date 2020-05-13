import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default class NavMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="http://localhost:3000/PlayGame">
              Trivia Now!
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="http://localhost:3000/PlayGame">
                  Play Game
                </Nav.Link>
                <Nav.Link href="http://localhost:3000/Users">Users</Nav.Link>
                <Nav.Link href="http://localhost:3000/CreateQuiz">
                  Create a Quiz
                </Nav.Link>
              </Nav>
              <Nav>
                {localStorage.getItem("Login") != "false" ? (
                  <Nav.Link href="http://localhost:3000/Login">
                    {localStorage.getItem("Login")}
                  </Nav.Link>
                ) : (
                  <Nav.Link href="http://localhost:3000/Login">Login</Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </div>
    );
  }
}
