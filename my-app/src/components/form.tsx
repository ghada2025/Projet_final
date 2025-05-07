import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "./dashboard/input";
import { Textarea } from "./dashboard/textarea";

type Quiz = {
  title: string;
  question: string;
  options: string[];
  answers: string[];
  type: string;
};

export default function MultiQuizForm({courseId}:{courseId?:string}) {

  const [course, setCourse]=useState("")
  
  const emptyQuiz: Quiz = {
    title: "",
    question: "",
    options: ["", "", "", ""],
    answers: [""],
    type: "QCS",
  };

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    { ...emptyQuiz },
    { ...emptyQuiz },
    { ...emptyQuiz },
  ]);
  const [currentPhase, setCurrentPhase] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    optionIndex?: number
  ) => {
    const { name, value } = e.target;
    const updated = [...quizzes];

    if (typeof optionIndex === "number") {
      updated[currentPhase].options[optionIndex] = value;
    } else {
      const key = name as keyof Quiz;

      if (key === "answers") {
        updated[currentPhase].answers = value
          .split(" / ")
          .map((ans) => ans.trim());
      } else {
        // @ts-expect-error: Safe assignment
        updated[currentPhase][key] = value;
      }
    }

    setQuizzes(updated);
  };

  const handleNext = () => {
    if (currentPhase < 2) {
      setCurrentPhase((prev) => prev + 1);
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentPhase > 0) {
      setCurrentPhase((prev) => prev - 1);
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5007/assignment", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: courseId,
          questions: quizzes,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create course");
      }

      console.log("Course created successfully!");
    } catch (error) {
      console.error("Error sending course creation:", error);
    }
  };

  const currentQuiz = quizzes[currentPhase];

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="p-6 border shadow-sm flex flex-col gap-4 rounded-lg"
    >
      <h2 className="text-xl font-bold mb-2">Question {currentPhase + 1}</h2>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={currentQuiz.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          name="question"
          value={currentQuiz.question}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>The options</Label>
        <div className="grid grid-cols-1 gap-2">
          {currentQuiz.options.map((opt, i) => (
            <Input
              key={i}
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
              value={opt}
              onChange={(e) => handleChange(e, i)}
              required
            />
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="answers">The answer(s)</Label>
        <Input
          id="answers"
          name="answers"
          value={currentQuiz.answers.join(" / ")}
          onChange={handleChange}
          placeholder="Separate answers with / if multiple"
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          name="type"
          value={currentQuiz.type}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="QCS">QCS</option>
          <option value="QCM">QCM</option>
        </select>
      </div>

      <div className="flex justify-between mt-4">
        {currentPhase > 0 && (
          <button
            type="button"
            onClick={handlePrevious}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Previous
          </button>
        )}

        {currentPhase < 2 ? (
          <button
            type="button"
            onClick={handleNext}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ml-auto"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ml-auto"
          >
            Submit All
          </button>
        )}
      </div>
    </form>
  );
}
