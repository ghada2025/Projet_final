"use client";
import Card from "@/components/card";
import Footer from "@/components/footer";
import InputContact from "@/components/input";
import Navbar from "@/components/navbar";
import TextArea from "@/components/textarea";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const cardInfo = [
    {
      title: "Adaptative Quiz system for students",
      text: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.",
      image: "/feature-1.jpg",
    },
    {
      title: "3D learning platform service",
      text: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.",
      image: "/feature-2.jpg",
    },
    {
      title: "Lean by watching video course",
      text: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.",
      image: "/feature-3.jpg",
    },
    {
      title: "Teacher and student Dashboard",
      text: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.",
      image: "/feature-4.jpg",
    },
  ];

  return (
    <>
      {/* The navbar component */}

      <Navbar></Navbar>

      {/* The Hero section */}

      <div className="flex items-center justify-center relative" id="Home">
        <div className="max-w-[1400px] px-[50px] w-full">
          <header className="flex flex-row-reverse h-auto items-center justify-between section-padding">
            <div>
              <Image
                src={"/Hero-picture.png"}
                alt="hero-picture"
                width={550}
                height={550}
                data-aos="fade-left"
                className="animate__animated animate__bounce"
              ></Image>
            </div>
            <div>
              <h1 className="font-bold header-font header-width">
                <span className="text-[var(--main-blue)]">Play, </span>{" "}
                <span className="text-[var(--main-orange)]">Learn, </span>{" "}
                <span className="text-[var(--main-red)]">Thrive!</span> Gamify
                🎮 Your{" "}
                <span className="text-[var(--main-green)]">Knowledge</span>{" "}
                Journey!
              </h1>
              <p className="header-p-padding header-width header-p-font">
                We're a team of experienced developers creating innovative web
                and mobile solutions that empower businesses to succeed online.
                Let's bring your vision to life
              </p>
              <div className="flex items-center gap-2.5">
                <Link href={"/login"}>
                  <button className="custom-button header-p-font">
                    Get started
                  </button>
                </Link>
                <a href="#About">
                  <button className="header-p-font px-[30px] py-[6px] rounded-[50px] cursor-pointer font-bold">
                    Get more info
                  </button>
                </a>
              </div>
            </div>
          </header>

          {/* The about section */}

          <section className="h-auto section-padding" id="About">
            <div className="text-center header-p-padding">
              <h1 className="header-font pt-4">About our plateform</h1>
              <h3 className="font-bold text-[var(--main-orange)] header-h3-font">
                Get to know us
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="header-h3-font font-bold">
                  Name of the plateform
                </h1>
                <p className="header-width header-p-font header-p-padding">
                  Prosperity School is a groundbreaking educational institution
                  that redefines the traditional classroom experience through an
                  innovative and immersive approach to learning. Situated in a
                  modern, state-of-the-art campus, Prosperity School is at the
                  forefront of educational transformation, harnessing the power
                  of technology and gaming to inspire and educate the leaders of
                  tomorrow.
                </p>
                <a href="#Contact">
                  <button className="custom-button header-p-font">
                    Get in touch
                  </button>
                </a>
              </div>
              <div>
                {/* add a video */}
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/Piw-9dOC8YQ?si=5DWzuqqLknE4qOoY`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </section>

          {/* The features section */}

          <section className="h-auto section-padding" id="Course">
            <div className="text-center header-p-padding flex flex-col items-center">
              <div>
                <h1 className="header-font pt-4">
                  One Platform, Limitless possibilities
                </h1>
                <h3 className="font-bold text-[var(--main-orange)] header-h3-font">
                  Get to know us
                </h3>
              </div>
              <div className="grid grid-cols-2 footer-padding nav-gap">
                {cardInfo.map((card, key) => (
                  <Card
                    title={card.title}
                    image={card.image}
                    text={card.text}
                    key={key}
                  ></Card>
                ))}
              </div>
            </div>
          </section>

          {/* The contact section */}

          <section className="h-auto section-padding relative" id="Contact">
            <div className="text-center header-p-padding flex flex-col items-center">
              <div>
                <h1 className="header-font pt-4">Contact us</h1>
                <h3 className="font-bold text-[var(--main-orange)] header-h3-font">
                  Get in touch
                </h3>
              </div>
              <div className="relative">
                {/* Contact Area (should be on top) */}
                <div className="nav-gap text-start border-3 rounded-md border-b-7 border-r-7 border-black p-10 contact-margin z-50 bg-white relative">
                  <p className="header-p-font text-[var(--main-orange)]">
                    Enter Your Email Below
                  </p>
                  <h3 className="header-h3-font header-width">
                    Support is just a click away. Contact us for prompt
                    assistance with your inquiries.
                  </h3>
                  <InputContact />
                  <TextArea />
                  <button className="custom-button w-full header-p-font h-13">
                    Send Your Message
                  </button>
                </div>

                {/* Image positioned below */}
                <Image
                  src="/boy.png"
                  alt="boy"
                  width={150}
                  height={150}
                  className="absolute top-[90px] left-[-105px] z-0"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
