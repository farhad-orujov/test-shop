"use client";

import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { beniga } from "@/app/fonts";

interface InfocardProps {
  classname?: string;
  title: string;
  text: string;
  // optional expanded info to show inside the modal. If not provided we reuse `text`.
  details?: string;
}

export const Infocard: React.FC<InfocardProps> = ({ classname, title, text, details }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className={clsx("flex flex-col justify-between w-full min-h-48 sm:h-72 border-1 rounded-[30px] px-6 py-3 bg-white", classname)}>
        <h1 className={clsx("text-[24px] font-bold h-20 uppercase", beniga.className)}>{title}</h1>
        <p className="flex-grow mt-4">{text}</p>
        <button onClick={() => setOpen(true)} className="mt-auto font-bold text-rose-400 hover:underline">More</button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-[90%] max-w-2xl bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-start gap-4">
              <h3 className={clsx("text-2xl font-bold", beniga.className)}>{title}</h3>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-800 font-bold"
              >
                ×
              </button>
            </div>
            <div className="mt-4 text-gray-700">
              <p>{details || text}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setOpen(false)} className="px-4 py-2 bg-rose-800 text-white rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};