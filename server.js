const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const Workout = require("./models/fitness_db.js")

const PORT = process.env.PORT || 3000;

const app = express();
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true, useFindAndModify: false });

  app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/exercise.html"));
  });

  app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/stats.html"));
  });

  let array = []

  //READ
  app.get("/api/workouts", (req, res) => {
    //what do I need to put in here to get the current workout
    console.log(Workout, "Here:")
    Workout.find({})
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
  })

  //UPDATE
  app.put("/api/workouts/:id", (req, res) => {
    Workout.findByIdAndUpdate(req.params.id, {
      $push:{exercises: req.body}
    }, { new: true, runValidators: true })
    .then( data => { 
      res.json(data)
    }).catch(
      err => {
        console.log(err)
        res.json(err)
      })
    
  })

  //CREATE
  app.post("/api/workouts", (req, res) => {
    console.log(req.body, "POST:")
  Workout.create({
      // exercises: [
      //   {
      //     type: req.body.type,
      //     name: req.body.name,
      //     duration: req.body.duration,
      //     weight: req.body.weight,
      //     reps: req.body.reps,
      //     sets: req.body.sets
      //   }]
    }).then( data => {
      res.json(data)
    }).catch(err => {
      console.log(err)
      res.json(err)
    })
  ;

  })

  //creating is for posting 


  //find by id and update 

  //post, get, put

  //create. find id, update, aggregate

app.listen(3000, () => {
    console.log("App running on port 3000!");
  });