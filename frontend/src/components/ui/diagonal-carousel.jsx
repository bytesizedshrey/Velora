"use client";;
import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_TRANSITION = {
  type: "spring",
  bounce: 0.16,
  duration: 0.85,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function DiagonalCarousel({
  items,
  activeIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  loop = false,
  slideSize = 260,
  rotationStep = 30,
  verticalStep = 120,
  inactiveScale = 0.6,
  transition = DEFAULT_TRANSITION,
  showControls = true,
  showDots = true,
  viewportClassName,
  slideClassName,
  imageClassName,
  labelClassName,
  controlsClassName,
  className,
  onKeyDown,
  tabIndex,
  ...props
}) {
  const maxIndex = Math.max(0, items.length - 1);
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(() =>
    clamp(defaultActiveIndex, 0, maxIndex));
  const currentIndex = clamp(activeIndex ?? uncontrolledIndex, 0, maxIndex);
  const safeSlideSize = Math.max(120, slideSize);
  const safeInactiveScale = clamp(inactiveScale, 0.35, 1);

  const selectSlide = React.useCallback((nextIndex) => {
    if (!items.length) {
      return;
    }

    const resolvedIndex = loop
      ? (nextIndex + items.length) % items.length
      : clamp(nextIndex, 0, maxIndex);

    if (activeIndex === undefined) {
      setUncontrolledIndex(resolvedIndex);
    }

    onActiveIndexChange?.(resolvedIndex);
  }, [activeIndex, items.length, loop, maxIndex, onActiveIndexChange]);

  const handleKeyDown = (event) => {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectSlide(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectSlide(currentIndex + 1);
    }
  };

  if (!items.length) {
    return null;
  }

  const isPreviousDisabled = !loop && currentIndex === 0;
  const isNextDisabled = !loop && currentIndex === maxIndex;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Diagonal image carousel"
      tabIndex={tabIndex ?? 0}
      onKeyDown={handleKeyDown}
      className={cn("relative isolate h-full w-full overflow-hidden", className)}
      {...props}>
      <div className={cn("absolute inset-0 overflow-hidden", viewportClassName)}>
        <motion.div
          className="absolute left-1/2 top-[30%] flex w-fit"
          animate={{ x: -(currentIndex * safeSlideSize + safeSlideSize / 2) }}
          transition={transition}>
          {items.map((item, index) => {
            const isActive = currentIndex === index;
            const distance = index - currentIndex;

            return (
              <motion.div
                key={`${item.src}-${index}`}
                className={cn(
                  "flex shrink-0 flex-col items-center gap-2 will-change-transform",
                  slideClassName
                )}
                style={{ width: safeSlideSize }}
                animate={{
                  rotate: distance * rotationStep,
                  scale: isActive ? 1 : safeInactiveScale,
                  y: distance * verticalStep,
                }}
                transition={transition}>
                <motion.p
                  className={cn("whitespace-nowrap text-sm", labelClassName)}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.3 }}>
                  {item.title}
                </motion.p>
                <button
                  type="button"
                  aria-label={`Show ${item.title}`}
                  aria-current={isActive ? "true" : undefined}
                  className="aspect-square w-full cursor-pointer"
                  onClick={() => selectSlide(index)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.alt ?? item.title}
                    draggable={false}
                    className={cn(
                      "h-full w-full select-none rounded-2xl object-cover shadow-xl",
                      imageClassName
                    )} />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      {showControls && (
        <div
          className={cn(
            "absolute inset-x-4 bottom-5 z-10 mx-auto flex w-fit items-center justify-center gap-3 rounded-full border-t border-l border-white/20 border-r border-b border-black/90 bg-gradient-to-b from-[#1e1e24] to-[#0d0d10] px-3 py-1 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.8),0_10px_24px_rgba(0,0,0,0.95)] backdrop-blur-md",
            controlsClassName
          )}>
          <button
            type="button"
            aria-label="Show previous slide"
            disabled={isPreviousDisabled}
            className="inline-flex size-8 items-center justify-center rounded-full transition-all hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => selectSlide(currentIndex - 1)}>
            <ChevronLeft className="size-4 text-white/90" />
          </button>

          {showDots && (
            <div className="flex items-center justify-center gap-2 px-1">
              {items.map((item, index) => (
                <button
                  key={`${item.title}-${index}`}
                  type="button"
                  aria-label={`Show slide ${index + 1}: ${item.title}`}
                  aria-current={currentIndex === index ? "true" : undefined}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    currentIndex === index
                      ? "w-7 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      : "w-2 bg-white/20 hover:bg-white/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"
                  )}
                  onClick={() => selectSlide(index)} />
              ))}
            </div>
          )}

          <button
            type="button"
            aria-label="Show next slide"
            disabled={isNextDisabled}
            className="inline-flex size-8 items-center justify-center rounded-full transition-all hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => selectSlide(currentIndex + 1)}>
            <ChevronRight className="size-4 text-white/90" />
          </button>
        </div>
      )}
    </div>
  );
}

export default DiagonalCarousel;
