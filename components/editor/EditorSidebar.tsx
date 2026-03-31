"use client";

import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Heading1,
  Heading2,
  Heading3,
  FileText,
  Users,
  Clock,
  Type,
  Eye,
  ChevronRight,
} from "lucide-react";

interface EditorSidebarProps {
  editor: Editor | null;
  activeUsers?: Array<{ id: string; name: string; email: string }>;
}

export default function EditorSidebar({ editor, activeUsers = [] }: EditorSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [outline, setOutline] = useState<Array<{ level: number; text: string; id: string }>>([]);
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    readingTime: 0,
  });

  useEffect(() => {
    if (!editor) return;

    const updateOutline = () => {
      const headings: Array<{ level: number; text: string; id: string }> = [];
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "heading") {
          const level = node.attrs.level;
          const text = node.textContent;
          const id = `heading-${pos}`;
          headings.push({ level, text, id });
        }
      });
      setOutline(headings);
    };

    // Update on every transaction
    editor.on("transaction", updateOutline);
    updateOutline();

    return () => {
      editor.off("transaction", updateOutline);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const updateStats = () => {
      const text = editor.getText();
      const words = text
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length;
      const characters = text.length;
      const readingTime = Math.ceil(words / 200);
      setStats({ words, characters, readingTime });
    };

    editor.on("transaction", updateStats);
    updateStats();

    return () => {
      editor.off("transaction", updateStats);
    };
  }, [editor]);

  const scrollToHeading = (pos: number) => {
    if (!editor) return;
    // Find the position of the heading node (simplified)
    let targetPos = 0;
    editor.state.doc.descendants((node, nodePos) => {
      if (node.type.name === "heading" && node.textContent === outline[pos]?.text) {
        targetPos = nodePos;
        return false;
      }
    });
    editor.commands.setTextSelection(targetPos);
    editor.commands.scrollIntoView();
  };

  if (!editor) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-20 z-30 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
        title="Toggle sidebar"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`
          fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Document Info</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Document Outline */}
            {outline.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Outline
                  </h3>
                </div>
                <div className="space-y-1">
                  {outline.map((heading, idx) => (
                    <button
                      key={heading.id}
                      onClick={() => scrollToHeading(idx)}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        {heading.level === 1 && <Heading1 className="w-3.5 h-3.5 text-gray-400" />}
                        {heading.level === 2 && <Heading2 className="w-3.5 h-3.5 text-gray-400" />}
                        {heading.level === 3 && <Heading3 className="w-3.5 h-3.5 text-gray-400" />}
                        <span
                          className="text-sm text-gray-600 group-hover:text-gray-900 truncate"
                          style={{
                            marginLeft: heading.level === 2 ? 12 : heading.level === 3 ? 24 : 0,
                          }}
                        >
                          {heading.text}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Document Stats */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-4 h-4 text-green-500" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Stats
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-800">{stats.words}</div>
                  <div className="text-xs text-gray-500 mt-1">Words</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-800">{stats.characters}</div>
                  <div className="text-xs text-gray-500 mt-1">Characters</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center col-span-2">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {stats.readingTime} min read
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Users */}
            {activeUsers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-purple-500" />
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Collaborators ({activeUsers.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {activeUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center text-xs text-gray-400">
            Outline updates as you type
          </div>
        </div>
      </div>
    </>
  );
}
