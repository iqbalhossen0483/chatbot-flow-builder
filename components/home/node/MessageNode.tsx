import ToggleButton from "@/components/libs/ToggleButton";
import { useReactFlow } from "@xyflow/react";
import {
  BookType,
  Image as ImageIcon,
  Link,
  LucideProps,
  MessageSquareText,
} from "lucide-react";
import Image from "next/image";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useCallback,
  useState,
} from "react";
import { BaseNode } from "./BaseNode";

// ─── Types ────────────────────────────────────────────────────────────────────

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

type MessageTypeMeta = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  color: string;
  label: string;
};

// ─── Meta ─────────────────────────────────────────────────────────────────────

const MESSAGE_TYPE_META: Record<MessageType, MessageTypeMeta> = {
  text: { icon: MessageSquareText, color: "text-indigo-500", label: "Text" },
  rich_text: { icon: BookType, color: "text-indigo-500", label: "Rich Text" },
  image: { icon: ImageIcon, color: "text-indigo-500", label: "Image" },
  link: { icon: Link, color: "text-indigo-500", label: "Link" },
};

const ALL_TYPES: MessageType[] = ["text", "rich_text", "image", "link"];

export default function MessageNode({ id, data, selected }: MessageNodeProps) {
  const { updateNodeData } = useReactFlow();
  const [editing, setEditing] = useState(false);

  const msgType = data.messageType ?? "text";
  const meta = MESSAGE_TYPE_META[msgType];

  const update = useCallback(
    (patch: Partial<MessageNodeData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  );

  // ── Collapsed preview ────────────────────────────────────────────────────
  const preview = (
    <div className="space-y-1">
      <div className="text-sm text-gray-800 font-medium truncate max-w-45">
        {data.label || "Untitled message"}
      </div>

      {(msgType === "text" || msgType === "rich_text") &&
        (data.content ? (
          <p className="text-xs text-gray-400 line-clamp-2 max-w-45">
            {data.content}
          </p>
        ) : (
          <p className="text-xs text-gray-300 italic">No content yet</p>
        ))}
      {msgType === "image" &&
        (data.imageUrl ? (
          <p className="text-xs text-gray-400 font-mono truncate max-w-45">
            {data.imageUrl.replace(/^https?:\/\//, "").slice(0, 28)}…
          </p>
        ) : (
          <p className="text-xs text-gray-300 italic">No image URL</p>
        ))}
      {msgType === "link" && (
        <p className="text-xs text-indigo-400 font-mono truncate max-w-45">
          {data.linkText ?? data.linkUrl ?? "No link set"}
        </p>
      )}
    </div>
  );

  // ── Edit panel ────────────────────────────────────────────────────────────
  const editPanel = (
    <div className="mt-3 space-y-3 nodrag nopan nowheel">
      {/* Label */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Label
        </label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => update({ label: e.target.value })}
          placeholder="Node label…"
        />
      </div>

      {/* Type switcher */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Type
        </label>
        <div className="grid grid-cols-4 gap-1 bg-gray-100 rounded-lg p-0.5">
          {ALL_TYPES.map((t) => {
            const m = MESSAGE_TYPE_META[t];
            const Icon = m.icon;
            return (
              <button
                key={t}
                onClick={() => update({ messageType: t })}
                title={m.label}
                className={[
                  "flex flex-col items-center gap-0.5 rounded-md py-1.5 px-1 text-[9px] font-semibold transition-all duration-150",
                  msgType === t
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600",
                ].join(" ")}
              >
                <Icon size={12} />
                {m.label.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Text / Rich Text */}
      {(msgType === "text" || msgType === "rich_text") && (
        <div>
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            {msgType === "rich_text" ? "Rich Content" : "Content"}
          </label>
          <textarea
            value={data.content ?? ""}
            onChange={(e) => update({ content: e.target.value })}
            placeholder={
              msgType === "rich_text"
                ? "Supports **bold**, _italic_, [links](url)…"
                : "Enter your message…"
            }
            rows={3}
          />
        </div>
      )}

      {/* Image */}
      {msgType === "image" && (
        <div>
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={data.imageUrl ?? ""}
            onChange={(e) => update({ imageUrl: e.target.value })}
            placeholder="https://example.com/image.png"
            className="font-mono"
          />
          {data.imageUrl && (
            <div className="mt-2 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 h-20 flex items-center justify-center">
              <Image
                width={100}
                height={100}
                src={data.imageUrl}
                alt="preview"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Link */}
      {msgType === "link" && (
        <div className="space-y-2">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Link Text
            </label>
            <input
              type="text"
              value={data.linkText ?? ""}
              onChange={(e) => update({ linkText: e.target.value })}
              placeholder="Click here"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
              URL
            </label>
            <input
              type="url"
              value={data.linkUrl ?? ""}
              onChange={(e) => update({ linkUrl: e.target.value })}
              placeholder="https://example.com"
              className="font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <BaseNode selected={selected}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center shrink-0">
          <meta.icon className={meta.color} size={14} />
        </div>
        <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
          Message
        </span>
        <span className="ml-auto inline-flex items-center rounded-full bg-indigo-50 px-1.5 py-0.5 text-xs font-medium text-indigo-500 border border-indigo-100">
          {meta.label}
        </span>
        <ToggleButton editing={editing} setEditing={setEditing} />
      </div>

      {editing ? editPanel : preview}
    </BaseNode>
  );
}
