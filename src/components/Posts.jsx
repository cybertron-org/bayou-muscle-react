
import React from 'react';

const instaImgs = [
  "/images/p1.png",
  "/images/p2.png",
  "/images/p3.png",
  "/images/p4.png",
  "/images/p5.png",
];

export default function InstagramSection() {
  return (
    <section className="hm-section hm-insta">
      <div className="text-center">
        <button className="hm-insta__label">
          Check out our Instagram @BaYou Muscle
        </button>
      </div>
      <div className="hm-insta__grid">
        {instaImgs.map((src, i) => (
          <div key={i} className="hm-insta__item">
            <img src={src} alt={`Instagram ${i + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}