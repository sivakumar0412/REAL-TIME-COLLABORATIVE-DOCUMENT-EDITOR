"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Save, Share2, Copy } from "lucide-react"
import Link from "next/link"
import { io, type Socket } from "socket.io-client"

interface User {
  id: string
  name: string
  color: string
  cursor?: number
}

interface Document {
  id: string
  title: string
  content: string
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"]

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const documentId = params.id as string

  const [document, setDocument] = useState<Document | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io({
      path: "/api/socket",
    })

    newSocket.on("connect", () => {
      setIsConnected(true)
      const user: User = {
        id: newSocket.id!,
        name: `User ${Math.floor(Math.random() * 1000)}`,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }
      setCurrentUser(user)
      newSocket.emit("join-document", { documentId, user })
    })

    newSocket.on("disconnect", () => {
      setIsConnected(false)
    })

    newSocket.on("user-joined", (user: User) => {
      setUsers((prev) => [...prev.filter((u) => u.id !== user.id), user])
    })

    newSocket.on("user-left", (userId: string) => {
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    })

    newSocket.on("users-list", (usersList: User[]) => {
      setUsers(usersList)
    })

    newSocket.on("content-changed", ({ content: newContent, userId }) => {
      if (userId !== newSocket.id) {
        setContent(newContent)
      }
    })

    newSocket.on("title-changed", ({ title: newTitle, userId }) => {
      if (userId !== newSocket.id) {
        setTitle(newTitle)
      }
    })

    newSocket.on("cursor-moved", ({ userId, position }) => {
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, cursor: position } : user)))
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [documentId])

  // Load document
  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}`)
        if (response.ok) {
          const doc = await response.json()
          setDocument(doc)
          setTitle(doc.title)
          setContent(doc.content)
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("Failed to load document:", error)
        router.push("/")
      }
    }

    loadDocument()
  }, [documentId, router])

  // Auto-save functionality
  const saveDocument = useCallback(async () => {
    if (!document) return

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })

      if (response.ok) {
        setLastSaved(new Date())
      }
    } catch (error) {
      console.error("Failed to save document:", error)
    }
  }, [documentId, title, content, document])

  // Debounced save
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveDocument()
    }, 2000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [title, content, saveDocument])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)

    if (socket) {
      socket.emit("content-change", { documentId, content: newContent })
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    if (socket) {
      socket.emit("title-change", { documentId, title: newTitle })
    }
  }

  const handleCursorMove = () => {
    if (textareaRef.current && socket) {
      const position = textareaRef.current.selectionStart
      socket.emit("cursor-move", { documentId, position })
    }
  }

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/editor/${documentId}`
    navigator.clipboard.writeText(shareUrl)
    setShowShareDialog(false)
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>

              <Input
                value={title}
                onChange={handleTitleChange}
                className="text-lg font-medium border-none shadow-none px-0 focus-visible:ring-0"
                placeholder="Untitled Document"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm text-gray-600">{isConnected ? "Connected" : "Disconnected"}</span>
              </div>

              {/* Active Users */}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <div className="flex -space-x-2">
                  {currentUser && (
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: currentUser.color }}
                      title={`${currentUser.name} (You)`}
                    >
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  {users.slice(0, 3).map((user) => (
                    <div
                      key={user.id}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: user.color }}
                      title={user.name}
                    >
                      {user.name.charAt(0)}
                    </div>
                  ))}
                  {users.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center text-white text-xs font-medium">
                      +{users.length - 3}
                    </div>
                  )}
                </div>
              </div>

              {/* Save Status */}
              {lastSaved && (
                <Badge variant="secondary" className="text-xs">
                  <Save className="h-3 w-3 mr-1" />
                  Saved {lastSaved.toLocaleTimeString()}
                </Badge>
              )}

              {/* Share Button */}
              <Button variant="outline" size="sm" onClick={() => setShowShareDialog(true)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onSelect={handleCursorMove}
          onKeyUp={handleCursorMove}
          onClick={handleCursorMove}
          placeholder="Start writing your document..."
          className="w-full min-h-[600px] resize-none border-none outline-none text-gray-900 text-base leading-relaxed font-mono"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          }}
        />
      </div>

      {/* Share Dialog */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Share Document</h3>
            <p className="text-sm text-gray-600 mb-4">Anyone with this link can view and edit this document.</p>
            <div className="flex gap-2">
              <Input value={`${window.location.origin}/editor/${documentId}`} readOnly className="flex-1" />
              <Button onClick={copyShareLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
