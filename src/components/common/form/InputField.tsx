'use client';

interface InputFieldProps {
  type: 'email' | 'password' | 'text' | 'date' | 'number';
  placeholder?: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  rows?: number;
}

export default function InputField({
  type,
  placeholder,
  value,
  onChange,
  label,
  required,
}: InputFieldProps) {
  return (
    <div>
      {label ? <label className="text-sm font-semibold">{label}</label> : null}
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1 border p-3 rounded-md w-full text-black"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
