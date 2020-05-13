import React from "react";
import { Button, Form, Card } from "react-bootstrap";
import "../Styling/PlayGame.css";

export default class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      questions: [],
      question: [],
      questionCount: 1,
      score: 0,
      correctAnswers: [],
      selection: "",
      questionAmount: 0,
      currentQuestion: 0,
      wasQuizCreated: false,
    };
  }

  handleSelection = (event) => {
    this.setState({
      selection: event.target.title,
    });
    this.disableButtons(event.target.title);
  };

  checkAnswer = () => {
    if (
      this.state.selection ==
      this.state.correctAnswers[this.state.currentQuestion]
    ) {
      Object.assign(this.state, {
        score: this.state.score + 1,
      });
    }
  };

  disableButtons = (selection) => {
    const node = this.myRef.current;
    for (let i = 0; i < node.children.length; i++) {
      if (selection !== node.children[i].children[0].title) {
        node.children[i].children[0].checked = false;
      }
    }
  };
  async componentDidMount() {
    //this checks whether we use a created quiz
    //or call the Trivia DB API for random quiz
    var url;
    const response = await fetch("/wasQuizCreated");
    const data = await response.json();
    this.handleCreatedQuiz(data);

    if (data) {
      url = "/getCreatedQuiz";
    } else {
      url = "https://opentdb.com/api.php?amount=10&encode=url3986";
    }

    this.getQuizQuestions(url);
  }

  handleCreatedQuiz = (quizType) => {
    this.setState({
      wasQuizCreated: quizType,
    });
  };

  deleteCreatedQuiz = () => {
    fetch("/deleteCreatedQuiz", {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then((res) => alert(res));
  };

  getQuizQuestions = (url) => {
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response["status"]);
        }
      })
      .then((responseJson) => {
        //on OK response set state to returned list of users
        this.setQuizLength(responseJson);
        var questions = this.parseQuestion(responseJson);
        this.removeSpecialCharacters(questions);
        this.storeCorrectAnswers(questions);
        this.shuffleAnswerOrder(questions);
        this.setState({
          question: this.state.questions[this.state.currentQuestion],
        });
      })
      .catch((error) => {
        //on error print status code in message from Error(response["status"])
        console.log(error + " is error");
        // window.location.replace("/404");
      });
  };

  setQuizLength = (questions) => {
    this.setState({
      questionAmount: questions["results"].length,
    });
  };

  shuffleAnswerOrder = (question) => {
    var outterArray = [];

    for (var i = 0; i < question.length; i++) {
      var innerArray = [];
      innerArray.push(question[i][0]);
      innerArray = innerArray.concat(
        question[i].slice(1).sort(() => Math.random() - 0.5)
      );
      outterArray.push(innerArray);
    }

    this.setState({
      questions: outterArray,
    });
  };

  storeCorrectAnswers = (questions) => {
    var answerContainer = [];
    for (let i = 0; i < questions.length; i++) {
      answerContainer.push(questions[i][1]);
    }

    this.setState({
      correctAnswers: answerContainer,
    });
  };

  parseQuestion = (responseJson) => {
    var outterArray = [];
    for (let i = 0; i < this.state.questionAmount; i++) {
      var innerArray = [];
      innerArray.push(responseJson["results"][i]["question"]);
      innerArray.push(responseJson["results"][i]["correct_answer"]);
      innerArray = innerArray.concat(
        responseJson["results"][i]["incorrect_answers"]
      );
      outterArray.push(innerArray);
    }
    return outterArray;
  };

  removeSpecialCharacters = (question) => {
    for (let i = 0; i < question.length; i++) {
      for (let j = 0; j < question[i].length; j++) {
        question[i][j] = decodeURIComponent(question[i][j]);
      }
    }
  };

  answerGiven = () => {
    if (this.state.selection == "") {
      alert("No answer selected");
      return true;
    }
  };

  nextQuestion = () => {
    Object.assign(this.state, {
      currentQuestion: this.state.currentQuestion + 1,
    });
  };

  nextRound = () => {
    this.checkAnswer();

    if (this.answerGiven()) {
      return;
    }

    this.nextQuestion();

    this.setState({
      questionCount: this.state.questionCount + 1,
      question: this.state.questions[this.state.currentQuestion],
    });

    if (this.state.questionCount == this.state.questionAmount) {
      this.updatePlayerStats();
      this.gameOver();
    }

    this.resetButtons();
  };

  gameOver = () => {
    this.setState({
      questionCount: 1,
    });
    alert(
      "Game Over! You scored: " +
        this.state.score +
        "/" +
        this.state.questionCount
    );

    if (this.state.wasQuizCreated) {
      this.deleteCreatedQuiz();
      alert("Your Quiz Was Deleted!");
    }

    window.location.replace("/");
  };

  resetButtons = () => {
    const node = this.myRef.current;
    for (let i = 0; i < node.children.length; i++) {
      node.children[i].children[0].checked = false;
    }
    this.setState({
      selection: "",
    });
  };

  calculateWin = () => {
    if (this.state.score / this.state.questionAmount >= 0.5) {
      var outcome = [1, 0];
    } else {
      var outcome = [0, 1];
      return outcome;
    }
  };

  updatePlayerStats = () => {
    if (localStorage.getItem("Login") != "false") {
      console.log(localStorage.getItem("Login"));
      console.log("PLAYED IS BEING UPDATED");
      var gameStats = {
        username: localStorage.getItem("Login"),
        win: this.calculateWin()[0],
        loss: this.calculateWin()[1],
        total_quizzes: 1,
        score: this.state.score,
      };

      fetch("/updatePlayer", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stats: gameStats,
        }),
      });
    }
  };

  render() {
    return (
      <div>
        <Card className="question">
          <Card.Header>{this.state.question[0]}</Card.Header>
          <Card.Body>
            <Form>
              <div ref={this.myRef} className="questionSet">
                {this.state.question.slice(1).map((possibleAnswer) => (
                  <Form.Check key={possibleAnswer}>
                    <Form.Check.Input
                      title={possibleAnswer}
                      onClick={this.handleSelection}
                      className="checkbox"
                      type="radio"
                    />
                    <Form.Check.Label>{possibleAnswer}</Form.Check.Label>
                  </Form.Check>
                ))}
              </div>
            </Form>
          </Card.Body>
          <Card.Footer className="text-muted">
            {this.state.questionCount}/{this.state.questionAmount}
          </Card.Footer>
          <div>
            <Button onClick={this.nextRound}>Submit Answer</Button>
          </div>
        </Card>
      </div>
    );
  }
}
