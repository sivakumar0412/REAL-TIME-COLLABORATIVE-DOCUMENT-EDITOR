-- Create database schema for PostgreSQL
-- Run this script to set up the database tables

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create document_collaborators table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS document_collaborators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission VARCHAR(20) DEFAULT 'edit', -- 'read', 'edit', 'admin'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(document_id, user_id)
);

-- Create document_sessions table (track active editing sessions)
CREATE TABLE IF NOT EXISTS document_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    socket_id VARCHAR(100),
    cursor_position INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON documents(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_document_collaborators_document_id ON document_collaborators(document_id);
CREATE INDEX IF NOT EXISTS idx_document_sessions_document_id ON document_sessions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_sessions_socket_id ON document_sessions(socket_id);

-- Insert sample data
INSERT INTO documents (id, title, content) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Welcome Document',
    'Welcome to the collaborative document editor!

This is a real-time collaborative editor where multiple users can edit documents simultaneously. Try opening this document in multiple browser tabs to see the real-time synchronization in action.

Features:
- Real-time collaborative editing
- Live user presence indicators
- Auto-save functionality
- Document sharing via links
- Cursor position tracking

Start typing to see the magic happen!'
) ON CONFLICT (id) DO NOTHING;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
