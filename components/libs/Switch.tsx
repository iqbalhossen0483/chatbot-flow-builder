import React from "react";

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
};

const Switch = ({ value, onChange }: Props) => {
  return (
    <button
      onClick={() => onChange(!value)}
      className={[
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
        value ? "bg-blue-500" : "bg-gray-200",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
          value ? "translate-x-5" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
};

export default Switch;
