/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */
import { Outlet, useNavigate } from "react-router-dom";
import { FaAngleDoubleUp } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import "./Layout.css";
import { animateScroll as scroll } from "react-scroll";
import Sidebar from "./Sidebar";
import AppBar from "./AppBar";

const DashboardLayout = () => {
  const navRef = useRef();
  const [toggle, setToggle] = useState(false);
  const toggleSideBar = () => {
    setToggle((toggle) => !toggle);
  };

  const containerRef = useRef();
  const handleToggleCloseBtn = () => {
    setToggle(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const button = document.getElementById("button");
      if (window.scrollY > 50) {
        button.classList.add("scrollToTopBtn");
      } else {
        button.classList.remove("scrollToTopBtn");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo(0, 0);
    scroll.scrollToTop({ smooth: true });
  }

  return (
    <main>
      <AppBar toggle={toggle} navRef={navRef} toggleSideBar={toggleSideBar} />
      <div>

        <div
          ref={containerRef}
          onClick={handleToggleCloseBtn}
          className={`${toggle ? `drawer-content -pl-15 md:pl-20 lg:pl-10 lg:pr-3 xl:pl-8 xl:pr-2` : `activeDrawer lg:pl-0`}  `}
        >
          <Outlet />
        </div>

        <Sidebar toggle={toggle} />
      </div>

      <button onClick={scrollToTop} id="button">
        <div className="scrollBtn">
          <FaAngleDoubleUp size={25} />
        </div>
      </button>
    </main>
  );
};

export default DashboardLayout;
