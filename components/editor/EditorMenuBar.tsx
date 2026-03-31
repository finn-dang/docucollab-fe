"use client";

import { Editor } from "@tiptap/react";
import { useState, useRef } from "react";
import FindReplaceModal from "./FindReplaceModal";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Indent,
  Outdent,
  Table,
  Eraser,
  Search,
  Palette,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
} from "lucide-react";

interface EditorMenuBarProps {
  editor: Editor | null;
  readOnly?: boolean;
}

export default function EditorMenuBar({ editor, readOnly = false }: EditorMenuBarProps) {
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [customColor, setCustomColor] = useState("#000000");
  const findReplaceButtonRef = useRef<HTMLButtonElement>(null);

  if (readOnly || !editor) return null;

  // Helper to ensure editor is focused before command
  const exec = (callback: () => void) => {
    editor.commands.focus();
    callback();
  };

  const Button = ({ onClick, isActive = false, disabled = false, title, children }: any) => (
    <button
      onClick={() => exec(onClick)}
      disabled={disabled}
      title={title}
      className={`
        p-2 rounded-lg transition-all duration-200
        ${isActive ? "bg-blue-100 text-blue-700 shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      `}
      type="button"
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-gray-200 mx-1" />;

  const addImage = () => {
    const url = prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const addLink = () => {
    const url = prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  // ✅ Color palette definition
  const colorPalette = [
    ...new Set([
      // Grays
      "#000000",
      "#434343",
      "#666666",
      "#999999",
      "#CCCCCC",
      "#E6E6E6",
      // Reds
      "#FF0000",
      "#E74C3C",
      "#F1948A",
      "#FDEDEC",
      // Oranges
      "#FFA500",
      "#F39C12",
      "#F5B041",
      "#FAD7A1",
      // Yellows
      "#FFFF00",
      "#F1C40F",
      "#F7DC6F",
      "#FEF9E7",
      // Greens
      "#00FF00",
      "#2ECC71",
      "#58D68D",
      "#ABEBC6",
      "#1abc9c",
      // Blues
      "#0000FF",
      "#3498DB",
      "#5DADE2",
      "#AED6F1",
      "#2980B9",
      // Purples
      "#800080",
      "#9B59B6",
      "#BB8FCE",
      "#E8DAEF",
      "#8E44AD",
      // Pinks
      "#FFC0CB",
      "#E84393",
      "#F5B7B1",
      "#FDEDEC",
      // Browns
      "#8B4513",
      "#A0522D",
      "#D2691E",
      "#CD853F",
      // Cyans
      "#00FFFF",
      "#1ABC9C",
      "#48C9B0",
      "#A3E4D7",
    ]),
  ];
  return (
    <>
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 rounded-t-xl shadow-sm">
        <div className="flex flex-wrap items-center gap-1 p-2">
          {/* Undo / Redo */}
          <Button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </Button>

          <Divider />

          {/* Text Formatting */}
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
            title="Highlight"
          >
            <Highlighter className="w-4 h-4" />
          </Button>

          <Divider />

          {/* ✅ Text Color Picker - FIXED */}
          <div className="relative">
            <Button onClick={() => setShowColorPicker(!showColorPicker)} title="Text Color">
              <div className="flex items-center gap-1">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: "#000" }}
                />
                <Palette className="w-3 h-3" />
              </div>
            </Button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-30 w-80 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-6 gap-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className="w-8 h-8 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <label className="block text-xs text-gray-500 mb-1">Custom color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-10 h-8 rounded border border-gray-200 cursor-pointer"
                    />
                    <button
                      onClick={() => setTextColor(customColor)}
                      className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Divider />

          {/* Alignment */}
          <Button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="Center"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </Button>

          <Divider />

          {/* Lists */}
          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive("taskList")}
            title="Task List"
          >
            <CheckSquare className="w-4 h-4" />
          </Button>

          {/* Indent / Outdent */}
          <Button
            onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
            title="Indent"
          >
            <Indent className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().liftListItem("listItem").run()}
            title="Outdent"
          >
            <Outdent className="w-4 h-4" />
          </Button>

          <Divider />

          {/* Headings Buttons */}
          <div className="flex items-center gap-1 border-r pr-1 mr-1">
            <Button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive("heading", { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive("heading", { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive("heading", { level: 3 })}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              isActive={editor.isActive("heading", { level: 4 })}
              title="Heading 4"
            >
              <Heading4 className="w-4 h-4" />
            </Button>
          </div>

          <Divider />

          {/* Table Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowTableMenu(!showTableMenu)}
              className="p-2 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              title="Table"
            >
              <Table className="w-4 h-4" />
            </button>

            {showTableMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-30 min-w-[200px]">
                <button
                  onClick={() => {
                    const rows = prompt("Rows:", "3");
                    const cols = prompt("Columns:", "3");
                    if (rows && cols)
                      editor
                        .chain()
                        .focus()
                        .insertTable({
                          rows: parseInt(rows),
                          cols: parseInt(cols),
                          withHeaderRow: true,
                        })
                        .run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Insert Table
                </button>

                <div className="border-t my-1"></div>

                <button
                  onClick={() => {
                    editor.chain().focus().addRowBefore().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Add Row Above
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().addRowAfter().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Add Row Below
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().deleteRow().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Row
                </button>

                <div className="border-t my-1"></div>

                <button
                  onClick={() => {
                    editor.chain().focus().addColumnBefore().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Add Column Left
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().addColumnAfter().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Add Column Right
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().deleteColumn().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Column
                </button>

                <div className="border-t my-1"></div>

                <button
                  onClick={() => {
                    editor.chain().focus().mergeCells().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Merge Cells
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().splitCell().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Split Cell
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().toggleHeaderRow().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Toggle Header Row
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().deleteTable().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Table
                </button>
              </div>
            )}
          </div>

          {/* Table Border Style */}
          <button
            onClick={() => {
              editor.chain().focus().setCellAttribute("style", "border: 2px solid #3b82f6").run();
            }}
            className="p-2 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            title="Border Style"
          >
            <div className="w-4 h-4 border-2 border-blue-500 rounded" />
          </button>

          {/* Find & Replace */}
          <button
            ref={findReplaceButtonRef}
            onClick={() => setShowFindReplace(true)}
            className="p-2 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            title="Find & Replace (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Clear Formatting */}
          <Button
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            title="Clear Formatting"
          >
            <Eraser className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showFindReplace && (
        <FindReplaceModal
          isOpen={showFindReplace}
          onClose={() => setShowFindReplace(false)}
          editor={editor}
          anchorEl={findReplaceButtonRef.current}
        />
      )}
    </>
  );
}
