"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "./authContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { PlayCircle } from "lucide-react";

const CourseSidebar = ({ className, chapterData }: any) => {
  console.log(chapterData);
  return (
    <div
      className={`flex flex-col px-5 py-10 bg-white rounded-[30px] h-screen max-h-[86%] gap-5 overflow-y-scroll shadow-lg  scrollbar-hided w-[400px] ${className}`}
    >
      <Accordion type="single" collapsible className="w-full ">
        {chapterData
          ? chapterData.map((chapter: any, i: any) => (
              <AccordionItem key={chapter.CreatedAt} value={chapter.ID}>
                <AccordionTrigger>{chapter.Title}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col py-1 gap-3">
                    {chapter.Lessons.map((l: any, index: any) => (
                      <Link
                        key={l.Title}
                        href={`${l.Content}`}
                        className="flex gap-2 bg-primary w-full rounded-r-xl rounded-l-xl px-3 py-2 text-white "
                      >
                        <PlayCircle /> {l.Title}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))
          : "Loading"}
      </Accordion>
    </div>
  );
};

export default CourseSidebar;
