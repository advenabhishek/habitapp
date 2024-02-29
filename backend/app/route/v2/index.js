const Router = require('koa-router')
const router = new Router({
    prefix: '/v2'
})

let routeList = [
    './habitCategory',
    './habit',
    './routineUnit',
    './userHabit',
    './userHabitLog',
]

for (let route of routeList) {
    try {
        let item = require(route)
        router.use(item.routes())
        router.use(item.allowedMethods())
    } catch (e) {
        console.error(e)
        throw e
    }
}

router.get('/', (ctx) => { ctx.body = { success: true } })
module.exports = router
