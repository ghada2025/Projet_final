"use client";

import { useId, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

type PasswordProps = {
  isCorrect: boolean;
  num?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
};

export default function Password({
  isCorrect,
  num = 1,
  onChange,
  name,
}: PasswordProps) {
  const id = useId();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="*:not-first:mt-2">
      <div className="relative">
        <Input
          id={`${id}-${num}`}
          name={name}
          placeholder={
            num === 1 ? "Enter Your Password" : "Confirm Your Password"
          }
          className="peer placeholder:text-black placeholder:p-font placeholder:font-semibold pe-9 peer p-font mt-5 border-3 border-black border-b-5 border-r-5 height-input"
          type={isVisible ? "text" : "password"}
          onBlur={onChange}
          aria-invalid={!isCorrect}
        />
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute right-3 inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
        >
          {isVisible ? (
            <EyeOffIcon size={25} aria-hidden="true" />
          ) : (
            <EyeIcon size={25} aria-hidden="true" />
          )}
        </button>
      </div>
      {!isCorrect && (
        <p
          className="text-red-500 mt-2 p-font break-words"
          role="alert"
          aria-live="polite"
        >
          {num === 1 ? "Password must be at least 8 characters and include uppercase, lo..." : "Password does not match"}
        </p>
      )}
    </div>
  );
}
