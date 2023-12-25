import { FC, useRef, useReducer, useEffect } from "react";

type State = {
  isEnded: boolean;
  isPlaying: boolean;
  isOpen: boolean;
};

type PlayAction = { type: "Play" };

type PauseAction = { type: "Pause" };

type CloseAction = { type: "Close" };

type EndAction = { type: "End" };

type Action = PlayAction | CloseAction | PauseAction | EndAction;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "Play":
      return {
        isEnded: false,
        isOpen: true,
        isPlaying: true,
      };
    case "Pause":
      return {
        ...state,
        isPlaying: false,
      };
    case "Close":
      return {
        ...state,
        isOpen: false,
      };
    case "End":
      return {
        ...state,
        isEnded: true,
        isPlaying: false,
      };
  }
};

const baseState: State = {
  isEnded: false,
  isOpen: false,
  isPlaying: false,
};

/**
 * Pros:
 * - Easier to maintain
 * - Good readability
 * - Potential to be reusable (passes SR principle)
 * - Easy to debug and fast to implement
 *
 * Cons:
 * - Requires more code than Pure implementation
 * - Required more knowledge about splitting actions
 * - Need to implemented useEffect for isEnded state, can't handle asynchronous state in reducer
 */
const UsingReactReducer: FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [state, dispatch] = useReducer(reducer, baseState);

  const handleDispatch = (action: Action) => () => {
    dispatch(action);
  };

  useEffect(() => {
    if (state.isEnded) {
      const timeout = setTimeout(() => {
        dispatch({ type: "Close" });
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [state.isEnded]);

  useEffect(() => {
    if (state.isPlaying) {
      const handler = (event) => {
        if (event.key === "Escape") {
          dispatch({ type: "Close" });
        }
      };

      window.addEventListener("keydown", handler);

      return () => {
        window.removeEventListener("keydown", handler);
      };
    }
  }, [state.isPlaying]);

  return (
    <main>
      <h4>Some video</h4>
      <div
        id="player"
        className="w-full"
        onClick={handleDispatch({ type: "Close" })}
      >
        <video
          controls
          ref={videoRef}
          id="video"
          width={state.isOpen ? 600 : 250}
          className="mx-auto"
          onPlay={handleDispatch({ type: "Play" })}
          onPause={handleDispatch({ type: "Pause" })}
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

export default UsingReactReducer;
