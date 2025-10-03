import { Star } from "lucide-react";

type RatingProps = {
  value: number; // рейтинг (например, 4)
  max?: number;  // максимальное число звёзд
};

export default function RatingStars({ value, max = 5 }: RatingProps) {
  return (
    <div className="flex gap-1 mt-[1px]">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={i < value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}
