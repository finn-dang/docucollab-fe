"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";

interface MentionListProps {
  items: string[];
  command: (props: { id: string }) => void;
}

export interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const MentionList = forwardRef<MentionListRef, MentionListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }
      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }
      if (event.key === "Enter") {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden min-w-[180px] z-50">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            key={item}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              index === selectedIndex
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => selectItem(index)}
          >
            <span className="text-purple-500 mr-1">@</span>
            {item}
          </button>
        ))
      ) : (
        <div className="px-4 py-2 text-sm text-gray-400">No results</div>
      )}
    </div>
  );
});

MentionList.displayName = "MentionList";
