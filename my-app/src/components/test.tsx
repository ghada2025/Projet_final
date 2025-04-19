import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function FlipCard({
  image,
  levels,
  grade,
}: {
  image: string;
  levels: string[];
  grade: string;
}) {
  const [flipped, setFlipped] = useState(false);

  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  function handleLevelClick(level: string) {
    setSelectedLevel(level);
  }

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:5007/student/grade", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: selectedLevel }),
    });
  };
  

  return (
    <div>
      <div
        className="w-[23vw] height-grade"
        onClick={() => setFlipped((prev) => !prev)}
      >
        <div
          className={`card-inner ${
            flipped ? "flipped" : ""
          } border-3 rounded-md border-b-7 border-r-7 border-black`}
        >
          {/* Front */}
          <div
            className={`card-face cursor-pointer flex flex-col justify-center items-center p-5 ${
              grade === "Primary School"
                ? "bg-[var(--sub-green)]"
                : grade === "Middle School"
                ? "bg-[var(--sub-blue)]"
                : "bg-[var(--sub-red)]"
            }`}
          >
            <Image src={image} alt="Card" width={200} height={200} />
          </div>

          {/* Back */}
          <div className="card-face card-back flex flex-col justify-evenly items-center p-4 bg-white rounded-xl">
            {levels.map((level, index) => (
              <Link href={"/register/validate"} className="w-full" key={index}>
                <button
                  onClick={() => handleLevelClick(level)}
                  className={`${
                    grade === "Primary School"
                      ? "bg-[var(--sub-green)]"
                      : grade === "Middle School"
                      ? "bg-[var(--sub-blue)]"
                      : "bg-[var(--sub-red)]"
                  } font-bold p-1.8 height-input rounded-md w-full text-center header-p-font border-3 border-black border-b-5 border-r-5 flex items-center justify-center cursor-pointer`}
                >
                  {level}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center mt-5">
        <h3 className={"header-h3-font"}>{grade}</h3>
      </div>
    </div>
  );
}
