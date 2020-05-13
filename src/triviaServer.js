const express = require("express");
const app = express();
const mongo = require("mongodb");
const mc = require("mongodb").MongoClient;
app.use(express.json());
var ObjectId = require("mongodb").ObjectID;
var quizMade = false;
const session = require("express-session");
app.use(session({ secret: "some secret here" }));

//Variable to store reference to database
let db;

app.get("/wasQuizCreated", (req, res, next) => {
  console.log("Questioning Quiz Creations Requested");

  if (quizMade) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.get("/getUsers", (req, res, next) => {
  console.log("Users Get Request");
  db.collection("triviaUserCollection")
    .find()
    .toArray(function (err, users) {
      if (err) throw err; //if error acessing database
      if (!users) {
        //if error with result retreived from database
        console.log("No users were retreived!");
        res.status(404).send("Invalid question ID");
        return;
      }
      console.log("Users sucessfuly retreived and sent to client");
      res.send(users);
    });
});

app.post("/verifyLogin", (req, res, next) => {
  console.log("Verify Login request reached!");

  if (req.session.loggedin) {
    console.log("User already logged in");
    //checking if user already logged in
    res.status(200).send(JSON.stringify("Already logged in."));
    return;
  }

  let username = req.body["login"]["username"];
  let password = req.body["login"]["password"];
  console.log(req.session);
  console.log("Username: " + username);
  console.log("Password: " + password);

  db.collection("triviaUserCollection").findOne(
    { username: username },
    function (err, result) {
      if (err) throw err;
      if (result) {
        if (result.password === password) {
          //establishes attributes for session
          req.session.loggedin = true;
          req.session.username = username;
          req.session.userID = result._id;
          console.log(req.session.username + " logged in");
          res.status(200).send(JSON.stringify(result._id));
        } else {
          console.log("Invalid Password. Not logged in");
          res.status(401).send("Not authorized. Invalid password.");
          return;
        }
      } else {
        console.log("Invalid Username. Not logged in");
        res.status(401).send("Not authorized. Invalid username.");
        return;
      }
    }
  );
});

//Define route handlers here
app.get("/getCreatedQuiz", (req, res, next) => {
  console.log("Question get request reached!!!");

  db.collection("triviaQuizCollection").findOne({}, function (err, result) {
    if (err) throw err;

    if (!result) {
      console.log("No qestions found.");
      res.status(404).send("Invalid question ID");
      return;
    }

    console.log(result);
    res.send(result["results"]["results"]);
  });
});

app.post("/storeQuiz", (req, res, next) => {
  console.log("Create Quiz post request reached!!!");
  db.collection("triviaQuizCollection").insertOne(
    { results: req.body },
    function (err, result) {
      if (err) throw err;
      if (!result) {
        console.log("Quiz not stored .");
        res.status(404).send("Invalid question ID");
        return;
      }
      quizMade = true;
      console.log(result);
    }
  );
});

app.post("/logout", (req, res, next) => {
  console.log("Request to log user out reached");
  req.session.loggedin = req.body["action"];
  console.log("User was logged out");

  res.status(200).send("User logged out");
});

app.post("/updatePlayer", (req, res, next) => {
  console.log("Request to update user score reached");

  db.collection("triviaUserCollection").updateOne(
    { username: req.body["stats"]["username"] },
    {
      $inc: {
        total_quizzes: req.body["stats"]["total_quizzes"],
        wins: req.body["stats"]["win"],
        losses: req.body["stats"]["loss"],
        total_score: req.body["stats"]["score"],
      },
    },
    function (err, result) {
      if (err) throw err;
      if (!result) {
        res.status(404).send("Cannot find user");
        return;
      }
      console.log(result);
      console.log("Profile Stats sucessfuly updated as above");
    }
  );
});

app.delete("/deleteCreatedQuiz", (req, res, next) => {
  console.log("Delete Created Quiz post request reached!!!");
  db.collection("triviaQuizCollection").deleteOne({}, function (err, result) {
    if (err) throw err;

    quizMade = false;
    res.send("Created Quiz Was Deleted");
    console.log(result);
  });
});

//Connect to database
mc.connect("mongodb://localhost:27017", function (err, client) {
  if (err) {
    console.log("Error in connecting to database");
    console.log(err);
    return;
  } else {
    console.log("Connected to database");
  }

  //USER "triviaDatabase" name in mongo shell
  db = client.db("triviaDatabase");

  app.listen(8080);
  console.log("Server on Port: 8080");
});
