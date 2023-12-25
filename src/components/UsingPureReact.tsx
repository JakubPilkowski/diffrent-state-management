import { FC, useRef, useState, useEffect } from "react";

/**
 * Pros:
 * - requires less code than other implementations
 * - `easier` for beginers to implement
 *
 * Cons:
 * - Hard to maintain
 * - useEffects are not readable
 * - breaks single responsibility principle
 * - code is not reusable
 * - requires more time to debug and implement
 */
const UsingPureReact: FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isOpen, setOpen] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [isEnded, setEnded] = useState(false);

  const setPlayAndOpen = () => {
    setPlaying(true);
    setOpen(true);
    setEnded(false);
  };

  const setPause = () => {
    setPlaying(false);
  };

  const setClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isOpen) {
      console.log(
        "🚀 ~ file: UsingPureReact.tsx:45 ~ useEffect ~ isPlaying:",
        isOpen
      );
      const handler = () => {
        console.log("ended");
        setPlaying(false);
        setEnded(true);
      };

      videoRef.current?.addEventListener("ended", handler);

      return () => {
        videoRef.current?.removeEventListener("ended", handler);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isPlaying) {
      const handler = (event) => {
        if (event.key === "Escape") {
          setClose();
        }
      };

      window.addEventListener("keydown", handler);

      return () => {
        window.removeEventListener("keydown", handler);
      };
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isEnded) {
      console.log(
        "🚀 ~ file: UsingPureReact.tsx:76 ~ useEffect ~ isEnded:",
        isEnded
      );
      const timeout = setTimeout(() => {
        setOpen(false);
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isEnded]);

  return (
    <main>
      <h4>Some video</h4>
      <div id="player" className="w-full" onClick={setClose}>
        <video
          controls
          ref={videoRef}
          id="video"
          width={isOpen ? 600 : 250}
          className="mx-auto"
          onPlay={setPlayAndOpen}
          onPause={setPause}
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

export default UsingPureReact;
