import dotenv from 'dotenv'
import http from 'http'
import app from './app.js'
import { connectMongo } from './config/db.js'
import { migrateLegacyStorage } from './utils/migrateLegacyStorage.js'

dotenv.config()

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000
const MAX_PORT_ATTEMPTS = 10

// Initialize Database & Seeds
async function startApp() {
  const connected = await connectMongo()
  if (!connected) {
    console.error('❌ Backend startup aborted because MongoDB is unavailable.')
    process.exit(1)
  }
  await migrateLegacyStorage()
  startServerOnPort(DEFAULT_PORT, MAX_PORT_ATTEMPTS)
}

function startServerOnPort(port, attemptsLeft) {
  const server = http.createServer(app)

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${port} is already in use.`)
      if (attemptsLeft > 0) {
        const nextPort = port + 1
        console.log(`🔄 Trying port ${nextPort} instead...`)
        startServerOnPort(nextPort, attemptsLeft - 1)
      } else {
        console.error(`❌ Could not find an open port after multiple attempts. Server startup aborted.`)
        process.exit(1)
      }
    } else {
      console.error('❌ Server startup error:', err)
      process.exit(1)
    }
  })

  server.listen(port, () => {
    console.log(`====================================================`)
    console.log(`🚀 OZ Interstate Production Backend Active`)
    console.log(`🌐 Server URL: http://localhost:${port}`)
    console.log(`====================================================`)
  })
}

startApp()
