import React from "react";
import "../Styling/CreateQuiz.css";
import CreateQuizCard from "./CreateQuizCard.js";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default class CreateQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      category: [
        "General Knowledge",
        "Entertainment: Books",
        "Entertainment: Film",
        "Entertainment: Music",
        "Entertainment: Musicals & Theatres",
        "Entertainment: Television",
        "Entertainment: Video Games",
        "Entertainment: Board Games",
        "Entertainment: Comics",
        "Entertainment: Japanese Anime & Manga",
        "Entertainment: Cartoon & Animations",
        "Science & Nature",
        "Science: Computers",
        "Science: Mathematics",
        "Science: Gadgets",
        "Mythology",
        "Sports",
        "Geography",
        "History",
        "Politics",
        "Art",
        "Celebrities",
        "Animals",
        "Vehicles",
      ],
      categoryID: [
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        29,
        31,
        32,
        17,
        18,
        19,
        30,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
      ],
      difficulty: ["easy", "medium", "hard"],
      type: ["Multiple Choice", "True / False"],
      number: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      selections: {
        category: "Unselected",
        difficulty: "Unselected",
        type: "Unselected",
        number: "Unselected",
      },
    };
  }

  selectDropdownItem = (event, index) => {
    var selection = event.target.title;
    var dropdownOptions = ["category", "difficulty", "type", "number"];
    dropdownOptions = dropdownOptions[index];

    if (index == 0) {
      selection = this.handleQuestionCategory(selection);
    }

    if (index == 2) {
      selection = this.handleQuestionType(selection);
    }

    this.setState((prevState) => ({
      selections: {
        ...prevState.selections,
        [dropdownOptions]: selection,
      },
    }));
  };

  handleQuestionCategory = (selection) => {
    const node = this.myRef.current;
    console.log(selection);
    for (let i = 0; i < node.children[0].children[1].children.length; i++) {
      var item = node.children[0].children[1].children[i].title;
      if (item == selection) {
        selection = this.state.categoryID[i];

        break;
      }
    }
    return selection;
  };

  handleQuestionType = (selection) => {
    if (selection == "Multiple Choice") {
      return "multiple";
    } else {
      return "boolean";
    }
  };

  selectionsToURL = () => {
    var url = new URL(
      "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple&encode=url3986"
    );
    url.searchParams.append(
      "category",
      encodeURIComponent(this.state.selections["category"])
    );
    url.searchParams.append(
      "difficulty",
      encodeURIComponent(this.state.selections["difficulty"])
    );
    url.searchParams.append(
      "type",
      encodeURIComponent(this.state.selections["type"])
    );
    url.searchParams.append(
      "amount",
      encodeURIComponent(this.state.selections["number"])
    );
    console.log(url);
    return url;
  };

  createQuiz = () => {
    if (this.checkForUnselections()) {
      return;
    }

    var url = this.selectionsToURL();

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response["status"]);
        }
      })
      .then((responseJson) => {
        if (responseJson["results"].length == 0) {
          this.deleteCreatedQuiz();
          alert(
            "No questions returned for your combination of selections. Please try again!"
          );
          return;
        }
        this.storeQuiz(responseJson);
      })
      .catch((error) => {
        //on error print status code in message from Error(response["status"])
        console.log(error + " is error");
        window.location.replace("/404");
      });
  };

  deleteCreatedQuiz = () => {
    fetch("/deleteCreatedQuiz", {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then((res) => alert(res));
  };

  checkForUnselections = () => {
    var errorMessage = "Missing Selections: ";
    if (this.state.selections["category"] == "Unselected") {
      errorMessage = errorMessage.concat("category");
    }

    if (this.state.selections["difficulty"] == "Unselected") {
      errorMessage = errorMessage.concat(" difficulty");
    }

    if (this.state.selections["type"] == "Unselected") {
      errorMessage = errorMessage.concat(" type");
    }

    if (this.state.selections["number"] == "Unselected") {
      errorMessage = errorMessage.concat(" number");
    }

    if (errorMessage.length == 20) {
      return false;
    } else {
      errorMessage = errorMessage.concat(" NOT selected");
      alert(errorMessage);
      return true;
    }
  };

  storeQuiz = (createdQuiz) => {
    console.log(createdQuiz);
    fetch("/storeQuiz", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        results: createdQuiz,
      }),
    });

    this.quizWasStored();
  };
  quizWasStored = () => {
    alert("Your Quiz was made! You will be redirected to play now!");
    this.setState((prevState) => ({
      selections: {
        ...prevState.selections,
        category: "Unselected",
        difficulty: "Unselected",
        number: "Unselected",
        type: "Unselected",
      },
    }));
    window.location.replace("/PlayGame");
  };

  render() {
    return (
      <div>
        <div className="CreateQuizCard">
          <CreateQuizCard selections={this.state.selections} />
        </div>
        <div ref={this.myRef} className="Dropdowns">
          <DropdownButton id="dropdown-basic-button" title="Category">
            {this.state.category.map((cat, index) => (
              <Dropdown.Item
                onClick={(event) => this.selectDropdownItem(event, 0)}
                key={index}
                title={cat}
                href="#/action-1"
              >
                {cat}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <DropdownButton id="dropdown-basic-button" title="Difficulty">
            {this.state.difficulty.map((diff, index) => (
              <Dropdown.Item
                key={index}
                title={diff}
                onClick={(event) => this.selectDropdownItem(event, 1)}
                href="#/action-1"
              >
                {diff}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <DropdownButton id="dropdown-basic-button" title="Type">
            {this.state.type.map((ty, index) => (
              <Dropdown.Item
                key={index}
                title={ty}
                onClick={(event) => this.selectDropdownItem(event, 2)}
                href="#/action-1"
              >
                {ty}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <DropdownButton id="dropdown-basic-button" title="Number">
            {this.state.number.map((num, index) => (
              <Dropdown.Item
                key={index}
                title={num}
                onClick={(event) => this.selectDropdownItem(event, 3)}
                href="#/action-1"
              >
                {num}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <div className="createQuizButton">
            <Button onClick={this.createQuiz} variant="secondary">
              CreateQuiz
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
