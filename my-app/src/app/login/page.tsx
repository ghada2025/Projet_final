"use client";
import InputContact from "@/components/input";
import Password from "@/components/password";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const elements = [
    {
      status: "teacher",
      mainImage: "/teacher-login.png",
      teacher: "/teacher-col.png",
      student: "/student-bnw.png",
      title: "Teacher platform",
    },
    {
      status: "student",
      mainImage: "/student-login.png",
      teacher: "/teacher-bnw.png",
      student: "/student-col.png",
      title: "Student platform",
    },
  ];

  type User = {
    email: string;
    password: string;
  };

  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });

  const handleLoginSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5007/${element.status}/login`, {
        method: "POST",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });
  
      if (!response.ok) {
        throw new Error("Login failed");
      }
  
      const data = await response.json();
      console.log(data); // e.g. "Login successful"
    } catch (error) {
      console.error("Error:", error);
    }
  };

  type FormData = {
    email: string;
    password: string;
  };

  const [formData, setFormData] = useState<FormData>({
    email: user.email || "",
    password: user.password || "",
  });

  const [isValid, setIsValid] = useState(true);
  const [isCorrect, setIsCorrect] = useState(true);
  const [index, setIndex] = useState(0);
  const [element, setElement] = useState(elements[index]);
  function handleLogin() {
    setIndex((index + 1) % 2);
    setElement(elements[index]);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Email validation
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(value? emailRegex.test(value):true);
    }

    // Password validation
    if (name === "password") {
      const updatedPassword = value;
      const passwordIsLongEnough = updatedPassword.length >= 8;
      const passwordHasUpperCase = /[A-Z]/.test(updatedPassword);
      const passwordHasLowerCase = /[a-z]/.test(updatedPassword);
      const passwordHasNumber = /\d/.test(updatedPassword);
      const passwordHasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(
        updatedPassword
      );
      const passwordIsValid =
        passwordIsLongEnough &&
        passwordHasUpperCase &&
        passwordHasLowerCase &&
        passwordHasNumber &&
        passwordHasSpecialChar;
      setIsCorrect(value? passwordIsValid: true);
    }
  };

  return (
    <>
      <div className="w-[100vw] h-screen flex ">
        <div className="relative w-4/10 h-screen">
          <Image src={`${element.mainImage}`} alt="main image" fill></Image>
        </div>
        <div className="w-6/10 flex flex-col justify-center items-center">
          <div>
            <div className="flex nav-gap mb-[10vh]">
              <div
                onClick={() => handleLogin()}
                className="flex flex-col items-center"
              >
                <Image
                  src={element.student}
                  alt="student"
                  width={60}
                  height={60}
                ></Image>
                <p className="header-p-font">Student</p>
              </div>
              <div
                onClick={() => handleLogin()}
                className="flex flex-col items-center"
              >
                <Image
                  src={element.teacher}
                  alt="teacher"
                  width={60}
                  height={60}
                ></Image>
                <p className="header-p-font">Teacher</p>
              </div>
            </div>
            <div>
              <h1 className="header-font">{element.title}</h1>
              <p className="header-p-font">Login to you account to continue</p>
            </div>
            <div>
              <InputContact
                isValid={isValid}
                onChange={handleChange}
                name="email"
              ></InputContact>
              <Password
                isCorrect={isCorrect}
                num={1}
                onChange={handleChange}
                name="password"
              ></Password>
              <p className="mt-[2.5vh] text-blue-500 cursor-pointer p-font">
                <Link href={"/reset-paasword"}>I forget my password !</Link>
              </p>
              <Link href={"/"}>
                <button
                  className="custom-button w-full my-[2vw] height-input header-p-font"
                  disabled={!isValid || !isCorrect}
                  onClick={() => {
                    handleLoginSubmit();
                  }}
                >
                  Login
                </button>
              </Link>
              <p className="p-font text-center underline font-bold">
                <Link href={"/register"}>I don't have an account !</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
