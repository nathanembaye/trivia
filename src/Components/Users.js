import React from "react";
import UserCard from "./UserCard.js";
import { CardGroup } from "react-bootstrap";

export default class Users extends React.Component {
  state = {
    users: [],
  };

  async componentDidMount() {
    fetch("./getUsers")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response["status"]);
        }
      })
      .then((responseJson) => {
        //on OK response set state to returned list of users
        const listOfUsers = responseJson;
        this.setState({
          users: listOfUsers,
        });
      })
      .catch((error) => {
        //on error print status code in message from Error(response["status"])
        console.log(error + " is the response status");
        window.location.replace("/404");
      });
  }

  render() {
    return (
      <div className="">
        <CardGroup>
          {this.state.users.map((user) => (
            <UserCard key={user} user={user} />
          ))}
        </CardGroup>
      </div>
    );
  }
}
