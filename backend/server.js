import app from './src/app.js'
import config from './src/config/config.js'
import http from 'http'
import dbConnection from './src/db/db.js'

const server = http.createServer(app)





server.listen(config.PORT , ()=>{
    console.log("server Running ")
})


//DB connection
dbConnection()