import { type Edge, type Node } from "@xyflow/react";
import { useRef, useState } from "react";
import Button from "../libs/Button";
import Modal from "../libs/Modal";

interface SaveFlowPayload {
  title: string;
  nodes: Node[];
  edges: Edge[];
}

async function saveFlowToBackend(payload: SaveFlowPayload) {
  const res = await fetch("/api/flows", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to save flow");
  }

  return res.json();
}

interface SaveFlowProps {
  nodes: Node[];
  edges: Edge[];
}

const SaveFlowToBackend = ({ nodes, edges }: SaveFlowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setTitle("");
  };

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    try {
      const response = await saveFlowToBackend({
        title: trimmed,
        nodes,
        edges,
      });

      closeModal();
    } catch (err) {}
  };

  return (
    <>
      {/* ── Save Button ── */}
      <Button onClick={openModal}>Save Flow</Button>

      <Modal
        title="Save Flow"
        open={isOpen}
        onClose={closeModal}
        footer={
          <>
            <Button variant="text" onClick={closeModal}>
              Cancel
            </Button>

            <Button onClick={handleSave} variant="contained">
              Save
            </Button>
          </>
        }
      >
        <div className="px-6 py-5">
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Flow title
          </label>
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. User onboarding pipeline"
            className="text-base!"
          />

          {/* Node/edge count hint */}
          <p className="mt-2 text-xs text-neutral-400">
            {nodes.length} node{nodes.length !== 1 ? "s" : ""} · {edges.length}{" "}
            edge{edges.length !== 1 ? "s" : ""}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default SaveFlowToBackend;
