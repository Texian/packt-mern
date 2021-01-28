//--------------------- Middleware Imports
import bodyParser from 'body-parser'
import express from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import Template from '../template.js'

const app = express()

//--------------------- Express Configuration
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compression())
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).send(Template())
})

//----------------------------------------------------- Routes -----------------------------------------------------//
//--------------------- Imports
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'

//--------------------- Routes
app.use('/', userRoutes)
app.use('/', authRoutes)
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ "error" : err.name + ":" + err.message})
    } else if (err) {
        res.status(400).json({ "error" : err.name + ":" + err.message})
        console.log(err)
    }
})

export default app