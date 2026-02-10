import clsx from "clsx";
import { ChevronUp } from "lucide-react";
import React from "react";

type Props = {
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const ToggleButton = ({ editing, setEditing }: Props) => {
  return (
    <button
      onClick={() => setEditing((v) => !v)}
      title={editing ? "Collapse" : "Edit"}
      className="ml-1 flex items-center justify-center w-5 h-5 rounded-md text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 nodrag"
    >
      <ChevronUp
        size={12}
        className={clsx("transition-all duration-300", {
          "rotate-180": !editing,
        })}
      />
    </button>
  );
};

export default ToggleButton;
