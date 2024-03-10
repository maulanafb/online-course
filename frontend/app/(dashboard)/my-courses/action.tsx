import { parse } from "cookie";

export async function getData() {
  // Get the Bearer token from cookies
  const cookies = parse(document.cookie);
  const token = cookies.CC_COOKIES;

  try {
    const response = await fetch(
      `http://192.168.18.33:8088/api/v1/course/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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

export async function fetchData() {
  try {
    const courseData = await getData();
    console.log("Course Data:", courseData);
    return courseData.data;
  } catch (error) {
    console.error("Failed to fetch data:");
    // Handle the error, maybe show an error message to the user
  }
}
