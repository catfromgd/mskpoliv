import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Carousel({ slides, autoplaySpeed = 3000 }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed,
    pauseOnHover: true,
    arrows: true,
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <Slider {...settings}>
        {slides.map((slide, idx) => (
          <div key={idx}>
            {/* Можно принимать как картинки, так и любой JSX */}
            {typeof slide === "string" ? (
              <img
                src={slide}
                alt={`slide-${idx}`}
                style={{ width: "100%", borderRadius: 8 }}
              />
            ) : (
              slide
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
}
