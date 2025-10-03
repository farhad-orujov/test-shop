import Image from "next/image";
import SearchBox from "./components/ui/searchbox/searchbox";
import { Infocard } from "./components/ui/infocard/infocard";
import ScrollingText from "./components/ui/scrollingtext";
import { beniga, tilda } from "./fonts";
import clsx from "clsx";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="container mx-auto">
        <div className="flex justify-center items-center w-4/6 mx-auto mt-12">
          <h1
            className={clsx(
              beniga.className,
              "lg:text-6xl text-4xl font-bold text-neutral-900 text-center"
            )}
          >
            IMMERSE YOURSELF IN A{" "}
            <span className="text-rose-800">WORLD OF FASHION</span> THAT FITS
            YOUR LIFESTYLE
          </h1>
        </div>
        <div className="flex flex-col-reverse lg:flex-row justify-center items-center mt-12 gap-8 px-4">
          <div
            className={clsx(
              beniga.className,
              "w-full lg:w-80 text-center lg:text-left text-3xl pt-3 px-4 lg:px-0 lg:pl-7 mt-1 border-2 border-zinc-300 rounded-[30px] font-black flex-shrink-0"
            )}
          >
            <h2>BRAND CLOTHINGS</h2>
            <p className={clsx(tilda.className, "font-medium text-xl mt-4")}>
              For the stylish
              <br />
              For the strong
              <br />
              For the fashionable
              <br />
              For the bold
              <br />
              For the trendy
              <br />
              For the you
              <br />
            </p>

            <Link href={"/catalog"}>
              <button className="mt-13 mb-4 bg-rose-800 text-xl text-white px-7 py-2 rounded-[20px] hover:bg-gray-800 transition">
                GO TO THE CATALOG
              </button>
            </Link>
          </div>
          <img
            src="/Item1.png"
            alt="Collage"
            className="w-full max-w-[800px] h-auto flex-shrink"
          />
        </div>
      </main>
      <div className={clsx(tilda.className, "w-screen mt-12")}>
        <ScrollingText />
      </div>
      <div className="w-full mt-12 flex justify-center">
        <h2
          className={clsx(
            beniga.className,
            "lg:text-6xl text-4xl font-bold text-neutral-900 text-center"
          )}
        >
          OUR CLIENTS TRUST US
        </h2>
      </div>
      <div className="container mx-auto w-full flex flex-col lg:flex-row justify-center px-4 mt-12 mb-12 gap-4">
        <div className="w-full lg:w-4/6">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div className="w-full lg:w-1/3">
                <Infocard
                  classname=""
                  title="Free Delivery"
                  text="We use all popular types of delivery"
                />
              </div>
              <div className="w-full lg:w-[350px]">
                <img
                  src="/Item2.jpg"
                  alt=""
                  className="w-full h-48 sm:h-64 xl:object-fill lg:block hidden"
                />
              </div>
              <div className="w-full lg:w-1/3 mb-4 lg:mb-0">
                <Infocard
                  classname=""
                  title="Returns & Exchanges"
                  text="All products are provided with a manufacturer's warranty."
                />
              </div>
            </div>
            <div className="w-full">
              <Infocard
                classname=""
                title="online payment"
                text="You can easily and quickly pay for your order by credit card directly through our website. We'll ensure your data is securely protected so you can focus on choosing the perfect look."
              />
            </div>
          </div>
        </div>
        <div className="lg:w-[300px] flex items-center max-h-[200px] lg:block hidden justify-center">
          <img src="/Item3.jpg" alt="" />
        </div>
      </div>
    </>
  );
}
