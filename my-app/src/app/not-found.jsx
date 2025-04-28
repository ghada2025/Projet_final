import Link from "next/link";

export default function Validate() {
  return (
    <div className="flex flex-col justify-center items-center w-[100vw] h-screen px-15">
      <div className="w-full flex flex-col justify-between items-center h-[35vh] text-center">
        <div>
          <h1 className="header-font">Oops, something went wrong!</h1>
          <h3 className="font-bold text-[var(--main-orange)] header-p-font mb-5">
          There was an error with the internal server. Please contact your site adminte
          </h3>
        </div>
        <Link href={"/"} className="w-full flex justify-center items-center">
          <button className="custom-button header-p-font w-[40vw]">
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}