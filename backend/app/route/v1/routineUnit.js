const Router = require('koa-router')
const router = new Router({
    prefix: '/routine-unit'
})

const routineUnitController = require('../../controller/routineUnit')
router.get('/habit/:habitId', routineUnitController.getRoutineUnit)
module.exports = router
