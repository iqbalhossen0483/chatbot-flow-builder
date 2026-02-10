import {
  BookType,
  Image,
  Link,
  LucideProps,
  MessageSquareText,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { BaseNode } from "./BaseNode";

type MessageType = "text" | "rich_text" | "image" | "link";

type MessageNodeData = {
  label: string;
  messageType?: MessageType;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
};

type MessageNodeProps = {
  id: string;
  data: MessageNodeData;
  selected?: boolean;
};

type MessageData = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  color: string;
  label: string;
};
type MessageTypeMeta = {
  text: MessageData;
  rich_text: MessageData;
  image: MessageData;
  link: MessageData;
};

const MESSAGE_TYPE_META: MessageTypeMeta = {
  text: {
    icon: MessageSquareText,
    color: "text-indigo-500",
    label: "Text",
  },
  rich_text: {
    icon: BookType,
    color: "text-indigo-500",
    label: "Rich Text",
  },

  image: { icon: Image, color: "text-indigo-500", label: "Image" },
  link: { icon: Link, color: "text-indigo-500", label: "Link" },
};

export default function MessageNode({ data, selected }: MessageNodeProps) {
  const msgType = data.messageType ?? "text";
  const meta = MESSAGE_TYPE_META[msgType];

  return (
    <BaseNode selected={selected}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center shrink-0 text-sm">
          <meta.icon className={meta.color} size={16} />
        </div>
        <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
          Message
        </span>
        <span className="ml-auto inline-flex items-center rounded-full bg-indigo-50 px-1.5 py-0.5 text-xs font-medium text-indigo-500 border border-indigo-100">
          {meta.label}
        </span>
      </div>

      {/* Content preview */}
      <div className="space-y-1">
        <div className="text-sm text-gray-800 font-medium truncate max-w-45">
          {data.label || "Untitled message"}
        </div>

        {msgType === "text" || msgType === "rich_text" ? (
          data.content ? (
            <div className="text-xs text-gray-400 line-clamp-2 max-w-45">
              {data.content}
            </div>
          ) : (
            <div className="text-xs text-gray-300 italic">No content yet</div>
          )
        ) : msgType === "image" ? (
          data.imageUrl ? (
            <div className="text-xs text-gray-400 font-mono truncate max-w-45">
              {data.imageUrl.replace(/^https?:\/\//, "").slice(0, 28)}…
            </div>
          ) : (
            <div className="text-xs text-gray-300 italic">No image URL</div>
          )
        ) : msgType === "link" ? (
          <div className="text-xs text-indigo-400 font-mono truncate max-w-45">
            {data.linkText ?? data.linkUrl ?? "No link set"}
          </div>
        ) : null}
      </div>
    </BaseNode>
  );
}
