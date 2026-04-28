"use client";

import { Editor } from "@tiptap/react";
import { Minus, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trash2, X } from "lucide-react";

interface TableControlsProps {
  editor: Editor;
}

export default function TableControls({ editor }: TableControlsProps) {
  if (!editor.isActive("table")) return null;

  return (
    <div className="absolute z-10 bg-white shadow-lg rounded-lg border border-gray-200 p-1 flex gap-1">
      <button
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        className="p-1.5 rounded hover:bg-gray-100"
        title="Add column before"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        className="p-1.5 rounded hover:bg-gray-100"
        title="Add column after"
      >
        <ArrowRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().addRowBefore().run()}
        className="p-1.5 rounded hover:bg-gray-100"
        title="Add row before"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().addRowAfter().run()}
        className="p-1.5 rounded hover:bg-gray-100"
        title="Add row after"
      >
        <ArrowDown className="w-4 h-4" />
      </button>
      <div className="w-px bg-gray-200 mx-1" />
      <button
        onClick={() => editor.chain().focus().deleteColumn().run()}
        className="p-1.5 rounded hover:bg-gray-100"
        title="Delete column"
      >
        <Minus className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().deleteRow().run()}
        className="p-1.5 rounded hover:bg-gray-100"
        title="Delete row"
      >
        <X className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().deleteTable().run()}
        className="p-1.5 rounded hover:bg-red-100 text-red-600"
        title="Delete table"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
