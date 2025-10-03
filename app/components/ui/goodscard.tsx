import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { beniga, tilda } from "@/app/fonts";
import RatingStars from "./ratingstars";
import { Tags } from "./tags";
import { useRouter } from "next/navigation";

interface GoodsCardProps {
  classname?: string;
  pathtoimg: string;
  alt: string;
  rating: number;
  price: number;
  originalprice?: number;
  tags?: string[];
}

export const GoodsCard: React.FC<GoodsCardProps> = ({
  classname,
  pathtoimg,
  alt,
  rating,
  price,
  originalprice,
  tags,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    const productData = {
      id: alt.toLowerCase().replace(/\s+/g, "-"),
      name: alt,
      price: price,
      originalPrice: originalprice,
      rating: rating,
      image: pathtoimg,
      tags: tags || [],
    };

    router.push(
      `/catalog/${productData.id}?data=${encodeURIComponent(
        JSON.stringify(productData)
      )}`
    );
  };

  return (
    <>
      <div onClick={handleCardClick} className="cursor-pointer">
        <section
          className={clsx(
            "w-70 h-full rounded-[30px] border-2 border-zinc-200 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-zinc-600/50 m-4 sm:m-8 md:m-4",
            classname
          )}
        >
          <div className="w-full h-10 flex justify-between">
            <div className="pt-2 pl-6">{tags && <Tags tags={tags} />}</div>
            <Image
              src="/heart.svg"
              alt="heart"
              width={20}
              height={20}
              className="mt-3 mr-3"
            />
          </div>
          <div className="h-50 overflow-hidden border-t-2 border-b-2 border-zinc-200">
            <Image
              src={pathtoimg}
              alt={alt}
              width={400}
              height={100}
              className={clsx("", classname)}
            />
          </div>
          <div className="pl-6">
            <h2
              className={clsx(
                "font-bold text-lg mt-6 uppercase",
                tilda.className
              )}
            >
              {alt}
            </h2>
            <p className="mb-2 mt-1">type</p>
            <div className="flex">
              <RatingStars value={rating} />
              <p className="ml-2">{rating}</p>
            </div>
            <div className={clsx("mt-2", beniga.className)}>
              {price} AZN{" "}
              {originalprice ? (
                <span className="text-sm text-zinc-400 line-through">
                  {originalprice} USD
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
