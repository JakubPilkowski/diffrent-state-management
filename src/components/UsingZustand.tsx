import { FC, useRef } from "react";
import { Subscription, fromEvent } from "rxjs";
import { create } from "zustand";

type State = {
  isIdle: boolean;
  isEnded: boolean;
  isPlaying: boolean;
  isOpen: boolean;
};

type Action = {
  start: VoidFunction;
  pause: VoidFunction;
  play: VoidFunction;
  end: VoidFunction;
  open: VoidFunction;
  close: VoidFunction;
  idle: VoidFunction;
};

const useVideo = create<State & Action>((set) => ({
  isIdle: true,
  isPlaying: false,
  isEnded: false,
  isOpen: false,
  start: () =>
    set(() => ({
      isPlaying: true,
      isOpen: true,
    })),
  pause: () =>
    set(() => ({
      isPlaying: false,
    })),
  play: () =>
    set(() => ({
      isPlaying: true,
    })),
  end: () =>
    set(() => ({
      isPlaying: false,
      isEnded: true,
    })),
  open: () =>
    set(() => ({
      isOpen: true,
    })),
  close: () =>
    set(() => ({
      isOpen: false,
    })),
  idle: () =>
    set(() => ({
      isOpen: false,
      isEnded: false,
    })),
}));

const keydownEvent = fromEvent(document.body, "keydown");
let sub: Subscription | null = null;
let timeout: number | null = null;

useVideo.subscribe((state) => {
  const { isOpen, isEnded } = state;

  if (isOpen) {
    sub =
      sub ||
      keydownEvent.subscribe((event) => {
        if (event?.key === "Escape") {
          state.close();
        }
      });
  } else {
    sub?.unsubscribe();
    sub = null;
  }

  if (isEnded) {
    timeout = timeout || setTimeout(state.idle, 2000);
  } else {
    if (typeof timeout === "number") {
      clearTimeout(timeout);
      timeout = null;
    }
  }
});

/**
 * Pros:
 * - Very easy and straightforward
 * - Good readability
 * - Reusable
 * - Easy to debug and fast to implement
 * - No useEffects!!!
 * - Requires same amount of code as other solutions
 *
 * Cons:
 * - Subscribe method is not scalable so it won't work great with a lot of logic on subcribe layer
 */
const UsingZustand: FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { isOpen, isIdle, end, close, pause, play, start } = useVideo();

  return (
    <main>
      <h4>Some video</h4>
      <div id="player" className="w-full" onClick={close}>
        <video
          controls
          ref={videoRef}
          id="video"
          width={isOpen ? 600 : 250}
          className="mx-auto"
          onPlay={isIdle ? start : play}
          onPause={pause}
          onEnded={end}
          muted
        >
          <source
            src="https://static.vecteezy.com/system/resources/previews/023/960/299/mp4/hello-neon-light-title-animation-on-wall-great-for-greetings-opening-bumper-cinema-digital-media-publishing-film-short-movie-etc-free-video.mp4"
            type="video/mp4"
          ></source>
        </video>
      </div>
    </main>
  );
};

export default UsingZustand;
