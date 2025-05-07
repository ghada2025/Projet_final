"use client";
import InputContact from "@/components/input";
import Password from "@/components/password";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
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

  type FormData = {
    email: string;
    password: string;
  };

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [isValid, setIsValid] = useState(true);
  const [isCorrect, setIsCorrect] = useState(true);
  const [index, setIndex] = useState(0);
  const [element, setElement] = useState(elements[index]);

  const handleLogin = () => {
    const newIndex = (index + 1) % 2;
    setIndex(newIndex);
    setElement(elements[newIndex]);
  };

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
  
    // Password validation (optionnel à activer si besoin)
    if (name === "password") {
      const passwordIsValid =
        value.length >= 8 &&
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /\d/.test(value) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(value);
      setIsCorrect(value ? passwordIsValid : true);
    }
  };
  

  const handleLoginSubmit = async () => {
    const currentStatus = elements[index].status;
  
    try {
      const response = await fetch(`http://localhost:5007/${currentStatus}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
      console.log("Response JSON:", data);
  
      if (!response.ok) {
        throw new Error("Login failed");
      }
  
      router.push(currentStatus === "teacher" ? `/teacher-dashboard/Home` : `/student-dashboard`);
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  
  
  return (
    <>
      <div className="w-[100vw] h-screen flex">
        {/* Side Image - Hidden on screens <= 700px */}
        <div className="relative w-4/10 h-screen hidden md:block">
          <Image src={`${element.mainImage}`} alt="main image" fill />
        </div>
        
        {/* Main Content */}
        <div className="w-full flex flex-col justify-center items-center md:w-6/10">
          <div className="w-[65vw] md:w-[65%]">
            <div className="flex nav-gap mb-[10vh]">
              <div
                onClick={handleLogin}
                className="flex flex-col items-center cursor-pointer"
              >
                <Image
                  src={element.student}
                  alt="student"
                  width={60}
                  height={60}
                />
                <p className="header-p-font">Student</p>
              </div>
              <div
                onClick={handleLogin}
                className="flex flex-col items-center cursor-pointer"
              >
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
              <p className="header-p-font">Login to your account to continue</p>
            </div>
            <div>
              <InputContact
                isValid={isValid}
                onChange={handleChange}
                name="email"
              />
              <Password
                isCorrect={isCorrect}
                num={1}
                onChange={handleChange}
                name="password"
              />
              <Link
                href={elements[index].status === "teacher" ? "/teacher-dashboard/Home" : "/student-dashboard"}
              >
                <button
                  className="custom-button w-full my-[2vw] height-input header-p-font"
                  disabled={!isValid || !isCorrect}
                  onClick={handleLoginSubmit}
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
