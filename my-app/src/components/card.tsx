import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Card({image, title, text}:{image:string, title:string, text:string}){
    return (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start text-start width-card nav-gap border-5 border-black p-5">
            <Image src={image} alt="feature icon" width={300} height={300} className="sm:w-[40%] md:w-[30%] mb-4 sm:mb-0" />
            <div className="sm:w-[55%] md:w-[60%]">
              <h3 className="header-h3-font card-h3-height text-xl sm:text-2xl md:text-3xl [@media(max-width:780px)]:mb-5">{title}</h3>
              <p className="header-p-font text-base sm:text-lg md:text-xl">{text}</p>
              <button className="text-blue-500 flex items-center h-9 gap-2 cursor-pointer header-p-font card mt-2">
                Learn more<ArrowRight className="text-blue-500 mt-1" />
              </button>
            </div>
          </div>
        </>
      );
      
}