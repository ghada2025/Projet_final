"use client";
import Card from "@/components/card";
import Footer from "@/components/footer";
import FormMail from "@/components/formMail";
import InputContact from "@/components/input";
import Navbar from "@/components/navbar";
import TextArea from "@/components/textarea";
import Image from "next/image";
import Link from "next/link";

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
return(
<>
  {/* Navbar */}
  <Navbar />

  {/* Hero Section */}
  <div className="flex items-center justify-center relative" id="Home">
    <div className="max-w-[1400px] px-5 md:px-[50px] w-full">
      <header className="flex flex-col-reverse md:flex-row-reverse items-center justify-between section-padding gap-10">
      <div className="[@media(max-width:470px)]:w-[70%] custom-width">
  <Image
    src={"/Hero-picture.png"}
    alt="hero-picture"
    layout="responsive" 
    width={550} 
    height={550} 
    data-aos="fade-left"
    className="animate__animated animate__bounce"
  />
</div>


        <div className="text-center md:text-left">
          <h1 className="font-bold header-font header-width">
            <span className="text-[var(--main-blue)]">Play, </span>
            <span className="text-[var(--main-orange)]">Learn, </span>
            <span className="text-[var(--main-red)]">Thrive!</span> Gamify 🎮 Your{" "}
            <span className="text-[var(--main-green)]">Knowledge</span> Journey!
          </h1>
          <p className="header-p-padding header-width header-p-font">
            We're a team of experienced developers creating innovative web and mobile solutions that empower businesses to succeed online. Let's bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Link href={"/login"}>
              <button className="custom-button header-p-font">Get started</button>
            </Link>
            <a href="#About">
              <button className="header-p-font px-[30px] py-[6px] rounded-[50px] cursor-pointer font-bold card">
                Get more info
              </button>
            </a>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="h-auto section-padding" id="About">
        <div className="text-center header-p-padding">
          <h1 className="header-font pt-4">About our platform</h1>
          <h3 className="font-bold text-[var(--main-orange)] header-h3-font">
            Get to know us
          </h3>
        </div>
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-10">
          <div>
            <h1 className="header-h3-font font-bold">Name of the platform</h1>
            <p className="header-width header-p-font header-p-padding">
              Prosperity School is a groundbreaking educational institution that redefines the traditional classroom experience through an innovative and immersive approach to learning.
            </p>
            <a href="#Contact">
              <button className="custom-button header-p-font mt-4">
                Get in touch
              </button>
            </a>
          </div>
          <div className="width-card">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/Piw-9dOC8YQ?si=5DWzuqqLknE4qOoY"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="rounded-lg width-card"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
          <div className="grid grid-cols-2 gap-8 mt-8 [@media(max-width:470px)]:grid-cols-1">
  {cardInfo.map((card, key) => (
    <Card
      title={card.title}
      image={card.image}
      text={card.text}
      key={key}
    />
  ))}
</div>


        </div>
      </section>

      {/* Contact Section */}
      <section className="h-auto section-padding relative" id="Contact">
  <div className="text-center header-p-padding flex flex-col items-center">
    <div>
      <h1 className="header-font pt-4 text-xl sm:text-3xl md:text-4xl">Contact us</h1>
      <h3 className="font-bold text-[var(--main-orange)] header-h3-font text-lg sm:text-xl md:text-2xl">
        Get in touch
      </h3>
    </div>
    <div className="relative mt-8">
      {/* Contact Area */}
      <div className="nav-gap text-start border-3 rounded-md border-b-7 border-r-7 border-black p-6 sm:p-8 md:p-10 contact-margin z-50 bg-white relative w-full sm:w-[90%] md:w-[670px] mx-auto">
        <p className="header-p-font text-[var(--main-orange)]">
          Enter Your Email Below
        </p>
        <h3 className="header-h3-font header-width text-base ">
          Support is just a click away. Contact us for prompt assistance with your inquiries.
        </h3>
        <FormMail></FormMail>
      </div>

      {/* Image positioned below */}
      <Image
        src="/boy.png"
        alt="boy"
        width={150}
        height={150}
        className="absolute top-[90px] left-[-108px] z-0 md:top-[120px] md:left-[-103px] sm:top-[100px] sm:left-[-115px]"
      />
    </div>
  </div>
</section>


    </div>
  </div>

  {/* Footer */}
  <Footer />
</>)

}
