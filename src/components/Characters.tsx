import React from "react";
import { PALETTE } from "../theme/palette";

export type SheepProps = {
  x: number;
  y: number;
  scale?: number;
  facing?: "left" | "right";
  variant?: "baa" | "pip";
  walkPhase?: number; // continuously increments while walking
  headTiltDeg?: number;
  earWiggle?: number; // -1..1
  blink?: boolean;
  sleepy?: boolean;
  baaOpen?: number; // 0..1 for gentle singing/bleating cue
  hopY?: number;
  filterId?: string;
};

/**
 * Hand-crafted picture-book sheep matching the exact proportions and soft,
 * unoutlined cream-wool & charcoal-face aesthetic of the reference artwork.
 */
export const Sheep: React.FC<SheepProps> = ({
  x,
  y,
  scale = 1,
  facing = "left",
  variant = "baa",
  walkPhase = 0,
  headTiltDeg = 0,
  earWiggle = 0,
  blink = false,
  sleepy = false,
  baaOpen = 0,
  hopY = 0,
  filterId = "url(#baa-crayon-fine)",
}) => {
  const dir = facing === "left" ? 1 : -1;
  const leg1Swing = Math.sin(walkPhase) * 7;
  const leg2Swing = Math.sin(walkPhase + Math.PI) * 7;
  const bodyBob = Math.abs(Math.sin(walkPhase)) * 4;
  const isSleepy = sleepy;

  return (
    <g
      transform={`translate(${x}, ${y - hopY - bodyBob}) scale(${scale * dir}, ${scale})`}
      filter={filterId}
    >
      {/* Subtle ground shadow on grass */}
      <ellipse
        cx={4}
        cy={38 + bodyBob}
        rx={46}
        ry={8}
        fill="rgba(76, 72, 66, 0.11)"
      />

      {/* 4 stubby rounded legs (matching the reference sheep silhouettes) */}
      <g fill={PALETTE.charcoal}>
        {/* Back far legs */}
        <rect
          x={-26 + leg2Swing * 0.6}
          y={12}
          width={8}
          height={26}
          rx={4}
        />
        <rect
          x={18 + leg1Swing * 0.6}
          y={12}
          width={8}
          height={26}
          rx={4}
        />
        {/* Front near legs */}
        <rect
          x={-16 + leg1Swing}
          y={14}
          width={8}
          height={26}
          rx={4}
        />
        <rect
          x={28 + leg2Swing}
          y={14}
          width={8}
          height={26}
          rx={4}
        />
      </g>

      {/* Fluffy scalloped wool cloud body */}
      <g>
        <path
          d="M -38 -4
             C -46 -18, -32 -36, -16 -34
             C -8 -44, 14 -44, 22 -34
             C 38 -36, 52 -22, 46 -6
             C 56 6, 48 24, 32 22
             C 22 28, 6 28, -4 23
             C -16 28, -32 24, -36 14
             C -46 12, -46 2, -38 -4 Z"
          fill={PALETTE.woolCream}
        />
        {/* Soft lower wool shadow crescent */}
        <path
          d="M -34 12 C -18 22, 18 24, 38 15 C 32 23, 10 27, -6 22 C -18 26, -32 22, -34 12 Z"
          fill={PALETTE.woolShade}
          opacity={0.7}
        />
        {/* Cute little round fluffy tail on back right */}
        <circle cx={48} cy={-4} r={10} fill={PALETTE.woolCream} />
      </g>

      {/* Pip's tiny warm terracotta ribbon scarf so kids recognize Baa's friend */}
      {variant === "pip" && (
        <g transform="translate(-26, -2)">
          <path
            d="M -8 -6 Q 6 6 16 14"
            stroke={PALETTE.terracottaLight}
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 8 6 L 18 16"
            stroke={PALETTE.terracotta}
            strokeWidth={4.5}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Charcoal oval head + droopy ears (tilts curiously when listening!) */}
      <g transform={`translate(-36, -12) rotate(${headTiltDeg})`}>
        {/* Far ear */}
        <ellipse
          cx={-6}
          cy={-11 + earWiggle * 3}
          rx={10}
          ry={5.5}
          transform={`rotate(${-24 + earWiggle * 16}, -6, -11)`}
          fill={PALETTE.charcoal}
        />
        {/* Head oval */}
        <ellipse
          cx={-2}
          cy={0}
          rx={17}
          ry={14}
          transform="rotate(-12)"
          fill={PALETTE.charcoal}
        />
        {/* Near ear */}
        <ellipse
          cx={11}
          cy={-6 - earWiggle * 3}
          rx={10}
          ry={5.5}
          transform={`rotate(${28 - earWiggle * 18}, 11, -6)`}
          fill={PALETTE.charcoal}
        />
        {/* Little wool tuft on top of head */}
        <circle cx={4} cy={-14} r={7.5} fill={PALETTE.woolCream} />
        <circle cx={-3} cy={-13} r={5.5} fill={PALETTE.woolCream} />
        {variant === "pip" && (
          <circle cx={9} cy={-12} r={5} fill={PALETTE.woolCream} />
        )}

        {/* Gentle eyes */}
        {isSleepy || blink ? (
          <g
            stroke={PALETTE.woolCream}
            strokeWidth={2.2}
            strokeLinecap="round"
            fill="none"
          >
            <path d="M -10 -1 Q -6 2 -3 -1" />
            <path d="M 1 -2 Q 5 1 8 -2" />
          </g>
        ) : (
          <g>
            <circle cx={-7} cy={-1} r={2.4} fill={PALETTE.woolCream} />
            <circle cx={3} cy={-2} r={2.4} fill={PALETTE.woolCream} />
            {/* Tiny warm catchlights */}
            <circle cx={-7.7} cy={-1.8} r={0.8} fill={PALETTE.charcoal} />
            <circle cx={2.3} cy={-2.8} r={0.8} fill={PALETTE.charcoal} />
          </g>
        )}

        {/* Soft rosy cheek */}
        <ellipse
          cx={4}
          cy={5}
          rx={3.8}
          ry={2.2}
          fill={variant === "pip" ? "#E89A82" : "#C98574"}
          opacity={0.72}
        />

        {/* Gentle happy/singing mouth when bleating */}
        {baaOpen > 0.05 && (
          <ellipse
            cx={-8}
            cy={7}
            rx={3.5 * baaOpen + 1}
            ry={3.2 * baaOpen + 0.5}
            fill="#E69E8C"
          />
        )}
      </g>
    </g>
  );
};

/**
 * Tiny friendly terracotta-breasted songbird.
 */
export const Songbird: React.FC<{
  x: number;
  y: number;
  scale?: number;
  facing?: "left" | "right";
  wingPhase?: number;
  singOpen?: number;
}> = ({
  x,
  y,
  scale = 1,
  facing = "left",
  wingPhase = 0,
  singOpen = 0,
}) => {
  const dir = facing === "left" ? 1 : -1;
  const wingLift = Math.sin(wingPhase) * 14;

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale * dir}, ${scale})`}
      filter="url(#baa-crayon-fine)"
    >
      {/* Legs */}
      <path
        d="M -2 12 L -4 22 M 5 12 L 5 22"
        stroke={PALETTE.charcoal}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Tail */}
      <path
        d="M 14 2 L 32 -8 L 28 4 Z"
        fill={PALETTE.mountainDeep}
      />
      {/* Plump body */}
      <ellipse cx={2} cy={2} rx={16} ry={13} fill={PALETTE.mountainMid} />
      {/* Warm terracotta breast */}
      <path
        d="M -13 0 C -14 10, -3 15, 6 12 C 1 4, -5 -2, -13 0 Z"
        fill={PALETTE.terracottaLight}
      />
      {/* Animated wing */}
      <path
        d={`M -2 -2 Q 12 ${-12 - wingLift} 20 ${2 - wingLift * 0.5} Q 8 10 -2 4 Z`}
        fill={PALETTE.mountainDeep}
      />
      {/* Beak */}
      <path
        d={`M -13 -3 L -22 ${-1 - singOpen * 2} L -13 1 Z`}
        fill={PALETTE.sailOrange}
      />
      {singOpen > 0.1 && (
        <path
          d={`M -13 1 L -21 ${3 + singOpen * 3} L -13 4 Z`}
          fill={PALETTE.terracotta}
        />
      )}
      {/* Eye */}
      <circle cx={-7} cy={-3} r={2.2} fill={PALETTE.charcoal} />
      <circle cx={-7.6} cy={-3.6} r={0.7} fill={PALETTE.woolCream} />
    </g>
  );
};

/**
 * Playful swirling pastel-blue wind curl representing "Breeze".
 */
export const BreezeSwirl: React.FC<{
  x: number;
  y: number;
  progress: number; // 0..1 travel progress
  scale?: number;
  opacity?: number;
}> = ({ x, y, progress, scale = 1, opacity = 0.72 }) => {
  const dashOffset = (1 - progress) * 420;
  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      opacity={opacity}
      fill="none"
      strokeLinecap="round"
    >
      <path
        d="M -180 18 C -90 -24, -10 26, 65 -6 C 110 -24, 150 -10, 146 16 C 142 36, 108 32, 114 12"
        stroke={PALETTE.breezeBlue}
        strokeWidth={6.5}
        strokeDasharray="240 240"
        strokeDashoffset={dashOffset}
      />
      <path
        d="M -130 42 C -50 14, 30 48, 105 22 C 136 10, 158 26, 144 40"
        stroke={PALETTE.creekHighlight}
        strokeWidth={4}
        strokeDasharray="190 220"
        strokeDashoffset={dashOffset * 0.9}
      />
      {/* Tiny floating music-pollen flecks */}
      <circle
        cx={-40 + progress * 160}
        cy={-14 + Math.sin(progress * Math.PI * 3) * 10}
        r={4}
        fill={PALETTE.flowerYellow}
        opacity={0.75}
      />
      <circle
        cx={-100 + progress * 200}
        cy={18 + Math.cos(progress * Math.PI * 2) * 12}
        r={3}
        fill={PALETTE.woolCream}
        opacity={0.85}
      />
    </g>
  );
};

/**
 * Expanding low-stimulation concentric rings indicating a natural sound source
 * ("Listen carefully...").
 */
export const ListeningRipples: React.FC<{
  x: number;
  y: number;
  phase: number; // 0..1 repeating cycle
  color?: string;
  maxRadius?: number;
}> = ({ x, y, phase, color = PALETTE.breezeBlue, maxRadius = 110 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} fill="none">
      {[0, 0.33, 0.66].map((offset, idx) => {
        const p = (phase + offset) % 1;
        const r = 18 + p * maxRadius;
        const alpha = Math.sin(p * Math.PI) * 0.65;
        return (
          <circle
            key={idx}
            cx={0}
            cy={0}
            r={r}
            stroke={color}
            strokeWidth={3.5}
            strokeDasharray="12 8"
            opacity={alpha}
          />
        );
      })}
    </g>
  );
};

/**
 * Glowing pastel Sound Bubble collected by Baa in each habitat.
 */
export const SoundBubble: React.FC<{
  x: number;
  y: number;
  color: string;
  scale?: number;
  bobPhase?: number;
  opacity?: number;
}> = ({
  x,
  y,
  color,
  scale = 1,
  bobPhase = 0,
  opacity = 1,
}) => {
  const dy = Math.sin(bobPhase) * 9;
  const pulse = 1 + Math.sin(bobPhase * 1.5) * 0.05;
  return (
    <g
      transform={`translate(${x}, ${y + dy}) scale(${scale * pulse})`}
      opacity={opacity}
    >
      <circle cx={0} cy={0} r={34} fill={color} opacity={0.28} />
      <circle
        cx={0}
        cy={0}
        r={24}
        fill={color}
        opacity={0.85}
        filter="url(#baa-crayon-fine)"
      />
      <circle cx={-7} cy={-8} r={6} fill={PALETTE.woolCream} opacity={0.55} />
      {/* Simple curved eighth-note emblem */}
      <g fill={PALETTE.woolCream} stroke={PALETTE.woolCream} strokeWidth={2.6} strokeLinecap="round">
        <circle cx={-3} cy={6} r={4.2} />
        <path d="M 1 6 L 1 -9 Q 8 -6 10 -1" fill="none" />
      </g>
    </g>
  );
};

/**
 * Gentle drifting golden twilight fireflies for Scene 5 bedtime calming.
 */
export const Fireflies: React.FC<{
  frame: number;
  count?: number;
  areaWidth?: number;
  areaHeight?: number;
  opacity?: number;
}> = ({
  frame,
  count = 14,
  areaWidth = 1800,
  areaHeight = 900,
  opacity = 1,
}) => {
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }).map((_, i) => {
        const seedX = ((i * 397) % 100) / 100;
        const seedY = ((i * 613) % 100) / 100;
        const speed = 0.015 + (i % 5) * 0.004;
        const cx =
          80 +
          seedX * (areaWidth - 160) +
          Math.sin(frame * speed + i) * 45;
        const cy =
          80 +
          seedY * (areaHeight - 200) +
          Math.cos(frame * speed * 0.8 + i * 2) * 32;
        const glow = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame * 0.06 + i * 1.7));
        return (
          <g key={i} transform={`translate(${cx}, ${cy})`}>
            <circle
              cx={0}
              cy={0}
              r={15}
              fill={PALETTE.fireflyGlow}
              opacity={glow * 0.34}
            />
            <circle
              cx={0}
              cy={0}
              r={7.5}
              fill={PALETTE.flowerYellow}
              opacity={glow * 0.52}
            />
            <circle
              cx={0}
              cy={0}
              r={3.5}
              fill={PALETTE.woolCream}
              opacity={glow * 0.92}
            />
          </g>
        );
      })}
    </g>
  );
};
