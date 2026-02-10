import { Trash2 } from "lucide-react";

type Props = {
  onDelete: () => void;
};

const DeleteButton = ({ onDelete }: Props) => {
  return (
    <button
      onClick={onDelete}
      title="Delete"
      className="flex items-center justify-center w-5 h-5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 nodrag transition-all duration-300"
    >
      <Trash2 size={12} />
    </button>
  );
};

export default DeleteButton;
