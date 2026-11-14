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
  SoundBubble,
} from "../components/Characters";
import { MeadowTree, WheatBlades } from "../components/WorldElements";
import { PALETTE } from "../theme/palette";

/**
 * Scene 3 (150s = 4500 frames @ 30fps):
 * Baa crosses into the Golden Wheat Meadow, meets Pip, dances in gentle 3/4 waltz,
 * plays the 1-2-3-4 Blooming Wildflower counting game, and collects Sound Bubble #2!
 */
export const Scene3GoldenMeadow: React.FC<{ withAudio?: boolean }> = ({
  withAudio = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Baa enters from left (0..480f: -120 -> 580), meets Pip (at 1140)
  // Then at 120s (3600f) both Baa & Pip trot rightwards off toward Lighthouse Cove!
  let baaX = 580;
  let baaWalk = 0;
  let pipX = 1140;
  let pipWalk = 0;
  let pipFacing: "left" | "right" = "left";

  if (frame < 480) {
    baaX = interpolate(frame, [0, 480], [-110, 580], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    baaWalk = frame * 0.2;
  } else if (frame >= 3600) {
    baaX = interpolate(frame, [3600, 4440], [580, 2060], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    pipX = interpolate(frame, [3600, 4440], [1140, 2320], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    baaWalk = (frame - 3600) * 0.19;
    pipWalk = (frame - 3600) * 0.19;
    pipFacing = "right";
  }

  // Greeting at 18s (540f) & 19s (570f)
  const baaGreet =
    frame >= 540 && frame < 564
      ? Math.sin(((frame - 540) / 24) * Math.PI)
      : 0;
  const pipGreet =
    frame >= 570 && frame < 594
      ? Math.sin(((frame - 570) / 24) * Math.PI)
      : 0;
  const heartOpacity = interpolate(
    frame,
    [555, 590, 680, 720],
    [0, 0.9, 0.9, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Waltz breeze waves (24s..115s = 720..3450f)
  const windIntensity =
    frame >= 720 && frame < 3450
      ? 1.0 + 0.55 * Math.sin(frame * 0.03)
      : 0.75;
  const breezeProgress = ((frame - 720) % 270) / 270;

  // 1-2-3-4 Flower Blooming Counting Game (48s, 66s, 84s = 1440f, 1980f, 2520f)
  const bloomStarts = [1440, 1980, 2520];
  const flowerBlooms = [0.22, 0.22, 0.22, 0.22];
  const flowerGlows = [0, 0, 0, 0];
  let cloudBounceIdx = -1;
  let pipCheerHop = 0;
  let pipCheerOpen = 0;

  for (const bs of bloomStarts) {
    if (frame >= bs && frame < bs + 480) {
      for (let idx = 0; idx < 4; idx++) {
        const tFlower = bs + idx * 66; // +2.2s each
        if (frame >= tFlower) {
          const p = spring({
            frame: frame - tFlower,
            fps,
            config: { damping: 14, stiffness: 90 },
          });
          flowerBlooms[idx] = Math.max(flowerBlooms[idx], 0.22 + 0.78 * p);
          if (frame < tFlower + 52) {
            flowerGlows[idx] = Math.sin(((frame - tFlower) / 52) * Math.PI);
            cloudBounceIdx = idx;
          }
        }
      }
      // Pip cheers at +10.0s (+300f)
      const cheerT = bs + 300;
      if (frame >= cheerT && frame < cheerT + 22) {
        pipCheerHop = Math.sin(((frame - cheerT) / 22) * Math.PI) * 28;
        pipCheerOpen = Math.sin(((frame - cheerT) / 22) * Math.PI);
      }
    }
  }
  if (frame >= 3000) {
    for (let i = 0; i < 4; i++) flowerBlooms[i] = 1;
  }

  // Sound Bubble #2 collects at 116s (3480f)
  const bubble2Appear = spring({
    frame: frame - 3480,
    fps,
    config: { damping: 16, stiffness: 55 },
  });
  const bubble2X =
    frame < 3600
      ? interpolate(bubble2Appear, [0, 1], [960, pipX - 110])
      : pipX - 110;
  const bubble2Y =
    frame < 3600
      ? interpolate(bubble2Appear, [0, 1], [730, 565])
      : 565;

  const baaBlink = frame % 130 <= 5;
  const pipBlink = (frame + 45) % 130 <= 5;

  const flowerCoords = [
    [435, 830],
    [710, 815],
    [985, 835],
    [1290, 820],
  ];

  return (
    <StorybookFrame
      backgroundColor={PALETTE.skyMorning}
      fadeInFrames={24}
      fadeOutFrames={24}
      totalFrames={durationInFrames}
    >
      {withAudio && <Audio src={staticFile("audio/scene3_meadow.mp3")} />}

      <AbsoluteFill>
        <svg
          viewBox="0 0 1920 1080"
          width="100%"
          height="100%"
          style={{ display: "block" }}
        >
          <CrayonDefs idPrefix="baa" />

          {/* Warm sunlit paper sky */}
          <rect x={0} y={0} width={1920} height={1080} fill={PALETTE.skyMorning} />

          {/* 4 counting rhythm clouds overhead */}
          {[
            { x: 320, y: 150, s: 0.95 },
            { x: 740, y: 120, s: 1.05 },
            { x: 1180, y: 145, s: 0.92 },
            { x: 1580, y: 165, s: 0.85 },
          ].map((c, idx) => {
            const bounce =
              cloudBounceIdx === idx
                ? -Math.sin(((frame % 52) / 52) * Math.PI) * 18
                : 0;
            return (
              <PuffyCloud
                key={idx}
                x={c.x}
                y={c.y + bounce}
                scale={c.s}
                driftX={Math.sin(frame * 0.008 + idx) * 24}
                variant={idx % 2 === 0 ? "fluffy" : "flat"}
              />
            );
          })}

          {/* Multi-layered blue mountain ridges matching Panel 2 */}
          <path
            d="M 0 435 Q 290 280 610 355 Q 920 275 1260 355 Q 1580 280 1920 400 L 1920 620 L 0 620 Z"
            fill={PALETTE.mountainFar}
            filter="url(#baa-crayon-edge)"
          />
          <path
            d="M 0 465 Q 320 330 670 390 Q 1030 305 1380 415 Q 1670 390 1920 460 L 1920 620 L 0 620 Z"
            fill={PALETTE.mountainMid}
            filter="url(#baa-crayon-edge)"
          />

          {/* Left emerald shrub hill */}
          <path
            d="M 0 460 C 140 405, 290 420, 410 492 L 0 510 Z"
            fill={PALETTE.treeCanopy}
            filter="url(#baa-crayon-edge)"
          />

          {/* Vast Golden Wheat Meadow with gentle curved organic hillside */}
          <path
            d="M 0 476 Q 480 452 960 472 Q 1460 450 1920 476 L 1920 1080 L 0 1080 Z"
            fill={PALETTE.meadowGold}
            filter="url(#baa-crayon-edge)"
          />
          {/* Subtle sunlit golden horizon warmth */}
          <path
            d="M 0 476 Q 480 452 960 472 Q 1460 450 1920 476 L 1920 585 L 0 585 Z"
            fill={PALETTE.meadowGoldWarm}
            opacity={0.32}
          />

          {/* Mid-field golden grass tufts */}
          {[
            [210, 620],
            [520, 585],
            [860, 610],
            [1160, 575],
            [1410, 625],
            [1730, 595],
            [350, 745],
            [920, 725],
            [1620, 755],
          ].map(([gx, gy], idx) => (
            <CrayonGrassTuft
              key={idx}
              x={gx}
              y={gy}
              scale={1.25}
              color={PALETTE.wheatDarkStroke}
              swayDeg={Math.sin(frame * 0.045 - idx * 0.6) * 5 * windIntensity}
            />
          ))}

          {/* Right green meadow tree */}
          <MeadowTree
            x={1520}
            y={505}
            scale={1.7}
            swayDeg={Math.sin(frame * 0.036 + 0.8) * 2.2 * windIntensity}
          />

          {/* 4 Blooming Wildflowers (1-2-3-4 Counting & Rhythm) */}
          {flowerCoords.map(([fx, fy], idx) => (
            <g key={idx}>
              {flowerGlows[idx] > 0.05 && (
                <ListeningRipples
                  x={fx}
                  y={fy - 22}
                  phase={(frame * 0.03) % 1}
                  color={PALETTE.terracottaLight}
                  maxRadius={75}
                />
              )}
              <CrayonFlower
                x={fx}
                y={fy}
                scale={1.55}
                bloom={flowerBlooms[idx]}
                stemColor={PALETTE.wheatDarkStroke}
                petalColor={PALETTE.woolCream}
                glow={flowerGlows[idx]}
              />
            </g>
          ))}

          {/* Breeze Swirl sweeping across the golden field */}
          {frame >= 720 && frame < 3450 && (
            <BreezeSwirl
              x={interpolate(breezeProgress, [0, 1], [-180, 2080])}
              y={420 + Math.sin(breezeProgress * Math.PI * 2) * 45}
              progress={Math.min(1, breezeProgress * 1.4)}
              scale={1.65}
              opacity={0.62}
            />
          )}

          {/* Baa (with Sound Bubble #1 trailing smoothly) */}
          <SoundBubble
            x={baaX - 105}
            y={560}
            color={PALETTE.bubbleTeal}
            scale={1.1}
            bobPhase={frame * 0.06}
            opacity={0.92}
          />
          <Sheep
            x={baaX}
            y={695}
            scale={1.52}
            facing="right"
            variant="baa"
            walkPhase={baaWalk}
            blink={baaBlink}
            baaOpen={baaGreet}
            hopY={baaGreet * 22}
            headTiltDeg={Math.sin(frame * 0.03) * 5}
          />

          {/* Pip (Friend Lamb with warm scarf) */}
          <Sheep
            x={pipX}
            y={715}
            scale={1.48}
            facing={pipFacing}
            variant="pip"
            walkPhase={pipWalk}
            blink={pipBlink}
            baaOpen={Math.max(pipGreet, pipCheerOpen)}
            hopY={Math.max(pipGreet * 20, pipCheerHop)}
            headTiltDeg={-Math.sin(frame * 0.032) * 5}
          />

          {/* Warm friendly heart sparkle when Baa & Pip meet */}
          {heartOpacity > 0.01 && (
            <g transform="translate(860, 560)" opacity={heartOpacity}>
              <path
                d="M 0 18 C -22 0, -28 -22, -12 -28 C -2 -32, 0 -20, 0 -16 C 0 -20, 2 -32, 12 -28 C 28 -22, 22 0, 0 18 Z"
                fill={PALETTE.terracottaLight}
                filter="url(#baa-crayon-fine)"
              />
            </g>
          )}

          {/* Sound Bubble #2 (Golden Wheat Note) */}
          {frame >= 3475 && (
            <SoundBubble
              x={bubble2X}
              y={bubble2Y}
              color={PALETTE.bubbleGold}
              scale={1.25 * bubble2Appear}
              bobPhase={frame * 0.065 + 1.2}
              opacity={bubble2Appear}
            />
          )}

          {/* Swaying foreground tall golden wheat blades */}
          <WheatBlades
            frame={frame}
            baseY={1060}
            count={24}
            width={1900}
            windIntensity={windIntensity}
          />
        </svg>
      </AbsoluteFill>
    </StorybookFrame>
  );
};
