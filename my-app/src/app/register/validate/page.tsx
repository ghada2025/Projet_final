import Link from "next/link";

export default function Validate() {
  return (
    <div className="flex flex-col justify-center items-center w-[100vw] h-screen">
      <div className="w-full flex flex-col justify-between items-center h-[35vh] text-center">
        <div>
          <h1 className="header-font">Congratulations! you are in with us</h1>
          <h3 className="font-bold text-[var(--main-orange)] header-h3-font">
            your account will be validated by your headmaster
          </h3>
        </div>
        <Link href={"/"} className="w-full flex justify-center items-center">
          <button className="custom-button header-p-font w-[40vw]">
            Return to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
}
