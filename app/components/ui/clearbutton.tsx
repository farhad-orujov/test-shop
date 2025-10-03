import clsx from "clsx";

interface ClearButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    classname?: string;
    onClick?: () => void;
}

export const ClearButton: React.FC<ClearButtonProps> = ({ classname, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx("w-full mt-2 py-2 px-4 bg-gray-300 text-gray-800 font-bold rounded-md hover:bg-gray-300 transition-colors", classname)}
    >
      Clear Filter
    </button>
  );
};