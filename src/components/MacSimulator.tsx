import { useState, useEffect, useRef, useCallback } from "react";
import { emitter } from "../lib/emitter";
import {
  useTimeStore,
  getHours,
  getMinutes,
  getAmpm,
  getDateString,
  getIsNight,
} from "../stores/time";
import { usePlaylistStore } from "../stores/playlist";
import DynamicIsland from "./DynamicIsland";

export default function MacSimulator() {
  const now = useTimeStore((s) => s.now);
  const startTime = useTimeStore((s) => s.start);
  const stopTime = useTimeStore((s) => s.stop);

  const getTracks = usePlaylistStore((s) => s.getTracks);
  const preloadTrackArt = usePlaylistStore((s) => s.preloadTrackArt);
  const play = usePlaylistStore((s) => s.play);
  const dispose = usePlaylistStore((s) => s.dispose);

  const hours = getHours(now);
  const minutes = getMinutes(now);
  const ampm = getAmpm(now);
  const dateString = getDateString(now);
  const currentTemperature = getIsNight(now) ? 16 : 24;

  const [isLocked, setIsLocked] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroClipPath, setHeroClipPath] = useState<string | null>(null);
  const [hintActive, setHintActive] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageContainer2Ref = useRef<HTMLDivElement>(null);
  const unlockTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hintIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Parallax
  const parallaxY = (() => {
    if (!imageRef.current || !imageContainerRef.current) return 0;
    const diff =
      imageRef.current.offsetHeight - imageContainerRef.current.offsetHeight;
    return -(scrollProgress * diff * 0.5);
  })();

  const handleScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
  }, []);

  const calculateHeroClipPath = useCallback(() => {
    const el = imageContainer2Ref.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const r = 40;
    setHeroClipPath(
      `M ${r} 0 L ${w - r} 0 Q ${w} 0 ${w} ${r} L ${w} ${h - r} Q ${w} ${h} ${w - r} ${h} L ${r} ${h} Q 0 ${h} 0 ${h - r} L 0 ${r} Q 0 0 ${r} 0 Z`,
    );
  }, []);

  const handleUnlockClick = useCallback(() => {
    if (!isLocked) return;

    if (audioContextRef.current) {
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "square";
      osc.frequency.setValueAtTime(2000, ctx.currentTime);

      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.02);
    }

    emitter.emit("toggle-live-activity", { state: false, type: "isLocked" });
    setIsLocked(false);
    preloadTrackArt();

    const t1 = setTimeout(() => {
      emitter.emit("toggle-notification", {
        state: true,
        type: "didConnectAirPods",
        duration: 3500,
      });
      const t2 = setTimeout(() => play(), 3750);
      unlockTimersRef.current.push(t2);
    }, 2000);
    unlockTimersRef.current.push(t1);
  }, [isLocked, preloadTrackArt, play]);

  // Init hint animation
  useEffect(() => {
    hintIntervalRef.current = setInterval(() => {
      setHintActive(true);
      hintTimeoutRef.current = setTimeout(() => setHintActive(false), 1000);
    }, 7000);
    return () => {
      if (hintIntervalRef.current) clearInterval(hintIntervalRef.current);
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, []);

  // Scroll + resize listeners + lifecycle
  useEffect(() => {
    audioContextRef.current = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", calculateHeroClipPath);
    requestAnimationFrame(calculateHeroClipPath);
    startTime();
    getTracks();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateHeroClipPath);
      stopTime();
      unlockTimersRef.current.forEach(clearTimeout);
      dispose();
    };
  }, [
    handleScroll,
    calculateHeroClipPath,
    startTime,
    stopTime,
    getTracks,
    dispose,
  ]);

  return (
    <section className="isolate flex w-full flex-col items-center px-0 select-none lg:px-8">
      <div
        ref={imageContainerRef}
        className="relative h-48 w-full overflow-visible sm:aspect-[2/1] sm:h-auto sm:overflow-hidden"
      >
        {/* Top Bar */}
        <div className="absolute top-0 right-0 left-0 z-20 flex justify-center sm:grid sm:grid-cols-3">
          {/* Left pill: focus mode */}
          <div className="flex p-5">
            <div
              className={`flex h-10 items-center rounded-[28px] bg-black/50 backdrop-blur-xl transition-all duration-500 ${isLocked ? "opacity-0 -translate-y-1 pointer-events-none" : "opacity-0 -translate-y-1 pointer-events-none"}`}
            >
              <div className="flex items-center space-x-2 px-4 text-white">
                <svg
                  className="size-4 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                <span className="text-[13px] font-medium whitespace-nowrap">
                  Work
                </span>
              </div>
            </div>
          </div>

          {/* Center: Dynamic Island */}
          <div className="flex justify-center p-5">
            <DynamicIsland
              isLocked={isLocked}
              notchWidth={136}
              notchHeight={40}
            />
          </div>

          {/* Right pill: time + battery */}
          <div className="flex justify-end p-5">
            <div
              className={`flex h-10 items-center justify-center space-x-3 rounded-[28px] bg-black/50 backdrop-blur-xl px-4 text-white transition-all duration-500 ${isLocked ? "opacity-0 -translate-y-1 pointer-events-none" : "opacity-0 -translate-y-1 pointer-events-none"}`}
            >
              <span className="text-[13px] font-medium whitespace-nowrap">
                {hours}:{minutes}
                <span className="hidden md:inline"> {ampm}</span>
              </span>
              <svg
                className="size-4 fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="absolute inset-0">
          <div
            className={`absolute bottom-6 z-20 flex w-full items-center justify-center transition-all duration-500 delay-300 ${isLocked ? "opacity-0 translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"}`}
          >
            <div className="flex items-center justify-center rounded-[24px] bg-black/50 backdrop-blur-xl px-4 py-2.5 space-x-2.5">
              <img
                className="size-12 object-contain"
                src="/images/dock/finder.png"
                alt="Finder"
                draggable={false}
              />
              <img
                className="size-12 object-contain"
                src="/images/dock/launchpad.png"
                alt="Launchpad"
                draggable={false}
              />
              <img
                className="size-12 object-contain"
                src="/images/dock/dyno_icon.png"
                alt="Dyno"
                draggable={false}
              />
              <img
                className="size-12 object-contain"
                src="/images/dock/music.png"
                alt="Music"
                draggable={false}
              />
              <img
                className="size-12 object-contain"
                src="/images/dock/settings.png"
                alt="Settings"
                draggable={false}
              />
            </div>
          </div>

          {/* Lock screen content */}
          <div
            className={`absolute inset-0 z-10 mt-22 mb-6 flex flex-col items-center justify-end md:justify-between lg:mt-23 transition-all duration-500 ${isLocked ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
          >
            <div className="flex flex-col items-center">
              <div className="hidden flex-col items-center text-center lg:flex">
                <div className="text-3xl font-semibold text-purple-300/85 saturate-150">
                  {dateString}
                </div>
                <div className="font-numeric text-8xl font-bold text-purple-300/90 saturate-150">
                  {hours}:{minutes}
                </div>
              </div>

              {/* Focus badge */}
              <div className="mt-3.5 hidden items-center space-x-5 font-semibold text-purple-300/90 saturate-150 lg:flex">
                <div className="relative flex w-18 items-center">
                  <div className="absolute flex w-18 items-center">
                    <div className="mr-1.5 ml-0.5 size-[18px]">
                      <svg
                        className="absolute size-[18px] fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 28 28"
                        aria-hidden="true"
                      >
                        <path d="M19.222 1C21.74 1 23 2.285 23 4.808v18.396C23 25.74 21.74 27 19.222 27H7.79C5.26 27 4 25.739 4 23.204V4.808C4 2.285 5.26 1 7.79 1zm-5.71 17.972c-4.254 0-6.247 3.42-6.247 4.717 0 .45.22.764.709.764h11.065c.501 0 .72-.315.72-.764 0-1.297-1.992-4.717-6.246-4.717m0-7.652c-1.723 0-3.106 1.492-3.106 3.287 0 1.928 1.383 3.37 3.107 3.382 1.723.012 3.105-1.455 3.105-3.383 0-1.794-1.382-3.285-3.105-3.286M10.37 3.571a.826.826 0 0 0-.83.813c0 .448.378.812.83.812h6.26c.464 0 .83-.364.83-.812a.82.82 0 0 0-.83-.813z" />
                      </svg>
                    </div>
                    <div>Work</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="relative mr-[5px] ml-0.5 size-[18px]">
                    <svg
                      className="absolute size-[18px] fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 28 28"
                      aria-hidden="true"
                    >
                      <path d="M13.668 19.691c3.258 0 5.965-2.707 5.965-5.976 0-3.281-2.707-5.988-5.965-5.988s-5.965 2.707-5.965 5.988c0 3.27 2.707 5.976 5.965 5.976M13.68 5.56c.55 0 1.008-.457 1.008-1.02V2.02C14.688 1.458 14.23 1 13.68 1a1.02 1.02 0 0 0-1.02 1.02v2.52c0 .562.457 1.019 1.02 1.019m5.742 2.402a1.03 1.03 0 0 0 1.441 0l1.793-1.793a1.04 1.04 0 0 0 0-1.441 1.026 1.026 0 0 0-1.43 0L19.423 6.53a1.026 1.026 0 0 0 0 1.43m2.379 5.754c0 .55.469 1.008 1.02 1.008h2.519c.55 0 1.008-.457 1.008-1.008s-.457-1.02-1.008-1.02h-2.52c-.55 0-1.02.47-1.02 1.02m-2.38 5.754a1.026 1.026 0 0 0 0 1.43l1.806 1.816a1.05 1.05 0 0 0 1.43-.012 1.026 1.026 0 0 0 0-1.43l-1.805-1.804a1.05 1.05 0 0 0-1.43 0M13.68 21.87c-.563 0-1.02.457-1.02 1.008v2.531c0 .55.457 1.008 1.02 1.008.55 0 1.008-.457 1.008-1.008V22.88c0-.55-.458-1.008-1.008-1.008M7.926 19.47c-.399-.375-1.055-.375-1.442 0l-1.793 1.793a1.037 1.037 0 0 0-.011 1.43 1.064 1.064 0 0 0 1.441.011l1.793-1.805a1.037 1.037 0 0 0 .012-1.43m-2.38-5.754c0-.55-.468-1.02-1.019-1.02h-2.52c-.55 0-1.007.47-1.007 1.02s.457 1.008 1.008 1.008h2.52c.55 0 1.019-.457 1.019-1.008M7.915 7.96c.387-.375.387-1.043.012-1.43L6.133 4.727c-.387-.375-1.043-.387-1.43 0-.387.398-.387 1.054-.012 1.43L6.484 7.96a1.026 1.026 0 0 0 1.43 0" />
                    </svg>
                  </div>
                  <div className="relative inline-flex tabular-nums">
                    <span>{currentTemperature}</span>
                    <span>&deg;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Press to unlock */}
            <div
              className="shimmer animate-shine cursor-pointer !bg-clip-text p-6 text-2xl font-bold text-transparent saturate-150 sm:text-lg sm:font-semibold lg:p-4"
              onClick={handleUnlockClick}
            >
              Press to unlock
            </div>
          </div>
        </div>

        {/* Wallpaper */}
        <div
          ref={imageContainer2Ref}
          className="rounded-5xl absolute top-0 right-0 left-0 h-48 w-full overflow-hidden bg-stone-900 sm:h-full"
          style={
            heroClipPath ? { clipPath: `path('${heroClipPath}')` } : undefined
          }
        >
          <picture>
            <source
              media="(min-width: 640px)"
              srcSet="/background.svg"
              type="image/svg+xml"
            />
            <source
              media="(max-width: 640px)"
              srcSet="/background.svg"
              type="image/svg+xml"
            />
            <img
              ref={imageRef}
              className="aspect-video h-96 w-full object-cover blur-sm sm:h-auto sm:blur-none"
              src="/background.svg"
              alt="Wallpaper"
              style={{ transform: `translateY(${parallaxY}px)` }}
            />
          </picture>
          {/* Bottom fade gradient */}
          <div className="absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t from-stone-900 to-transparent sm:hidden" />
        </div>
      </div>

      {/* Hint */}
      <div className="mt-4 hidden cursor-default items-center p-4 text-sm font-bold text-orange-950/40 select-none sm:flex">
        <svg
          className={`mr-2 h-3.5 w-3.5 fill-current transition duration-500 ${hintActive ? "rotate-45" : ""}`}
          viewBox="0 0 28 28"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M5.06 3.024C4.804 1.238 6.858.052 8.276 1.168l17.117 13.466c1.47 1.159.688 3.522-1.182 3.574l-7.03.19a1.998 1.998 0 0 0-1.65.953l-3.68 5.993c-.98 1.594-3.418 1.089-3.685-.764L5.06 3.024Z" />
        </svg>
        Psst&hellip; it's interactive!
      </div>
    </section>
  );
}
