import React, { useState, useRef, useEffect } from "react";
import styles from "./Carousel.module.css";

const slidesData = [
  { id: 1, bgClass: styles.placeholder1, alt: "Слайд 1" },
  { id: 2, bgClass: styles.placeholder2, alt: "Слайд 2" },
  { id: 3, bgClass: styles.placeholder3, alt: "Слайд 3" },
];

const Carousel = () => {
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const startXRef = useRef(0);
  const deltaXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const goTo = (i) => {
    const newIndex = (i + slidesData.length) % slidesData.length;
    setIndex(newIndex);
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Свайп
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX || e.touches[0].clientX;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const currentX = e.clientX || e.touches[0].clientX;
    deltaXRef.current = currentX - startXRef.current;
    trackRef.current.style.transition = "0ms";
    trackRef.current.style.transform = `translateX(${
      -index * 100 + (deltaXRef.current / trackRef.current.clientWidth) * 100
    }%)`;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const threshold = trackRef.current.clientWidth * 0.12;
    if (Math.abs(deltaXRef.current) > threshold) {
      deltaXRef.current < 0 ? next() : prev();
    } else {
      trackRef.current.style.transition = "480ms ease";
      trackRef.current.style.transform = `translateX(${-index * 100}%)`;
    }
    deltaXRef.current = 0;
  };

  useEffect(() => {
    trackRef.current.style.transition = "480ms ease";
    trackRef.current.style.transform = `translateX(${-index * 100}%)`;
  }, [index]);

  return (
    <section className={styles.carousel}>
      {/* Фиксированный текст */}
      <div className={styles.overlay}>
        <h1 className={styles.title}>Автополив</h1>
        <p className={styles.subtitle}>под ключ</p>
      </div>

      {/* Кнопки */}
      <button className={styles.btn + " " + styles.prev} onClick={prev} aria-label="Предыдущий слайд">
        &#10094;
      </button>
      <button className={styles.btn + " " + styles.next} onClick={next} aria-label="Следующий слайд">
        &#10095;
      </button>

      {/* Лента слайдов */}
      <div
        className={styles.track}
        ref={trackRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        {slidesData.map((slide) => (
          <div key={slide.id} className={`${styles.slide} ${slide.bgClass}`} role="group" aria-label={`${slide.id} из ${slidesData.length}`} />
        ))}
      </div>

      {/* Индикаторы */}
      <div className={styles.indicators}>
        {slidesData.map((_, i) => (
          <button
            key={i}
            className={styles.dot}
            aria-current={index === i ? "true" : "false"}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;
