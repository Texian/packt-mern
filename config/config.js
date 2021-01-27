const config = {
    //--------------------- dev or production mode
    env: process.env.NODE_ENV || 'development',
    //--------------------- port to listen to
    port: process.env.PORT || 4000,
    //--------------------- jwt auth seed
    jwtSecret: process.env.JWT_SECRET || "A_secret_code",
    //--------------------- MongoDB database instance location
    mongoUri: process.env.MONGODB_URI || 
        process.env.MONGO_HOST ||
        'mongodb://' + (process.env.IP || 'localhost') + ':' + (process.env.MONGO_PORT || '27017') + '/mern'
}

export default config

//Replaces the need for a .env file