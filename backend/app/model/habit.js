const mongoose = require('../service/database')
const { getSignedUrl } = require('../service/aws')

const habitSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    habitCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    awsKey: {
        type: String,
        required: true, // CHANGE THIS TO TRUE LATER
        get: awsKey => {
            try {
                // console.log(awsKey)
                return getSignedUrl(awsKey)
            } catch (e) {
                console.error(e)
                return
            }
        }
    }
}, {
    timestamps: true,
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
})

/**
 * @typedef Habit
 */
const Habit = mongoose.model('Habit', habitSchema)

module.exports = Habit



// // ------------------------Insert sample data
// setTimeout(() => {
//     Habit.insertMany([
//         {
//             name: "Gym",
//             habitCategoryId: "622e28d6f89de15b819c47f0",
//             awsKey: "icons/Icon_gym.svg"
//         },
//         {
//             name: "Yoga",
//             habitCategoryId: "622e28d6f89de15b819c47f0",
//             awsKey: "icons/Icon_yoga.svg"
//         },
//         {
//             name: "Walking",
//             habitCategoryId: "622e28d6f89de15b819c47f0",
//             awsKey: "icons/Icon_walking.svg"
//         },
//         {
//             name: "Running",
//             habitCategoryId: "622e28d6f89de15b819c47f0",
//             awsKey: "icons/Icon_running.svg"
//         },
//         {
//             name: "Cycling",
//             habitCategoryId: "622e28d6f89de15b819c47f0",
//             awsKey: "icons/Icon_cycling.svg"
//         },
//         {
//             name: "Swimming",
//             habitCategoryId: "622e28d6f89de15b819c47f0",
//             awsKey: "icons/Icon_swimming.svg"
//         },
//         {
//             name: "Eat Fruits Daily",
//             habitCategoryId: "622e28d6f89de15b819c47f1",
//             awsKey: "icons/Icon_eatfruit.svg"
//         },
//         {
//             name: "Drink more Water",
//             habitCategoryId: "622e28d6f89de15b819c47f1",
//             awsKey: "icons/Icon_water.svg"
//         },
//         {
//             name: "Sleep early",
//             habitCategoryId: "622e28d6f89de15b819c47f2",
//             awsKey: "icons/Icon_sleepearly.svg"
//         },
//         {
//             name: "Wake-up early",
//             habitCategoryId: "622e28d6f89de15b819c47f2",
//             awsKey: "icons/Icon_wakeupearly.svg"
//         },
//     ])

//     // console.log('Inserted new habits')
// }, 2000)


