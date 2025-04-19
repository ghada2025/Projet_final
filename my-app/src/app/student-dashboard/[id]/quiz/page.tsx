"use client";
import CourseDetails from "@/components/course-details";
import Header from "@/components/header";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Quiz() {
  // const quizzes = [
  //   {
  //     id: "1",
  //     title: "Understanding Fractions",
  //     description: "Choose the correct representation of 1/2.",
  //     type: "QCS",
  //     options: [
  //       "Two equal parts, one colored",
  //       "Three equal parts, all colored",
  //       "Four parts, two shaded",
  //       "One full shape, no shading",
  //     ],
  //     answer: ["Two equal parts, one colored"],
  //   },
  //   {
  //     id: "2",
  //     title: "Multiplication Table",
  //     description: "Which of the following equal 6 x 4? (choose multiples)",
  //     type: "QCM",
  //     options: ["12", "20", "24", "30"],
  //     answer: ["24", "20"],
  //   },
  //   {
  //     id: "3",
  //     title: "Geometry Basics",
  //     description: "What is the name of a 4-sided shape with equal sides?",
  //     type: "QCS",
  //     options: ["Rectangle", "Triangle", "Square", "Pentagon"],
  //     answer: ["Square"],
  //   },
  //   {
  //     id: "4",
  //     title: "Fill in the Blank",
  //     description:
  //       "12 divided by ___ equals 4, and 4 times ___ equals 16, and 16 minus ___ equals 14, and 14 plus ___ equals 20.",
  //     type: "FIG",
  //     options: ["2", "3", "4", "6"],
  //     answer: ["3", "4", "2", "6"],
  //   },
  // ];

  const [quizzes, setQuizzes] = useState<any>([]);
  const [quizzId, setQuizzId] = useState<any>(null);
  const [coursedet, setcoursedet] = useState<any>(null);
  const { id } = useParams<{ id: string }>();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, coursedetRes] = await Promise.all([
          fetch(`http://localhost:5007/course/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch(`http://localhost:5007/course/weekSubject/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!coursedetRes.ok || !courseRes.ok) {
          throw new Error("One of the fetches failed");
        }

        const coursedetData = await coursedetRes.json();
        const coursesData = await courseRes.json();

        // Helper to replace _id with id in one object
        const replaceId = (obj: any) => {
          const newObj = { ...obj };
          newObj.id = newObj._id;
          delete newObj._id;
          return newObj;
        };

        const cleanCoursedet = coursedetData.coursedet.map(replaceId);
        const cleanCourse = replaceId(coursesData);

        setcoursedet(cleanCoursedet);
        setQuizzes(cleanCourse.quizzes);
        setQuizzId(cleanCourse.id);
      } catch (err) {
        console.error("Fetching error:", err);
      }
    };

    fetchData();
  }, []);

  const { courseComplete, Pending } = coursedet;
  const courseList = courseComplete.concat(Pending);
  const last = courseComplete.length;

  const alphabet = [
    { color: "--main-orange", title: "A" },
    { color: "--main-blue", title: "B" },
    { color: "--main-green", title: "C" },
    { color: "--main-red", title: "D" },
  ];
  const [index, setIndex] = useState(0); // keep track of the quizzes
  const [isDone, setIsDone] = useState(false); // give the answer and updates the score
  const [score, setScore] = useState(0); // keep track of the score
  const [isCorrect, setIsCorrect] = useState(false); // check if the answer is correct
  const [clicked, setClicked] = useState<number[]>([]); // check if the answer is clicked
  const [countCorrect, setCountCorrect] = useState(0); // check if the answer is correct
  const [isSubmitted, setIsSubmitted] = useState(false); // check if the answer is submitted
  let parts: string[] = [""];
  const [inputs, setInputs] = useState(Array(parts.length - 1).fill("")); // initialize based on number of gaps

  if (quizzes[index].type === "FIG") {
    parts = quizzes[index].description.split("___");
  }

  const handleInputChange = (index: number, value: string) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = value;
    setInputs(updatedInputs);
  };

  function handleIsDone() {
    setIsDone(true);
    if (isCorrect) {
      setScore(score + countCorrect);
    }
  }

  function handleCliked(value: number) {
    if (quizzes[index].type === "QCS") {
      setClicked([value]);
    } else if (quizzes[index].type === "QCM") {
      setClicked((prev) => [...(prev || []), value]);
    } else if (quizzes[index].type === "FIG") {
      setClicked([...inputs]);
    }
  }

  function handleIsCorrect(value = "", i = 0) {
    if (quizzes[index].type !== "FIG") {
      const selectedOption = value;
      const isItCorrect = quizzes[index].answer.find(
        (option: any) => option === selectedOption
      );
      if (isItCorrect) {
        setIsCorrect(true);
        if (countCorrect < quizzes[index].answer.length) {
          setCountCorrect(countCorrect + 1);
        }
      } else {
        setIsCorrect(false);
      }
    } else if (quizzes[index].type === "FIG") {
      if (quizzes[index].answer[i] === inputs[i]) {
        setIsCorrect(true);
        if (countCorrect < quizzes[index].answer.length) {
          setCountCorrect(countCorrect + 1);
        }
      } else {
        setIsCorrect(false);
      }
    }
  }

  function handleNext() {
    if (index < quizzes.length - 1) {
      setIndex(index + 1);
    } else {
      handleSubmit();
    }
  }

  function calculateScore() {
    return Math.round(
      (score /
        quizzes.reduce(
          (sum: number, quiz: any) => sum + quiz.answer.length,
          0
        )) *
        100
    );
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
    await fetch(`http://localhost:5007/quiz/submit/${quizzId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score: finalScore,
        status: "Done",
      }),
    });
  };

  return (
    <div className="flex items-center justify-center relative">
      <div className="max-w-[1400px] px-[50px] gap-10 w-full">
        {/* Header part */}

        <Header></Header>

        {/* Course Section */}

        <div className="flex h-[80vh] nav-gap">
          {/* Course Details */}

          <CourseDetails courseList={courseList} last={last}></CourseDetails>

          {/* Course Quiz */}

          <section className="w-3/4">
            <h3 className="h2-font">Let's learn !</h3>
            <div className="rounded-lg border-3 border-b-7 border-r-7 border-black p-6 overflow-y-auto scroll-container h-[68vh] header-p-margin flex flex-col">
              {!isSubmitted && quizzes[index].type !== "FIG" && (
                <>
                  <div>
                    <h2 className="h2-font">{quizzes[index].title}</h2>
                  </div>
                  <div className="flex items-start justify-between nav-gap">
                    <p className="p-font header-p-padding">
                      {quizzes[index].description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 nav-gap">
                    {quizzes[index].options.map((option: any, key: number) => (
                      <div
                        key={key}
                        className={`cursor-pointer border-3 ${
                          isDone
                            ? quizzes[index].answer.find(
                                (opt: any) => opt === option
                              )
                              ? countCorrect < quizzes[index].answer.length &&
                                countCorrect > 0
                                ? "border-[var(--main-orange)]"
                                : "border-[var(--main-green)]"
                              : "border-[var(--main-red)]"
                            : clicked?.find((opt) => opt === key) === key
                            ? `border-[var(${alphabet[key].color})]`
                            : "border-black"
                        } border-b-5 border-r-5 py-2 flex items-center font-semibold px-4 p-font nav-gap card`}
                        onClick={() => {
                          handleCliked(key);
                          handleIsCorrect(option);
                        }}
                      >
                        <div
                          className={`bg-[var(${alphabet[key].color})] border-3 border-black border-b-5 border-r-5 py-0.3 px-1`}
                        >
                          {alphabet[key].title}
                        </div>
                        <h2>{option}</h2>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-end mt-auto">
                    {!isDone && (
                      <button
                        disabled={clicked.length === 0}
                        className="custom-button header-p-font"
                        onClick={handleIsDone}
                      >
                        Next
                      </button>
                    )}
                    {isDone && (
                      <button
                        className="custom-button header-p-font"
                        disabled={clicked.length === 0}
                        onClick={() => {
                          handleNext();
                          setIsDone(false);
                          setClicked([]);
                          setCountCorrect(0);
                        }}
                      >
                        {index < quizzes.length - 1 ? "Next" : "Submit"}
                      </button>
                    )}
                  </div>
                </>
              )}
              {isSubmitted && (
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="header-font">
                    Your score is{" "}
                    <span
                      className={`text-${
                        score < 50
                          ? "[var(--main-red)]"
                          : score < 75
                          ? "[var(--main-orange)]"
                          : "[var(--main-green)]"
                      }`}
                    >
                      {score} %
                    </span>
                  </h2>
                  <p className="h2-font header-p-padding">
                    Thank you for taking the quiz!
                  </p>
                  <Link href={"/student-dashboard"}>
                    <button className="custom-button header-p-font">
                      Finish Courses
                    </button>
                  </Link>
                </div>
              )}
              {!isSubmitted && quizzes[index].type === "FIG" && (
                <>
                  <div>
                    <h2 className="h2-font">{quizzes[index].title}</h2>
                  </div>
                  <div className="flex items-start">
                    {
                      <div className="p-font header-p-padding leading-8">
                        {parts.map((part, i) => (
                          <span key={i} className="inline">
                            <span className="inline">{part}</span>
                            {i < parts.length - 1 && (
                              <input
                                type="text"
                                value={inputs[i] || ""}
                                onChange={(e) =>
                                  handleInputChange(i, e.target.value)
                                }
                                disabled={isDone}
                                className={`inline bg-[#D9D9D980] rounded-lg border-2 ${
                                  isDone
                                    ? quizzes[index].answer.find(
                                        (opt: any) => opt === inputs[i]
                                      )
                                      ? countCorrect <
                                          quizzes[index].answer.length &&
                                        countCorrect > 0
                                        ? "border-[var(--main-orange)]"
                                        : "border-[var(--main-green)]"
                                      : "border-[var(--main-red)]"
                                    : ""
                                } mx-1 px-2 py-0.5 w-24 outline-none`}
                                onBlur={() => {
                                  handleCliked(i);
                                  handleIsCorrect(undefined, i);
                                }}
                              />
                            )}
                          </span>
                        ))}
                      </div>
                    }
                  </div>
                  <div className="grid grid-cols-2 nav-gap">
                    {quizzes[index].options.map((option: any, key: number) => (
                      <div
                        key={key}
                        className={`cursor-pointer border-3 border-black border-b-5 border-r-5 py-2 flex items-center font-semibold px-4 p-font nav-gap`}
                      >
                        <div
                          className={`bg-[var(${alphabet[key].color})] border-3 border-black border-b-5 border-r-5 py-0.3 px-1`}
                        >
                          {alphabet[key].title}
                        </div>
                        <h2>{option}</h2>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-end mt-auto">
                    {!isDone && (
                      <button
                        disabled={clicked.length === 0}
                        className="custom-button header-p-font"
                        onClick={handleIsDone}
                      >
                        Next
                      </button>
                    )}
                    {isDone && (
                      <button
                        className="custom-button header-p-font"
                        disabled={clicked.length === 0}
                        onClick={() => {
                          handleNext();
                          setIsDone(false);
                          setClicked([]);
                          setCountCorrect(0);
                        }}
                      >
                        {index < quizzes.length - 1 ? "Next" : "Submit"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
