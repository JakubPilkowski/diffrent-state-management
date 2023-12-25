import { FC, useRef } from "react";
import { useMachine } from "@xstate/react";
import { createMachine, fromEventObservable } from "xstate";
import { fromEvent } from "rxjs";

const videoMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDcCWEwHsCyBDAxgBaoB2YAdOgDZgDEAygCoCCASowNoAMAuoqAAdMsVABdUmEvxAAPRAFoAzAEZF5LgBYuAJgDsATmUbFOgGwAOADQgAnguUBWbeVMbtDzfsXauph4vMAX0DrNAwcAmIycgEqXBtSKHI0MAB3ckwBMBJaAGEAGQB5egBRbj4kECERcUlpOQRdB11yc0VTfTaDfV9dK1sFby5yXVHzLgdlbUN9DVNg0PQsPCJSClj4xOTUNPJ8KmE6QoAFEoA5culqsQkpSobOtX0vbS1TRQ0vB31rOwQlNrkPR9CZTGZzBYgMLLSJrGJxBIkJIbGxgABO8PitGOzAAqqVLpVrrU7qAGrpXOp9NopuZzKNlF5fgoOuRlFMDIpDFxFLotA5IdCIqtoiitij0ZibLRzgARQmCYQ3Or3RAaOZsri6dx6Z7tanM-7KFrKLgzIwqelaRSCpbCqLrBHihGSgS4ACusDox3yzAAmgqqkqSfVEBT9EDvBTzBYtQ4NLpDcpTC4dD0uL5PnyNAKQlC7SsHVLnfFJdkMBAGCx2IHibdQ-9tOZyBpk+8TD4uc1DfIpmpRg4uhnNBNtDa80LC3CxUipWWSBXaDJYKJcKIKLgAGbrtEACh8GYAlLRJ7DRU7ZxKMeXILXg-XVf8Pmz+V4DI45nNDWO1FyzTptFcXQ23HPMSEwDB4EqU8RTAK57xVMkFAcfxyH0FDzHZXUuHMGkeyAoExmTaZrQ0IIJwLM8KGoOCiQQ0lZGQiY0IwrCDBwvCBiNHM0KaTCQSMeNzA0W1winc9NiReCagfJCjRMFxTCU15Zg+ZMHFMHsNOGdl2U+JwTG+fRRJhWDi1nFJUmk5UGIaDw1DaDoumeXomh7BNnFmdVcKaHxzEmEz7WnC8kksjIsgYutEMYhAUOUVp9WcnpTD6HsAgcEYxlBaZGQTQLxMdSTQp2dJ9kOayQ0fUYWj1V5fA+L4fi4gE1GBcZJhy2Z5gosSqPM5EXTRCrZJi+RcMU5TPmMVs-E05qaWGWZ3B5BkAgzbR8r6mcBtLDEUWG6KGmMZtOj5Qcm3VJSEx7fQTTNRw-AmOZVGMnrTKLba5z2j0vQO2zEH0PwgX8DxvhS55TGUfCIzYrxuV5flNrMz6r3IG8ID+hslA0CbTBU6b1MTZrjU1c1jGUK0dBE4JAiAA */
  id: "videoMachine",
  initial: "idle",
  states: {
    idle: {
      on: {
        START: "playing",
      },
    },

    playing: {
      states: {
        view: {
          entry: () => {},
          exit: () => {},
          states: {
            open: {
              invoke: {
                src: fromEventObservable(() =>
                  fromEvent(document.body, "keydown")
                ),
              },
              on: {
                CLOSE: "close",
                keydown: {
                  guard: ({ event }) => {
                    const key = event?.key;
                    if (key === "Escape") {
                      return true;
                    }
                    return false;
                  },
                  target: "close",
                },
              },
            },

            close: {
              on: {
                OPEN: "open",
              },
            },
          },

          initial: "open",
        },

        player: {
          type: "compound",
          states: {
            play: {
              on: {
                PAUSE: "pause",
                END: "ended",
              },
            },

            pause: {
              on: {
                PLAY: "play",
                END: "ended",
              },
            },

            ended: {
              after: {
                "2000": "#videoMachine.idle",
              },
              on: {
                PLAY: "play",
              },
            },
          },

          initial: "play",
        },
      },

      type: "parallel",
    },
  },
});

/**
 * Pros:
 * - Awesome readability using XState extension to visualize state of the player. We can even simulate state using this extension.
 * - Easy to manipulate and access state
 * - Perfect for handling more complex state
 * - Awesome integration with DOM events
 * - No useEffects!!! Incredible
 *
 * Cons:
 * - Requires slighly more code
 * - Requires more knowledge about state flows
 * - Requires more time to understand how it works
 * - Visualizer is not perfect but fair enough
 */
const UsingXState: FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [current, send] = useMachine(videoMachine);

  const isPlaying = current.matches("playing");
  const isOpen = current.matches("playing.view.open");

  const handleDispatch =
    ({ type }: { type: string }) =>
    () => {
      send({ type });
    };

  return (
    <main>
      <h4>Some video</h4>
      <div
        id="player"
        className="w-full"
        onClick={handleDispatch({ type: "CLOSE" })}
      >
        <video
          controls
          ref={videoRef}
          id="video"
          width={isOpen ? 600 : 250}
          className="mx-auto"
          onPlay={handleDispatch({ type: isPlaying ? "PLAY" : "START" })}
          onPause={handleDispatch({ type: "PAUSE" })}
          onEnded={handleDispatch({ type: "END" })}
          muted
        >
          <source src="../public/video.mp4" type="video/mp4" />
        </video>
      </div>
    </main>
  );
};

export default UsingXState;
