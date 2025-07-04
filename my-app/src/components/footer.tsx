export default function Footer() {
    return (
      <div className="flex items-center justify-center bg-[var(--main-orange)]">
        <footer className="max-w-[1400px] w-full h-auto px-5 md:px-[50px] footer-padding pb-0 text-white">
          <div className="flex flex-col md:flex-row justify-between tems-center md:items-start gap-10">
            <div className="text-center md:text-start">
              <h3 className="header-h3-font">Liberty School</h3>
              <div className="w-full flex justify-center">
              <p className="header-p-font header-p-padding footer-width">
                We're a school of experienced teachers creating online solutions that help students succeed in their studies.
              </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row nav-gap text-center md:text-start">
              <div>
                <h3 className="header-h3-font">Quick links</h3>
                <ul className="header-p-padding header-p-font">
                  <li className="card"><a href="#About" className="cursor-pointer">About Us</a></li>
                  <li className="card"><a href="#Course" className="cursor-pointer">Course</a></li>
                  <li className="card"><a href="#Contact" className="cursor-pointer">Contact Us</a></li>
                </ul>
              </div>
              <div>
                <h3 className="header-h3-font">Get in Touch</h3>
                <ul className="header-p-padding header-p-font">
                  <li>doukhamohamedriad@gmail.com</li>
                  <li className="underline">Our location</li>
                  <li>+213 540 30 59 88</li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="mt-6"/>
          <p className="header-p-font header-p-padding text-center mt-4">&copy; 2025 Liberty School. All rights reserved.</p>
        </footer>
      </div>
    );
  } 
