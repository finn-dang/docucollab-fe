"use client";

import { useState, useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";
import { X, Search, ArrowRight, Replace, ReplaceAll } from "lucide-react";

interface FindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor;
  anchorEl: HTMLElement | null;
}

export default function FindReplaceModal({
  isOpen,
  onClose,
  editor,
  anchorEl,
}: FindReplaceModalProps) {
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const findInputRef = useRef<HTMLInputElement>(null);

  // Get full document text
  const getFullText = () => {
    return editor.state.doc.textContent;
  };

  // Find all matches with positions
  const findAllMatches = (): Array<{ from: number; to: number }> => {
    if (!findText.trim()) return [];

    const fullText = getFullText();
    let matches: Array<{ from: number; to: number }> = [];

    if (useRegex) {
      try {
        const flags = caseSensitive ? "g" : "gi";
        const regex = new RegExp(findText, flags);
        let match;
        while ((match = regex.exec(fullText)) !== null) {
          matches.push({
            from: match.index,
            to: match.index + match[0].length,
          });
        }
      } catch (e) {
        return [];
      }
    } else {
      const searchText = caseSensitive ? findText : findText.toLowerCase();
      const content = caseSensitive ? fullText : fullText.toLowerCase();
      let pos = 0;
      while ((pos = content.indexOf(searchText, pos)) !== -1) {
        matches.push({ from: pos, to: pos + searchText.length });
        pos += searchText.length;
      }
    }
    return matches;
  };

  // Update matches when find text changes
  useEffect(() => {
    if (!isOpen || !findText.trim()) {
      setMatchCount(0);
      setCurrentMatchIndex(0);
      return;
    }
    const matches = findAllMatches();
    setMatchCount(matches.length);
    setCurrentMatchIndex(matches.length > 0 ? 1 : 0);

    // Select first match
    if (matches.length > 0) {
      selectMatch(matches[0]);
    }
  }, [findText, caseSensitive, useRegex, isOpen]);

  // Select a match in the editor
  const selectMatch = (match: { from: number; to: number }) => {
    try {
      editor.commands.setTextSelection({ from: match.from, to: match.to });
      editor.commands.scrollIntoView();
    } catch (e) {
      console.error("Could not select match:", e);
    }
  };

  // Find next match
  const findNext = () => {
    const matches = findAllMatches();
    if (matches.length === 0) return;

    const newIndex = currentMatchIndex % matches.length;
    setCurrentMatchIndex(newIndex + 1);
    selectMatch(matches[newIndex]);
  };

  // Find previous match
  const findPrevious = () => {
    const matches = findAllMatches();
    if (matches.length === 0) return;

    let newIndex = currentMatchIndex - 2;
    if (newIndex < 0) newIndex = matches.length - 1;
    setCurrentMatchIndex(newIndex + 1);
    selectMatch(matches[newIndex]);
  };

  // Replace current match
  const replaceCurrent = () => {
    const matches = findAllMatches();
    if (matches.length === 0) return;

    const currentMatch = matches[currentMatchIndex - 1];
    if (!currentMatch) return;

    const { state } = editor;
    const { tr } = state;

    tr.insertText(replaceText, currentMatch.from, currentMatch.to);
    editor.view.dispatch(tr);

    // Update after replacement
    setTimeout(() => {
      const newMatches = findAllMatches();
      setMatchCount(newMatches.length);
      if (newMatches.length > 0) {
        setCurrentMatchIndex(1);
        selectMatch(newMatches[0]);
      } else {
        setCurrentMatchIndex(0);
      }
    }, 50);
  };

  // Replace all matches
  const replaceAll = () => {
    const matches = findAllMatches();
    if (matches.length === 0) return;

    let { state } = editor;
    let { tr } = state;

    // Replace from end to start to maintain positions
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      tr = tr.insertText(replaceText, match.from, match.to);
    }

    editor.view.dispatch(tr);

    setMatchCount(0);
    setCurrentMatchIndex(0);
  };

  // Calculate position
  useEffect(() => {
    if (isOpen && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen, anchorEl]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        anchorEl &&
        !anchorEl.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose, anchorEl]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && findInputRef.current) {
      setTimeout(() => findInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed z-50 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 animate-in fade-in slide-in-from-top-1 duration-200"
      style={{ top: position.top, left: position.left }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-500" />
          <h3 className="font-medium text-gray-800">Find & Replace</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Find Input */}
        <div>
          <div className="relative">
            <input
              ref={findInputRef}
              type="text"
              placeholder="Find..."
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              className="w-full px-3 py-2 pr-20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
            {matchCount > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {currentMatchIndex}/{matchCount}
              </div>
            )}
          </div>
        </div>

        {/* Replace Input */}
        <div>
          <input
            type="text"
            placeholder="Replace with..."
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        {/* Options */}
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            Match case
          </label>
          <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={useRegex}
              onChange={(e) => setUseRegex(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            Regex
          </label>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={findPrevious}
            disabled={!findText || matchCount === 0}
            className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
          >
            ← Previous
          </button>
          <button
            onClick={findNext}
            disabled={!findText || matchCount === 0}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Next →
          </button>
        </div>

        {/* Replace Buttons */}
        <div className="flex gap-2">
          <button
            onClick={replaceCurrent}
            disabled={!findText || matchCount === 0}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
          >
            <Replace className="w-3.5 h-3.5" />
            Replace
          </button>
          <button
            onClick={replaceAll}
            disabled={!findText || matchCount === 0}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
          >
            <ReplaceAll className="w-3.5 h-3.5" />
            Replace All
          </button>
        </div>
      </div>
    </div>
  );
}
