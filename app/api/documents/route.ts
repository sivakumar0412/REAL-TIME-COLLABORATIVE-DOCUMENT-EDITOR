import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In production, use a real database like PostgreSQL
const documents: any[] = [
  {
    id: "1",
    title: "Welcome Document",
    content:
      "Welcome to the collaborative document editor!\n\nThis is a real-time collaborative editor where multiple users can edit documents simultaneously. Try opening this document in multiple browser tabs to see the real-time synchronization in action.\n\nFeatures:\n- Real-time collaborative editing\n- Live user presence indicators\n- Auto-save functionality\n- Document sharing via links\n- Cursor position tracking\n\nStart typing to see the magic happen!",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    collaborators: 0,
  },
]

export async function GET() {
  return NextResponse.json(documents)
}

export async function POST(request: NextRequest) {
  const { title } = await request.json()

  const newDocument = {
    id: Date.now().toString(),
    title: title || "Untitled Document",
    content: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    collaborators: 0,
  }

  documents.unshift(newDocument)

  return NextResponse.json(newDocument)
}
