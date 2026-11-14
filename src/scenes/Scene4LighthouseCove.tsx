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
  CrayonGrassTuft,
  PuffyCloud,
  StorybookFrame,
} from "../components/PastelPaperEngine";
import {
  ListeningRipples,
  Sheep,
  SoundBubble,
} from "../components/Characters";
import { Lighthouse, Sailboat } from "../components/WorldElements";
import { PALETTE } from "../theme/palette";

/**
 * Scene 4 (130s = 3900 frames @ 30fps):
 * Baa & Pip arrive down the coastal path to Lighthouse Cove.
 * Gentle 8-second Ocean Tide breathing swells, orange sailboat ringing its
 * missing harbor bell, soft apricot golden-hour transition, and Sound Bubble #3!
 */
export const Scene4LighthouseCove: React.FC<{ withAudio?: boolean }> = ({
  withAudio = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Baa & Pip walk down coastal grassy slope onto overlook (0..780f = 0..26s)
  let baaX = 585;
  let pipX = 740;
  let walkPhase = 0;

  if (frame < 780) {
    baaX = interpolate(frame, [0, 780], [-140, 585], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    pipX = interpolate(frame, [0, 780], [-300, 740], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    walkPhase = frame * 0.19;
  }

  // 8-second (240 frame) Ocean Tide breathing cycle synchronized with audio swells
  const tideCycle = 0.5 - 0.5 * Math.cos((2 * Math.PI * frame) / 240);
  const boatBobY = Math.sin(frame * 0.035) * 7 - tideCycle * 8;
  const boatRockDeg = Math.cos(frame * 0.03) * 3.2;
  const boatDriftX = Math.sin(frame * 0.009) * 55;

  // Harbor bell chimes every 8s (240 frames) from 28s (840f) to 108s (3240f)
  const bellActive = frame >= 840 && frame < 3240;
  const bellLocal = ((frame - 840) % 240 + 240) % 240;
  const bellRing = bellActive && bellLocal < 55 ? bellLocal / 55 : 0;

  // Sky softly transitions from morning cream to warm apricot sunset
  const sunsetMix = interpolate(frame, [1600, 3800], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const skyColor = sunsetMix < 0.5 ? PALETTE.skyMorning : "#F3E5D0";

  // Sound Bubble #3 rises from sailboat at 104s (3120f)
  const bubble3Appear = spring({
    frame: frame - 3120,
    fps,
    config: { damping: 16, stiffness: 50 },
  });
  const bubble3X = interpolate(
    bubble3Appear,
    [0, 1],
    [1420 + boatDriftX, 895]
  );
  const bubble3Y = interpolate(bubble3Appear, [0, 1], [595, 585]);

  const baaBlink = frame % 120 <= 5;
  const pipBlink = (frame + 55) % 120 <= 5;

  return (
    <StorybookFrame
      backgroundColor={skyColor}
      fadeInFrames={24}
      fadeOutFrames={24}
      totalFrames={durationInFrames}
    >
      {withAudio && <Audio src={staticFile("audio/scene4_lighthouse.mp3")} />}

      <AbsoluteFill>
        <svg
          viewBox="0 0 1920 1080"
          width="100%"
          height="100%"
          style={{ display: "block" }}
        >
          <CrayonDefs idPrefix="baa" />

          {/* Sky backdrop warming subtly toward golden hour */}
          <rect x={0} y={0} width={1920} height={1080} fill={PALETTE.skyMorning} />
          <rect
            x={0}
            y={0}
            width={1920}
            height={680}
            fill="#F4DEC2"
            opacity={sunsetMix * 0.65}
          />

          {/* Soft apricot coastal horizon clouds */}
          <PuffyCloud
            x={820}
            y={235}
            scale={1.2}
            color={PALETTE.cloudPeach}
            driftX={Math.sin(frame * 0.008) * 24}
            variant="flat"
          />
          <PuffyCloud
            x={1470}
            y={260}
            scale={1.05}
            color={PALETTE.cloudPeach}
            driftX={-Math.cos(frame * 0.007) * 20}
            variant="flat"
          />

          {/* Soft violet-blue distant coastal island */}
          <path
            d="M 650 565 Q 890 365 1070 435 Q 1230 475 1380 565 Z"
            fill={PALETTE.mountainViolet}
            filter="url(#baa-crayon-edge)"
          />

          {/* Calm pastel turquoise-blue ocean bay */}
          <rect
            x={450}
            y={550 - tideCycle * 10}
            width={1470}
            height={530}
            fill={PALETTE.seaBlue}
          />

          {/* Horizontal ocean ripple dashes shifting gently with tide */}
          {[
            [920, 620],
            [1190, 650],
            [1560, 610],
            [1030, 720],
            [1350, 745],
            [1680, 710],
            [1150, 845],
            [1490, 875],
            [1730, 830],
            [1260, 960],
            [1620, 945],
          ].map(([rx, ry], idx) => {
            const dx = Math.sin(frame * 0.025 + idx) * 18;
            return (
              <line
                key={idx}
                x1={rx + dx}
                y1={ry - tideCycle * 6}
                x2={rx + 85 + dx}
                y2={ry - tideCycle * 6}
                stroke={PALETTE.seaRipple}
                strokeWidth={5.5}
                strokeLinecap="round"
                opacity={0.72}
              />
            );
          })}

          {/* Gentle coastal wave foam crest breathing near shore */}
          <path
            d={`M ${880 - tideCycle * 28} 1020 Q ${950 - tideCycle * 22} 840 ${820 - tideCycle * 18} 680`}
            fill="none"
            stroke={PALETTE.creekHighlight}
            strokeWidth={7}
            strokeLinecap="round"
            opacity={0.35 + tideCycle * 0.45}
          />

          {/* Left grassy coastal cliff & winding sandy trail */}
          <path
            d="M 0 530 C 310 520, 660 595, 920 755 C 1035 835, 1110 945, 1165 1080 L 0 1080 Z"
            fill={PALETTE.hillLightGreen}
            filter="url(#baa-crayon-edge)"
          />
          <path
            d="M 275 705 C 455 715, 655 815, 815 1080 L 620 1080 C 505 885, 360 770, 225 745 Z"
            fill={PALETTE.sandPath}
            filter="url(#baa-crayon-fine)"
          />

          {/* Iconic Red-and-White Lighthouse with warming evening beam */}
          <Lighthouse
            x={330}
            y={480}
            scale={1.32}
            beamPhase={frame * 0.025}
            beamIntensity={0.2 + sunsetMix * 0.55}
          />

          {/* Orange Sailboat bobbing in the bay */}
          <Sailboat
            x={1420 + boatDriftX}
            y={565}
            scale={1.45}
            bobY={boatBobY}
            rockDeg={boatRockDeg}
            bellRing={bellRing}
          />

          {/* Listening ripples when harbor bell rings */}
          {bellActive && bellLocal < 85 && (
            <ListeningRipples
              x={1420 + boatDriftX + 35}
              y={545 + boatBobY}
              phase={bellLocal / 85}
              color={PALETTE.fireflyGlow}
              maxRadius={155}
            />
          )}

          {/* Coastal grass tufts */}
          {[
            [115, 835],
            [245, 910],
            [455, 930],
            [860, 915],
            [980, 985],
          ].map(([gx, gy], idx) => (
            <CrayonGrassTuft
              key={idx}
              x={gx}
              y={gy}
              scale={1.2}
              swayDeg={Math.sin(frame * 0.04 + idx) * 3}
            />
          ))}

          {/* Sound Bubbles #1 & #2 floating with Baa & Pip */}
          <SoundBubble
            x={baaX - 85}
            y={645}
            color={PALETTE.bubbleTeal}
            scale={1.05}
            bobPhase={frame * 0.06}
            opacity={0.92}
          />
          <SoundBubble
            x={pipX - 45}
            y={625}
            color={PALETTE.bubbleGold}
            scale={1.05}
            bobPhase={frame * 0.06 + 1.2}
            opacity={0.92}
          />

          {/* Sound Bubble #3 arriving from the boat */}
          {frame >= 3115 && (
            <SoundBubble
              x={bubble3X}
              y={bubble3Y}
              color={PALETTE.bubbleCoral}
              scale={1.15 * bubble3Appear}
              bobPhase={frame * 0.06 + 2.4}
              opacity={bubble3Appear}
            />
          )}

          {/* Baa & Pip watching the harbor boat */}
          <Sheep
            x={baaX}
            y={795}
            scale={1.45}
            facing="right"
            variant="baa"
            walkPhase={walkPhase}
            blink={baaBlink}
            headTiltDeg={bellLocal < 45 && bellActive ? -10 : 0}
          />
          <Sheep
            x={pipX}
            y={825}
            scale={1.4}
            facing="right"
            variant="pip"
            walkPhase={walkPhase * 1.05}
            blink={pipBlink}
            headTiltDeg={bellLocal < 45 && bellActive ? -8 : 0}
          />
        </svg>
      </AbsoluteFill>
    </StorybookFrame>
  );
};
