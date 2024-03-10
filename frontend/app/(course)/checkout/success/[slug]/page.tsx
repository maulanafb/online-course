"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchData } from "./action";
import { useParams } from "next/navigation";
import confetti from "canvas-confetti";

const SuccessPage = () => {
  const [courseData, setCourseData] = useState<any>(null);
  const params = useParams();
  const handleConvetti = () => {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: any, max: any) {
      return Math.random() * (max - min) + min;
    }

    var interval: any = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };
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
    handleConvetti();
  }, [params.slug]);

  console.log(courseData);
  return (
    <section className="flex flex-col w-screen h-screen pt-5 pb-10">
      <div className="flex flex-col justify-center items-center gap-5">
        <div>
          <Image
            src={"/success.svg"}
            height={700}
            width={700}
            alt="success image"
          />
        </div>
        <span className="text-title">Payment Success</span>
        <span className="max-w-md text-center">
          Congratulations on unlocking the door to your future success! 🌟 Your
          journey to skill elevation begins now. Let's dive in and shape a
          brighter tomorrow together! 🚀
        </span>

        {/* <Link
          href={`/my-courses/introduction-to-programming-2024-02-16/xvFZjo5PgG0`}
          className="bg-primary px-3 py-2 rounded-md text-white text-center text-[16px]"
        >
          Let's Start ▶
        </Link> */}

        {courseData ? (
          <Link
            href={
              courseData.Chapter[0]?.Lessons[0]?.Content
                ? `/my-courses/${courseData.Slug}/${courseData.Chapter[0].Lessons[0].Content}`
                : "#"
            }
            className="bg-primary px-3 py-2 rounded-md text-white text-center text-[16px]"
          >
            Let's Start ▶
          </Link>
        ) : (
          "Loading..."
        )}
      </div>
    </section>
  );
};

export default SuccessPage;
