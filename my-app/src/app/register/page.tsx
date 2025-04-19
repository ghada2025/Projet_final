"use client";
import InputContact from "@/components/input";
import Password from "@/components/password";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const elements = [
    {
      status: "teacher",
      mainImage: "/teacher-login.png",
      teacher: "/teacher-col.png",
      student: "/student-bnw.png",
      title: "Teacher platform",
      button: "Login",
    },
    {
      status: "student",
      mainImage: "/student-login.png",
      teacher: "/teacher-bnw.png",
      student: "/student-col.png",
      title: "Student platform",
      button: "Next",
    },
  ];

  const handleSubmit = async () => {
    try { 
      const response = await fetch(`http://localhost:5007/${element.status}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
    }
    catch (error) {
      console.error("Error:", error);
    }
  }


  const [index, setIndex] = useState(0);
  const [element, setElement] = useState(elements[index]);

  function handleLogin() {
    setIndex((prevIndex) => (prevIndex + 1) % 2);
    setElement(elements[(index + 1) % 2]);
  }

  type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isValid, setIsValid] = useState<boolean>(true); // For email
  const [isCorrect, setIsCorrect] = useState<boolean>(true); // For password match & length
  const [ismatched, setIsMatched] = useState<boolean>(true); // For password match

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
      const passwordHasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(updatedPassword);
      const passwordIsValid = passwordIsLongEnough && passwordHasUpperCase && passwordHasLowerCase && passwordHasNumber && passwordHasSpecialChar;
      setIsCorrect(value? passwordIsValid: true);
    }
    if (name === "confirmPassword") {
      const updatedConfirm = value;
      const updatedPassword = formData.password;
      const passwordsMatch = updatedPassword === updatedConfirm;

      setIsMatched(value? passwordsMatch:true);
    }
  };

  return (
    <div className="w-[100vw] h-screen flex">
      <div className="relative w-4/10 h-screen">
        <Image src={`${element.mainImage}`} alt="main image" fill />
      </div>
      <div className="w-6/10 flex flex-col justify-center items-center px-[20px]">
        <div>
          <div className="flex nav-gap mb-[5vh]">
            <div onClick={handleLogin} className="flex flex-col items-center">
              <Image
                src={element.student}
                alt="student"
                width={60}
                height={60}
              />
              <p className="header-p-font">Student</p>
            </div>
            <div onClick={handleLogin} className="flex flex-col items-center">
              <Image
                src={element.teacher}
                alt="teacher"
                width={60}
                height={60}
              />
              <p className="header-p-font">Teacher</p>
            </div>
          </div>
          <div>
            <h1 className="header-font">{element.title}</h1>
            <p className="header-p-font">Create your account to continue</p>
          </div>
          <div className="w-[100%]">
            <div className="flex nav-gap">
              <Input
                className="peer header-p-font mt-5 border-3 border-black border-b-5 border-r-5 height-input placeholder:text-black placeholder:p-font placeholder:font-semibold"
                placeholder="First Name"
                onChange={handleChange}
                type="text"
                name="firstName"
              />
              <Input
                className="peer header-p-font mt-5 border-3 border-black border-b-5 border-r-5 height-input placeholder:text-black placeholder:p-font placeholder:font-semibold"
                placeholder="Last Name"
                onChange={handleChange}
                type="text"
                name="lastName"
              />
            </div>
            <InputContact isValid={isValid} onChange={handleChange} name="email" />
            <Password
              isCorrect={isCorrect}
              num={1}
              onChange={handleChange}
              name="password"
            />
            <Password
              isCorrect={ismatched}
              num={2}
              onChange={handleChange}
              name="confirmPassword"
            />
            <Link
              href={element.button === "Login" ? "/register/validate" : "/register/grade"}
            >
              <button
                className="custom-button w-full my-[2vw] height-input header-p-font"
                disabled={!isValid || !isCorrect || !formData.firstName || !formData.lastName}
                onClick={() => {
                  handleLogin();
                  handleSubmit();
                }
                }
              >
                {element.button}
              </button>
            </Link>
            <p className="header-p-font text-center underline font-bold">
              <Link href={"/login"}>I already have an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}