"use client";

import Link from "next/link";
import React, { useState } from "react";
import { SearchDialog } from "./SearchDialog";
import { NavbarItem } from "./NavbarItem";
import Image from "next/image";
import { useAuth } from "./authContext";

const Navbar = ({ user }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuAccountOpen, setIsMenuAccountOpen] = useState(false);
  const [loginMenu, setLoginMenu] = useState(false);
  const { userData } = useAuth();

  console.log(userData);
  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsMenuAccountOpen(false);
  };
  const logout = () => {
    // Hapus cookie dengan nama CC_COOKIES
    document.cookie =
      "CC_COOKIES=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Merefresh halaman
    location.reload();
  };
  return (
    <>
      <nav className=" container text-gray-800 bg-opacity-30 backdrop-blur-md sticky top-0 left-0 right-0 z-50 flex items-center justify-between p-3 bg-white">
        <div className="hidden lg:flex space-x-6 justify-center items-center">
          <Link
            href={"/"}
            className="font-bold text-lg  px-2 py-1 rounded hover:bg-[#e6e8eb80] hover:text-[#5cc081] text-[#16a34a] transition-all duration-200"
          >
            CodingCraft
          </Link>

          <div
            className={`lg:flex items-center  font-[500] tracking-tight text-[14px] hidden `}
          >
            <NavbarItem />
            <div className="flex ">
              <a
                href=""
                className="hover:bg-[#e6e8eb80] px-4 py-2 rounded-md transition-all duration-200"
              >
                Contact
              </a>
              <a
                href=""
                className="hover:bg-[#e6e8eb80] px-4 py-2 rounded-md transition-all duration-200"
              >
                Support
              </a>
            </div>
          </div>
        </div>

        {userData ? (
          <div className="hidden  lg:flex space-x-6 items-center relative  text-sm tracking-tighter cursor-pointer">
            <SearchDialog />
            <div
              className=" hidden  lg:flex space-x-6 items-center"
              onClick={() => setLoginMenu(!loginMenu)}
            >
              <div className="font-[500] tracking-tighter ">
                Halo, {userData.name}
              </div>

              <Image
                src={"/account.svg"}
                width={35}
                height={35}
                alt="account icon"
              />
            </div>
            <div
              className={`flex flex-col ${
                loginMenu ? "absolute" : "hidden"
              } left-[130px] top-[50px] bg-white rounded-lg px-5 py-3 gap-5 tracking-tighter font-[400] text-[14px]`}
            >
              <Link
                href="/my-courses"
                className="hover:text-gray-300 duration-300"
              >
                My Courses
              </Link>
              <Link
                href="/my-transactions"
                className="hover:text-gray-300 duration-300"
              >
                Transaction History
              </Link>
              <Link
                href="/settings"
                className="hover:text-gray-300 duration-300"
              >
                Settings
              </Link>
              <div
                onClick={logout}
                className="hover:text-gray-300 duration-300"
              >
                Logout
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden  lg:flex space-x-6 items-center   text-sm">
            <SearchDialog />
            <Link href="/auth">Log in</Link>
            <Link
              href="/auth"
              className="px-4 py-1 bg-primary rounded-md font-semibold text-white hover:bg-gray-800 transition-all duration-200"
            >
              Get Started Free <span className="font-bold text-[15px]">→</span>
            </Link>
          </div>
        )}

        <div className="lg:hidden flex justify-center items-center bg-[#e6e8eb80] p-2 rounded-lg">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className=" focus:outline-none"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            )}
          </button>
        </div>
        <Link
          href={"/"}
          className="lg:hidden font-bold text-lg   rounded  hover:text-[#5cc081] text-[#16a34a] transition-all duration-200"
        >
          <Image src={"/logo-mobile.png"} width={40} height={40} alt="logo" />
        </Link>

        {userData ? (
          <div
            onClick={() => setIsMenuAccountOpen(!isMenuAccountOpen)}
            className="flex justify-center items-center  lg:hidden rounded-lg"
          >
            <Image
              src={"/account.svg"}
              width={35}
              height={35}
              alt="logo"
              className="text-primary"
            />
          </div>
        ) : (
          <Link
            href={"/auth"}
            className="lg:hidden px-2 py-1 tracking-tighter text-white font-semibold bg-primary rounded-lg text-sm"
          >
            Sign In
          </Link>
        )}
      </nav>
      <div className="relative">
        <div
          className={`lg:hidden flex flex-col  py-6 px-6 ${
            isMenuOpen ? "bg-white -bottom-0 shadow-lg" : "-bottom-full"
          } duration-500 h-[70%] w-screen z-10 fixed rounded-t-[35px] gap-7`}
        >
          <div
            className="flex justify-end mb-5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>

          {/* Place other menu items here */}

          <div className="flex flex-col tracking-tighter gap-4 ">
            <h1 className="font-semibold tracking-tighter">Development</h1>
            <div className="flex justify-between">
              <Link
                onClick={closeMenus}
                href={"/courses"}
                className="flex flex-col bg-[#e6e8eb80] hover:bg-white border-[1px] rounded-xl p-4"
              >
                Fullstack
              </Link>
              <Link
                onClick={closeMenus}
                href={"/courses"}
                className="flex flex-col bg-[#e6e8eb80] hover:bg-white border-[1px] rounded-xl p-4"
              >
                FrontEnd
              </Link>
              <Link
                onClick={closeMenus}
                href={"/courses"}
                className="flex flex-col bg-[#e6e8eb80] hover:bg-white border-[1px] rounded-xl p-4"
              >
                BackEnd
              </Link>
            </div>
          </div>

          <div className="flex flex-col tracking-tighter gap-4">
            <h1 className="font-semibold tracking-tighter">Courses</h1>
            <div className="flex justify-between">
              <Link
                onClick={closeMenus}
                href={"/courses"}
                className="flex flex-col bg-[#e6e8eb80] hover:bg-white border-[1px] rounded-xl p-4"
              >
                All Courses
              </Link>
              <Link
                onClick={closeMenus}
                href={"/courses"}
                className="flex flex-col bg-[#e6e8eb80] hover:bg-white border-[1px] rounded-xl p-4"
              >
                Website
              </Link>
              <Link
                onClick={closeMenus}
                href={"/courses"}
                className="flex flex-col bg-[#e6e8eb80] hover:bg-white border-[1px] rounded-xl p-4"
              >
                Mobile
              </Link>
            </div>
          </div>

          <div className="flex flex-col tracking-tighter gap-4">
            <h1 className="font-semibold tracking-tighter">Events</h1>
            <div className="flex justify-between">
              <Link
                onClick={closeMenus}
                href={"/courses"}
                className="flex flex-col bg-[#e6e8eb80] hover:bg-white border-[1px] rounded-xl p-4"
              >
                Online
              </Link>
              <Link
                onClick={closeMenus}
                href={"/courses"}
                className="flex flex-col bg-[#e6e8eb80] hover:bg-white border-[1px] rounded-xl p-4"
              >
                Offline
              </Link>
              <Link
                onClick={closeMenus}
                href={"/courses"}
                className="flex flex-col bg-[#e6e8eb80] hover:bg-white border-[1px] rounded-xl p-4"
              >
                Collaboration
              </Link>
            </div>
          </div>
        </div>

        {/* Backdrop Shadow */}
        {isMenuOpen && (
          <div
            className="lg:hidden fixed top-0 left-0 w-screen h-screen bg-black opacity-50 duration-200"
            onClick={() => setIsMenuAccountOpen(false)}
          ></div>
        )}
      </div>
      <div className="relative">
        <div
          className={`lg:hidden flex flex-col  py-6 px-6 justify-evenly ${
            isMenuAccountOpen ? "bg-white -bottom-0 shadow-lg" : "-bottom-full"
          } duration-500 h-[55%] w-screen z-10 fixed rounded-t-[45px]`}
        >
          <div
            className="flex justify-end "
            onClick={() => setIsMenuAccountOpen(!isMenuAccountOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>

          {/* Place other menu items here */}
          <div className="flex items-center  justify-between">
            <div className="flex items-center">
              <Image
                src={`/account.svg`}
                alt="avatar"
                width={70}
                height={70}
                className="mr-5"
              />
              <div className="flex flex-col">
                <div className="font-semibold text-[20px] capitalize">
                  {userData?.name}
                </div>
                <div>Fullstack-Developer</div>
              </div>
            </div>
            <div className="px-2 py-1 rounded-xl bg-primary text-white font-bold text-[14px]">
              PRO
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href={`/my-courses`}>My Courses</Link>
            <Link href={`/my-transactions`}>Transaction History</Link>
            <Link href={`/settings`}>Settings</Link>
            <a onClick={logout}>Logout</a>
          </div>
          <Link
            href={"/courses"}
            className="w-full bg-primary text-white px-2 py-1 rounded-xl text-center flex items-end justify-center align-bottom"
          >
            Check our latest Promo !!!
          </Link>
        </div>

        {/* Backdrop Shadow */}
        {isMenuAccountOpen && (
          <div
            className="lg:hidden fixed top-0 left-0 w-screen h-screen bg-black opacity-50 duration-200"
            onClick={() => setIsMenuAccountOpen(false)}
          ></div>
        )}
      </div>
    </>
  );
};

export default Navbar;
