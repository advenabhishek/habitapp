const Router = require('koa-router')
const router = new Router()

let v1 = require('./app/route/v1')
router.use(v1.routes())
router.use(v1.allowedMethods())

let v2 = require('./app/route/v2')
router.use(v2.routes())
router.use(v1.allowedMethods())

router.get('/', (ctx) => { ctx.body = { success: true } })
module.exports = router
