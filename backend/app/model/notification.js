const mongoose = require('../service/database')

const notificationSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userHabitId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    time: {
        type: mongoose.Schema.Types.Date,
        require: true
    },
    frequency: {
        type: Number,
        default: 24 * 3600 * 1000
    },
    type: {
        type: String, // should be ENUM?
        required: false,
        default: false,
    },
    status: {
        type: String, // should be ENUM?
        required: false,
        default: false,
        enum: ['ACTIVE', 'CLICKED', 'IGNORED',]
    },
    token: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
})

/**
 * @typedef Notification
 */
const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification



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