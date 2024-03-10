import FormatRupiah from "@/lib/formatter";
import Image from "next/image";
import Link from "next/link";

export async function getData(slug: string | string[] | undefined) {
  try {
    const response = await fetch(
      `http://192.168.18.33:8088/api/v1/course/${slug}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching data:");
    throw error; // Re-throw the error to handle it at the calling site
  }
}

export async function fetchData(slug: string | string[] | undefined) {
  try {
    const courseData = await getData(slug);
    const course = courseData.data;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto max-w-[1240px] py-10">
        {/* left */}
        <div className="md:order-last">
          <Image
            src={"/course1.jpg"}
            className="rounded-sm md:rounded-[20px] mx-auto md:mx-0"
            alt="course"
            width={1000}
            height={1000}
          />
        </div>
        <div className="md:order-first flex flex-col gap-4">
          <h1 className="md:text-start text-[30px] md:text-[60px] font-[600] text-[#050505] leading-[33px] md:leading-[55px] tracking-tighter md:py-2">
            {course.Name}
          </h1>
          <h2>
            <span>By</span>
            {"    "}
            <span className="text-[25px] font-[600]">{course.Mentor.Name}</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[#8d8c8c] text-[14px] font-bold tracking-tighter line-through animate-blink">
              {FormatRupiah(400000)}
            </span>
            <span className="text-[#fa5d29] font-bold tracking-tighter">
              {FormatRupiah(200000)}
            </span>
          </div>
          <Link
            href={`/checkout/${slug}`}
            className={`max-w-[250px] md:max-w-[345px] font-[600] py-2 text-[18px] tracking-tighter bg-primary text-white text-center rounded-xl`}
          >
            Buy Course
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch data:");
    // Handle the error, maybe show an error message to the user
  }
}
