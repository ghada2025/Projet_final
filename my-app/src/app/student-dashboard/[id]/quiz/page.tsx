"use client";
import CourseDetails from "@/components/course-details";
import Header from "@/components/header";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Quiz() {
  const [quizzes, setQuizzes] = useState<any>([]);
  const [quizzId, setQuizzId] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const [coursedet, setCoursedet] = useState<any[]>([]);
  const [course, setCourse] = useState<any>(null);
  const [last, setLast] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, coursedetRes] = await Promise.all([
          fetch(`http://localhost:5007/course/${id}`),
          fetch(`http://localhost:5007/course/weekSubject/${id}`, {
            credentials: "include",
          }),
        ]);

        if (!courseRes.ok ) {
          throw new Error("courseRes fetches failed");
        }
        if (!coursedetRes.ok ) {
          throw new Error("coursedetRes fetches failed");
        }
        const courseData = await courseRes.json();
        const coursedetData = await coursedetRes.json();

        const replaceId = (obj: any) => {
          const { _id, ...rest } = obj;
          return { id: _id, ...rest };
        };

        const cleanCoursedet = [
          ...(coursedetData.completed?.map(replaceId) || []),
          ...(coursedetData.incompleted?.map(replaceId) || []),
        ];

        setLast(coursedetData.completed.length);
        const cleanCourse = courseData?.course ? replaceId(courseData.course) : null;

        setCoursedet(cleanCoursedet);
        setCourse(cleanCourse);
        setQuizzes(cleanCourse?.quiz?.questions || []);
        setQuizzId(cleanCourse?.quiz?.questions._id || "");
      } catch (err) {
        console.error("Fetching error:", err);
      }
    };

    fetchData();
  }, [id]);

  const [index, setIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [clicked, setClicked] = useState<number[]>([]);
  const [countCorrect, setCountCorrect] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputs, setInputs] = useState<string[]>([]);

  const alphabet = ["--main-orange", "--main-blue", "--main-green", "--main-red"];

  useEffect(() => {
    if (quizzes[index]?.type === "FIG") {
      const parts = quizzes[index].question.split("___");
      setInputs(Array(parts.length - 1).fill(""));
    }
  }, [index, quizzes]);

  const handleInputChange = (i: number, value: string) => {
    const updatedInputs = [...inputs];
    updatedInputs[i] = value;
    setInputs(updatedInputs);
  };

  function handleIsDone() {
    setIsDone(true);
    if (isCorrect) {
      setScore((prev) => prev + countCorrect);
    }
  }

  function handleClicked(value: number) {
    if (quizzes[index].type === "QCS") {
      setClicked([value]);
    } else if (quizzes[index].type === "QCM") {
      setClicked((prev) => [...prev, value]);
    } else {
      setClicked([]);
    }
  }

  function handleIsCorrect(value: string = "", i = 0) {
    const correctAnswers = quizzes[index].answers;
    if (quizzes[index].type !== "FIG") {
      const isCorrectAnswer = correctAnswers.includes(value);
      setIsCorrect(isCorrectAnswer);
      if (isCorrectAnswer && countCorrect < correctAnswers.length) {
        setCountCorrect((prev) => prev + 1);
      }
    } else {
      const isCorrectInput = correctAnswers[i] === inputs[i];
      setIsCorrect(isCorrectInput);
      if (isCorrectInput && countCorrect < correctAnswers.length) {
        setCountCorrect((prev) => prev + 1);
      }
    }
  }

  function handleNext() {
    if (index < quizzes.length - 1) {
      setIndex(index + 1);
      setIsDone(false);
      setClicked([]);
      setCountCorrect(0);
    } else {
      handleSubmit();
    }
  }

  function calculateScore() {
    const total = quizzes.reduce((sum: number, q: any) => sum + q.answers.length, 0);
    return Math.round((score / total) * 100);
  }

  async function handleSubmit() {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
    await fetch(`http://localhost:5007/quiz/submit/${quizzId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: finalScore, status: "Done" }),
    });
  }

  return (
    <div className="flex items-center justify-center relative">
      <div className="max-w-[1400px] px-[50px] gap-10 w-full">
        <Header />
        <div className="flex h-[80vh] nav-gap">
          <CourseDetails courseList={coursedet} last={last} />
          <section className="w-3/4">
            <h3 className="h2-font">Let's learn !</h3>
            <div className="rounded-lg border-3 border-b-7 border-r-7 border-black p-6 overflow-y-auto scroll-container h-[68vh] header-p-margin flex flex-col">
              {!isSubmitted ? (
                <div>
                  <h2 className="h2-font">{quizzes[index]?.title}</h2>
                  <p className="p-font header-p-padding">{quizzes[index]?.question}</p>
                  <div className="grid grid-cols-2 nav-gap">
                    {quizzes[index]?.options?.map((option: string, key: number) => (
                      <div
                        key={key}
                        className={`cursor-pointer border-3 border-b-5 border-r-5 py-2 px-4 flex items-center font-semibold p-font nav-gap card ${
                          isDone
                            ? quizzes[index].answers.includes(option)
                              ? "border-[var(--main-green)]"
                              : "border-[var(--main-red)]"
                            : clicked.includes(key)
                            ? `border-[var(${alphabet[key]})]`
                            : "border-black"
                        }`}
                        onClick={() => {
                          handleClicked(key);
                          handleIsCorrect(option);
                        }}
                      >
                        <div className={`bg-[var(${alphabet[key]})] border-3 border-black border-b-5 border-r-5 py-0.3 px-1`}>
                          {String.fromCharCode(65 + key)}
                        </div>
                        <h2>{option}</h2>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      className="custom-button header-p-font"
                      disabled={!clicked.length}
                      onClick={isDone ? handleNext : handleIsDone}
                    >
                      {isDone ? (index < quizzes.length - 1 ? "Next" : "Submit") : "Validate"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="header-font">Your score is <span className={`text-[var(--main-${score < 50 ? "red" : "green"})]`}>{score}%</span></h2>
                  <p className="h2-font header-p-padding">
                    Thank you for taking the quiz!
                  </p>
                  <Link href={"/student-dashboard"} onClick={handleSubmit}>
                    <button className="custom-button header-p-font">
                      Finish Courses
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}