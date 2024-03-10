"use client";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";
// import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { fetchData } from "./action";
import Link from "next/link";

interface Course {
  ID: number;
  Course: {
    Name: string;
    Slug: string;
    Chapter: {
      Lessons: {
        Content: string;
      }[];
    }[];
  };
}

const MyCourse = () => {
  const [coursesData, setCoursesData] = useState<Course[] | null>(null);
  console.log(coursesData);
  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const data = await fetchData();
        setCoursesData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchDataAsync();
  }, []);

  return (
    <>
      <Navbar />
      <section className="flex mx-auto p-5 gap-10">
        {/* sidebar */}
        <DashboardSidebar />
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <h1 className="text-[36px] text-gray-700 font-bold tracking-tighter text-center md:text-start leading-[40px] relative">
              My Courses
            </h1>
            <p className="max-w-md text-gray-500">
              Stay at the cutting edge by constantly upgrading your tech
              knowledge and skills.
            </p>
          </div>
          <div
            className={`grid ${
              coursesData && coursesData.length > 0
                ? "grid-cols-4"
                : "grid-cols-1"
            }  gap-5`}
          >
            {/* map over coursesData and render each course */}
            {coursesData && coursesData.length > 0 ? (
              coursesData?.map((course: any) => (
                <div
                  key={course.ID}
                  className="flex flex-col rounded-2xl p-5 bg-white gap-3 shadow"
                >
                  <Image
                    className="rounded-xl"
                    src={`/course1.jpg`}
                    width={400}
                    height={400}
                    alt="course"
                  />
                  <div className="flex flex-col max-w-[200px]">
                    <h1 className="max-w-[400px] truncate-line-2 text-[16px] text-gray-700 font-semibold tracking-tighter text-center md:text-start leading-[20px] relative">
                      {course.Course.Name}
                    </h1>
                  </div>
                  <Link
                    href={
                      course.Course.Chapter[0]?.Lessons[0]?.Content
                        ? `/my-courses/${course.Course.Slug}/${course.Course.Chapter[0].Lessons[0].Content}`
                        : "#"
                    }
                    className="bg-primary px-2 py-1 rounded-md text-white text-center text-[14px]"
                  >
                    Start Learning ▶
                  </Link>
                </div>
              ))
            ) : (
              <div className="flex flex-col justify-center mx-auto mb-10 w-full gap-5">
                <span className="text-[26px] text-center font-semibold text-gray-600 ">
                  You have no courses yet 😢
                </span>
                <Link
                  href={"/courses"}
                  className="px-3 py-1 bg-primary rounded-2xl text-center font-semibold text-white"
                >
                  All Courses Page
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MyCourse;
