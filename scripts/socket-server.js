// Standalone Socket.IO server for real-time collaboration
// This would typically run as a separate service in production

const { createServer } = require("http")
const { Server } = require("socket.io")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

// Store active users per document
const documentUsers = new Map()

app.prepare().then(() => {
  const httpServer = createServer(handler)

  const io = new Server(httpServer, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  })

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("join-document", ({ documentId, user }) => {
      socket.join(documentId)

      if (!documentUsers.has(documentId)) {
        documentUsers.set(documentId, new Map())
      }

      const docUsers = documentUsers.get(documentId)
      docUsers.set(socket.id, user)

      // Notify others about new user
      socket.to(documentId).emit("user-joined", user)

      // Send current users list to the new user
      const usersList = Array.from(docUsers.values()).filter((u) => u.id !== socket.id)
      socket.emit("users-list", usersList)

      console.log(`User ${user.name} joined document ${documentId}`)
    })

    socket.on("content-change", ({ documentId, content }) => {
      socket.to(documentId).emit("content-changed", {
        content,
        userId: socket.id,
      })
    })

    socket.on("title-change", ({ documentId, title }) => {
      socket.to(documentId).emit("title-changed", {
        title,
        userId: socket.id,
      })
    })

    socket.on("cursor-move", ({ documentId, position }) => {
      socket.to(documentId).emit("cursor-moved", {
        userId: socket.id,
        position,
      })

      // Update user cursor position
      for (const [docId, users] of documentUsers.entries()) {
        if (docId === documentId && users.has(socket.id)) {
          const user = users.get(socket.id)
          user.cursor = position
          users.set(socket.id, user)
          break
        }
      }
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)

      // Remove user from all documents
      for (const [documentId, users] of documentUsers.entries()) {
        if (users.has(socket.id)) {
          const user = users.get(socket.id)
          users.delete(socket.id)
          socket.to(documentId).emit("user-left", socket.id)
          console.log(`User ${user.name} left document ${documentId}`)

          if (users.size === 0) {
            documentUsers.delete(documentId)
          }
        }
      }
    })
  })

  httpServer
    .once("error", (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
