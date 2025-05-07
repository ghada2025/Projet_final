"use client";
import Image from "next/image";
import SearchBar from "./searchbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine } from "@remixicon/react";

export default function Header({ show = false, chat=false }: { show?: boolean, chat?: boolean }) {
  type User = {
    id: string;
    firstName: string;
    lastName: string;
  };

  const [user, setUser] = useState<User>();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user and courses in parallel
        const userRes = await fetch("http://localhost:5007/student/me", {
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
          <h1 className="header-h3-font text-[clamp(18px,4vw,28px)]">
            Welcome back
          </h1>
          <p className="header-p-font text-[clamp(14px,3vw,20px)]">
            {user?.firstName + " " + user?.lastName}
          </p>
        </div>
      </div>

      {/* Middle Part (Game Icon) */}
      {show && (
        <Link href={"/student-dashboard/chat"}>
          <div className="card hidden [@media(min-width:700px)]:block cursor-pointer">
            <Image src={"/play.png"} alt="chat" width={60} height={60} />
          </div>
        </Link>
      )}

      {/* Right Side (Search + Settings) */}
      <div className="flex items-center nav-gap">
        {/* SearchBar hidden under 470px */}
        <div className="hidden [@media(min-width:725px)]:block">
          <SearchBar />
        </div>

        {/* Logout Icon */}

        <button
          onClick={() => {
            if (!chat) {
              fetch("http://localhost:5007/student/logout", {
                method: "GET",
                credentials: "include",
              });
              router.push("/");
            }
            else{
              router.push("/student-dashboard")
            }
          }}
          className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group hidden [@media(min-width:525px)]:block"
          type="button"
        >
          <div className="bg-[var(--main-green)] border-3 cursor-pointer border-black border-b-5 border-r-5 height-input rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
            <RiArrowLeftLine className="text-bold"></RiArrowLeftLine>
          </div>
          <p className="translate-x-2 font-bold">{chat?"Go back":"Sign out"}</p>
        </button>
      </div>
    </header>
  );
}
