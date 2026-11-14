import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
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
  Fireflies,
  Sheep,
  SoundBubble,
} from "../components/Characters";
import {
  Cottage,
  Lighthouse,
  MeadowTree,
  Sailboat,
} from "../components/WorldElements";
import { HANDWRITING_FONT, PALETTE, SCRIPT_FONT } from "../theme/palette";

/**
 * Scene 5 (70s = 2100 frames @ 30fps):
 * Earth's Symphony & Bedtime Lullaby Finale.
 * 0s-36s (0..1080f): Dusk symphony at Lighthouse Cove where all 3 Sound Bubbles
 * harmonize with drifting golden fireflies.
 * 36s-70s (1080..2100f): Gentle dissolve back to the signature 3-Panel Postcard,
 * with Baa & Pip curled up peacefully asleep and the iconic quote glowing.
 */
export const Scene5SymphonyFinale: React.FC<{ withAudio?: boolean }> = ({
  withAudio = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Cross-dissolve from Cove Symphony (Part A) into 3-Panel Postcard Bedtime (Part B)
  const postcardMix = interpolate(frame, [980, 1140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // 3 orbiting Sound Bubbles weaving together
  const orbitAngle = frame * 0.024;
  const bubble1X = 960 + Math.cos(orbitAngle) * 145;
  const bubble1Y = 390 + Math.sin(orbitAngle) * 52;
  const bubble2X = 960 + Math.cos(orbitAngle + (2 * Math.PI) / 3) * 145;
  const bubble2Y = 390 + Math.sin(orbitAngle + (2 * Math.PI) / 3) * 52;
  const bubble3X = 960 + Math.cos(orbitAngle + (4 * Math.PI) / 3) * 145;
  const bubble3Y = 390 + Math.sin(orbitAngle + (4 * Math.PI) / 3) * 52;

  const twilightGrad = interpolate(frame, [0, 900], [0.35, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const endQuoteOpacity = interpolate(frame, [1120, 1240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <StorybookFrame
      fullBleed
      backgroundColor={PALETTE.paperCream}
      fadeInFrames={24}
      fadeOutFrames={45}
      totalFrames={durationInFrames}
      twilightTint={twilightGrad * 0.55}
    >
      {withAudio && <Audio src={staticFile("audio/scene5_finale.mp3")} />}

      <AbsoluteFill>
        <svg
          viewBox="0 0 1920 1080"
          width="100%"
          height="100%"
          style={{ display: "block" }}
        >
          <CrayonDefs idPrefix="baa" />

          {/* ================= PART A: LIGHTHOUSE COVE SYMPHONY ================= */}
          <g opacity={1 - postcardMix}>
            {/* Rounded storybook viewport frame */}
            <g clipPath="url(#baa-card-clip)">
              {/* Cozy twilight sky gradient */}
              <defs>
                <linearGradient id="dusk-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9AB0CA" />
                  <stop offset="62%" stopColor="#E6D8CE" />
                  <stop offset="100%" stopColor="#F4DFC7" />
                </linearGradient>
              </defs>
              <rect x={34} y={30} width={1852} height={1020} fill="url(#dusk-sky)" />

              {/* Soft crescent moon & stars */}
              <g transform="translate(1520, 160)" opacity={0.85}>
                <circle cx={0} cy={0} r={34} fill={PALETTE.woolCream} />
                <circle cx={14} cy={-8} r={29} fill="#9FB4CD" />
              </g>

              <PuffyCloud
                x={760}
                y={220}
                scale={1.15}
                color={PALETTE.cloudPeach}
                driftX={Math.sin(frame * 0.008) * 18}
                variant="flat"
              />

              {/* Coastal island */}
              <path
                d="M 650 565 Q 890 365 1070 435 Q 1230 475 1380 565 Z"
                fill={PALETTE.mountainViolet}
                filter="url(#baa-crayon-edge)"
              />

              {/* Calm twilight sea */}
              <rect
                x={450}
                y={555}
                width={1450}
                height={500}
                fill="#A2C4D4"
              />
              {[
                [960, 635],
                [1210, 675],
                [1520, 625],
                [1120, 770],
                [1430, 810],
              ].map(([rx, ry], idx) => (
                <line
                  key={idx}
                  x1={rx + Math.sin(frame * 0.02 + idx) * 14}
                  y1={ry}
                  x2={rx + 85 + Math.sin(frame * 0.02 + idx) * 14}
                  y2={ry}
                  stroke={PALETTE.creekHighlight}
                  strokeWidth={5}
                  strokeLinecap="round"
                  opacity={0.48}
                />
              ))}

              {/* Cliff & path */}
              <path
                d="M 34 535 C 330 525, 660 595, 920 755 C 1035 835, 1110 945, 1165 1050 L 34 1050 Z"
                fill="#A4B861"
                filter="url(#baa-crayon-edge)"
              />
              <path
                d="M 275 705 C 455 715, 655 815, 815 1050 L 620 1050 C 505 885, 360 770, 225 745 Z"
                fill={PALETTE.sandPath}
              />

              <Lighthouse
                x={330}
                y={480}
                scale={1.32}
                beamPhase={frame * 0.02}
                beamIntensity={0.78}
              />
              <Sailboat
                x={1420}
                y={565}
                scale={1.4}
                bobY={Math.sin(frame * 0.03) * 5}
                rockDeg={Math.cos(frame * 0.025) * 2.5}
              />

              {/* Baa & Pip settling happily side by side */}
              <Sheep
                x={585}
                y={795}
                scale={1.45}
                facing="right"
                variant="baa"
                sleepy={frame > 600}
              />
              <Sheep
                x={740}
                y={825}
                scale={1.4}
                facing="right"
                variant="pip"
                sleepy={frame > 660}
              />

              {/* Orbiting trio of glowing Sound Bubbles */}
              <SoundBubble
                x={bubble1X}
                y={bubble1Y}
                color={PALETTE.bubbleTeal}
                scale={1.2}
                bobPhase={frame * 0.05}
              />
              <SoundBubble
                x={bubble2X}
                y={bubble2Y}
                color={PALETTE.bubbleGold}
                scale={1.2}
                bobPhase={frame * 0.05 + 1.4}
              />
              <SoundBubble
                x={bubble3X}
                y={bubble3Y}
                color={PALETTE.bubbleCoral}
                scale={1.2}
                bobPhase={frame * 0.05 + 2.8}
              />

              <Fireflies frame={frame} count={18} opacity={0.88} />
            </g>
          </g>

          {/* ================= PART B: BEDTIME 3-PANEL POSTCARD ================= */}
          <g opacity={postcardMix}>
            <rect x={0} y={0} width={1920} height={1080} fill={PALETTE.paperCream} />

            {/* Soft stars & moon in cream margins */}
            <PuffyCloud x={770} y={76} scale={0.76} color={PALETTE.cloudSoft} />
            <PuffyCloud
              x={1260}
              y={108}
              scale={0.56}
              color={PALETTE.cloudSoft}
              variant="flat"
            />

            {/* Top-open, bottom-rounded clip paths so trees, mountains & lighthouse dome never chop flat */}
            <defs>
              <clipPath id="fin-p1">
                <path d="M 420 20 L 1500 20 L 1500 319 Q 1500 355 1464 355 L 456 355 Q 420 355 420 319 Z" />
              </clipPath>
              <clipPath id="fin-p2">
                <path d="M 420 362 L 1500 362 L 1500 581 Q 1500 617 1464 617 L 456 617 Q 420 617 420 581 Z" />
              </clipPath>
              <clipPath id="fin-p3">
                <path d="M 420 622 L 1500 622 L 1500 843 Q 1500 879 1464 879 L 456 879 Q 420 879 420 843 Z" />
              </clipPath>
            </defs>

            <g clipPath="url(#fin-p1)">
              <path
                d="M 420 265 Q 680 185 880 218 Q 1040 135 1230 198 Q 1380 225 1500 245 L 1500 355 L 420 355 Z"
                fill={PALETTE.mountainFar}
                filter="url(#baa-crayon-edge)"
              />
              <path
                d="M 420 260 C 480 180, 620 165, 760 225 C 940 245, 1140 205, 1340 220 C 1420 225, 1470 235, 1500 245 L 1500 355 L 420 355 Z"
                fill="#A8BA66"
                filter="url(#baa-crayon-edge)"
              />
              <path
                d="M 889 234 C 878 258, 945 274, 922 300 C 895 328, 765 335, 720 355 L 818 355 C 858 335, 962 315, 974 288 C 986 262, 914 248, 904 234 Z"
                fill={PALETTE.creekBlue}
              />
              <Cottage
                x={618}
                y={226}
                scale={0.62}
                windowGlow={1}
                smokePhase={(frame * 0.005) % 1}
              />
              <MeadowTree x={1290} y={255} scale={0.78} />
              <CrayonFlower x={490} y={335} scale={0.65} />
              <CrayonGrassTuft x={1020} y={328} scale={0.68} />
              {/* Both lambs peacefully sleeping beside the tree */}
              <Sheep x={1075} y={295} scale={0.66} facing="left" sleepy />
              <Sheep
                x={1165}
                y={305}
                scale={0.62}
                facing="left"
                variant="pip"
                sleepy
              />
            </g>

            {/* Panel 2: Golden twilight meadow */}
            <g clipPath="url(#fin-p2)">
              <path
                d="M 420 495 Q 600 412 800 450 Q 980 415 1180 448 Q 1340 420 1500 475 L 1500 617 L 420 617 Z"
                fill={PALETTE.mountainFar}
                filter="url(#baa-crayon-edge)"
              />
              <path
                d="M 420 505 Q 580 432 760 462 Q 940 422 1150 475 Q 1320 465 1500 500 L 1500 617 L 420 617 Z"
                fill={PALETTE.mountainMid}
                filter="url(#baa-crayon-edge)"
              />
              <path
                d="M 420 498 C 460 476, 540 478, 595 504 L 420 515 Z"
                fill={PALETTE.treeCanopy}
              />
              <path
                d="M 420 500 Q 960 491 1500 500 L 1500 617 L 420 617 Z"
                fill="#EED36B"
              />
              {Array.from({ length: 14 }).map((_, cIdx) => {
                const cx = 465 + cIdx * 76 + ((cIdx * 13) % 10);
                return (
                  <g
                    key={cIdx}
                    stroke={PALETTE.wheatStroke}
                    strokeWidth={2.8}
                    strokeLinecap="round"
                    fill="none"
                    opacity={0.78}
                  >
                    <path d={`M ${cx - 8} 617 Q ${cx - 12} 596 ${cx - 15} 584`} />
                    <path d={`M ${cx} 617 Q ${cx} 590 ${cx} 574`} />
                    <path d={`M ${cx + 9} 617 Q ${cx + 13} 598 ${cx + 17} 587`} />
                  </g>
                );
              })}
              <MeadowTree x={1290} y={516} scale={0.78} />
              <SoundBubble
                x={760}
                y={530}
                color={PALETTE.bubbleGold}
                scale={0.65}
                bobPhase={frame * 0.05}
              />
            </g>

            {/* Panel 3: Lighthouse evening lantern */}
            <g clipPath="url(#fin-p3)">
              <path
                d="M 420 756 Q 600 732 820 758 Q 1080 738 1310 756 Q 1420 744 1500 758 L 1500 786 L 420 786 Z"
                fill="#EFE0CD"
                opacity={0.65}
              />
              <PuffyCloud
                x={945}
                y={696}
                scale={0.65}
                color={PALETTE.cloudPeach}
                variant="flat"
              />
              <PuffyCloud
                x={1305}
                y={704}
                scale={0.55}
                color={PALETTE.cloudPeach}
                variant="flat"
              />
              <path
                d="M 850 785 Q 960 725 1045 745 Q 1120 755 1190 785 Z"
                fill={PALETTE.mountainViolet}
                filter="url(#baa-crayon-edge)"
              />
              <rect x={690} y={782} width={810} height={98} fill="#A3C4D3" />
              {[
                [980, 804],
                [1140, 818],
                [1390, 808],
                [1060, 845],
                [1280, 855],
              ].map(([rx, ry], idx) => (
                <line
                  key={idx}
                  x1={rx}
                  y1={ry}
                  x2={rx + 44}
                  y2={ry}
                  stroke={PALETTE.seaRipple}
                  strokeWidth={3}
                  strokeLinecap="round"
                  opacity={0.65}
                />
              ))}
              <path
                d="M 420 778 C 580 775, 760 792, 920 828 C 985 844, 1020 862, 1045 879 L 420 879 Z"
                fill="#A5B863"
              />
              <path
                d="M 595 824 C 680 822, 770 842, 855 879 L 765 879 C 705 852, 635 838, 575 836 Z"
                fill={PALETTE.sandPath}
              />
              <Lighthouse
                x={615}
                y={762}
                scale={0.44}
                beamIntensity={0.65}
                beamPhase={frame * 0.03}
              />
              <Sailboat
                x={1290}
                y={792}
                scale={0.62}
                bobY={Math.sin(frame * 0.05) * 2.5}
              />
            </g>

            <Fireflies frame={frame} count={10} opacity={0.78} />

            {/* Closing quote & top-left margin bedtime mark (zero overlap) */}
            <g opacity={endQuoteOpacity}>
              <text
                x={92}
                y={74}
                fontFamily={HANDWRITING_FONT}
                fontSize={30}
                fill={PALETTE.inkOlive}
                opacity={0.78}
              >
                Goodnight, little listeners · Baa &amp; Breeze
              </text>
              <text
                x={615}
                y={945}
                fontFamily={SCRIPT_FONT}
                fontSize={46}
                fontWeight={600}
                fill={PALETTE.inkOlive}
                fontStyle="italic"
              >
                The earth has music
              </text>
              <text
                x={835}
                y={998}
                fontFamily={SCRIPT_FONT}
                fontSize={46}
                fontWeight={600}
                fill={PALETTE.inkOlive}
                fontStyle="italic"
              >
                for those who listen
              </text>
            </g>
          </g>
        </svg>
      </AbsoluteFill>
    </StorybookFrame>
  );
};
