const routineUnitLogic = require('../logic/routineUnit')

class RoutineUnitController {
    async getRoutineUnit(ctx) {
        let { params: { habitId } } = ctx
        if (!habitId) {
            throw new Error('Please Provide a valid habitId')
        }
        let response = await routineUnitLogic.getRoutineUnit(habitId)
        ctx.body = response
    }
}

module.exports = new RoutineUnitController()
