if (process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: 'mongodb+srv://forcousteau:<forcousteau>@notelist-prod-yr8jd.mongodb.net/test?retryWrites=true' }
} else {
    module.exports = { mongoURI: 'mongodb://localhost/notelist-db' }
}