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
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = () => {
    const newIndex = (index + 1) % 2;
    setIndex(newIndex);
    setElement(elements[newIndex]);
    setErrorMsg(""); // reset erreur si on change de rôle
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
      const response = await fetch(
        `https://projet-final-zm7q.onrender.com/${currentStatus}/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();
      console.log("Response JSON:", data);

      if (!response.ok) {
        setErrorMsg(data.message || "Login failed ❌");
        return;
      }

      setErrorMsg(""); // reset erreur
      router.push(
        currentStatus === "teacher"
          ? `/teacher-dashboard/Home`
          : `/student-dashboard`
      );
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Erreur lors de la connexion. Veuillez réessayer.");
    }
  };

  return (
    <div className="w-[100vw] h-screen flex">
      {/* Image latérale */}
      <div className="relative w-4/10 h-screen hidden md:block">
        <Image src={element.mainImage} alt="main image" fill />
      </div>

      {/* Contenu principal */}
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

            {errorMsg && (
              <p className="text-red-600 text-center my-2">{errorMsg}</p>
            )}

            <button
              className="custom-button w-full my-[2vw] height-input header-p-font"
              disabled={!isValid || !isCorrect}
              onClick={handleLoginSubmit}
            >
              Login
            </button>

            <p className="p-font text-center underline font-bold">
              <Link href="/register">I don't have an account !</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
