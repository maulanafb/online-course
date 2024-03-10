"use client";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import HomeBody from "@/components/shared/HomeBody";
import Navbar from "@/components/shared/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <DashboardSidebar className="hidden" />
      <main className="container flex min-h-screen flex-col max-w-[1124px] ">
        <Header />
        <HomeBody />
      </main>
      <Footer />
    </>
  );
}
