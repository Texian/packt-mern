//--------------------- Middleware Imports
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from '../template.js'
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import devBundle from './devBundle.js' //TODO comment out before production build
import React from 'react'
import ReactDOMServer from 'react-dom/server.js'
import StaticRouter from 'react-router-dom/StaticRouter.js'
import MainRouter from './../client/MainRouter.js'
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles'
import theme from './../client/theme.js'

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

devBundle.compile(app) //TODO comment out before production build

//--------------------- Express Configuration
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

//----------------------------------------------------- Routes -----------------------------------------------------//
//--------------------- Mount Routes
app.use('/', userRoutes)
app.use('/', authRoutes)

app.get('*', (req, res) => {
    const sheets = new ServerStyleSheets()
    const context ={}
    const markup = ReactDOMServer.renderToString(
        sheets.collect(
            <StaticRouter location={req.url} context={context}>
                <ThemeProvider theme={theme}>
                    <MainRouter />
                </ThemeProvider>
            </StaticRouter>
        )
    )
    if (context.url) {
        return res.redirect(303, context.url)
    }
    const css = sheets.toString()
    res.status(200).send(Template({
        markup: markup,
        css:css
    }))
})

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ "error" : err.name + ":" + err.message})
    } else if (err) {
        res.status(400).json({ "error" : err.name + ":" + err.message})
        console.log(err)
    }
})

export default app