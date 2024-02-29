const mongoose = require('../service/database')

const userHabitSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    routine: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    active: {
        type: Boolean,
        required: false,
        default: false,
    },
}, {
    timestamps: true,
})

/**
 * @typedef UserHabit
 */
userHabitSchema.index({ userId: 1, habitId: 1 }, { unique: true })
// // console.log('adding uniqure index to userhabit schema')
const UserHabit = mongoose.model('UserHabit', userHabitSchema)

module.exports = UserHabit


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