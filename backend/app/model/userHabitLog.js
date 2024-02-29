const mongoose = require('../service/database')

const userHabitLogSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    userHabitId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    time: {
        type: Date,
        required: true,
        default: new Date(),
    },
    location: {
        type: String,
        default: '',
        required: true
    }
}, {
    timestamps: true,
})

/**
 * @typedef UserHabitLog
 */
// // console.log('adding uniqure index to userhabit schema')
const UserHabitLog = mongoose.model('UserHabitLog', userHabitLogSchema)

module.exports = UserHabitLog


//------------------------Insert sample data
// setTimeout(() => {
//     Habit.insertMany([
//         {
//             name: "Exercise Daily",
//             habitCategoryId: "6215300a7b7a01c47ded4797"

//         },
//         {
//             name: "Eeat Healthy",
//             habitCategoryId: "6215300a7b7a01c47ded4797"

//         },
//         {
//             name: "Become Mindful",
//             habitCategoryId: "6215300a7b7a01c47ded4797"

//         },
//         {
//             name: "Wake up Early",
//             habitCategoryId: "6215300a7b7a01c47ded4797"

//         },

//     ])
// }, 2000)