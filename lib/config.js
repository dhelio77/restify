module.exports = {
    name: 'RestifyAPI'
    ,version: '1.0.0'
    ,env: process.env.NODE_ENV || 'DEV'
    ,port: process.env.PORT || 3000
    ,base_url: process.env.BASE_URL || 'http://localhost:3000'
    ,db: {
        uri: 'mongodb://localhost:27017/Blog'
    }
}