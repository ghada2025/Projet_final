import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <>
      <div className="flex justify-center items-center h-[10vh] w-full font-bold bg-white sticky top-0 shadow-xl z-100">
        <div className="max-w-[1400px] px-[50px] w-full flex justify-between items-center">
          <Image src={"/logo.png"} alt="logo" width={40} height={40} className="card"></Image>
          <ul className="flex items-center nav-gap header-p-font mx-[10px]">
            <li className="card">
              <a href="#Home">Home</a>
            </li>
            <li className="card">
              <a href="#About">About</a>
            </li>
            <li className="card">
              <a href="#Course">Course</a>
            </li>
            <li className="card">
              <a href="#Location">Location</a>
            </li>
            <li className="card">
              <a href="#Contact">Contact</a>
            </li>
          </ul>
          <Link href={"/login"}>
            <button className="custom-button header-p-font">Login</button>
          </Link>
        </div>
      </div>
    </>
  );
}
