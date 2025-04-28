import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormMailProps = {
    email: {
        value: string;
        isValid: boolean;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };
    message: {
        value: string;
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    };
};

export default function FormMail({ email, message }: FormMailProps) {
    const emailId = useId();
    const messageId = useId();

    return (
        <div className="flex flex-col gap-6">
        {/* Email Input */}
            <div className="*:not-first:mt-2">
                <Input
                id={emailId}
                name="email"
                value={email.value}
                onChange={email.onChange}
                className="placeholder:text-black placeholder:p-font placeholder:font-semibold peer p-font mt-5 border-3 border-black border-b-5 border-r-5 height-input"
                placeholder="Enter Your Email"
                type="email"
                aria-invalid={!email.isValid}
                onBlur={email.onChange}
                />
                {!email.isValid && (
                <p
                    className="peer-aria-invalid:text-destructive mt-2 p-font"
                    role="alert"
                    aria-live="polite"
                >
                    Email is invalid
                </p>
                )}
            </div>

        {/* Message Textarea */}
            <div className="*:not-first:mt-2">
                <Textarea
                id={messageId}
                name="message"
                value={message.value}
                onChange={message.onChange}
                placeholder="Enter Your Message"
                className="placeholder:text-black placeholder:p-font placeholder:font-semibold field-sizing-content max-h-29.5 min-h-0 resize-none py-1.75 rounded-[5px] p-font my-5 h-40 border-3 border-black border-b-5 border-r-5"
                />
            </div>
        </div>
    );
}
