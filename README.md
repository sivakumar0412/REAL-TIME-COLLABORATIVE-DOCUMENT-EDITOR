# 📝 Real-Time Collaborative Document Editor

*COMPANY*: CODTECH IT SOLUTIONS

*NAME*: D SIVA KUMAR

*INTERN ID*: CT06DH1140

*DOMAIN*: Full Stack Web Development

*DURATION*: 6 WEEEKS

*MENTOR*:NEELA SANTOSH


# 📝 Real-Time Collaborative Document Editor

A modern, real-time collaborative document editor built with React.js, Next.js, and Socket.IO. Multiple users can edit documents simultaneously with live synchronization, user presence indicators, and auto-save functionality.

![Collaborative Editor Demo](https://via.placeholder.com/800x400/4f46e5/ffffff?text=Collaborative+Document+Editor)

## ✨ Features

### 🚀 Real-Time Collaboration
- **Live Text Synchronization** - See changes from other users instantly
- **User Presence Indicators** - Know who's currently editing
- **Live Cursor Tracking** - See where other users are typing
- **Conflict Resolution** - Handle simultaneous edits gracefully

### 📄 Document Management
- **Create & Edit Documents** - Simple document creation and editing
- **Auto-Save** - Documents save automatically every 2 seconds
- **Document Sharing** - Share documents via shareable links
- **Document History** - Track creation and modification dates

### 🎨 User Experience
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Clean Interface** - Distraction-free editing experience
- **Connection Status** - Visual indicators for connection state
- **User Avatars** - Colored avatars for each collaborator

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Next.js 14** - Full-stack React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Socket.IO** - Real-time bidirectional communication
- **Next.js API Routes** - Serverless API endpoints

### Database (Ready for Integration)
- **PostgreSQL** - Relational database (schema provided)
- **In-Memory Storage** - Current demo implementation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone or Download the Project**
   \`\`\`bash
   # If using git
   git clone <repository-url>
   cd collaborative-document-editor
   
   # Or download and extract the ZIP file
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   # Using npm (recommended)
   npm install --legacy-peer-deps
   
   # Or using yarn
   yarn install
   \`\`\`

3. **Start Development Server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open in Browser**
   Navigate to \`http://localhost:3000\`

### Testing Real-Time Features

1. Open the application in multiple browser tabs
2. Create a new document or open the "Welcome Document"
3. Start typing in one tab and watch it appear in others
4. Notice the user avatars and connection indicators

## 📁 Project Structure

\`\`\`
collaborative-document-editor/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Homepage with document list
│   ├── editor/[id]/page.tsx     # Document editor page
│   ├── api/                     # API routes
│   │   ├── documents/           # Document CRUD operations
│   │   └── socket/              # Socket.IO configuration
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   └── ui/                      # UI component library
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
├── scripts/                     # Database and server scripts
│   ├── init-database.sql        # PostgreSQL schema
│   └── socket-server.js         # Standalone Socket.IO server
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
\`\`\`

## 🔧 Configuration

### Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
# Database (when using PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/collaborative_editor

# Socket.IO Configuration
SOCKET_IO_PORT=3001

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Database Setup (Optional)

The application currently uses in-memory storage for demo purposes. To use PostgreSQL:

1. **Install PostgreSQL** on your system
2. **Create a database** named \`collaborative_editor\`
3. **Run the initialization script**:
   \`\`\`bash
   psql -d collaborative_editor -f scripts/init-database.sql
   \`\`\`
4. **Update API routes** to use database instead of in-memory storage

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (if not already done)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Configure Socket.IO** for production:
   - Use a separate Socket.IO server (Railway, Heroku, etc.)
   - Update client connection URL

### Deploy to Other Platforms

The application can be deployed to:
- **Netlify** (with serverless functions)
- **Railway** (full-stack deployment)
- **Heroku** (with PostgreSQL add-on)
- **DigitalOcean App Platform**

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create new documents
- [ ] Edit document titles
- [ ] Type in document content
- [ ] Open same document in multiple tabs
- [ ] Verify real-time synchronization
- [ ] Check user presence indicators
- [ ] Test auto-save functionality
- [ ] Verify document sharing links

### Automated Testing (Future Enhancement)

\`\`\`bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Integration tests
npm run test:integration
\`\`\`

## 🔧 Troubleshooting

### Common Issues

**1. Dependency Conflicts**
\`\`\`bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
\`\`\`

**2. Port Already in Use**
\`\`\`bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
\`\`\`

**3. Socket.IO Connection Issues**
- Check browser console for WebSocket errors
- Ensure firewall allows connections
- Try running the standalone socket server

**4. Real-Time Features Not Working**
- Verify Socket.IO client connection
- Check network tab for WebSocket connections
- Ensure multiple tabs are using the same document ID

### Debug Mode

Enable debug logging:
\`\`\`bash
DEBUG=socket.io* npm run dev
\`\`\`

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**:
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages

### Areas for Contribution

- [ ] User authentication system
- [ ] Rich text editing (bold, italic, etc.)
- [ ] Document versioning and history
- [ ] Comments and suggestions
- [ ] Export functionality (PDF, Word)
- [ ] Mobile app development
- [ ] Performance optimizations

## 📚 API Documentation

### Document Endpoints

\`\`\`
GET    /api/documents          # List all documents
POST   /api/documents          # Create new document
GET    /api/documents/[id]     # Get specific document
PUT    /api/documents/[id]     # Update document
DELETE /api/documents/[id]     # Delete document
\`\`\`

### Socket.IO Events

\`\`\`javascript
// Client to Server
socket.emit('join-document', { documentId, user })
socket.emit('content-change', { documentId, content })
socket.emit('title-change', { documentId, title })
socket.emit('cursor-move', { documentId, position })

// Server to Client
socket.on('user-joined', user)
socket.on('user-left', userId)
socket.on('users-list', users)
socket.on('content-changed', { content, userId })
socket.on('title-changed', { title, userId })
socket.on('cursor-moved', { userId, position })
\`\`\`

## 🔒 Security Considerations

### Current Implementation
- No authentication (demo purposes)
- Public document access
- In-memory storage only

### Production Recommendations
- Implement user authentication
- Add document permissions (read/write/admin)
- Use HTTPS for all connections
- Validate and sanitize all inputs
- Implement rate limiting
- Use secure database connections

## 📈 Performance

### Current Optimizations
- Debounced auto-save (2-second delay)
- Efficient Socket.IO event handling
- Minimal re-renders with React hooks

### Future Optimizations
- Operational Transformation for better conflict resolution
- Document chunking for large files
- CDN for static assets
- Database indexing and caching

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Socket.IO Team** - Real-time communication made easy
- **Tailwind CSS** - Beautiful utility-first CSS
- **Vercel** - Excellent deployment platform
- **Open Source Community** - For inspiration and tools

## 📞 Support

### Getting Help

1. **Check the troubleshooting section** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Join our community** discussions

### Reporting Bugs

When reporting bugs, please include:
- Operating system and version
- Node.js version
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

### Feature Requests

We welcome feature requests! Please:
- Check if the feature already exists
- Describe the use case clearly
- Explain why it would be valuable
- Consider contributing the implementation

---

**Happy Collaborating! 🎉**

Built with ❤️ using React, Next.js, and Socket.IO

