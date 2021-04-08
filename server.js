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
  app.get('/api/workouts', (req, res) => {
    Workout.aggregate([
      {
        $addFields: {
          totalDuration: {
            $sum: '$exercises.duration',
          },
        },
      },
    ])
      .then((dbWorkouts) => {
        console.log(dbWorkouts)
        res.json(dbWorkouts);
      })
      .catch((err) => {
        console.log(err)
        res.json(err);
      });
  });

  //UPDATE
  app.put("/api/workouts/:id", (req, res) => {
    console.log(`THIS IS MY LOG: ${JSON.stringify(req.body)}`)
    Workout.findByIdAndUpdate(req.params.id, 
      { $set: {exercises: req.body} }, 
      { new: true, runValidators: true}, 
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
    Workout.create({day: new Date()}
    ).then(data => {
      res.json(data)
    }).catch(err => {
      console.log(err)
      res.json(err)
    })
  })

  app.get('/api/workouts/range', (req, res) => {
    Workout.aggregate([
      {
        $addFields: {
          totalDuration: {
            $sum: '$exercises.duration',
          },
        },
      },
    ])
      .sort({ _id: -1 })
      .limit(7)
      .then((dbWorkouts) => {
        console.log(dbWorkouts);
        res.json(dbWorkouts);
      })
      .catch((err) => {
        console.log(err)
        res.json(err);
      });
  });

app.listen(3000, () => {
    console.log("App running on port 3000!");
  });