"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { useEffect, useRef, useState } from "react";
import EditorMenuBar from "./EditorMenuBar";
import ActiveUsers from "./ActiveUsers";
import TypingIndicator from "./TypingIndicator";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import socketService from "@/lib/socket";
import EditorSidebar from "./EditorSidebar";
import { mentionSuggestion } from "./mentionSuggestion";
import Mention from "@tiptap/extension-mention";
// ----------------------------------------------------------------------
// Inner component that receives a ready Y.Doc and Provider
// ----------------------------------------------------------------------
interface CollaborativeEditorInnerProps {
  content: string;
  onUpdate: (content: string) => void;
  documentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  readOnly?: boolean;
  ydoc: Y.Doc;
  provider: WebsocketProvider;
}

function CollaborativeEditorInner({
  content,
  onUpdate,
  documentId,
  userId,
  userName,
  userEmail,
  readOnly = false,
  ydoc,
  provider,
}: CollaborativeEditorInnerProps) {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor provider connection status
  useEffect(() => {
    // Set initial status
    setIsConnected(provider.ws?.readyState === 1);

    const handleStatus = (event: { status: string }) => {
      console.log("🔵 Provider status:", event.status);
      setIsConnected(event.status === "connected");
    };

    const handleOpen = () => {
      console.log("🔵 WebSocket opened");
      setIsConnected(true);
    };

    const handleClose = () => {
      console.log("🔵 WebSocket closed");
      setIsConnected(false);
    };

    provider.on("status", handleStatus);

    // ✅ Listen to raw WebSocket events
    if (provider.ws) {
      provider.ws.addEventListener("open", handleOpen);
      provider.ws.addEventListener("close", handleClose);
    }

    return () => {
      provider.off("status", handleStatus);
      if (provider.ws) {
        provider.ws.removeEventListener("open", handleOpen);
        provider.ws.removeEventListener("close", handleClose);
      }
    };
  }, [provider]);

  // Socket.io for presence (active users, typing indicators)
  useEffect(() => {
    socketService.connect(documentId, userId, userName, userEmail);

    socketService.on("active-users", (users: ActiveUser[]) => {
      setActiveUsers(users);
    });
    socketService.on("user-joined", (user: ActiveUser) => {
      setActiveUsers((prev) => [...prev.filter((u) => u.id !== user.id), user]);
    });
    socketService.on("user-left", (leftUserId: string) => {
      setActiveUsers((prev) => prev.filter((u) => u.id !== leftUserId));
    });
    socketService.on(
      "typing-status",
      (data: { userId: string; userName: string; isTyping: boolean }) => {
        if (data.isTyping) {
          setTypingUsers((prev) => {
            if (prev.some((u) => u.userId === data.userId)) return prev;
            return [...prev, { userId: data.userId, userName: data.userName }];
          });
        } else {
          setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
        }
      }
    );

    return () => {
      socketService.disconnect();
    };
  }, [documentId, userId, userName, userEmail]);

  // Create the TipTap editor with collaboration extensions
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ history: false }), // Yjs manages history
        Underline,
        TextStyle,
        Color,
        TaskList,
        TaskItem.configure({ nested: true }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Highlight,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { class: "text-blue-500 underline cursor-pointer" },
        }),
        Image.configure({ inline: true, allowBase64: true }),
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        Placeholder.configure({
          placeholder: "Start writing your document here...",
        }),
        CharacterCount.configure({ limit: 50000 }),
        Mention.configure({
          HTMLAttributes: {
            class: "mention",
          },
          suggestion: mentionSuggestion,
        }),
        // ✅ Collaboration extensions – Yjs is now ready
        Collaboration.configure({ document: ydoc }),
        CollaborationCursor.configure({
          provider,
          user: {
            name: userName,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          },
          // ✅ Add custom rendering
          render: (user: any) => {
            const cursor = document.createElement("span");
            cursor.classList.add("collaboration-cursor");
            cursor.style.borderLeft = `2px solid ${user.color}`;
            cursor.style.backgroundColor = `${user.color}20`; // 20 = 12% opacity
            cursor.style.pointerEvents = "none";

            const label = document.createElement("span");
            label.classList.add("collaboration-cursor-label");
            label.textContent = user.name;
            label.style.backgroundColor = user.color;
            label.style.color = "#fff";
            label.style.padding = "2px 6px";
            label.style.borderRadius = "4px";
            label.style.fontSize = "12px";
            label.style.fontWeight = "500";
            label.style.marginLeft = "4px";
            label.style.whiteSpace = "nowrap";

            cursor.appendChild(label);
            return cursor;
          },
        }),
      ],
      content,
      editable: !readOnly,
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[500px] px-4 py-8 max-w-none",
        },
        handleDOMEvents: {
          keydown: () => {
            if (!readOnly && !typingTimeoutRef.current) {
              socketService.emit("typing", {
                documentId,
                userId,
                userName,
                isTyping: true,
              });
            }
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              socketService.emit("typing", {
                documentId,
                userId,
                userName,
                isTyping: false,
              });
              typingTimeoutRef.current = null;
            }, 1000);
            return false;
          },
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        onUpdate(html);
        setSaveStatus("saving");
        setTimeout(() => setSaveStatus("saved"), 500);
      },
    },
    [ydoc, provider]
  );

  // Sync external content into the editor if needed (e.g., initial load)
  useEffect(() => {
    if (editor && content) {
      const currentContent = editor.getHTML();
      if (currentContent !== content) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header with status and active users */}

      <div className="sticky top-0 z-10 bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {saveStatus === "saving" && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              Saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-xs text-gray-400">All changes saved</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <TypingIndicator typingUsers={typingUsers} />
          <ActiveUsers users={activeUsers} />
          {!isConnected && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Reconnecting...
            </span>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <EditorMenuBar editor={editor} readOnly={readOnly} />

      {/* Editor Content */}
      <div className="border rounded-lg bg-white shadow-sm mt-4">
        <EditorContent editor={editor} />
      </div>

      {/* Character Count */}
      <div className="mt-2 text-right text-xs text-gray-400">
        {editor.storage.characterCount?.characters() || 0} / 50,000 characters
      </div>
      <EditorSidebar editor={editor} activeUsers={activeUsers} />
    </div>
  );
}

interface CollaborativeEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  documentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  readOnly?: boolean;
}

export default function CollaborativeEditor(props: CollaborativeEditorProps) {
  const [isCollabReady, setIsCollabReady] = useState(false);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      if (ydocRef.current) {
        ydocRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted || props.readOnly) return;

    // Create Yjs document and WebSocket provider
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      `document-${props.documentId}`,
      ydoc
    );

    ydocRef.current = ydoc;
    providerRef.current = provider;

    // Wait for initial sync before enabling the editor
    const handleSync = (isSynced: boolean) => {
      if (isSynced) {
        setIsCollabReady(true);
      }
    };
    provider.on("synced", handleSync);

    return () => {
      provider.off("synced", handleSync);
      // Cleanup will be done by the outer unmount effect
    };
  }, [mounted, props.documentId, props.readOnly]);

  // Show loading spinner while Yjs is setting up
  if (!mounted || !isCollabReady) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Yjs is ready – render the real editor
  return (
    <CollaborativeEditorInner {...props} ydoc={ydocRef.current!} provider={providerRef.current!} />
  );
}

// Types used by the component
interface ActiveUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  cursor?: number;
}

interface TypingUser {
  userId: string;
  userName: string;
}
