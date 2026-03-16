import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import Header from "./Header";
import CategoryNavbar from "./CategoryNavbar";
import Footer from "./Footer";
import FloatingContactButtons from "./FloatingContactButtons";

function CustomerLayout() {
  const [showFloatingHeader, setShowFloatingHeader] = useState(false);
  const rafIdRef = useRef(null);
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      // Cancel previous RAF if still pending
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Show floating header when scrolled past 100px
        // Hide immediately when at top
        if (currentScrollY < 10) {
          setShowFloatingHeader(false);
        } else if (currentScrollY > 100) {
          setShowFloatingHeader(true);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* TopBar - always visible at top */}
      <TopBar />

      {/* Main Header and CategoryNavbar - always in document flow */}
      <Header />
      <CategoryNavbar />

      {/* Floating Header - appears when scrolled down */}
      <div
        className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-lg"
        style={{
          opacity: showFloatingHeader ? 1 : 0,
          pointerEvents: showFloatingHeader ? "auto" : "none",
          transition: showFloatingHeader
            ? "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
            : "opacity 0s",
          willChange: "opacity",
        }}
      >
        <Header />
        <CategoryNavbar />
      </div>

      {/* max width 1126px */}
      <main className="flex-1 px-4 py-6 text-left">
        <Outlet />
      </main>

      <Footer />

      {/* Floating Contact Buttons */}
      <FloatingContactButtons />
    </div>
  );
}

export default CustomerLayout;
