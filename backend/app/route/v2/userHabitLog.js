const Router = require('koa-router')
const router = new Router({
    prefix: '/user-habit-log'
})

const userHabitLogController = require('../../controller/userHabitLog')
router.post('/', userHabitLogController.createUserHabitLog)
router.get('/:id', userHabitLogController.getUserHabitLog)
router.put('/:id', userHabitLogController.editUserHabitLog)
router.delete('/:id', userHabitLogController.deleteUserHabitLog)
router.get('/user/:userId', userHabitLogController.getUserHabitLogList)
router.get('/summary/user-habit/:userHabitId', userHabitLogController.getSummary)
router.get('/summary/user/:userId', userHabitLogController.getSummaryByUser)
module.exports = router