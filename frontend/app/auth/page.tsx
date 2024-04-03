"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import axios from "axios";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  CredentialResponse,
} from "@react-oauth/google";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useRouter } from "next/navigation";
import { fetchUserData, useAuth } from "@/components/shared/authContext";
import Navbar from "@/components/shared/Navbar";
import { useEffect, useState } from "react";

const loginFormSchema = z
  .object({
    emailAddress: z.string().email(),
    password: z.string().min(6),
    passwordConfirm: z.string().min(6),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirm;
    },
    {
      message: "Password do not match",
      path: ["passwordConfirm"],
    }
  );
const registerFormSchema = z
  .object({
    fullName: z.string().min(3),
    emailAddress: z.string().email(),
    password: z.string().min(6),
    passwordConfirm: z.string().min(6),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirm;
    },
    {
      message: "Password do not match",
      path: ["passwordConfirm"],
    }
  );

export default function AuthPage() {
  const [token, setToken] = useState("");
  const { userData } = useAuth();

  const router = useRouter();
  if (userData || userData != undefined) {
    router.replace("/");
  }
  console.log(userData);
  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const tokenId = credentialResponse.credential;
      const backendResponse = await axios.get(
        `http://localhost:8088/api/v1/auth/google/callback?tokenId=${tokenId}`
      );
      const token = backendResponse.data.token;
      localStorage.setItem("token", token);
      Cookies.set("CC_COOKIES", token, {
        expires: 7,
      });
      setToken(token);
      router.replace("/");
      location.reload();
    } catch (error) {
      console.error("Login dengan Google gagal:");
    }
  };

  const formLogin = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
      passwordConfirm: "",
    },
  });
  const formRegister = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      emailAddress: "",
      password: "",
      passwordConfirm: "",
    },
  });
  const handleLogin = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const res = await fetch("http://localhost:8088/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.emailAddress,
          password: values.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data.data);

        // Set the cookie on successful login
        Cookies.set("CC_COOKIES", data.data.token, {
          expires: 7,
          // path: "/",
        });

        console.log("Login successful!");
        toast("Login Success"); // Update with your desired redirect path
        fetchUserData();
        router.replace("/"); // Redirect to the desired path after successful login
        location.reload();
      } else {
        if (res.status === 422) {
          // Handle validation errors
          const errorData = await res.json();
          console.error("Login failed:", errorData.error);
          toast("Validation error: " + errorData.error);
        } else {
          // Handle other login failures
          const errorData = await res.json();
          console.error("Login failed:", errorData.error);
          toast("Login failed: " + errorData.error);
        }
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const handlerRegister = async (
    values: z.infer<typeof registerFormSchema>
  ) => {
    try {
      const res = await fetch("http://localhost:8088/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.emailAddress,
          name: values.fullName,
          password: values.password,
          passwordConfirm: values.passwordConfirm,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        // Set the cookie on successful registration
        Cookies.set("CC_COOKIES", data.data.token, {
          expires: 7,
        });

        console.log("Registration successful!");
        toast("Registration Success"); // Update with your desired redirect path
        fetchUserData();
        router.replace("/"); // Redirect to the desired path after successful login
        location.reload();
      } else {
        if (res.status === 422) {
          // Handle validation errors
          const errorData = await res.json();
          console.error("Registration failed:", errorData.error);
          toast("Validation error: " + errorData.error);
        } else {
          // Handle other registration failures
          const errorData = await res.json();
          console.error("Registration failed:", errorData.error);
          toast("Registration failed: " + errorData.error);
        }
      }
    } catch (error) {
      console.error("An error occurred during registration:", error);
    }
  };
  useEffect(() => {
    router.refresh();
  }, [token]);
  return (
    <>
      <Navbar />
      <main className="container flex min-h-screen flex-col items-center justify-between py-4">
        <Tabs
          defaultValue="signin"
          className="max-w-md w-full space-y-2 rounded-2xl"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Login</TabsTrigger>
            <TabsTrigger value="signup">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className="max-w-md w-full  rounded-2xl">
              <CardHeader>
                <CardTitle>Login Form</CardTitle>
                <CardDescription>Let&apos;s join with usss</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...formLogin}>
                  <form
                    onSubmit={formLogin.handleSubmit(handleLogin)}
                    className="max-w-md w-full flex flex-col gap-4"
                  >
                    <FormField
                      control={formLogin.control}
                      name="emailAddress"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Email Address"
                                type="email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={formLogin.control}
                      name="password"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="password"
                                type="password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={formLogin.control}
                      name="passwordConfirm"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Password Confirm</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Password Confirm"
                                type="password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <div className="flex flex-col justify-center items-center gap-2 w-full">
                      <Button type="submit" className="w-full">
                        Login
                      </Button>
                      <div className="flex items-center gap-2">
                        <div className="flex-grow h-[1px] bg-gray-400"></div>
                        <span className="text-gray-500 text-[14px]">
                          login or register with google
                        </span>
                        <div className="flex-grow h-[1px] bg-gray-400"></div>
                      </div>
                      <GoogleOAuthProvider clientId="555809304379-gqicb9q9fcc9iererv73cmpeuo0jp7p3.apps.googleusercontent.com">
                        <div>
                          <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() =>
                              console.log("Login dengan Google gagal")
                            }
                          />
                        </div>
                      </GoogleOAuthProvider>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="max-w-md w-full  rounded-2xl">
              <CardHeader>
                <CardTitle>Register Form</CardTitle>
                <CardDescription>Let&apos;s join with us</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...formRegister}>
                  <form
                    onSubmit={formRegister.handleSubmit(handlerRegister)}
                    className="max-w-md w-full flex flex-col gap-4"
                  >
                    <FormField
                      control={formRegister.control}
                      name="emailAddress"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Email Address"
                                type="email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={formRegister.control}
                      name="fullName"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Fullname</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Your Fullname"
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={formRegister.control}
                      name="password"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="password"
                                type="password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={formRegister.control}
                      name="passwordConfirm"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Password Confirm</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Password Confirm"
                                type="password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <div className="flex flex-col justify-center items-center gap-2 w-full">
                      <Button type="submit" className="w-full">
                        Register
                      </Button>
                      <div className="flex items-center gap-2">
                        <div className="flex-grow h-[1px] bg-gray-400"></div>
                        <span className="text-gray-500 text-[14px]">
                          login or register with google
                        </span>
                        <div className="flex-grow h-[1px] bg-gray-400"></div>
                      </div>
                      <GoogleOAuthProvider clientId="555809304379-gqicb9q9fcc9iererv73cmpeuo0jp7p3.apps.googleusercontent.com">
                        <div>
                          <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() =>
                              console.log("Login dengan Google gagal")
                            }
                          />
                        </div>
                      </GoogleOAuthProvider>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
