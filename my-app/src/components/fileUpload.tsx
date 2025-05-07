"use client"
import { useEffect } from "react";
import { CircleUserRoundIcon, XIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";

export default function Component({ onFileChange }: { onFileChange: (file: File | null) => void }) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
  });

  const file = files[0]?.file || null;
  const previewUrl = files[0]?.preview || null;

  useEffect(() => {
    if (file instanceof File) {
      onFileChange(file);
    } else {
      onFileChange(null);
    }
  }, [file, onFileChange]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="inline-flex relative">
        <Button
          variant="outline"
          className="size-10 overflow-hidden p-0 shadow-none"
          onClick={openFileDialog}
          aria-label={previewUrl ? "Change image" : "Upload image"}
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Preview"
              width={64}
              height={64}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-4 opacity-60" />
            </div>
          )}
        </Button>
        {previewUrl && (
          <Button
            onClick={() => {
              removeFile(files[0]?.id);
              onFileChange(null); 
            }}
            size="icon"
            className="absolute top-0 right-0 size-6 rounded-full border-2 shadow-none"
            aria-label="Remove image"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        <input {...getInputProps()} className="sr-only" />
      </div>
    </div>
  );
}