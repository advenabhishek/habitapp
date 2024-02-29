const mongoose = require('../service/database')

const unitSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    template:'',
    defaultAmount: {
        type: String,
        required: true,
    },
    default: {
        type: Boolean,
        required: false,
        default: false,
    },
    // template: {
    //     type: String,
    // }
})

const routineUnitsSchema = mongoose.Schema({
    units: {
        type: [unitSchema],
        required: false,
    },
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
}, {
    timestamps: true,
})

/**
 * @typedef RoutineUnit
 */
const RoutineUnit = mongoose.model('routineUnit', routineUnitsSchema)

module.exports = RoutineUnit


// // ------------------------Insert sample data
// setTimeout(() => {
//     RoutineUnit.insertMany([
//         {
//             units: [
//                 {
//                     type: 'Duration',
//                     name: 'mins',
//                     // template:'I will Gym for {amount} {name} {} at “6:00” “AM” in “Gold gym”',
//                     defaultAmount: 60,
//                     increment: 15,
//                     default: true
//                 },
//                 {
//                     type: 'Calories',
//                     name: 'cal',
//                     template:'',
//                     defaultAmount: 100,
//                     increment: 25,
//                     default: false
//                 },
//             ],
//             habitId: "622e2a4f09f46f59c5f5c682"
//         },
//         {
//             units: [
//                 {
//                     type: 'Duration',
//                     name: 'mins',
//                     template:'',
//                     defaultAmount: 30,
//                     increment: 15,
//                     default: true
//                 },
//             ],
//             habitId: "622e2a4f09f46f59c5f5c683"
//         },
//         {
//             units: [
//                 {
//                     type: 'Duration',
//                     name: 'mins',
//                     template:'',
//                     defaultAmount: 30,
//                     increment: 15,
//                     default: true
//                 },
//                 {
//                     type: 'Distance',
//                     name: 'km',
//                     template:'',
//                     defaultAmount: 3.0,
//                     increment: 0.5,
//                     default: false
//                 },
//                 {
//                     type: 'Steps',
//                     name: 'steps',
//                     template:'',
//                     defaultAmount: 6000,
//                     increment: 500,
//                     default: false
//                 },
//                 {
//                     type: 'Laps',
//                     name: 'laps',
//                     template:'',
//                     defaultAmount: 4,
//                     increment: 1,
//                     default: false
//                 },
//             ],
//             habitId: "622e2a4f09f46f59c5f5c684"
//         },
//         {
//             units: [
//                 {
//                     type: 'Duration',
//                     name: 'mins',
//                     template:'',
//                     defaultAmount: 20,
//                     increment: 5,
//                     default: true
//                 },
//                 {
//                     type: 'Distance',
//                     name: 'km',
//                     template:'',
//                     defaultAmount: 3.0,
//                     increment: 0.5,
//                     default: false
//                 },
//                 {
//                     type: 'Laps',
//                     name: 'laps',
//                     template:'',
//                     defaultAmount: 4,
//                     increment: 1,
//                     default: false
//                 },
//                 {
//                     type: 'Calories',
//                     name: 'cal',
//                     template:'',
//                     defaultAmount: 100,
//                     increment: 25,
//                     default: false
//                 },
//             ],
//             habitId: "622e2a4f09f46f59c5f5c685"
//         },
//         {
//             units: [
//                 {
//                     type: 'Duration',
//                     name: 'mins',
//                     template:'',
//                     defaultAmount: 30,
//                     increment: 5,
//                     default: true
//                 },
//                 {
//                     type: 'Distance',
//                     name: 'km',
//                     template:'',
//                     defaultAmount: 3.0,
//                     increment: 0.5,
//                     default: false
//                 },
//                 {
//                     type: 'Laps',
//                     name: 'laps',
//                     template:'',
//                     defaultAmount: 4,
//                     increment: 1,
//                     default: false
//                 },
//             ],
//             habitId: "622e2a4f09f46f59c5f5c686"
//         },
//         {
//             units: [
//                 {
//                     type: 'Duration',
//                     name: 'mins',
//                     template:'',
//                     defaultAmount: 60,
//                     increment: 15,
//                     default: true
//                 },
//                 {
//                     type: 'Laps',
//                     name: 'laps',
//                     template:'',
//                     defaultAmount: 8,
//                     increment: 1,
//                     default: false
//                 },
//             ],
//             habitId: "622e2a4f09f46f59c5f5c687"
//         },
//         {
//             units: [
//                 {
//                     type: 'Number of fruits',
//                     name: 'fruits',
//                     template:'',
//                     defaultAmount: 2,
//                     increment: 1,
//                     default: true
//                 },
//             ],
//             habitId: "622e2a4f09f46f59c5f5c688"
//         },
//         {
//             units: [
//                 {
//                     type: 'Glasses',
//                     name: 'glass',
//                     template:'',
//                     defaultAmount: 6,
//                     increment: 1,
//                     default: true
//                 },
//                 {
//                     type: 'Bottles',
//                     name: 'bottle',
//                     template:'',
//                     defaultAmount: 2,
//                     increment: 0.5,
//                     default: false
//                 },
//                 {
//                     type: 'Litres',
//                     name: 'l',
//                     template:'',
//                     defaultAmount: 2,
//                     increment: 0.2,
//                     default: false
//                 },

//             ],
//             habitId: "622e2a4f09f46f59c5f5c689"
//         },
//         {
//             units: [
//                 {
//                     type: 'Duration',
//                     name: 'minute',
//                     template:'',
//                     defaultAmount: 500,
//                     increment: 10,
//                     default: true
//                 },

//             ],
//             habitId: "622e2a4f09f46f59c5f5c68a"
//         },
//     ])
//     // console.log('Inserted habit units successfully....')
// }, 2000)
