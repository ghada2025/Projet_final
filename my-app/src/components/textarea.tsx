
import { Textarea } from "@/components/ui/textarea"

export default function TextArea() {
  return (
    <div className="*:not-first:mt-2">
      <Textarea
        placeholder="Enter Your Message"
        className="placeholder:text-black placeholder:p-font placeholder:font-semibold field-sizing-content max-h-29.5 min-h-0 resize-none py-1.75 rounded-[5px] p-font my-5 h-40 border-3 border-black border-b-5 border-r-5"
      />
    </div>
  )
}
