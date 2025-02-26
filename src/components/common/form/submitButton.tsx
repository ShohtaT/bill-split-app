'use client';

interface SubmitButtonProps {
  label: string;
  disabled?: boolean;
}

export default function SubmitButton({ label, disabled = false }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="bg-blue-500 text-white p-3 rounded-full w-60 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      disabled={disabled}
    >
      {label}
    </button>
  );
}
