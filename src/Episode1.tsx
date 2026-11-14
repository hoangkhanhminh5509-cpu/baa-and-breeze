import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { FPS, PALETTE, SCENE_DURATIONS_SEC } from "./theme/palette";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2CottageBrook } from "./scenes/Scene2CottageBrook";
import { Scene3GoldenMeadow } from "./scenes/Scene3GoldenMeadow";
import { Scene4LighthouseCove } from "./scenes/Scene4LighthouseCove";
import { Scene5SymphonyFinale } from "./scenes/Scene5SymphonyFinale";

export const EPISODE1_FRAMES = {
  intro: SCENE_DURATIONS_SEC.intro * FPS, // 1200 (0:00 - 0:40)
  cottage: SCENE_DURATIONS_SEC.cottage * FPS, // 3600 (0:40 - 2:40)
  meadow: SCENE_DURATIONS_SEC.meadow * FPS, // 4500 (2:40 - 5:10)
  lighthouse: SCENE_DURATIONS_SEC.lighthouse * FPS, // 3900 (5:10 - 7:20)
  finale: SCENE_DURATIONS_SEC.finale * FPS, // 2100 (7:20 - 8:30)
} as const;

export const EPISODE1_TOTAL_FRAMES =
  EPISODE1_FRAMES.intro +
  EPISODE1_FRAMES.cottage +
  EPISODE1_FRAMES.meadow +
  EPISODE1_FRAMES.lighthouse +
  EPISODE1_FRAMES.finale; // 15,300 frames = 8m 30s

/**
 * Full 8m 30s YouTube Pilot Episode:
 * "Baa & Breeze — Ep. 1: The Whispering Valley (The Earth Has Music)"
 */
export const Episode1Full: React.FC = () => {
  const s1Start = 0;
  const s2Start = EPISODE1_FRAMES.intro;
  const s3Start = s2Start + EPISODE1_FRAMES.cottage;
  const s4Start = s3Start + EPISODE1_FRAMES.meadow;
  const s5Start = s4Start + EPISODE1_FRAMES.lighthouse;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.paperCream }}>
      <Sequence from={s1Start} durationInFrames={EPISODE1_FRAMES.intro}>
        <Scene1Intro withAudio />
      </Sequence>

      <Sequence from={s2Start} durationInFrames={EPISODE1_FRAMES.cottage}>
        <Scene2CottageBrook withAudio />
      </Sequence>

      <Sequence from={s3Start} durationInFrames={EPISODE1_FRAMES.meadow}>
        <Scene3GoldenMeadow withAudio />
      </Sequence>

      <Sequence from={s4Start} durationInFrames={EPISODE1_FRAMES.lighthouse}>
        <Scene4LighthouseCove withAudio />
      </Sequence>

      <Sequence from={s5Start} durationInFrames={EPISODE1_FRAMES.finale}>
        <Scene5SymphonyFinale withAudio />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * 30-second YouTube Channel Trailer / Highlight Cut (900 frames @ 30fps)
 * Showcasing all 5 worlds with rich synced audio excerpts for fast previews.
 */
export const Episode1Trailer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.paperCream }}>
      {/* Intro 3-panel postcard + mystery chime (6s = 180f) */}
      <Sequence durationInFrames={180}>
        <Sequence from={-500} durationInFrames={720}>
          <Scene1Intro withAudio={false} />
        </Sequence>
        <Audio
          src={staticFile("audio/scene1_intro.mp3")}
          trimBefore={12 * FPS}
          trimAfter={18 * FPS}
        />
      </Sequence>

      {/* Cottage Brook & Songbird (6s = 180f) */}
      <Sequence from={180} durationInFrames={180}>
        <Sequence from={-1300} durationInFrames={1520}>
          <Scene2CottageBrook withAudio={false} />
        </Sequence>
        <Audio
          src={staticFile("audio/scene2_cottage.mp3")}
          trimBefore={43 * FPS}
          trimAfter={49 * FPS}
        />
      </Sequence>

      {/* Golden Wheat Meadow & Pip + Blooming Flowers (6s = 180f) */}
      <Sequence from={360} durationInFrames={180}>
        <Sequence from={-1430} durationInFrames={1650}>
          <Scene3GoldenMeadow withAudio={false} />
        </Sequence>
        <Audio
          src={staticFile("audio/scene3_meadow.mp3")}
          trimBefore={47 * FPS}
          trimAfter={53 * FPS}
        />
      </Sequence>

      {/* Lighthouse Cove & Orange Sailboat (6s = 180f) */}
      <Sequence from={540} durationInFrames={180}>
        <Sequence from={-820} durationInFrames={1040}>
          <Scene4LighthouseCove withAudio={false} />
        </Sequence>
        <Audio
          src={staticFile("audio/scene4_lighthouse.mp3")}
          trimBefore={27 * FPS}
          trimAfter={33 * FPS}
        />
      </Sequence>

      {/* Symphony Finale & Goodnight 3-Panel Close (6s = 180f) */}
      <Sequence from={720} durationInFrames={180}>
        <Sequence from={-1050} durationInFrames={1260}>
          <Scene5SymphonyFinale withAudio={false} />
        </Sequence>
        <Audio
          src={staticFile("audio/scene5_finale.mp3")}
          trimBefore={35 * FPS}
          trimAfter={41 * FPS}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
