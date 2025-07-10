import type { NextRequest } from "next/server"
import { Server as SocketIOServer } from "socket.io"
import type { Server as HTTPServer } from "http"

interface User {
  id: string
  name: string
  color: string
  cursor?: number
}

// Store active users per document
const documentUsers = new Map<string, Map<string, User>>()

export async function GET(req: NextRequest) {
  // This is a placeholder for Socket.IO server initialization
  // In a real implementation, you would set up the Socket.IO server here
  return new Response("Socket.IO server should be initialized", { status: 200 })
}

// Socket.IO server logic (this would typically be in a separate server file)
export function initializeSocketServer(server: HTTPServer) {
  const io = new SocketIOServer(server, {
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

      const docUsers = documentUsers.get(documentId)!
      docUsers.set(socket.id, user)

      // Notify others about new user
      socket.to(documentId).emit("user-joined", user)

      // Send current users list to the new user
      const usersList = Array.from(docUsers.values()).filter((u) => u.id !== socket.id)
      socket.emit("users-list", usersList)
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
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)

      // Remove user from all documents
      for (const [documentId, users] of documentUsers.entries()) {
        if (users.has(socket.id)) {
          users.delete(socket.id)
          socket.to(documentId).emit("user-left", socket.id)

          if (users.size === 0) {
            documentUsers.delete(documentId)
          }
        }
      }
    })
  })

  return io
}
