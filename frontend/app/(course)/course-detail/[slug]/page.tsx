"use client";
import { useEffect, useState } from "react";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchData } from "./action";

const CourseDetail = () => {
  const params = useParams();
  const [courseData, setCourseData] = useState<any>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const data = await fetchData(params.slug);
        setCourseData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCourseData();
  }, [params.slug]);

  return (
    <>
      <Navbar />
      <section className="overflow-y-hidden">
        <div className="flex flex-col mx-auto px-3 md:px-0">
          <div className="flex mt-10 lg:w-[1240px] md:mx-auto text-[14px] font-[400] duration-200">
            <Link
              href="/courses"
              className="flex shadow-sm hover:text-gray-400 bg-[#e6e8eb80] rounded-lg items-center px-2 py-1 tracking-tighter gap-2 "
            >
              <ArrowLeft /> <span>Back to Courses</span>
            </Link>
          </div>

          {/* hero */}
          {courseData && courseData}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CourseDetail;
