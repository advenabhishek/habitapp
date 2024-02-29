const Habit = require('../model/habit')
const habitCategory = require('../model/habitCategory')

class ActivityLogic {
    async getHabitByHabitCategory(habitCategoryId) {
        let result = await Habit.find({
            habitCategoryId
        }, {
            _id: 1,
            name: 1,
            awsKey: 1,
        })

        return result
    }

    async getHabit(id){
        return await Habit.findById(id)
    }
}

module.exports = new ActivityLogic()

