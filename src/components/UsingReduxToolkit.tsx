import {
  Dispatch,
  MiddlewareAPI,
  configureStore,
  createSlice,
} from "@reduxjs/toolkit";
import { ComponentType, FC, useRef } from "react";
import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { Subscription, fromEvent } from "rxjs";

type State = {
  isIdle: boolean;
  isEnded: boolean;
  isPlaying: boolean;
  isOpen: boolean;
};

const playerSlice = createSlice({
  name: "player",
  initialState: {
    isIdle: true,
    isEnded: false,
    isOpen: false,
    isPlaying: false,
  } as State,
  reducers: {
    start: (state) => {
      state.isOpen = true;
      state.isPlaying = true;
      state.isIdle = false;
    },
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
    end: (state) => {
      state.isPlaying = false;
      state.isEnded = true;
    },
    idle: (state) => {
      state.isIdle = true;
      state.isOpen = false;
    },
  },
});

const { start, play, pause, close, end, idle } = playerSlice.actions;

type Action = {
  payload: unknown;
  type: string;
};

export type AppDispatch = typeof store.dispatch;

const keydownEvent = fromEvent(document.body, "keydown");
let sub: Subscription | null = null;
let timeout: number | null = null;

export const playerMiddleware =
  (api: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
    if (action.type === "player/start" || action.type === "player/open") {
      sub =
        sub ||
        keydownEvent.subscribe((event) => {
          if (event?.key === "Escape") {
            api.dispatch(close());
          }
        });
    } else {
      sub?.unsubscribe();
      sub = null;
    }

    if (action.type === "player/end") {
      timeout = timeout || setTimeout(() => api.dispatch(idle()), 2000);
    } else {
      if (typeof timeout === "number") {
        clearTimeout(timeout);
        timeout = null;
      }
    }
    // You should always do this at the end of your middleware
    return next(action);
  };

export const store = configureStore({
  reducer: {
    player: playerSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(playerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Pros:
 *  - no useEffects
 *  - player slice straightforward
 *  - build in immer support
 *
 * Cons:
 * - requires a lot of code
 * - documentation about middleware is scary
 * - middlewares requires more knowledge and they are called before state change instead of zustand middlewares
 * - need to provide Hoc for Provider initialization
 * - requires a lot of base configuration
 * - covers too much features for simple logic like this
 */
const UsingReduxToolkit: FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { isOpen, isIdle } = useAppSelector((state) => state.player);

  const dispatch = useAppDispatch();

  return (
    <main>
      <h4>Some video</h4>
      <div id="player" className="w-full" onClick={() => dispatch(close())}>
        <video
          controls
          ref={videoRef}
          id="video"
          width={isOpen ? 600 : 250}
          className="mx-auto"
          onPlay={() => dispatch(isIdle ? start() : play())}
          onPause={() => dispatch(pause())}
          onEnded={() => dispatch(end())}
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

const WithReduxStore = (Component: ComponentType) => () => {
  return (
    <Provider store={store}>
      <Component />
    </Provider>
  );
};

export default WithReduxStore(UsingReduxToolkit);
