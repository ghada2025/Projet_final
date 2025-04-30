"use client"
import Image from "next/image";
import SearchBar from "./searchbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header({show=false}:{show?: boolean}) {
type User = {
    id: string;
    firstName: string;
    lastName: string;
  };

const [user, setUser] = useState<User>();
const router = useRouter()

useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch user and courses in parallel
      const userRes = await
        fetch("http://localhost:5007/student/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

      if (!userRes.ok) {
        throw new Error("the fetche failed");
      }

      const userData = await userRes.json();
      console.log(userData);
      setUser(userData.student);
    } catch (err) {
      console.error("Fetching error:", err);
    }
  };

  fetchData();
}, []);
return (
  <header className="flex items-center justify-between flex-wrap py-7 gap-5">
    {/* Left Side (Welcoming block) */}
    <div className="flex items-center nav-gap">
      <Image
        src={"/student-col.png"}
        alt="student"
        width={60}
        height={60}
        className="card"
      />
      <div>
        <h1 className="header-h3-font w-[17vw] text-[clamp(18px,4vw,28px)]">
          Welcome back
        </h1>
        <p className="header-p-font text-[clamp(14px,3vw,20px)]">
          {user?.firstName + " " + user?.lastName}
        </p>
      </div>
    </div>

    {/* Middle Part (Game Icon) */}
    {show && (
      <div className="card hidden [@media(min-width:700px)]:block">
        <Image
          src={"/play.png"}
          alt="play"
          width={60}
          height={60}
        />
      </div>
    )}

    {/* Right Side (Search + Settings) */}
    <div className="flex items-center nav-gap">
      {/* SearchBar hidden under 470px */}
      <div className="hidden [@media(min-width:470px)]:block">
        <SearchBar />
      </div>

      {/* Logout Icon */}
      
      <button
        onClick={() => {
          fetch("http://localhost:5007/student/logout", {
            method: "GET",
            credentials: "include",
          })
          router.push("/")
        }}
        className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
        type="button"
      >
        <div
          className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            height="25px"
            width="25px"
          >
            <path
              d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
              fill="#000000"
            ></path>
            <path
              d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
              fill="#000000"
            ></path>
          </svg>
        </div>
        <p className="translate-x-2">Go Back</p>
      </button>
    </div>
  </header>
);

}
