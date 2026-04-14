# 📝 DocuCollab - Collaborative Document Editor

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.10-06B6D4?logo=tailwindcss)
![TipTap](https://img.shields.io/badge/TipTap-2.6.6-7C3AED)
![License](https://img.shields.io/badge/License-MIT-green)

### 🚀 Real-time collaborative document editing

**Live cursors • Typing indicators • Instant sync**

</div>

---

## ✨ Features

### 📄 Document Management

- Create, edit, delete documents
- Rich text editor (bold, italic, underline, highlight, colors)
- Headings (H1 → H6), alignment, lists (bullet, number, checklist)
- Tables, images, links, code blocks, blockquotes
- 🔍 Find & Replace (regex supported)
- 💾 Auto-save (1.5s) with status indicator
- 🔢 Character count limit

---

### 🤝 Real-time Collaboration

- ⚡ Live sync via CRDT (Yjs)
- 👀 See other users’ cursors
- ⌨️ Typing indicators
- 👥 Active users (avatar stack)
- 🔄 Conflict-free merging

---

### 🔐 Authentication & Authorization

- Login / Register
- JWT + refresh token
- Role-based access (Admin / User / Collaborator / Viewer)
- Protected routes via middleware

---

### 👥 Sharing & Permissions

- Public / Private documents
- Add collaborators (edit)
- Add viewers (read-only)
- Owner-only delete & settings

---

### 🛠️ Admin Panel

- User management (CRUD + search + pagination)
- Role management
- Menu management (dynamic navigation)

---

### 🎨 UI/UX

- Modern gradient theme (purple/blue)
- Responsive (mobile → desktop)
- Grid/List view toggle
- Search & filter
- Toast notifications + loading states

---

## 🏗️ Architecture

```
Client (Next.js)
 ├── Documents Page
 ├── Editor (TipTap)
 └── Admin Panel
        │
        ▼
 ┌───────────────┬───────────────┬───────────────┐
 │   REST API    │  WebSocket    │  Socket.IO    │
 │   (3000)      │   (1234)      │   (3001)      │
 │               │   (Yjs)       │ (Presence)    │
 └───────────────┴───────────────┴───────────────┘
                     │
                     ▼
                 MongoDB
```

---

## 🚀 Tech Stack

### Frontend

| Tech         | Purpose              |
| ------------ | -------------------- |
| Next.js      | App Router framework |
| React        | UI library           |
| TypeScript   | Type safety          |
| Tailwind CSS | Styling              |
| TipTap       | Editor               |
| Yjs          | Real-time CRDT       |
| Socket.IO    | Presence             |

---

### Backend

| Tech              | Purpose   |
| ----------------- | --------- |
| Node.js + Express | API       |
| MongoDB           | Database  |
| JWT               | Auth      |
| Socket.IO         | Real-time |
| Yjs WebSocket     | Sync      |

---

## 📁 Project Structure

```
my-app/
├── app/
│   ├── (auth)/
│   ├── (protected)/
│   │   ├── admin/
│   │   └── documents/
│   ├── layout.tsx
│   └── providers.tsx
│
├── components/
│   ├── editor/
│   ├── document/
│   ├── admin/
│   └── common/
│
├── lib/
│   ├── services/
│   ├── axios.ts
│   ├── auth.ts
│   └── socket.ts
│
├── server/
│   ├── collaboration-server.js
│   └── socket-server.js
│
├── context/
├── hooks/
├── middleware.ts
└── package.json
```

---

## 🔧 Installation

### 1. Clone

```bash
git clone <repo>
cd my-app
```

### 2. Install

```bash
npm install
```

### 3. Env

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Run

```bash
# Next.js
npm run dev

# Yjs server
npm run collab-server

# Socket server
npm run socket-server
```

👉 Or all-in-one:

```bash
npm run dev:all
```

---

## 🌐 Open App

```
http://localhost:3000
```

---

## 🔄 Real-time Flow

```
User A types
   ↓
TipTap update
   ↓
Yjs update
   ↓
WebSocket → Server
   ↓
Broadcast
   ↓
User B / C receive
   ↓
UI updates instantly
```

---

## 🎮 Usage

### Create Document

- Click **New Document**
- Fill title + type
- Add collaborators/viewers
- Create

### Edit

- Toolbar formatting
- Auto-save every 1.5s

### Collaborate

- Share URL
- Open in multiple tabs
- Watch live sync 🔥

---

## 🧪 Testing

### Multi-user Test

- Open Chrome + Incognito
- Edit same doc
- See real-time updates

### Permission Test

- Viewer → read-only
- Collaborator → edit

---

## 🐛 Troubleshooting

| Issue              | Fix                |
| ------------------ | ------------------ |
| WebSocket failed   | Run collab-server  |
| Socket not working | Run socket-server  |
| Not syncing        | Check both servers |
| Token expired      | Re-login           |

---

## 📦 Dependencies

### Core

```json
{
  "next": "16.2.2",
  "react": "19.2.4",
  "typescript": "5.6.2",
  "tailwindcss": "3.4.10"
}
```

### Editor

```json
{
  "@tiptap/react": "2.6.6",
  "yjs": "13.6.20",
  "socket.io-client": "4.8.1"
}
```

---

## 🤝 Contributing

```bash
git checkout -b feature/awesome
git commit -m "Add awesome feature"
git push origin feature/awesome
```

Open PR 🚀

---

## 🙏 Credits

- TipTap
- Yjs
- Socket.IO
- Next.js
- Tailwind CSS

---

<div align="center">

### ❤️ Built for real-time collaboration

</div>
