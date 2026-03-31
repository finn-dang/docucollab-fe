import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { MentionList, MentionListRef } from "./MentionList";

// Mock user list - replace with actual API call
const getUsers = async (query: string): Promise<string[]> => {
  const users = [
    "John Doe",
    "Jane Smith",
    "Michael Johnson",
    "Emily Davis",
    "David Wilson",
    "Sarah Brown",
    "James Taylor",
    "Lisa Anderson",
  ];

  return users.filter((user) => user.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
};

export const mentionSuggestion = {
  items: async ({ query }: { query: string }) => {
    return getUsers(query);
  },

  render: () => {
    let component: ReactRenderer<MentionListRef> | null = null;
    let popup: any = null;

    return {
      onStart: (props: any) => {
        if (!props.clientRect) return;

        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: any) {
        component?.updateProps(props);

        if (!props.clientRect) return;

        popup?.[0]?.setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === "Escape") {
          popup?.[0]?.hide();
          return true;
        }

        return component?.ref?.onKeyDown(props) || false;
      },

      onExit() {
        popup?.[0]?.destroy();
        component?.destroy();
      },
    };
  },
};
