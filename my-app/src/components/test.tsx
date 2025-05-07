"use client";
import { FormData } from "@/app/types";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FlipCard({
  image,
  levels,
  grade,
  dataIn,
}: {
  image: string;
  levels: string[];
  grade: string;
  dataIn: FormData;
}) {
  const [flipped, setFlipped] = useState(false);
  const router = useRouter();

  async function handleSubmit(level: string) {
    try {
      const response = await fetch(`http://localhost:5007/student/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...dataIn, grade: level }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      router.push("/register/validate");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="flex flex-col items-center mt-5">
      <div
        className="w-[23vw] md:w-[23vw] height-grade"
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
          <div className="card-face card-back flex flex-col justify-evenly items-center p-2 md:p-4 bg-white rounded-xl">
            {levels.map((level, index) => (
              <button
                key={index}
                onClick={() => handleSubmit(level)}
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
            ))}
          </div>
        </div>
      </div>
      <div className="text-center mt-5">
        <h3 className={"text-sm font-bold custom-p"}>{grade}</h3>
      </div>
    </div>
  );
}
