import React from "react";
import { Composition, Folder } from "remotion";
import { FPS, HEIGHT, WIDTH } from "./theme/palette";
import {
  EPISODE1_FRAMES,
  EPISODE1_TOTAL_FRAMES,
  Episode1Full,
  Episode1Trailer,
} from "./Episode1";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2CottageBrook } from "./scenes/Scene2CottageBrook";
import { Scene3GoldenMeadow } from "./scenes/Scene3GoldenMeadow";
import { Scene4LighthouseCove } from "./scenes/Scene4LighthouseCove";
import { Scene5SymphonyFinale } from "./scenes/Scene5SymphonyFinale";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BaaAndBreeze-Ep1-Full"
        component={Episode1Full}
        durationInFrames={EPISODE1_TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      <Composition
        id="BaaAndBreeze-Ep1-Trailer"
        component={Episode1Trailer}
        durationInFrames={900}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      <Folder name="Episode-1-Scenes">
        <Composition
          id="Scene1-Intro"
          component={Scene1Intro}
          durationInFrames={EPISODE1_FRAMES.intro}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="Scene2-CottageBrook"
          component={Scene2CottageBrook}
          durationInFrames={EPISODE1_FRAMES.cottage}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="Scene3-GoldenMeadow"
          component={Scene3GoldenMeadow}
          durationInFrames={EPISODE1_FRAMES.meadow}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="Scene4-LighthouseCove"
          component={Scene4LighthouseCove}
          durationInFrames={EPISODE1_FRAMES.lighthouse}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="Scene5-SymphonyFinale"
          component={Scene5SymphonyFinale}
          durationInFrames={EPISODE1_FRAMES.finale}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      </Folder>
    </>
  );
};
