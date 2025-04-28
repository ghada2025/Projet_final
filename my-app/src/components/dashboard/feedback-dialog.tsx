import { Button } from "@/components/dashboard/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dashboard/dialog";
import { Textarea } from "@/components/dashboard/textarea";

export default function FeedbackDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-sm font-semibold border-2">
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send us feedback</DialogTitle>
          <DialogDescription>
            Help us know what to update in our platform
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5">
          <Textarea
            id="feedback"
            placeholder="How can we improve our online school service?"
            aria-label="Send feedback"
          />
          <div className="flex flex-col sm:flex-row sm:justify-end">
            <Button type="button" className="bg-blue-500 hover:bg-blue-700">Send feedback</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
