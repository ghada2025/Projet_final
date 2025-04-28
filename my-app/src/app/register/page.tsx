"use client";
import InputContact from "@/components/input";
import Password from "@/components/password";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import Grade from "./grade/page";
import { useRouter } from "next/navigation";
import Link from "next/link";


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

  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [element, setElement] = useState(elements[index]);
  const [isfinished, setIsFinished] = useState(false);

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

  const handleSubmit = async () => {
    if (element.status === "teacher") {
      try {
        const response = await fetch(`http://localhost:5007/teacher/register`, {
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
        router.push("/register/validate");
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setIsFinished(true);
    }
  };

  const [isValid, setIsValid] = useState<boolean>(true);
  const [isCorrect, setIsCorrect] = useState<boolean>(true);
  const [ismatched, setIsMatched] = useState<boolean>(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(value ? emailRegex.test(value) : true);
    }

    if (name === "password") {
      const passwordIsValid =
        value.length >= 8 &&
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /\d/.test(value) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(value);
      setIsCorrect(value ? passwordIsValid : true);
    }

    if (name === "confirmPassword") {
      const passwordsMatch = formData.password === value;
      setIsMatched(value ? passwordsMatch : true);
    }
  };

  return (
    <>
      {!isfinished ? (
        <div className="w-[100vw] h-screen flex">
          {/* Side Image - Hidden on screens <= 700px */}
          <div className="relative w-4/10 h-screen hidden md:block">
            <Image src={`${element.mainImage}`} alt="main image" fill />
          </div>
  
          {/* Main Content */}
          <div className="w-full md:w-6/10 flex flex-col justify-center items-center px-[20px]">
            <div className="w-[65vw] md:w-[65%]">
              <div className="flex nav-gap mb-[5vh]">
                <div onClick={handleLogin} className="flex flex-col items-center">
                  <Image src={element.student} alt="student" width={60} height={60} />
                  <p className="header-p-font">Student</p>
                </div>
                <div onClick={handleLogin} className="flex flex-col items-center">
                  <Image src={element.teacher} alt="teacher" width={60} height={60} />
                  <p className="header-p-font">Teacher</p>
                </div>
              </div>
              <div>
                <h1 className="header-font">{element.title}</h1>
                <p className="header-p-font">Create your account to continue</p>
              </div>
              <div className="w-full">
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
                <Password isCorrect={isCorrect} num={1} onChange={handleChange} name="password" />
                <Password isCorrect={ismatched} num={2} onChange={handleChange} name="confirmPassword" />
  
                <button
                  className="custom-button w-full my-[2vw] height-input header-p-font"
                  disabled={
                    !isValid ||
                    !isCorrect ||
                    !formData.firstName ||
                    !formData.lastName
                  }
                  onClick={handleSubmit}
                >
                  {element.button}
                </button>
  
                <p className="header-p-font text-center underline font-bold">
                  <Link href="/login">I already have an account</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Grade data={formData} />
      )}
    </>
  );  
}
