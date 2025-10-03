import styles from "./scrollingtext.module.css";
import clsx from "clsx";

export default function ScrollingText() {
  // Массив для повторения прямоугольников
  const items = [
    { text: "Discounts", color: "rect_gray" },
    { text: "Rectangle 2", color: "rect_pink" },
  ];
  // Делаем длинную ленту из 20 пар (можно увеличить для большей плавности)
  const repeatCount = 20;
  const repeated = Array.from({ length: repeatCount }, (_, i) => items[i % 2]);
  // Дублируем массив для бесшовной анимации
  const seamless = [...repeated, ...repeated];
  return (
    <div className={clsx(styles.scrolling_text)}>
      <div className={styles.scrolling_track}>
        {seamless.map((item, idx) => (
          <div className={clsx(styles.rect, styles[item.color])} key={idx}>{item.text}</div>
        ))}
      </div>
    </div>
  );
}
