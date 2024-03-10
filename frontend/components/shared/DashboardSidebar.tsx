"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAuth } from "./authContext";

const DashboardSidebar = ({ className }: any) => {
  const { userData } = useAuth();

  return (
    <div
      className={`flex flex-col px-5 py-10 bg-white rounded-2xl max-h-[600px] gap-5 overflow-y-scroll shadow-lg  scrollbar-hided w-[400px] ${className}`}
    >
      <div className="flex flex-col ">
        <Image src={"/account.svg"} alt="avatar" width={60} height={60} />
        <div className="flex flex-col pt-5 gap-2">
          <div className="font-semibold tracking-tighter text-[16px]">
            {userData?.name}
          </div>
          <div className="font-normal text-gray-500 tracking-tighter text-[16px]">
            Fullstack Developer
          </div>
        </div>
      </div>
      <hr />
      <div className="flex flex-col gap-8 ">
        <Link href="/my-courses">My Courses</Link>
        <Link href="/my-transactions">Transactions History</Link>
        <Link href="/settings">Settings</Link>
        <a href="/settings">Logout</a>
      </div>
    </div>
  );
};

export default DashboardSidebar;
