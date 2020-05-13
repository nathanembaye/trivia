import React from "react";
import UserMan from "../Assets/UserMan.png";
import UserWoman from "../Assets/UserWoman.png";

import { Card } from "react-bootstrap";

export default class UserCard extends React.Component {
  render() {
    return (
      <div>
        <Card style={{ width: "15rem" }}>
          {this.props.user["gender"] ? (
            <Card.Img variant="top" src={UserMan} />
          ) : (
            <Card.Img variant="top" src={UserWoman} />
          )}
          <Card.Body>
            <Card.Title>Username: {this.props.user["username"]}</Card.Title>
            <Card.Text>
              Wins: {this.props.user["wins"]}
              <br />
              Losses: {this.props.user["losses"]} <br />
              Games Played: {this.props.user["total_quizzes"]}
              <br />
              Score: {this.props.user["total_score"]}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
