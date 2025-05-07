"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function FormMail() {
  const emailId = useId();
  const messageId = useId();

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = validateEmail(email);
    setIsEmailValid(valid);
    if (!valid) return;

    setIsSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch("http://localhost:5007/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setMessage("");
      } else {
        console.log(res)
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Email Input */}
      <div className="*:not-first:mt-2">
        <Input
          id={emailId}
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (!isEmailValid) setIsEmailValid(true);
          }}
          className="placeholder:text-black placeholder:p-font placeholder:font-semibold peer p-font mt-5 border-3 border-black border-b-5 border-r-5 height-input"
          placeholder="Enter Your Email"
          type="email"
          aria-invalid={!isEmailValid}
          onBlur={() => setIsEmailValid(validateEmail(email))}
        />
        {!isEmailValid && (
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter Your Message"
          className="placeholder:text-black placeholder:p-font placeholder:font-semibold field-sizing-content max-h-29.5 min-h-0 resize-none py-1.75 rounded-[5px] p-font my-5 h-40 border-3 border-black border-b-5 border-r-5"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !isEmailValid}
        className="custom-button w-full header-p-font mt-4 h-12 sm:h-14 md:h-16"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      {/* Status Message */}
      {status === "success" && (
        <p className="text-[var(--main-green)] font-semibold text-center">
          Message sent successfully!
        </p>
      )}
      {status === "error" && (
        <p className="text-[var(--main-red)] font-semibold text-center">
          Failed to send message. Please try again.
        </p>
      )}
    </form>
  );
}
