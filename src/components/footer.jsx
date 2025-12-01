import { Instagram } from "lucide-react";
import { BsInstagram, BsLinkedin } from "react-icons/bs";

function Footer() {
  return (
    <>
      <footer className="footer sm:footer-horizontal flex footer-center bg-base-300 text-base-content p-4 mb-0 justify-center ">
        <aside>
          <div className="mb-2">
            <p className="text-md mb-2">
              Designed and Managed by
              <span className="text-md font-bold text-slate-800 ml-2 ">
                PRIYAM PATHAK
              </span>
            </p>
            <div className="flex justify-center space-x-2">
              <BsInstagram />
              <BsLinkedin />
            </div>
          </div>
        </aside>
      </footer>
    </>
  );
}
export default Footer;
