import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import {
  CrayonDefs,
  CrayonFlower,
  CrayonGrassTuft,
  PuffyCloud,
  StorybookFrame,
} from "../components/PastelPaperEngine";
import {
  BreezeSwirl,
  ListeningRipples,
  Sheep,
  Songbird,
  SoundBubble,
} from "../components/Characters";
import {
  Cottage,
  MeadowTree,
  WindingBrook,
} from "../components/WorldElements";
import { PALETTE } from "../theme/palette";

/**
 * Scene 2 (120s = 3600 frames @ 30fps):
 * Baa discovers the Cottage Brook's water-plink marimba rhythm,
 * plays musical call-and-response with the Songbird in the tree,
 * and collects Sound Bubble #1 (Teal Brook Note).
 */
export const Scene2CottageBrook: React.FC<{ withAudio?: boolean }> = ({
  withAudio = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Baa's choreography across 120s
  // 0..120f: walks in from right hill toward stream bank (1180 -> 1045)
  // 120..1260f: listens to water plinks by stream
  // 1260..2460f: turns slightly / watches Songbird on tree & answers "Baa!"
  // 2460..2760f: joyful celebration as Bubble #1 rises
  // 2880..3600f: trots softly off-right toward Golden Meadow (1045 -> 1980)
  let baaX = 1045;
  let walkPhase = 0;
  let facing: "left" | "right" = "left";

  if (frame < 120) {
    baaX = interpolate(frame, [0, 120], [1260, 1045], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    walkPhase = frame * 0.22;
  } else if (frame >= 2880) {
    facing = "right";
    baaX = interpolate(frame, [2880, 3550], [1045, 2020], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    walkPhase = (frame - 2880) * 0.2;
  }

  // Natural blinking every ~4 seconds
  const blinkCycle = frame % 125;
  const blink = blinkCycle >= 0 && blinkCycle <= 5;

  // Water plinks every 1.8s (54 frames) from 4s (120f) to 42s (1260f) & 96s..117s
  const waterActive = (frame >= 120 && frame < 1260) || frame >= 2880;
  const plinkCycle = ((frame - 120) % 54 + 54) % 54;
  const plinkPulse = waterActive && plinkCycle < 24 ? plinkCycle / 24 : 0;

  // Listening rings around brook (120..1260f)
  const brookListening = frame >= 120 && frame < 1260;

  // Songbird arrives at 40s (1200f), sits on tree until 88s (2640f), then flies up
  const birdArrive = spring({
    frame: frame - 1200,
    fps,
    config: { damping: 18, stiffness: 50 },
  });
  const birdLeave = interpolate(frame, [2640, 2760], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const birdX =
    interpolate(birdArrive, [0, 1], [1780, 1465]) + birdLeave * 420;
  const birdY =
    interpolate(birdArrive, [0, 1], [110, 425]) -
    Math.sin(birdArrive * Math.PI) * 60 -
    birdLeave * 260;
  const birdFlying = frame < 1265 || frame > 2640;
  const birdWingPhase = birdFlying ? frame * 0.45 : Math.sin(frame * 0.08) * 0.2;

  // 3 Call & Response rounds matching audio: 44s (1320f), 56s (1680f), 68s (2040f)
  let birdSingOpen = 0;
  let birdListening = false;
  let baaOpen = 0;
  let baaHop = 0;

  const rounds = [1320, 1680, 2040];
  for (const rStart of rounds) {
    // Bird sings for 1.2s (36f)
    if (frame >= rStart && frame < rStart + 36) {
      birdSingOpen = Math.abs(Math.sin((frame - rStart) * 0.38));
      birdListening = true;
    }
    // Baa responds at +4.4s (+132f) for 15 frames
    const baaStart = rStart + 132;
    if (frame >= baaStart && frame < baaStart + 18) {
      baaOpen = Math.sin(((frame - baaStart) / 18) * Math.PI);
      baaHop = Math.sin(((frame - baaStart) / 18) * Math.PI) * 24;
    }
  }

  // Head tilt & ear wiggle when listening
  const isListeningNow = brookListening || birdListening;
  const headTilt = isListeningNow ? Math.sin(frame * 0.04) * 9 - 6 : 0;
  const earWiggle = isListeningNow ? Math.sin(frame * 0.22) * 0.75 : 0;
  if (frame >= 1260 && frame < 2850) {
    facing = "right"; // face toward the Songbird on the tree!
  }

  // Sound Bubble #1 collects at 92s (2760f)
  const bubbleAppear = spring({
    frame: frame - 2760,
    fps,
    config: { damping: 16, stiffness: 55 },
  });
  const bubbleX =
    frame < 2880
      ? interpolate(bubbleAppear, [0, 1], [840, baaX - 95])
      : baaX - 95;
  const bubbleY =
    frame < 2880
      ? interpolate(bubbleAppear, [0, 1], [760, 585])
      : 585;

  // Breeze gently guides Baa eastward at 96s (2880f)
  const breezeGuide = interpolate(frame, [2860, 3400], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cloudDrift1 = Math.sin(frame * 0.008) * 32;
  const cloudDrift2 = Math.cos(frame * 0.007) * 26;

  return (
    <StorybookFrame
      backgroundColor={PALETTE.skyMorning}
      fadeInFrames={24}
      fadeOutFrames={24}
      totalFrames={durationInFrames}
    >
      {withAudio && <Audio src={staticFile("audio/scene2_cottage.mp3")} />}

      <AbsoluteFill>
        <svg
          viewBox="0 0 1920 1080"
          width="100%"
          height="100%"
          style={{ display: "block" }}
        >
          <CrayonDefs idPrefix="baa" />

          {/* Soft cream morning sky */}
          <rect x={0} y={0} width={1920} height={1080} fill={PALETTE.skyMorning} />

          {/* Floating sky clouds */}
          <PuffyCloud x={540} y={165} scale={1.35} driftX={cloudDrift1} />
          <PuffyCloud
            x={1420}
            y={220}
            scale={1.1}
            driftX={cloudDrift2}
            variant="flat"
          />

          {/* Distant blue mountain peaks */}
          <path
            d="M 0 545 Q 340 420 650 480 Q 980 285 1290 420 Q 1580 485 1920 515 L 1920 750 L 0 750 Z"
            fill={PALETTE.mountainFar}
            filter="url(#baa-crayon-edge)"
          />
          <path
            d="M 0 560 Q 420 475 720 505 Q 1080 390 1440 475 Q 1700 515 1920 535 L 1920 760 L 0 760 Z"
            fill={PALETTE.mountainMid}
            opacity={0.48}
            filter="url(#baa-crayon-edge)"
          />

          {/* Left rolling green cottage hill */}
          <path
            d="M 0 520 C 120 355, 380 330, 620 445 C 860 515, 1180 445, 1520 470 C 1720 485, 1840 505, 1920 525 L 1920 740 L 0 740 Z"
            fill={PALETTE.hillLightGreen}
            filter="url(#baa-crayon-edge)"
          />

          {/* Darker mid-ground green ridge */}
          <path
            d="M 920 510 C 1180 435, 1520 425, 1920 495 L 1920 620 L 920 620 Z"
            fill={PALETTE.hillMidGreen}
            opacity={0.78}
            filter="url(#baa-crayon-edge)"
          />

          {/* Warm sunlit foreground meadow meeting brook bend smoothly */}
          <path
            d="M 0 555 C 420 526, 760 518, 906 502 C 1080 516, 1460 535, 1920 560 L 1920 1080 L 0 1080 Z"
            fill={PALETTE.hillLightGreen}
          />

          {/* Winding singing brook emerging from valley bend */}
          <WindingBrook
            ripplePhase={(frame * 0.008) % 1}
            plinkPulse={plinkPulse}
            plinkSpot={{ x: 855, y: 745 }}
          />

          {/* Listening rings around the brook */}
          {brookListening && (
            <ListeningRipples
              x={855}
              y={745}
              phase={(frame * 0.014) % 1}
              color={PALETTE.creekHighlight}
              maxRadius={135}
            />
          )}

          {/* White Cottage with Terracotta Roof & Gentle Smoke */}
          <Cottage
            x={385}
            y={476}
            scale={1.45}
            smokePhase={(frame * 0.004) % 1}
          />

          {/* Swaying Rounded Green Tree */}
          <MeadowTree
            x={1525}
            y={540}
            scale={1.65}
            swayDeg={Math.sin(frame * 0.032) * 1.8}
          />

          {/* Grass tufts and yellow wildflowers */}
          {[
            [180, 770],
            [330, 680],
            [490, 860],
            [1060, 870],
            [1250, 740],
            [1410, 880],
            [1710, 780],
            [1790, 895],
          ].map(([gx, gy], idx) => (
            <CrayonGrassTuft
              key={idx}
              x={gx}
              y={gy}
              scale={1.15}
              swayDeg={Math.sin(frame * 0.04 + idx) * 2.5}
            />
          ))}

          {[
            [155, 835],
            [270, 915],
            [525, 920],
            [1155, 915],
            [1345, 845],
            [1625, 875],
            [1745, 910],
          ].map(([fx, fy], idx) => (
            <CrayonFlower
              key={idx}
              x={fx}
              y={fy}
              scale={1.2}
              glow={
                waterActive
                  ? 0.25 + 0.25 * Math.sin(frame * 0.07 + idx)
                  : 0
              }
            />
          ))}

          {/* Songbird on the tree */}
          {frame >= 1190 && frame <= 2770 && (
            <g>
              {birdListening && (
                <ListeningRipples
                  x={birdX - 18}
                  y={birdY - 6}
                  phase={(frame * 0.025) % 1}
                  color={PALETTE.terracottaLight}
                  maxRadius={90}
                />
              )}
              <Songbird
                x={birdX}
                y={birdY}
                scale={1.35}
                facing="left"
                wingPhase={birdWingPhase}
                singOpen={birdSingOpen}
              />
            </g>
          )}

          {/* Hero Lamb: Baa */}
          <Sheep
            x={baaX}
            y={715}
            scale={1.55}
            facing={facing}
            variant="baa"
            walkPhase={walkPhase}
            headTiltDeg={headTilt}
            earWiggle={earWiggle}
            blink={blink}
            baaOpen={baaOpen}
            hopY={baaHop}
          />

          {/* Sound Bubble #1 (Teal Brook Note) */}
          {frame >= 2755 && (
            <SoundBubble
              x={bubbleX}
              y={bubbleY}
              color={PALETTE.bubbleTeal}
              scale={1.25 * bubbleAppear}
              bobPhase={frame * 0.06}
              opacity={bubbleAppear}
            />
          )}

          {/* Breeze guiding eastward toward the Golden Meadow */}
          {breezeGuide > 0.02 && breezeGuide < 0.98 && (
            <BreezeSwirl
              x={interpolate(breezeGuide, [0, 1], [620, 1680])}
              y={450 + Math.sin(breezeGuide * Math.PI * 2) * 35}
              progress={Math.min(1, breezeGuide * 1.5)}
              scale={1.55}
              opacity={Math.sin(breezeGuide * Math.PI) * 0.78}
            />
          )}
        </svg>
      </AbsoluteFill>
    </StorybookFrame>
  );
};
