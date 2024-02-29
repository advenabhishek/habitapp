const { mongo } = require('../service/database')
const mongoose = require('../service/database')
const { getSignedUrl } = require('../service/aws')

const habitCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    awsKey: {
        type: String,
        required: true, // CHANGE THIS TO TRUE LATER
        get: awsKey => {
            try {
                return getSignedUrl(awsKey)
            } catch (e) {
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
 * @typedef HabitCategory
 */
const HabitCategory = mongoose.model('HabitCategory', habitCategorySchema)

module.exports = HabitCategory


// ------------------------Insert sample data
// setTimeout(() => {
//     HabitCategory.insertMany([
//         {
//             _id: "622e28d6f89de15b819c47f0",
//             name: "Exercise Daily",
//             awsKey: "icons/Icon_exercise.svg"
//         },
//         {
//             _id: "622e28d6f89de15b819c47f1",
//             name: "Eat and Drink Healthy",
//             awsKey: "icons/Icon_eatdrinkhealthy.svg"

//         },
//         {
//             _id: "622e28d6f89de15b819c47f2",
//             name: "Sleep and Wake-up Early",
//             awsKey: "icons/Icon_sleep.svg"

//         },
//     ])

//     // console.log('Inserted new habit habit category')
// }, 2000)
