"use client";

import { useFileUpload } from "@/hooks/use-file-upload";
import { Download } from "lucide-react";

interface AddClassProps {
  isAssignment? : boolean
  isCourse?: boolean
  isQuiz?: boolean
  onClick?: () => void;
}


export default function AddClass({ onClick, isCourse, isAssignment, isQuiz }: AddClassProps) {
  const maxSizeMB = 10;

  return (
    <div
      onClick={onClick}
      className="border flex flex-col items-center justify-center px-4 py-8 rounded-lg text-center cursor-pointer hover:bg-gray-100 transition h-full"
    >
      <div
        className={`bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border`}
        aria-hidden="true"
      >
        <Download className={`size-${isCourse?"7":"4"} opacity-60`} />
      </div>
      <p className={`mb-1.5 text-${isCourse?"2xl":"md"} font-medium`}>Create a new {isCourse?"course":isAssignment?"assignment":isQuiz?"quiz":"class"}</p>
      <p className={`text-muted-foreground text-${isCourse?"l":"sm"}`}>
        {isCourse?"Click here to create a new course":isAssignment?"test your student with a well written homework":isQuiz?"test your student with a small quiz":`Max size: ${maxSizeMB} student in a class`}
      </p>
    </div>
  );
}

