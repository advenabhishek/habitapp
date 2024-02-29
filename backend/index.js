const Koa = require('koa')
const app = new Koa()
const cors = require('koa2-cors')
require('dotenv').config()

const Raven = require('raven')
const router = require('./router')
const processNotification = require('./app/service/notification')

// Middlewares
app.use(require('koa-body')({
    formidable: {
        uploadDir: __dirname + '/uploads', // directory where files will be uploaded
        keepExtensions: true // keep file extension on upload
    },
    multipart: true,
    urlencoded: true,
}))

app.use(async (ctx, next) => {
    function getIP(req) {
        // req.connection is deprecated
        const conRemoteAddress = req.connection?.remoteAddress
        // req.socket is said to replace req.connection
        const sockRemoteAddress = req.socket?.remoteAddress
        // some platforms use x-real-ip
        const xRealIP = req.headers['x-real-ip']
        // most proxies use x-forwarded-for
        const xForwardedForIP = (() => {
            const xForwardedFor = req.headers['x-forwarded-for']
            if (xForwardedFor) {
                // The x-forwarded-for header can contain a comma-separated list of
                // IP's. Further, some are comma separated with spaces, so whitespace is trimmed.
                const ips = xForwardedFor.split(',').map(ip => ip.trim())
                return ips[0]
            }
        })()
        // prefer x-forwarded-for and fallback to the others
        return xForwardedForIP || xRealIP || sockRemoteAddress || conRemoteAddress
    }

    const start = Date.now()
    await next()
    const ms = Date.now() - start
    const { method, url } = ctx.request
    const { status } = ctx
    const ip = getIP(ctx.request)
    console.log(`${method} ${url} ${status} -- ${ms}ms -- \x1b[34m [${ip}]\x1b[0m`)
})

app.use(async (ctx, next) => {
    try {
        await next()
        ctx.status = ctx.status || 200
    } catch (e) {
        // Raven.captureException(e)
        console.log(e)
        console.log(ctx.request.body)
        ctx.status = e.status || 400
        ctx.body = {
            error: {
                name: e.name,
                message: e.message
            }
        }
    }
})

app.use(cors({
    origin: function (ctx) {
        return '*'
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))


app.use(router.routes())
const server = require('http').createServer(app.callback())
server.listen(process.env.PORT || 4002)
console.log('\x1b[34m', 'Do-it' + '\x1b[0m' + ' Backend server running on', process.env.PORT || 4002)
processNotification()