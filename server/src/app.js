import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { CLIENT_ORIGIN } from './config/env.js'
import healthRoutes from './routes/health.js'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import commentRoutes from './routes/comments.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use(errorHandler)

export default app
