import { useEffect, useMemo, useRef, useState } from "react";
import DynamicIsland from "./DynamicIsland";
import { ContactCardIcon, CursorHintIcon, WeatherSunIcon } from "./icons/react";
import { useIslandStore } from "../stores/island";
import {
  getDateString,
  getHours,
  getIsNight,
  getMinutes,
  useTimeStore,
} from "../stores/time";

const shimmerTextStyle = {
  backgroundImage: "linear-gradient(90deg, #f0abfc 0%, #fff 50%, #f0abfc 100%)",
  backgroundSize: "200% 100%",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
} as const;

const dockApps = [
  { id: "finder", label: "Finder", src: "/images/dock/finder.webp" },
  { id: "launchpad", label: "Launchpad", src: "/images/dock/launchpad.webp" },
  { id: "dyno", label: "Dyno", src: "/images/dock/dyno_icon.webp" },
  { id: "music", label: "Music", src: "/images/dock/music.webp" },
  { id: "settings", label: "Settings", src: "/images/dock/settings.webp" },
] as const;

type DockAppId = (typeof dockApps)[number]["id"];

function MacSimulatorPoster() {
  const [isVisible, setIsVisible] = useState(false);
  const posterRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = posterRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={posterRef}
      className="isolate flex w-full flex-col items-center px-0 select-none lg:px-8"
    >
      <div className="relative h-48 w-full overflow-visible sm:aspect-[2/1] sm:h-auto sm:overflow-hidden">
        <div className="absolute left-0 right-0 top-0 z-20 flex justify-center">
          <div className="flex justify-center p-5">
            <div className="h-10 w-[136px] rounded-xl bg-stone-950 shadow-[0_2px_16px_0_rgba(12,10,9,0.25)]" />
          </div>
        </div>

        <div className="absolute inset-0 z-10 mb-6 mt-22 flex flex-col items-center justify-end md:justify-between lg:mt-23">
          <div className="hidden flex-col items-center text-center lg:flex">
            <div className="text-3xl font-semibold text-purple-300/85 saturate-150">
              Dynamic Island preview
            </div>
            <div className="font-numeric text-8xl font-bold text-purple-300/90 saturate-150">
              Dyno
            </div>
            <div className="mt-3.5 flex items-center space-x-5 font-semibold text-purple-300/90 saturate-150">
              <div>Native macOS app</div>
              <div className="inline-flex items-center">
                <span>Widgets</span>
                <span className="mx-2 text-purple-300/60">&middot;</span>
                <span>Notifications</span>
              </div>
            </div>
          </div>

          <div
            className={`bg-transparent p-6 text-2xl font-bold saturate-150 transition duration-700 sm:text-lg sm:font-semibold lg:p-4 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-70"
            }`}
            style={shimmerTextStyle}
          >
            Interactive demo loads on demand
          </div>
        </div>

        <div className="absolute bottom-6 z-20 flex w-full items-center justify-center">
          <div className="flex items-center justify-center space-x-2.5 rounded-[24px] bg-black/50 px-4 py-2.5 backdrop-blur-xl">
            {[
              ["Finder", "/images/dock/finder.webp"],
              ["Launchpad", "/images/dock/launchpad.webp"],
              ["Dyno", "/images/dock/dyno_icon.webp"],
              ["Music", "/images/dock/music.webp"],
              ["Settings", "/images/dock/settings.webp"],
            ].map(([alt, src]) => (
              <img
                key={src}
                className="size-12 object-contain"
                src={src}
                alt={alt}
                draggable={false}
                loading="lazy"
              />
            ))}
          </div>
        </div>

        <div className="rounded-5xl absolute left-0 right-0 top-0 h-48 w-full overflow-hidden bg-stone-900 sm:h-full">
          <img
            className="aspect-video h-96 w-full object-cover blur-sm sm:h-auto sm:blur-none"
            src="/background.svg"
            alt="Dyno preview wallpaper"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/35 via-transparent to-stone-950/20" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-900 to-transparent sm:hidden" />
        </div>
      </div>

      <div className="mt-4 hidden cursor-default items-center p-4 text-sm font-bold text-stone-700 select-none sm:flex dark:text-orange-25/90">
        <CursorHintIcon className="mr-2 h-3.5 w-3.5 fill-current" />
        Interactive demo will appear when this section enters view.
      </div>
    </section>
  );
}

export default function MacSimulator() {
  const now = useTimeStore((state) => state.now);
  const startTime = useTimeStore((state) => state.start);
  const stopTime = useTimeStore((state) => state.stop);

  const tracks = useIslandStore((state) => state.tracks);
  const initialize = useIslandStore((state) => state.initialize);
  const preloadTrackArt = useIslandStore((state) => state.preloadTrackArt);
  const play = useIslandStore((state) => state.play);
  const toggleLiveActivity = useIslandStore(
    (state) => state.toggleLiveActivity,
  );
  const toggleNotification = useIslandStore(
    (state) => state.toggleNotification,
  );
  const disposeIsland = useIslandStore((state) => state.dispose);

  const [isLocked, setIsLocked] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroClipPath, setHeroClipPath] = useState<string | null>(null);
  const [hintActive, setHintActive] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [openApps, setOpenApps] = useState<Record<DockAppId, boolean>>({
    finder: false,
    launchpad: false,
    dyno: false,
    music: false,
    settings: false,
  });

  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageContainer2Ref = useRef<HTMLDivElement>(null);
  const unlockTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hintIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const dockButtonRefs = useRef<Record<DockAppId, HTMLButtonElement | null>>({
    finder: null,
    launchpad: null,
    dyno: null,
    music: null,
    settings: null,
  });

  const hours = getHours(now);
  const minutes = getMinutes(now);
  const dateString = getDateString(now);
  const currentTemperature = getIsNight(now) ? 16 : 24;

  const parallaxY = useMemo(() => {
    if (!imageRef.current || !imageContainerRef.current) return 0;
    const diff =
      imageRef.current.offsetHeight - imageContainerRef.current.offsetHeight;
    return -(scrollProgress * diff * 0.5);
  }, [scrollProgress]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
    };

    const calculateHeroClipPath = () => {
      const element = imageContainer2Ref.current;
      if (!element) return;
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      const radius = 40;
      setHeroClipPath(
        `M ${radius} 0 L ${width - radius} 0 Q ${width} 0 ${width} ${radius} L ${width} ${height - radius} Q ${width} ${height} ${width - radius} ${height} L ${radius} ${height} Q 0 ${height} 0 ${height - radius} L 0 ${radius} Q 0 0 ${radius} 0 Z`,
      );
    };

    audioContextRef.current = new (
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    )();
    initialize();
    startTime();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", calculateHeroClipPath);
    requestAnimationFrame(calculateHeroClipPath);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateHeroClipPath);
      stopTime();
      unlockTimersRef.current.forEach(clearTimeout);
      if (hintIntervalRef.current) clearInterval(hintIntervalRef.current);
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      disposeIsland();
    };
  }, [disposeIsland, initialize, startTime, stopTime]);

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

  const handleUnlockClick = () => {
    if (!isLocked) return;

    const audioContext = audioContextRef.current;
    if (audioContext) {
      if (audioContext.state === "suspended") audioContext.resume();

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(2000, audioContext.currentTime);
      gain.gain.setValueAtTime(0.5, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.02,
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.02);
    }

    toggleLiveActivity(false, "isLocked");
    setIsLocked(false);
    tracks.forEach((_, index) => preloadTrackArt(index));

    const notificationTimer = setTimeout(() => {
      toggleNotification(true, "didConnectAirPods", 3500);
      const playTimer = setTimeout(() => {
        play();
      }, 3750);
      unlockTimersRef.current.push(playTimer);
    }, 2000);

    unlockTimersRef.current.push(notificationTimer);
  };

  const handleDockAppClick = (appId: DockAppId) => {
    const button = dockButtonRefs.current[appId];
    if (!button) return;

    button.animate(
      [
        { transform: "translateY(0) scale(1)", offset: 0 },
        {
          transform: "translateY(-18px) scale(1.04)",
          offset: 0.5,
          easing: "ease-out",
        },
        { transform: "translateY(0) scale(1)", offset: 1, easing: "ease-in" },
      ],
      {
        duration: 1000,
        easing: "linear",
      },
    );

    setOpenApps((current) => ({
      ...current,
      [appId]: true,
    }));
  };

  if (!hasMounted) {
    return <MacSimulatorPoster />;
  }

  return (
    <section
      ref={rootRef}
      className="isolate flex w-full flex-col items-center px-0 select-none lg:px-8"
    >
      <div
        ref={imageContainerRef}
        className="relative h-48 w-full overflow-visible sm:aspect-[2/1] sm:h-auto sm:overflow-hidden"
      >
        <div className="absolute left-0 right-0 top-0 z-20 flex justify-center sm:grid sm:grid-cols-1">
          <div className="flex justify-center p-5">
            <DynamicIsland notchWidth={136} notchHeight={40} />
          </div>
        </div>

        <div className="absolute inset-0">
          <div
            className={`absolute bottom-3 z-20 flex w-full items-center justify-center transition-all delay-300 duration-500 ${
              isLocked
                ? "pointer-events-none translate-y-2 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            <div className="flex items-center justify-center space-x-2 rounded-[18px] bg-white/45 px-2 py-2 backdrop-blur-xl">
              {dockApps.map((app) => (
                <button
                  key={app.id}
                  ref={(element) => {
                    dockButtonRefs.current[app.id] = element;
                  }}
                  type="button"
                  className="group relative flex cursor-pointer items-center justify-center rounded-2xl bg-transparent outline-hidden transition duration-200"
                  onClick={() => handleDockAppClick(app.id)}
                  aria-label={`Open ${app.label}`}
                >
                  <img
                    className="size-12 object-contain"
                    src={app.src}
                    alt={app.label}
                    draggable={false}
                  />
                  <span
                    className={`pointer-events-none absolute -bottom-1.5 left-1/2 block h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-stone-900/90 transition duration-300 ${
                      openApps[app.id]
                        ? "scale-100 opacity-100"
                        : "scale-50 opacity-0"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </div>

          <div
            className={`absolute inset-0 z-10 mb-6 mt-22 flex flex-col items-center justify-end transition-all duration-500 md:justify-between lg:mt-23 ${
              isLocked
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-0"
            }`}
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

              <div className="mt-3.5 hidden items-center space-x-5 font-semibold text-purple-300/90 saturate-150 lg:flex">
                <div className="relative flex w-18 items-center">
                  <div className="absolute flex w-18 items-center">
                    <div className="mr-1.5 ml-0.5 size-[18px]">
                      <ContactCardIcon className="absolute size-[18px] fill-current" />
                    </div>
                    <div>Work</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="relative ml-0.5 mr-[5px] size-[18px]">
                    <WeatherSunIcon className="absolute size-[18px] fill-current" />
                  </div>
                  <div className="relative inline-flex tabular-nums">
                    <span>{currentTemperature}</span>
                    <span>&deg;</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={`cursor-pointer bg-transparent p-6 text-2xl font-bold saturate-150 transition duration-700 sm:text-lg sm:font-semibold lg:p-4 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-70"
              }`}
              style={shimmerTextStyle}
              onClick={handleUnlockClick}
            >
              Press to unlock
            </button>
          </div>
        </div>

        <div
          ref={imageContainer2Ref}
          className="rounded-5xl absolute left-0 right-0 top-0 h-48 w-full overflow-hidden bg-stone-900 sm:h-full"
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
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-900 to-transparent sm:hidden" />
        </div>
      </div>

      <div className="mt-4 hidden cursor-default items-center p-4 text-sm font-bold text-stone-700 select-none sm:flex dark:text-orange-25/90">
        <CursorHintIcon
          className={`mr-2 h-3.5 w-3.5 fill-current transition duration-500 ${hintActive ? "rotate-45" : ""}`}
        />
        Psst&hellip; it's interactive!
      </div>
    </section>
  );
}
