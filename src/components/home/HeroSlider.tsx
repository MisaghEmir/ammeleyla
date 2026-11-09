"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  {
    image: "/images/hero/hero-1.png",
    smallText: "کالکشن جدید",
    title: "برای هر قدم",
    highlight: "یک انتخاب خاص",
    description: "از استایل روزمره تا استایل‌های خاص",
    button: "خرید کنید",
  },
  {
    image: "/images/hero/hero-2.webp",
    smallText: "استایل زنانه",
    title: "زیبایی را",
    highlight: "متفاوت تجربه کن",
    description: "جدیدترین مدل‌های زنانه عمه لیلا",
    button: "مشاهده محصولات",
  },
  {
    image: "/images/hero/hero-3.webp",
    smallText: "تخفیف ویژه",
    title: "انتخابی برای",
    highlight: "استایل تو",
    description: "محصولات منتخب با قیمت ویژه",
    button: "مشاهده تخفیف‌ها",
  },
];

export default function HeroSlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  /*
   * وقتی اسلاید با فلش یا swipe عوض شد،
   * نقطه فعال هم تغییر می‌کند.
   */
  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return;

    setCurrent(carouselApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;

    onSelect(api);

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  /*
   * کلیک روی نقطه
   */
  const goToSlide = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <section className="w-full bg-white">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          direction: "rtl",
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.title} className="pl-0">
              <div className="relative h-[330px] w-full overflow-hidden sm:h-[500px] lg:h-[390px]">
                {/* IMAGE */}

                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />

                {/* Overlay */}

                <div className="absolute inset-0 bg-gradient-to-l from-black/45 via-black/10 to-transparent" />

                {/* CONTENT */}
                <h1>
                  {slide.title}
                </h1>

                <div className="absolute inset-0">
                  <div className="mx-auto flex h-full max-w-7xl items-center px-6 sm:px-10 lg:px-16">
                    <div className="mr-auto max-w-[460px] text-right text-white"></div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Previous */}

        <CarouselPrevious
          className="
             right-22
            left-auto
            bottom-2
            top-auto
            h-11
            w-11
            -translate-y-1/2
            rounded-full
            border-0
            bg-white/90
            text-black
            shadow-lg
            hover:bg-[#f72568]
            hover:text-white
          "
        />

        {/* Next */}

        <CarouselNext
          className="
            left-9
            right-10
            bottom-2
            top-auto
            h-11
            w-11
            -translate-y-1/2
            rounded-full
            border-0
            bg-white/90
            text-black
            shadow-lg
            hover:bg-[#f72568]
            hover:text-white
          "
        />

        {/* =========================
            DOTS
        ========================= */}

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`رفتن به اسلاید ${index + 1}`}
              onClick={() => goToSlide(index)}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span
                className={`
                  block rounded-full transition-all duration-300
                  ${
                    current === index
                      ? "h-2.5 w-8 bg-white shadow-md"
                      : "h-2.5 w-2.5 bg-white/60 hover:bg-white"
                  }
                `}
              />
            </button>
          ))}
        </div>
      </Carousel>
    </section>
  );
}
