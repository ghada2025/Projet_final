import { useId } from "react"
import { ArrowRightIcon, SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SearchBar() {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <div className="relative">
        <Input
          id={id}
          className="peer header-p-font border-3 border-black border-b-5 border-r-5 height-input placeholder:text-black placeholder:header-p-font placeholder:font-bold"
          placeholder="Search..."
          type="search"
        />
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          type="submit"
        >
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
          <SearchIcon size={16} aria-hidden={true} className="text-black"/>
        </div>
        </button>
      </div>
    </div>
  )
}
