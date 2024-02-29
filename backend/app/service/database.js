const mongoose = require('mongoose')
const config = require('config')
try {
    mongoose.connect(config.get('mongoUri'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
    })
    // console.log('MongoDB connected ....')
} catch (e) {
    console.error(e.message)
    process.exit(1)
}
module.exports = mongoose
