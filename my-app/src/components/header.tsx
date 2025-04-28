"use client"
import Image from "next/image";
import SearchBar from "./searchbar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header({show=false}:{show?: boolean}) {
type User = {
    id: string;
    firstName: string;
    lastName: string;
  };

const [user, setUser] = useState<User>();

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

      {/* Settings Icon hidden under 700px */}
      <Link href={"student-dashboard/settings"} className="hidden [@media(min-width:700px)]:block">
        <Image
          src={"/settings.png"}
          alt="settings"
          width={60}
          height={60}
          className="card"
        />
      </Link>
    </div>
  </header>
);

}
