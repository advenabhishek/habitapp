const RoutineUnit = require('../model/routineUnit')

class RoutineUnitLogic {
    async getRoutineUnit(habitId) {
        // console.log({ habitId })
        let result = await RoutineUnit.findOne({
            habitId
        })
        return result
    }
}

module.exports = new RoutineUnitLogic()



