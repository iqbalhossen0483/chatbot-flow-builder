import { LoaderCircle } from "lucide-react";
import React from "react";

type Props = {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "contained" | "outlined" | "text";
  isLoading?: boolean;
};

const Button = ({
  onClick,
  children,
  variant = "contained",
  isLoading,
}: Props) => {
  const variants = {
    contained:
      "flex items-center gap-2 rounded-lg bg-green-800 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-black/20 transition-all duration-150             hover:bg-green-900 hover:shadow-xl active:scale-95",
    text: "rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 disabled:opacity-40",
    outlined:
      "rounded-lg border border-green-800 px-4 py-2 text-sm font-medium text-green-800 transition hover:bg-green-50 active:scale-95",
  };
  return (
    <button onClick={onClick} className={variants[variant]}>
      {isLoading ? (
        <LoaderCircle scale={16} className="animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
