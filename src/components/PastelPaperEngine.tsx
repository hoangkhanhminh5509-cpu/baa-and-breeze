import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "../theme/palette";

/**
 * Reusable SVG filters giving crisp geometric vectors the organic,
 * warm wax-crayon / colored-pencil edge tooth seen in the reference picture book.
 * Using fixed seeds prevents distracting "line boil" for low-stimulation viewing.
 */
export const CrayonDefs: React.FC<{ idPrefix?: string }> = ({
  idPrefix = "baa",
}) => {
  return (
    <defs>
      <filter
        id={`${idPrefix}-crayon-edge`}
        x="-4%"
        y="-4%"
        width="108%"
        height="108%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.038"
          numOctaves={3}
          seed={7}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={3.6}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      <filter
        id={`${idPrefix}-crayon-fine`}
        x="-4%"
        y="-4%"
        width="108%"
        height="108%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.065"
          numOctaves={2}
          seed={19}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={2.2}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      <filter
        id={`${idPrefix}-soft-glow`}
        x="-40%"
        y="-40%"
        width="180%"
        height="180%"
      >
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <clipPath id={`${idPrefix}-card-clip`}>
        <rect x={36} y={32} width={1848} height={1016} rx={38} ry={38} />
      </clipPath>
    </defs>
  );
};

/**
 * Outer storybook canvas: warm cream watercolor paper background,
 * rounded-rectangle picture-book card viewport (matching the 3-panel aesthetic),
 * subtle crayon stipple tooth and tactile cold-press paper grain overlay.
 */
export const StorybookFrame: React.FC<{
  children: React.ReactNode;
  backgroundColor?: string;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  totalFrames?: number;
  fullBleed?: boolean;
  twilightTint?: number; // 0..1
}> = ({
  children,
  backgroundColor = PALETTE.paperCream,
  fadeInFrames = 18,
  fadeOutFrames = 18,
  totalFrames = 999999,
  fullBleed = false,
  twilightTint = 0,
}) => {
  const frame = useCurrentFrame();

  const fadeIn =
    fadeInFrames > 0
      ? interpolate(frame, [0, fadeInFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  const fadeOut =
    fadeOutFrames > 0
      ? interpolate(
          frame,
          [totalFrames - fadeOutFrames, totalFrames],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        )
      : 1;

  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.paperCream,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill style={{ opacity }}>
        {fullBleed ? (
          <AbsoluteFill style={{ backgroundColor }}>{children}</AbsoluteFill>
        ) : (
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 30,
              width: 1852,
              height: 1020,
              borderRadius: 38,
              overflow: "hidden",
              backgroundColor,
              boxShadow: "inset 0 0 0 2px rgba(143, 131, 70, 0.08)",
            }}
          >
            {children}
          </div>
        )}
      </AbsoluteFill>

      {/* Subtle dusk warmth / twilight atmospheric glaze */}
      {twilightTint > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: `rgba(88, 108, 142, ${twilightTint * 0.22})`,
            mixBlendMode: "multiply",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Wax-crayon stipple tooth overlay */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.48, mixBlendMode: "soft-light" }}>
        <Img
          src={staticFile("textures/crayon-tooth.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Cold-press paper fiber texture */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.52, mixBlendMode: "multiply" }}>
        <Img
          src={staticFile("textures/paper-grain.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Hand-drawn rounded puffy cloud matching the picture-book clouds.
 */
export const PuffyCloud: React.FC<{
  x: number;
  y: number;
  scale?: number;
  color?: string;
  driftX?: number;
  variant?: "fluffy" | "flat";
  filterId?: string;
}> = ({
  x,
  y,
  scale = 1,
  color = PALETTE.cloudBlue,
  driftX = 0,
  variant = "fluffy",
  filterId = "url(#baa-crayon-edge)",
}) => {
  return (
    <g
      transform={`translate(${x + driftX}, ${y}) scale(${scale})`}
      filter={filterId}
    >
      {variant === "fluffy" ? (
        <path
          d="M -145 24
             C -168 24, -178 2, -160 -15
             C -148 -28, -124 -26, -110 -20
             C -104 -52, -72 -68, -42 -58
             C -26 -82, 16 -84, 38 -58
             C 66 -66, 98 -48, 102 -20
             C 124 -24, 152 -10, 152 12
             C 152 26, 132 28, 110 28
             L -125 28
             C -136 28, -142 26, -145 24 Z"
          fill={color}
          opacity={0.94}
        />
      ) : (
        <path
          d="M -130 16
             C -145 16, -148 2, -132 -6
             C -116 -14, -92 -10, -76 -18
             C -54 -36, -18 -38, 6 -22
             C 30 -34, 62 -28, 76 -12
             C 96 -14, 126 -6, 128 8
             C 130 18, 114 18, 92 18
             L -110 18 Z"
          fill={color}
          opacity={0.9}
        />
      )}
    </g>
  );
};

/**
 * Simple 3-stroke crayon grass tuft (`///`) scattered on hills and fields.
 */
export const CrayonGrassTuft: React.FC<{
  x: number;
  y: number;
  scale?: number;
  color?: string;
  swayDeg?: number;
}> = ({
  x,
  y,
  scale = 1,
  color = PALETTE.grassStrokeGreen,
  swayDeg = 0,
}) => {
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${swayDeg}) scale(${scale})`}
      stroke={color}
      strokeWidth={3.2}
      strokeLinecap="round"
      fill="none"
    >
      <path d="M -8 0 Q -12 -10 -14 -16" />
      <path d="M 0 0 Q 0 -12 1 -19" />
      <path d="M 8 0 Q 12 -9 15 -14" />
    </g>
  );
};

/**
 * Little 4-petal yellow meadow flower that can bloom smoothly (0..1).
 */
export const CrayonFlower: React.FC<{
  x: number;
  y: number;
  scale?: number;
  bloom?: number;
  stemColor?: string;
  petalColor?: string;
  glow?: number;
}> = ({
  x,
  y,
  scale = 1,
  bloom = 1,
  stemColor = PALETTE.grassStrokeGreen,
  petalColor = PALETTE.flowerYellow,
  glow = 0,
}) => {
  const s = scale * (0.2 + 0.8 * bloom);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d="M 0 0 Q -2 -10 0 -18"
        stroke={stemColor}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 0 -6 Q -7 -11 -9 -15"
        stroke={stemColor}
        strokeWidth={2.4}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 0 -6 Q 7 -11 9 -15"
        stroke={stemColor}
        strokeWidth={2.4}
        strokeLinecap="round"
        fill="none"
      />
      {glow > 0 && (
        <circle
          cx={0}
          cy={-21}
          r={16 + glow * 8}
          fill={PALETTE.fireflyGlow}
          opacity={glow * 0.45}
        />
      )}
      <g transform={`translate(0, -21) scale(${s})`}>
        <ellipse cx={-5} cy={-3} rx={5.5} ry={4.2} fill={petalColor} />
        <ellipse cx={5} cy={-3} rx={5.5} ry={4.2} fill={petalColor} />
        <ellipse cx={-3} cy={3} rx={4.8} ry={4.2} fill={petalColor} />
        <ellipse cx={3} cy={3} rx={4.8} ry={4.2} fill={petalColor} />
        <circle cx={0} cy={0} r={3} fill={PALETTE.flowerCenter} />
      </g>
    </g>
  );
};
