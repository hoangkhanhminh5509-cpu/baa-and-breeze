import React from "react";
import { PALETTE } from "../theme/palette";

/**
 * White 3/4 picture-book cottage with solid warm terracotta roof plane,
 * cozy right gable wall, tiny charcoal window & doorway, and chimney smoke.
 */
export const Cottage: React.FC<{
  x: number;
  y: number;
  scale?: number;
  smokePhase?: number;
  showSmoke?: boolean;
  windowGlow?: number; // 0..1 warm evening glow
  filterId?: string;
}> = ({
  x,
  y,
  scale = 1,
  smokePhase = 0,
  showSmoke = true,
  windowGlow = 0,
  filterId = "url(#baa-crayon-edge)",
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} filter={filterId}>
      {/* Chimney tucked softly on the upper roof ridge */}
      <rect
        x={22}
        y={-84}
        width={15}
        height={28}
        rx={3}
        fill={PALETTE.terracotta}
      />

      {/* Soft curling smoke puffs */}
      {showSmoke &&
        [0, 0.35, 0.7].map((offset, idx) => {
          const p = (smokePhase + offset) % 1;
          const sy = -92 - p * 80;
          const sx = 29 + Math.sin(p * Math.PI * 2 + idx) * 13 + p * 16;
          const sr = 7 + p * 12;
          const sa = Math.sin(p * Math.PI) * 0.42;
          return (
            <circle
              key={idx}
              cx={sx}
              cy={sy}
              r={sr}
              fill={PALETTE.woolCream}
              opacity={sa}
            />
          );
        })}

      {/* Cream-white cottage main walls & right gable peak */}
      <path
        d="M -72 -14 L 4 -14 L 40 -54 L 74 -14 L 74 44 Q 74 48 69 48 L -67 48 Q -72 48 -72 44 Z"
        fill={PALETTE.woolCream}
      />
      {/* Subtle warm eave shadow under left roof edge and gable overhang */}
      <path
        d="M -72 -14 L 4 -14 L 40 -48 L 74 -14 L 74 -6 L 40 -40 L 4 -6 L -72 -6 Z"
        fill={PALETTE.woolShade}
        opacity={0.7}
      />

      {/* Solid warm terracotta roof plane (matching exact 3/4 picture-book cottage) */}
      <path
        d="M -86 -8
           Q -89 -13 -84 -19
           L -34 -74
           Q -31 -77 -27 -77
           L 38 -68
           Q 42 -67 45 -63
           L 86 -14
           Q 89 -9 84 -6
           L 74 -4
           L 40 -48
           L 8 -6
           Z"
        fill={PALETTE.terracotta}
      />
      {/* Gentle crayon roof highlight along the left upper slope */}
      <path
        d="M -76 -14 L -32 -70 L 32 -62 L 4 -14 Z"
        fill={PALETTE.terracottaLight}
        opacity={0.28}
      />

      {/* Tiny dark charcoal square window on the left wall */}
      <rect
        x={-48}
        y={4}
        width={17}
        height={17}
        rx={2.5}
        fill={windowGlow > 0.2 ? PALETTE.flowerYellow : PALETTE.charcoal}
        opacity={windowGlow > 0.2 ? 0.55 + windowGlow * 0.45 : 1}
      />
      {/* Rounded doorway on the right gable wall */}
      <path
        d="M 28 48 L 28 6 Q 28 -2 39 -2 Q 50 -2 50 6 L 50 48 Z"
        fill={PALETTE.charcoal}
      />
    </g>
  );
};

/**
 * Rounded organic picture-book tree with warm Y-trunk & swaying canopy.
 */
export const MeadowTree: React.FC<{
  x: number;
  y: number;
  scale?: number;
  swayDeg?: number;
  filterId?: string;
}> = ({
  x,
  y,
  scale = 1,
  swayDeg = 0,
  filterId = "url(#baa-crayon-edge)",
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} filter={filterId}>
      {/* Ground tuft shadow */}
      <ellipse
        cx={0}
        cy={62}
        rx={38}
        ry={7}
        fill="rgba(104, 128, 56, 0.22)"
      />
      {/* Trunk with subtle Y branch */}
      <path
        d="M -11 62 C -9 34, -8 10, -10 -14 L -26 -34 L -17 -38 L 0 -18 L 19 -36 L 26 -30 L 10 -10 C 8 12, 10 36, 13 62 Z"
        fill={PALETTE.treeTrunk}
      />
      {/* Canopy sways softly around trunk top */}
      <g transform={`translate(0, -48) rotate(${swayDeg})`}>
        <path
          d="M -52 24
             C -76 20, -86 -8, -70 -30
             C -68 -56, -42 -76, -14 -72
             C 6 -86, 44 -80, 58 -54
             C 82 -48, 88 -18, 70 4
             C 76 26, 52 38, 28 32
             C 12 40, -14 40, -28 32
             C -40 36, -48 30, -52 24 Z"
          fill={PALETTE.treeCanopy}
        />
        {/* Soft sunlit upper-left canopy texture patch */}
        <path
          d="M -48 -14 C -44 -48, -14 -66, 18 -60 C 26 -58, 36 -48, 30 -36 C 6 -44, -22 -30, -34 -6 C -42 -2, -48 -6, -48 -14 Z"
          fill={PALETTE.treeHighlight}
          opacity={0.55}
        />
      </g>
    </g>
  );
};

/**
 * Winding pastel sky-blue stream tucked cleanly into the hillside valley notch
 * with gentle flowing cream ripples.
 */
export const WindingBrook: React.FC<{
  ripplePhase?: number;
  plinkPulse?: number; // 0..1 when water plinks
  plinkSpot?: { x: number; y: number };
  filterId?: string;
}> = ({
  ripplePhase = 0,
  plinkPulse = 0,
  plinkSpot = { x: 830, y: 760 },
  filterId = "url(#baa-crayon-edge)",
}) => {
  const dashShift = ripplePhase * 120;
  return (
    <g>
      <path
        d="M 896 492
           C 875 552, 938 615, 922 678
           C 906 745, 735 785, 650 880
           C 600 935, 560 990, 515 1060
           L 785 1060
           C 818 990, 862 925, 912 865
           C 996 765, 1022 695, 986 630
           C 955 572, 918 538, 914 492
           Q 905 486 896 492 Z"
        fill={PALETTE.creekBlue}
        filter={filterId}
      />

      {/* Flowing soft cream-white surface lines */}
      <g
        fill="none"
        stroke={PALETTE.creekHighlight}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.85}
      >
        <path
          d="M 906 530 C 918 580, 955 620, 945 662"
          strokeDasharray="34 46"
          strokeDashoffset={-dashShift}
        />
        <path
          d="M 942 682 C 915 740, 825 780, 770 845"
          strokeDasharray="48 56"
          strokeDashoffset={-dashShift * 1.15}
        />
        <path
          d="M 755 875 C 705 935, 665 980, 630 1040"
          strokeDasharray="56 54"
          strokeDashoffset={-dashShift * 1.3}
        />
      </g>

      {/* Water droplet chime ring */}
      {plinkPulse > 0.02 && (
        <g transform={`translate(${plinkSpot.x}, ${plinkSpot.y})`}>
          <ellipse
            cx={0}
            cy={0}
            rx={14 + plinkPulse * 46}
            ry={6 + plinkPulse * 18}
            fill="none"
            stroke={PALETTE.woolCream}
            strokeWidth={3.5}
            opacity={(1 - plinkPulse) * 0.85}
          />
          <circle
            cx={0}
            cy={-plinkPulse * 34}
            r={5.5 * (1 - plinkPulse * 0.4)}
            fill={PALETTE.creekHighlight}
            opacity={1 - plinkPulse}
          />
        </g>
      )}
    </g>
  );
};

/**
 * Lush clustered organic curved wheat/grass tufts along the golden meadow foreground,
 * matching the soft hand-drawn rhythmic arches in the reference illustration.
 */
export const WheatBlades: React.FC<{
  frame: number;
  baseY?: number;
  count?: number;
  width?: number;
  windIntensity?: number;
}> = ({
  frame,
  baseY = 1055,
  count = 24,
  width = 1860,
  windIntensity = 1,
}) => {
  return (
    <g fill="none" strokeLinecap="round">
      {Array.from({ length: count }).map((_, cIdx) => {
        const clusterX =
          58 + (cIdx / Math.max(1, count - 1)) * (width - 116) + ((cIdx * 17) % 14);
        const clusterScale = 0.85 + ((cIdx * 31) % 35) / 100;
        // Travelling soft wave pulse across the golden meadow
        const wave =
          Math.sin(frame * 0.042 - cIdx * 0.45) * 14 * windIntensity +
          Math.sin(frame * 0.02 + cIdx * 0.2) * 5;

        const subBlades = [
          { dx: -16, h: 72 * clusterScale, curl: -18 + wave * 0.85, w: 4.2 },
          { dx: -4, h: 108 * clusterScale, curl: -6 + wave, w: 5.2 },
          { dx: 8, h: 94 * clusterScale, curl: 10 + wave * 1.05, w: 4.8 },
          { dx: 19, h: 64 * clusterScale, curl: 22 + wave * 0.8, w: 4.0 },
        ];

        return (
          <g key={cIdx}>
            {subBlades.map((b, bIdx) => {
              const x0 = clusterX + b.dx;
              const xTip = x0 + b.curl;
              const yTip = baseY - b.h;
              const cx = x0 + b.curl * 0.35;
              const cy = baseY - b.h * 0.52;
              return (
                <path
                  key={bIdx}
                  d={`M ${x0} ${baseY} Q ${cx} ${cy} ${xTip} ${yTip}`}
                  stroke={
                    (cIdx + bIdx) % 2 === 0
                      ? PALETTE.wheatStroke
                      : PALETTE.wheatDarkStroke
                  }
                  strokeWidth={b.w}
                  opacity={0.86}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

/**
 * Iconic white & terracotta-red coastal lighthouse with soft gradient-faded light beam.
 */
export const Lighthouse: React.FC<{
  x: number;
  y: number;
  scale?: number;
  beamPhase?: number; // 0..2pi
  beamIntensity?: number; // 0..1
  filterId?: string;
}> = ({
  x,
  y,
  scale = 1,
  beamPhase = 0,
  beamIntensity = 0.45,
  filterId = "url(#baa-crayon-edge)",
}) => {
  const beamStretch = 0.68 + 0.32 * Math.sin(beamPhase);
  const beamDir = Math.cos(beamPhase) >= 0 ? 1 : -1;
  const beamSpan = 720 * beamStretch;
  const gradId = beamDir > 0 ? "lh-beam-grad-right" : "lh-beam-grad-left";

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <defs>
        <linearGradient
          id="lh-beam-grad-right"
          x1="0%"
          y1="50%"
          x2="100%"
          y2="50%"
        >
          <stop offset="0%" stopColor={PALETTE.fireflyGlow} stopOpacity="0.48" />
          <stop offset="48%" stopColor={PALETTE.fireflyGlow} stopOpacity="0.2" />
          <stop offset="100%" stopColor={PALETTE.fireflyGlow} stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="lh-beam-grad-left"
          x1="100%"
          y1="50%"
          x2="0%"
          y2="50%"
        >
          <stop offset="0%" stopColor={PALETTE.fireflyGlow} stopOpacity="0.48" />
          <stop offset="48%" stopColor={PALETTE.fireflyGlow} stopOpacity="0.2" />
          <stop offset="100%" stopColor={PALETTE.fireflyGlow} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Smooth feather-fading light beam cone with zero hard edge */}
      {beamIntensity > 0.02 && (
        <g transform="translate(0, -210)" opacity={beamIntensity}>
          <path
            d={`M 0 -10 L ${beamDir * beamSpan} ${-155 + Math.sin(beamPhase) * 38} Q ${beamDir * (beamSpan + 45)} ${Math.sin(beamPhase) * 38} ${beamDir * beamSpan} ${155 + Math.sin(beamPhase) * 38} L 0 10 Z`}
            fill={`url(#${gradId})`}
          />
          <circle cx={0} cy={0} r={44} fill={PALETTE.fireflyGlow} opacity={0.28} />
        </g>
      )}

      <g filter={filterId}>
        {/* Tapered white stone tower */}
        <path
          d="M -52 120 L -32 -168 L 32 -168 L 52 120 Z"
          fill={PALETTE.woolCream}
        />
        {/* Subtle left shading */}
        <path
          d="M -52 120 L -32 -168 L -14 -168 L -28 120 Z"
          fill={PALETTE.woolShade}
          opacity={0.55}
        />

        {/* Single iconic terracotta horizontal band */}
        <path
          d="M -42 -44 L -37 -105 L 37 -105 L 42 -44 Z"
          fill={PALETTE.terracotta}
        />

        {/* Lower tiny charcoal window */}
        <rect
          x={-8}
          y={18}
          width={16}
          height={22}
          rx={2.5}
          fill={PALETTE.charcoal}
        />
        {/* Tiny arched door at foot */}
        <path
          d="M -11 120 L -11 92 Q -11 82 0 82 Q 11 82 11 92 L 11 120 Z"
          fill={PALETTE.charcoal}
        />

        {/* Golden gallery rail */}
        <rect
          x={-40}
          y={-174}
          width={80}
          height={12}
          rx={4}
          fill={PALETTE.railGold}
        />
        <path
          d="M -36 -174 L -36 -188 L 36 -188 L 36 -174"
          fill="none"
          stroke={PALETTE.railGold}
          strokeWidth={4}
        />

        {/* Cyan-glowing lantern room */}
        <rect
          x={-28}
          y={-228}
          width={56}
          height={42}
          rx={4}
          fill={PALETTE.lanternGlow}
        />
        {/* Warm inner bulb glow */}
        <ellipse
          cx={0}
          cy={-207}
          rx={14}
          ry={14}
          fill={PALETTE.fireflyGlow}
          opacity={0.45 + beamIntensity * 0.45}
        />
        {/* Slim mullions */}
        <line
          x1={-10}
          y1={-228}
          x2={-10}
          y2={-186}
          stroke={PALETTE.woolCream}
          strokeWidth={3.5}
        />
        <line
          x1={10}
          y1={-228}
          x2={10}
          y2={-186}
          stroke={PALETTE.woolCream}
          strokeWidth={3.5}
        />

        {/* Terracotta dome cap & finial */}
        <path
          d="M -34 -226 C -30 -252, -10 -266, 0 -272 C 10 -266, 30 -252, 34 -226 Z"
          fill={PALETTE.terracotta}
        />
        <circle cx={0} cy={-278} r={5.5} fill={PALETTE.terracotta} />

        {/* Friendly rounded green coastal bush hugging left foot */}
        <path
          d="M -92 124 C -96 98, -72 86, -54 94 C -42 80, -20 88, -22 108 C -10 112, -14 128, -32 128 L -82 128 Z"
          fill={PALETTE.bushGreen}
        />
      </g>
    </g>
  );
};

/**
 * Cozy orange-sailed wooden boat floating peacefully on gentle ocean dashes.
 */
export const Sailboat: React.FC<{
  x: number;
  y: number;
  scale?: number;
  bobY?: number;
  rockDeg?: number;
  bellRing?: number; // 0..1 pulse when boat bell rings
  filterId?: string;
}> = ({
  x,
  y,
  scale = 1,
  bobY = 0,
  rockDeg = 0,
  bellRing = 0,
  filterId = "url(#baa-crayon-fine)",
}) => {
  return (
    <g
      transform={`translate(${x}, ${y + bobY}) rotate(${rockDeg}) scale(${scale})`}
      filter={filterId}
    >
      {/* Subtle water reflection */}
      <ellipse
        cx={0}
        cy={26}
        rx={54}
        ry={6}
        fill={PALETTE.seaRipple}
        opacity={0.45}
      />

      {/* Mast */}
      <line
        x1={2}
        y1={4}
        x2={2}
        y2={-112}
        stroke={PALETTE.treeTrunk}
        strokeWidth={4.5}
        strokeLinecap="round"
      />

      {/* Main sunny-orange left sail */}
      <path
        d="M -2 -104 C -28 -68, -46 -32, -52 -6 L -2 -6 Z"
        fill={PALETTE.sailOrange}
      />
      {/* Front coral-orange jib sail */}
      <path
        d="M 6 -92 C 28 -58, 42 -30, 46 -8 L 6 -8 Z"
        fill={PALETTE.sailAmber}
      />

      {/* Terracotta-red curved hull */}
      <path
        d="M -62 -2 L 62 -2 C 56 18, 40 24, 24 24 L -28 24 C -46 24, -58 14, -62 -2 Z"
        fill={PALETTE.terracotta}
      />
      {/* Tiny hull rim */}
      <path
        d="M -62 -2 L 62 -2"
        stroke={PALETTE.woolCream}
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.55}
      />

      {/* Little brass harbor bell near bow */}
      <g
        transform={`translate(28, -8) rotate(${Math.sin(bellRing * Math.PI * 6) * 20 * bellRing})`}
      >
        <path
          d="M -4 0 Q -4 -7 0 -7 Q 4 -7 4 0 L 6 4 L -6 4 Z"
          fill={PALETTE.flowerYellow}
        />
        {bellRing > 0.05 && (
          <circle
            cx={0}
            cy={-2}
            r={12 + bellRing * 28}
            fill="none"
            stroke={PALETTE.fireflyGlow}
            strokeWidth={3}
            opacity={1 - bellRing}
          />
        )}
      </g>
    </g>
  );
};
