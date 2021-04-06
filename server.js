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

//html files

  app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/exercise.html"));
  });

  app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/stats.html"));
  });



  // READ
  app.get("/api/workouts", (req, res) => {
    console.log(Workout, "Here:")
    Workout.find({})
    .then(data => {
      console.log(data)
      res.json(data);
    })
    .catch(err => {
      console.log(err)
      res.json(err);
    });
  })

  //UPDATE
  app.put("/api/workouts/:id", (req, res) => {
    Workout.findByIdAndUpdate(req.params.id, 
      {exercises: req.body}, 
      { new: true}, 
      err => {
        console.log(err)
      }
    )
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
    Workout.create({}
    ).then(data => {
      res.json(data)
    }).catch(err => {
      console.log(err)
      res.json(err)
    })
    

  })

app.listen(3000, () => {
    console.log("App running on port 3000!");
  });