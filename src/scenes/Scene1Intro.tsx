import React from "react";
import {
  AbsoluteFill,
  Easing,
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
import { BreezeSwirl, Sheep } from "../components/Characters";
import {
  Cottage,
  Lighthouse,
  MeadowTree,
  Sailboat,
} from "../components/WorldElements";
import { HANDWRITING_FONT, PALETTE, SCRIPT_FONT } from "../theme/palette";

/**
 * Scene 1 (40s = 1200 frames):
 * Opens with the exact 3-panel storybook postcard composition from the reference artwork!
 * Then Breeze carries a glowing lost bell-note across the three worlds, waking Baa up,
 * and the camera glides smoothly into Panel 1 (Cottage Brook) to begin the adventure.
 */
export const Scene1Intro: React.FC<{ withAudio?: boolean }> = ({
  withAudio = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Gentle entrance of the 3 postcard panels (0 -> 2.5s)
  const p1Appear = spring({ frame: frame - 8, fps, config: { damping: 20 } });
  const p2Appear = spring({ frame: frame - 24, fps, config: { damping: 20 } });
  const p3Appear = spring({ frame: frame - 40, fps, config: { damping: 20 } });

  const quoteOpacity = interpolate(frame, [55, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Breeze steals/carries a golden bell-note from Cottage Porch across the cards (12s -> 24s)
  const breezeProgress = interpolate(frame, [360, 720], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breezeX = interpolate(breezeProgress, [0, 1], [420, 1520]);
  const breezeY = interpolate(breezeProgress, [0, 0.5, 1], [230, 520, 770]);

  // Baa hears the mystery note & tilts head curiously at 18s-26s
  const earWiggle =
    frame > 560 && frame < 850 ? Math.sin((frame - 560) * 0.25) : 0;
  const headTilt =
    frame > 560
      ? interpolate(frame, [560, 610, 780, 840], [0, -14, -14, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const baaHop =
    frame > 720 && frame < 840
      ? Math.abs(Math.sin(((frame - 720) / 30) * Math.PI)) * 14
      : 0;

  // Smooth storybook zoom into Panel 1 (28s -> 40s)
  const zoomProgress = interpolate(frame, [840, 1180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const cameraScale = interpolate(zoomProgress, [0, 1], [1, 2.35]);
  const cameraTranslateY = interpolate(zoomProgress, [0, 1], [0, 295]);

  // Subtle ambient drifts
  const cloudDrift = Math.sin(frame * 0.015) * 14;
  const sheepWalk = frame > 820 ? (frame - 820) * 0.14 : 0;
  const baaXWalk = interpolate(frame, [820, 1160], [1085, 960], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <StorybookFrame
      fullBleed
      backgroundColor={PALETTE.paperCream}
      fadeInFrames={20}
      fadeOutFrames={24}
      totalFrames={durationInFrames}
    >
      {withAudio && <Audio src={staticFile("audio/scene1_intro.mp3")} />}

      <AbsoluteFill>
        <svg
          viewBox="0 0 1920 1080"
          width="100%"
          height="100%"
          style={{ display: "block" }}
        >
          <CrayonDefs idPrefix="baa" />

          {/* Camera transform wrapping the 3-panel storybook postcard */}
          <g
            transform={`translate(960, 540) scale(${cameraScale}) translate(-960, ${-540 + cameraTranslateY})`}
          >
            {/* Floating sky clouds above Panel 1 */}
            <g opacity={p1Appear}>
              <PuffyCloud x={770} y={76} scale={0.78} driftX={cloudDrift} />
              <PuffyCloud
                x={1260}
                y={108}
                scale={0.58}
                driftX={-cloudDrift * 0.7}
                variant="flat"
              />
            </g>

            {/* ================= PANEL 1: COTTAGE & BROOK ================= */}
            <g
              opacity={p1Appear}
              transform={`translate(0, ${(1 - p1Appear) * 24})`}
            >
              <defs>
                <clipPath id="panel1-clip">
                  <path d="M 420 20 L 1500 20 L 1500 319 Q 1500 355 1464 355 L 456 355 Q 420 355 420 319 Z" />
                </clipPath>
              </defs>
              <g clipPath="url(#panel1-clip)">
                {/* Distant mountains resting cleanly on cream paper */}
                <path
                  d="M 420 265 Q 680 185 880 218 Q 1040 135 1230 198 Q 1380 225 1500 245 L 1500 355 L 420 355 Z"
                  fill={PALETTE.mountainFar}
                  filter="url(#baa-crayon-edge)"
                />
                {/* Rolling mid green hill */}
                <path
                  d="M 420 260 C 480 180, 620 165, 760 225 C 940 245, 1140 205, 1340 220 C 1420 225, 1470 235, 1500 245 L 1500 355 L 420 355 Z"
                  fill={PALETTE.hillLightGreen}
                  filter="url(#baa-crayon-edge)"
                />
                <path
                  d="M 960 238 C 1100 208, 1280 204, 1500 232 L 1500 278 L 960 278 Z"
                  fill={PALETTE.hillMidGreen}
                  opacity={0.75}
                />
                {/* Foreground bright meadow base */}
                <path
                  d="M 420 258 C 680 246, 1120 250, 1500 262 L 1500 355 L 420 355 Z"
                  fill={PALETTE.hillLightGreen}
                />
                {/* Winding stream */}
                <path
                  d="M 889 234 C 878 258, 945 274, 922 300 C 895 328, 765 335, 720 355 L 818 355 C 858 335, 962 315, 974 288 C 986 262, 914 248, 904 234 Z"
                  fill={PALETTE.creekBlue}
                  filter="url(#baa-crayon-fine)"
                />
                <path
                  d="M 920 268 C 930 282, 875 308, 810 340"
                  stroke={PALETTE.creekHighlight}
                  strokeWidth={3}
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Cottage, Tree & Baa */}
                <Cottage
                  x={618}
                  y={226}
                  scale={0.62}
                  smokePhase={(frame * 0.006) % 1}
                />
                <MeadowTree
                  x={1290}
                  y={255}
                  scale={0.78}
                  swayDeg={Math.sin(frame * 0.04) * 1.6}
                />
                <CrayonGrassTuft x={515} y={325} scale={0.65} />
                <CrayonGrassTuft x={690} y={310} scale={0.6} />
                <CrayonGrassTuft x={1020} y={328} scale={0.68} />
                <CrayonGrassTuft x={1415} y={318} scale={0.65} />
                <CrayonFlower x={490} y={335} scale={0.65} />
                <CrayonFlower x={1185} y={334} scale={0.65} />
                <CrayonFlower x={1380} y={336} scale={0.62} />

                <Sheep
                  x={baaXWalk}
                  y={292}
                  scale={0.68}
                  facing="left"
                  walkPhase={sheepWalk}
                  earWiggle={earWiggle}
                  headTiltDeg={headTilt}
                  hopY={baaHop}
                />
              </g>
            </g>

            {/* ================= PANEL 2: GOLDEN WHEAT MEADOW ================= */}
            <g
              opacity={p2Appear * (1 - zoomProgress * 0.9)}
              transform={`translate(0, ${(1 - p2Appear) * 24})`}
            >
              <defs>
                <clipPath id="panel2-clip">
                  <path d="M 420 362 L 1500 362 L 1500 581 Q 1500 617 1464 617 L 456 617 Q 420 617 420 581 Z" />
                </clipPath>
              </defs>
              <g clipPath="url(#panel2-clip)">
                {/* Distant periwinkle blue mountains peaking against cream sky */}
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
                {/* Left green bush ridge */}
                <path
                  d="M 420 498 C 460 476, 540 478, 595 504 L 420 515 Z"
                  fill={PALETTE.treeCanopy}
                />
                {/* Rolling golden wheat field */}
                <path
                  d="M 420 500 Q 960 491 1500 500 L 1500 617 L 420 617 Z"
                  fill={PALETTE.meadowGold}
                />
                {/* Mid-meadow botanical golden tufts */}
                {[
                  [490, 542],
                  [790, 535],
                  [940, 558],
                  [1390, 536],
                ].map(([tx, ty], idx) => (
                  <CrayonGrassTuft
                    key={idx}
                    x={tx}
                    y={ty}
                    scale={0.62}
                    color={PALETTE.wheatDarkStroke}
                  />
                ))}
                {/* Curved clustered golden wheat arches along bottom margin */}
                {Array.from({ length: 14 }).map((_, cIdx) => {
                  const cx = 465 + cIdx * 76 + ((cIdx * 13) % 10);
                  const sw = Math.sin(frame * 0.04 + cIdx * 0.6) * 4.5;
                  return (
                    <g
                      key={cIdx}
                      stroke={PALETTE.wheatStroke}
                      strokeWidth={2.8}
                      strokeLinecap="round"
                      fill="none"
                      opacity={0.82}
                    >
                      <path
                        d={`M ${cx - 8} 617 Q ${cx - 12 + sw * 0.5} 596 ${cx - 15 + sw} 584`}
                      />
                      <path
                        d={`M ${cx} 617 Q ${cx + sw * 0.5} 590 ${cx + sw} 574`}
                      />
                      <path
                        d={`M ${cx + 9} 617 Q ${cx + 13 + sw * 0.5} 598 ${cx + 17 + sw} 587`}
                      />
                    </g>
                  );
                })}
                <MeadowTree
                  x={1290}
                  y={516}
                  scale={0.78}
                  swayDeg={Math.sin(frame * 0.04 + 1) * 1.4}
                />
                <Sheep x={640} y={548} scale={0.65} facing="right" />
                <Sheep
                  x={1145}
                  y={562}
                  scale={0.68}
                  facing="left"
                  variant="pip"
                />
              </g>
            </g>

            {/* ================= PANEL 3: LIGHTHOUSE COVE ================= */}
            <g
              opacity={p3Appear * (1 - zoomProgress * 0.9)}
              transform={`translate(0, ${(1 - p3Appear) * 24})`}
            >
              <defs>
                <clipPath id="panel3-clip">
                  <path d="M 420 622 L 1500 622 L 1500 843 Q 1500 879 1464 879 L 456 879 Q 420 879 420 843 Z" />
                </clipPath>
              </defs>
              <g clipPath="url(#panel3-clip)">
                {/* Soft coastal apricot morning haze behind hills (no rectangular edge) */}
                <path
                  d="M 420 756 Q 600 732 820 758 Q 1080 738 1310 756 Q 1420 744 1500 758 L 1500 786 L 420 786 Z"
                  fill="#EFE0CD"
                  opacity={0.75}
                />
                {/* Soft peach coastal clouds hovering on cream paper */}
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
                {/* Purple-blue coastal island silhouette */}
                <path
                  d="M 850 785 Q 960 725 1045 745 Q 1120 755 1190 785 Z"
                  fill={PALETTE.mountainViolet}
                  filter="url(#baa-crayon-edge)"
                />
                {/* Calm sea bay */}
                <rect
                  x={690}
                  y={782}
                  width={810}
                  height={98}
                  fill={PALETTE.seaBlue}
                />
                {/* Horizontal ripple dashes */}
                {[
                  [980, 804],
                  [1140, 818],
                  [1390, 808],
                  [1060, 845],
                  [1280, 855],
                  [940, 862],
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
                    opacity={0.7}
                  />
                ))}
                {/* Left grassy cliff slope & sandy path */}
                <path
                  d="M 420 778 C 580 775, 760 792, 920 828 C 985 844, 1020 862, 1045 879 L 420 879 Z"
                  fill={PALETTE.hillLightGreen}
                />
                <path
                  d="M 595 824 C 680 822, 770 842, 855 879 L 765 879 C 705 852, 635 838, 575 836 Z"
                  fill={PALETTE.sandPath}
                />
                <Lighthouse
                  x={615}
                  y={762}
                  scale={0.44}
                  beamIntensity={0.22}
                  beamPhase={frame * 0.04}
                />
                <Sailboat
                  x={1290}
                  y={792}
                  scale={0.62}
                  bobY={Math.sin(frame * 0.06) * 3}
                  rockDeg={Math.cos(frame * 0.05) * 2.5}
                />
                <CrayonGrassTuft x={505} y={850} scale={0.6} />
                <CrayonGrassTuft x={925} y={855} scale={0.6} />
              </g>
            </g>

            {/* ================= BREEZE & MYSTERY GOLDEN CHIME ================= */}
            {frame > 350 && frame < 760 && (
              <g opacity={1 - zoomProgress}>
                <BreezeSwirl
                  x={breezeX}
                  y={breezeY}
                  progress={Math.min(1, breezeProgress * 1.4)}
                  scale={0.85}
                  opacity={0.78}
                />
                {/* Drifting little golden bell-note */}
                <g
                  transform={`translate(${breezeX + 45}, ${breezeY - 12 + Math.sin(frame * 0.14) * 10})`}
                >
                  <circle
                    cx={0}
                    cy={0}
                    r={18}
                    fill={PALETTE.fireflyGlow}
                    opacity={0.45}
                  />
                  <circle cx={0} cy={0} r={9} fill={PALETTE.flowerYellow} />
                </g>
              </g>
            )}

            {/* Curious "?" gentle sound-spark above Baa when note passes */}
            {frame > 560 && frame < 770 && (
              <g transform="translate(1070, 224)">
                <text
                  x={0}
                  y={0}
                  fontFamily={HANDWRITING_FONT}
                  fontSize={36}
                  fill={PALETTE.terracotta}
                  textAnchor="middle"
                >
                  ♪ ?
                </text>
              </g>
            )}

            {/* ================= STORYBOOK HANDWRITTEN QUOTE ================= */}
            <g opacity={quoteOpacity * (1 - zoomProgress * 1.3)}>
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

              {/* Subtle series mark in top-left cream margin */}
              <text
                x={92}
                y={74}
                fontFamily={HANDWRITING_FONT}
                fontSize={30}
                fill={PALETTE.inkOlive}
                opacity={0.78}
              >
                Baa &amp; Breeze · Ep. 1
              </text>
            </g>
          </g>
        </svg>
      </AbsoluteFill>
    </StorybookFrame>
  );
};
