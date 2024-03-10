import DashboardSidebar from "@/components/shared/DashboardSidebar";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";
import React from "react";

const MyTransactions = () => {
  return (
    <>
      <Navbar />
      <section className="flex mx-auto p-5 gap-10">
        {/* sidebar   */}
        <DashboardSidebar />
        <div className="flex flex-col gap-10 ">
          <div className="flex flex-col gap-5">
            <h1 className="text-[36px] text-gray-700 font-bold tracking-tighter text-center md:text-start leading-[40px] relative">
              My Transactions
            </h1>
            <p className="max-w-md text-gray-500">Transactions history</p>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {/* card  */}
            <div className="flex flex-col rounded-2xl p-5 bg-white gap-3 shadow">
              <Image
                className="rounded-xl"
                src={`/course1.jpg`}
                width={400}
                height={400}
                alt="course"
              />
              <div className="flex flex-col max-w-[200px]">
                <h1 className="max-w-[400px] truncate-line-2 text-[16px] text-gray-700 font-semibold tracking-tighter text-center md:text-start leading-[20px] relative">
                  Design System with Elegant style and more
                </h1>
              </div>
              <div className="bg-primary px-2 py-1 rounded-md text-white text-center text-[14px]">
                Start Learning ▶
              </div>
            </div>
            <div className="flex flex-col rounded-2xl p-5 bg-white gap-3 shadow">
              <Image
                className="rounded-xl"
                src={`/course1.jpg`}
                width={400}
                height={400}
                alt="course"
              />
              <div className="flex flex-col max-w-[200px]">
                <h1 className="max-w-[400px] truncate-line-2 text-[16px] text-gray-700 font-semibold tracking-tighter text-center md:text-start leading-[20px] relative">
                  Design System with Elegant style and more
                </h1>
              </div>
              <div className="bg-primary px-2 py-1 rounded-md text-white text-center text-[14px]">
                Start Learning ▶
              </div>
            </div>
            <div className="flex flex-col rounded-2xl p-5 bg-white gap-3 shadow">
              <Image
                className="rounded-xl"
                src={`/course1.jpg`}
                width={400}
                height={400}
                alt="course"
              />
              <div className="flex flex-col max-w-[200px]">
                <h1 className="max-w-[400px] truncate-line-2 text-[16px] text-gray-700 font-semibold tracking-tighter text-center md:text-start leading-[20px] relative">
                  Design System with Elegant style and more
                </h1>
              </div>
              <div className="bg-primary px-2 py-1 rounded-md text-white text-center text-[14px]">
                Start Learning ▶
              </div>
            </div>
            <div className="flex flex-col rounded-2xl p-5 bg-white gap-3 shadow">
              <Image
                className="rounded-xl"
                src={`/course1.jpg`}
                width={400}
                height={400}
                alt="course"
              />
              <div className="flex flex-col max-w-[200px]">
                <h1 className="max-w-[400px] truncate-line-2 text-[16px] text-gray-700 font-semibold tracking-tighter text-center md:text-start leading-[20px] relative">
                  Design System with Elegant style and more
                </h1>
              </div>
              <div className="bg-primary px-2 py-1 rounded-md text-white text-center text-[14px]">
                Start Learning ▶
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyTransactions;
