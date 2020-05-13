import React from "react";
import createQuiz from "../Assets/CreateQuizImage.jpg";
import { Card, ListGroupItem, ListGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default class createQuizCard extends React.Component {
  render() {
    return (
      <div className="DropDownCard">
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src={createQuiz} />
          <Card.Body>
            <Card.Title>Create Quiz Instructions</Card.Title>
            <Card.Text>
              Create Quiz allows you to define the parameters for your own quiz!
              If you want a hint on what types of questions to expect check out
              the Examples questions link below.
            </Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroupItem>
              Category: {this.props.selections["category"]}
            </ListGroupItem>
            <ListGroupItem>
              Difficulty: {this.props.selections["difficulty"]}
            </ListGroupItem>
            <ListGroupItem>Type: {this.props.selections["type"]}</ListGroupItem>
            <ListGroupItem>
              Number of Questions: {this.props.selections["number"]}{" "}
            </ListGroupItem>
          </ListGroup>
          <Card.Body>
            <Card.Link href="https://opentdb.com/browse.php">
              Examples Questions
            </Card.Link>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
