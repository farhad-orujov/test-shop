import clsx from "clsx";
import React from "react";
import { beniga } from "@/app/fonts";

interface InfocardProps {
    classname?: string;
    title: string;
    text: string;
}

export const Infocard: React.FC<InfocardProps> = ({ classname, title, text }) => {
  return (
    <>
        <div className={clsx("flex flex-col justify-between w-full min-h-48 sm:h-72 border-1 rounded-[30px] px-6 py-3", classname)}>
            <h1 className={clsx("text-[24px] font-bold h-20 uppercase", beniga.className)}>{title}</h1>
            <p className="flex-grow mt-4">{text}</p>
            <button className="mt-auto font-bold text-rose-400">More</button>
        </div>
    </>
  );
}