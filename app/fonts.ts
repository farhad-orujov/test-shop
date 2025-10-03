// app/fonts.ts
import localFont from "next/font/local";

export const tilda = localFont({
  src: [
    {
      path: "../public/fonts/TildaSans-VF.woff2",
    },
  ],
  variable: "--font-tilda",
});


export const beniga = localFont({
  src: [
    {
      path: "../public/fonts/Beniga.otf",
    },
  ],
  variable: "--font-beniga",
});