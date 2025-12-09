"use client";

import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function ImageCarousel({ images }: { images: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbApi?.scrollTo(index);
  }, [emblaApi, thumbApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = () =>
    setSelectedIndex((i) => (i + 1) % images.length);

  const prevImage = () =>
    setSelectedIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  return (
    <div className="w-full">

      {/* MAIN CAROUSEL */}
      <div ref={emblaRef} className="overflow-hidden rounded-xl shadow-lg mb-4">
        <div className="flex">
          {images.map((src, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] h-72 md:h-96 relative cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <img src={src} className="w-full h-full object-cover rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* THUMB STRIP */}
      <div ref={thumbRef} className="overflow-hidden">
        <div className="flex gap-3">
          {images.map((src, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-20 w-28 rounded-lg overflow-hidden border-2 transition ${
                index === selectedIndex
                  ? "border-blue-600 scale-105"
                  : "border-gray-300 opacity-70 hover:opacity-100"
              }`}
            >
              <img src={src} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">

          {/* CLOSE */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          {/* IMAGE */}
          <img
            src={images[selectedIndex]}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />

          {/* LEFT ARROW */}
          <button
            onClick={prevImage}
            className="absolute left-6 text-white text-5xl"
          >
            ‹
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={nextImage}
            className="absolute right-6 text-white text-5xl"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
