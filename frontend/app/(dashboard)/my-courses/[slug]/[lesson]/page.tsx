"use client";
import CourseSidebar from "@/components/shared/CourseSidebar";
import NavbarCourse from "@/components/shared/NavbarCourse";
import React, { useEffect, useState } from "react";
import { fetchData } from "./action";
import { useParams } from "next/navigation";

interface CourseData {
  Chapter: any; // Replace 'any' with the actual type
  // ... other properties
}

const LearnPage = () => {
  const [coursesData, setCoursesData] = useState<CourseData>();
  const params = useParams();
  console.log(params?.slug);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const data = await fetchData(params?.slug);
        setCoursesData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchDataAsync();
  }, [params?.slug]); // Include params?.slug in the dependency array

  console.log(coursesData);

  return (
    <>
      <NavbarCourse />
      <section className="flex py-3 px-5 h-[70%] w-screen overflow-x-hidden overflow-y-scroll grow">
        {/* sidebar  */}
        <div className="flex-shrink-0 overflow-y-auto overflow-x-hidden w-1/3">
          <CourseSidebar chapterData={coursesData?.Chapter} />
        </div>
        <div className="flex-1 flex overflow-x-hidden">
          <iframe
            className="w-full max-h-[500px] rounded-2xl overflow-x-hidden overflow-y-hidden"
            src={`https://www.youtube.com/embed/${params?.lesson}?autoplay=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      </section>
    </>
  );
};

export default LearnPage;
