"use client"
import Image from "next/image";
import SearchBar from "./searchbar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header({show=false}:{show?: boolean}) {

  const [user, setUser] = useState<any>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch user and courses in parallel
      const userRes = await
        fetch("http://localhost:3000/api/user", {
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

      setUser(userData.user);
    } catch (err) {
      console.error("Fetching error:", err);
    }
  };

  fetchData();
}, []);
  return (
    <header className="flex items-center justify-between py-7">
      <div className="flex items-center nav-gap">
        <Image
          src={"/student-col.png"}
          alt="student"
          width={60}
          height={60}
          className="card"
        ></Image>
        <div>
          <h1 className="header-h3-font w-[17vw]">Welcome back</h1>
          {/* Student name needs to be changed dynamically */}
          <p className="header-p-font">{user.firstName + " " + user.lastName}</p>
        </div>
      </div>
      {show && (<div className="card">
        <Image src={"/play.png"} alt="play" width={60} height={60}></Image>
      </div>)}
      <div className="flex items-center nav-gap">
        <SearchBar></SearchBar>
        <Link href={"student-dashboard/settings"}>
          <Image
            src={"/settings.png"}
            alt="settings"
            width={60}
            height={60}
            className="card"
          ></Image>
        </Link>
      </div>
    </header>
  );
}
