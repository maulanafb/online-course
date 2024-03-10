"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { parse } from "cookie";
import FormatRupiah from "@/lib/formatter";

interface Lesson {
  ID: number;
  Title: string;
  Content: string;
  IsFree: boolean;
  MentorNote: string;
  IsCompleted: boolean;
  ChapterID: number;
  CreatedAt: string;
  UpdatedAt: string;
}

interface Chapter {
  ID: number;
  Title: string;
  CourseID: number;
  Lessons: Lesson[];
  CreatedAt: string;
  UpdatedAt: string;
}

interface CourseImage {
  ID: number;
  CourseID: number;
  FileName: string;
  IsPrimary: number;
  CreatedAt: string;
  UpdatedAt: string;
}

interface Mentor {
  ID: number;
  Email: string;
  Name: string;
  Image: string;
  Password: string;
  Role: string;
  CreatedAt: string;
  UpdatedAt: string;
}

interface CourseData {
  ID: number;
  Name: string;
  Slug: string;
  Price: number;
  Level: string;
  Description: string;
  MentorID: number;
  CategoryID: number;
  Category: {
    ID: number;
    Title: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  Chapter: Chapter[];
  Mentor: Mentor;
  CourseImage: CourseImage[];
  CreatedAt: string;
  UpdatedAt: string;
}

const CheckoutPage = () => {
  const params = useParams();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getData(params.slug);
        setCourseData(fetchedData.data);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section className="max-w-[1000px] flex mx-auto justify-center py-10">
      <div className="flex flex-col items-center w-4/5 gap-5">
        <h1 className="text-title">Checkout Course</h1>
        <div className="text-center tracking-tight font-medium text-[16px] text-gray-600">
          {courseData?.Description}
        </div>
        <div className="flex w-4/5 justify-center items-center bg-white rounded-xl">
          <div className="flex justify-evenly flex-col p-5 gap-3">
            <h1>Special benefits for you</h1>
            <div className="flex justify-center items-center gap-2 border-2 rounded-lg p-2">
              <div>Testing testing yuhu</div>
              <CheckCircle2Icon color="#16a34a" width={30} height={30} />
            </div>
          </div>
        </div>
        <div className="flex flex-col  w-4/5 p-5 gap-5 bg-white rounded-2xl py-5 my-5">
          <h1>Payment Details</h1>

          <div key={courseData?.ID} className="flex justify-between">
            <span>Course name</span>
            <span>{courseData?.Name}</span>
          </div>
          <div key={courseData?.ID} className="flex justify-between">
            <span>Course Price</span>
            <span>{FormatRupiah(courseData!.Price)}</span>
          </div>

          <Button
            onClick={() => payCourse(params.slug)}
            className="font-semibold text-[16px] py-3 rounded-2xl"
          >
            Pay & Elevate Your Skills
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;

const payCourse = async (params: any) => {
  console.log(params);
  const cookies = parse(document.cookie);
  const token = cookies.CC_COOKIES;

  try {
    const response = await fetch(
      `http://192.168.18.33:8088/api/v1/transactions/${params}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to initiate payment");
    }

    const responseData = await response.json();
    const paymentURL = responseData.data.PaymentURL;

    // Buka link paymentURL dalam jendela baru
    window.open(paymentURL, "_blank");
  } catch (error) {
    console.error("Error initiating payment:", error);
    // Handle the error, mungkin menampilkan pesan error kepada pengguna
  }
};
async function getData(slug: string | string[] | undefined) {
  try {
    const response = await fetch(
      `http://192.168.18.33:8088/api/v1/course/${slug}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to handle it at the calling site
  }
}
