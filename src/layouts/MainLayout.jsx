import { Outlet } from "react-router";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ScroleToTop from "../components/common/ScroleToTop";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-paper font-sans text-ink">
      <ScroleToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
