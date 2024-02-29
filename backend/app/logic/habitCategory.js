const HabitCategory = require('../model/habitCategory')
class ActivityLogic {
    async getHabitCategoryList() {
        let result = await HabitCategory.find({}, {
            _id: 1,
            name: 1,
            awsKey: 1,
        })
        // console.log(result)
        return result
    }

    async getHabitCategory({id}) {
        let result = await HabitCategory.findById(id)
        // console.log(result)
        return result
    }
}

module.exports = new ActivityLogic()
