import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Card({image, title, text}:{image:string, title:string, text:string}){
    return(
        <>
        <div className="flex justify-between items-start text-start width-card nav-gap border-5 border-black p-5">
            <Image src={image} alt="feature icon" width={300} height={300}></Image>
            <div>
                <h3 className="header-h3-font card-h3-height">{title}</h3>
                <p className="header-p-font">{text}</p>
                <button className="text-blue-500 flex items-center h-9 gap-2 cursor-pointer header-p-font">Learn more<ArrowRight className="text-blue-500 mt-1"></ArrowRight></button>
            </div>
        </div>
        </>
    )
}