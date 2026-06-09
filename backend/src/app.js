const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const authRoutes = require('./routes/auth.routes')

const app = express()

app.use(helmet())
app.use(cors({ origin: '*' }))
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'OdontoSoft' })
})

module.exports = app