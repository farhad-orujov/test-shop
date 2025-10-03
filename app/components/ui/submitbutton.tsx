import clsx from "clsx";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    classname?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ classname }) => {
  return (
    <button
      type="submit"
      className={clsx("w-full py-2 bg-neutral-900 text-white font-bold rounded-md hover:bg-neutral-800",classname)}
    >
      Submit
    </button>
  );
};