import { useId } from "react";
import { Input } from "@/components/ui/input";

type InputContactProps = {
  isValid?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
};

export default function InputContact({ isValid=true, onChange, name }: InputContactProps) {
  const id = useId();

  return (
    <div className="*:not-first:mt-2">
      <Input
        id={id}
        name={name}
        className="placeholder:text-black placeholder:p-font placeholder:font-semibold peer p-font mt-5 border-3 border-black border-b-5 border-r-5 height-input"
        placeholder="Enter Your Email"
        type="email"
        aria-invalid={!isValid} 
        onBlur={onChange}
      />
      {!isValid && (
        <p
          className="peer-aria-invalid:text-destructive mt-2 p-font"
          role="alert"
          aria-live="polite"
        >
          Email is invalid
        </p>
      )}
    </div>
  );
}

