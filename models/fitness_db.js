const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
    day: {
    type: Date, 
    // for some reason this snippet is giving me an issue
    // default: () => new Date(),
    },
    exercises: {
        type: String, 
        name: String, 
        duration: Number, 
        weight: Number, 
        reps: Number, 
        sets: Number, 
        distance: Number,
    }

}, 
//added this snippet
{ typeKey: '$type' }
)

const Workout = mongoose.model("Workout", workoutSchema);
module.exports = Workout