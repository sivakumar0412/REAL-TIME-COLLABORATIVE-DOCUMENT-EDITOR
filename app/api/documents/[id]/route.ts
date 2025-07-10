import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const document = documents.find((doc) => doc.id === params.id)

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  return NextResponse.json(document)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { title, content } = await request.json()

  const documentIndex = documents.findIndex((doc) => doc.id === params.id)

  if (documentIndex === -1) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  documents[documentIndex] = {
    ...documents[documentIndex],
    title: title || documents[documentIndex].title,
    content: content !== undefined ? content : documents[documentIndex].content,
    updated_at: new Date().toISOString(),
  }

  return NextResponse.json(documents[documentIndex])
}
