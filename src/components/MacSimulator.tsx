import { useEffect, useMemo, useRef, useState } from "react";
import DynamicIsland from "./DynamicIsland";
import {
  BatteryAlertIcon,
  ContactCardIcon,
  CursorHintIcon,
  GlobeIcon,
  WeatherSunIcon,
} from "./icons/react";
import { useIslandStore } from "../stores/island";
import {
  getAmpm,
  getDateString,
  getHours,
  getIsNight,
  getMinutes,
  useTimeStore,
} from "../stores/time";

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

  const imageRef = useRef<HTMLImageElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageContainer2Ref = useRef<HTMLDivElement>(null);
  const unlockTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hintIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const hours = getHours(now);
  const minutes = getMinutes(now);
  const ampm = getAmpm(now);
  const dateString = getDateString(now);
  const currentTemperature = getIsNight(now) ? 16 : 24;

  const parallaxY = useMemo(() => {
    if (!imageRef.current || !imageContainerRef.current) return 0;
    const diff =
      imageRef.current.offsetHeight - imageContainerRef.current.offsetHeight;
    return -(scrollProgress * diff * 0.5);
  }, [scrollProgress]);

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

    audioContextRef.current = new (window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext)();
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

  return (
    <section className="isolate flex w-full flex-col items-center px-0 select-none lg:px-8">
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
            className={`absolute bottom-6 z-20 flex w-full items-center justify-center transition-all delay-300 duration-500 ${
              isLocked
                ? "pointer-events-none translate-y-2 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            <div className="flex items-center justify-center space-x-2.5 rounded-[24px] bg-black/50 px-4 py-2.5 backdrop-blur-xl">
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
              className="shimmer animate-shine cursor-pointer bg-transparent p-6 text-2xl font-bold text-transparent saturate-150 sm:text-lg sm:font-semibold lg:p-4"
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

      <div className="mt-4 hidden cursor-default items-center p-4 text-sm font-bold text-orange-950/40 select-none sm:flex">
        <CursorHintIcon
          className={`mr-2 h-3.5 w-3.5 fill-current transition duration-500 ${hintActive ? "rotate-45" : ""}`}
        />
        Psst&hellip; it's interactive!
      </div>
    </section>
  );
}
