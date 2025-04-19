export default function Footer() {
  return (
    <div className="flex items-center justify-center bg-[var(--main-orange)]">
      <footer className="max-w-[1400px] w-full h-auto px-[50px] footer-padding pb-0 text-white">
        <div className="flex justify-between">
          <div>
            <h3 className="header-h3-font">Name of the software</h3>
            {/* To change */}
            <p className="header-p-font header-p-padding footer-width">
              We're a team of experienced developers creating innovative web and
              mobile solutions that empower businesses to succeed online. Let's
              bring your vision to life
            </p>
          </div>
          <div className="flex nav-gap">
            <div>
              <h3 className="header-h3-font">Quick links</h3>
              <ul className="header-p-padding header-p-font">
                <li>
                  <a href="#About" className="cursor-pointer">About Us</a>
                </li>
                <li>
                  <a href="#Course" className="cursor-pointer">Course</a>
                </li>
                <li>
                  <a href="#Contact" className="cursor-pointer">Contact Us</a>
                </li>
                <li>
                  <a href="#Subscription" className="cursor-pointer">Subscription</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="header-h3-font">Get in Touch</h3>
              <ul className="header-p-padding header-p-font">
                {/* To change */}
                <li>Email@example.com</li>
                <li className="underline">our location</li>
                <li>+213 542 89 75 41</li>
              </ul>
            </div>
          </div>
        </div>
        <hr />
        <p className="header-p-font header-p-padding text-center">&copy; 2025 Software Name. All rights reserved.</p>
      </footer>
    </div>
  );
}
