import { continueRender, delayRender, staticFile } from "remotion";

export const HANDWRITING_FONT = "BaaPatrickHand";
export const SCRIPT_FONT = "BaaCaveat";

if (typeof document !== "undefined" && typeof FontFace !== "undefined") {
  const handle = delayRender("Loading local storybook fonts");
  Promise.all([
    new FontFace(
      HANDWRITING_FONT,
      `url(${staticFile("fonts/PatrickHand.woff2")}) format("woff2")`,
      { weight: "400", style: "normal" }
    ).load(),
    new FontFace(
      SCRIPT_FONT,
      `url(${staticFile("fonts/Caveat.woff2")}) format("woff2")`,
      { weight: "400 700", style: "normal" }
    ).load(),
  ])
    .then((loadedFaces) => {
      for (const face of loadedFaces) {
        document.fonts.add(face);
      }
      continueRender(handle);
    })
    .catch((err) => {
      console.error("Failed to load local fonts", err);
      continueRender(handle);
    });
}

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Exact pastel crayon & watercolor paper palette sampled from reference artwork
export const PALETTE = {
  // Paper & Ink
  paperCream: "#F6F0E1",
  paperWarm: "#EFE6D0",
  paperShadow: "#E5DAC0",
  inkOlive: "#8F8346",
  inkMuted: "#7C734B",
  charcoal: "#4C4842",
  charcoalSoft: "#5D5850",

  // Sky & Clouds
  skyMorning: "#F4EFE1",
  skySoftBlue: "#D6E8F0",
  cloudBlue: "#C4DFEC",
  cloudSoft: "#B3D1E2",
  cloudPeach: "#F1DEC9",
  cloudCream: "#F7EBDD",

  // Mountains
  mountainFar: "#B8D0E2",
  mountainMid: "#97B4CD",
  mountainDeep: "#7A97B8",
  mountainViolet: "#8597B9",

  // Meadows & Foliage
  hillLightGreen: "#BACB6D",
  hillMidGreen: "#9DB659",
  hillDeepGreen: "#719E4B",
  grassStrokeGreen: "#6E9141",
  treeCanopy: "#6EA64B",
  treeHighlight: "#82B65C",
  treeTrunk: "#7B5D43",
  bushGreen: "#73A44B",

  // Golden Wheat Meadow
  meadowGold: "#F7DD68",
  meadowGoldWarm: "#F2CE4F",
  wheatStroke: "#DFB234",
  wheatDarkStroke: "#CEA12B",

  // Water & Sand
  creekBlue: "#B5D7E6",
  creekHighlight: "#E3F1F6",
  seaBlue: "#B7D5DF",
  seaRipple: "#8DB6C6",
  sandPath: "#E7D5A4",

  // Cottage, Lighthouse, Sailboat & Sheep
  woolCream: "#FAF6E9",
  woolShade: "#ECE4CD",
  terracotta: "#CA5C3B",
  terracottaLight: "#DF754B",
  sailOrange: "#EA9A3E",
  sailAmber: "#DF7B39",
  railGold: "#CBB565",
  lanternGlow: "#BEE1ED",
  flowerYellow: "#F6D74C",
  flowerCenter: "#DF9C33",

  // Magic Sound & Twilight Hues
  breezeBlue: "#A8CCE0",
  bubbleTeal: "#8EC7CA",
  bubbleGold: "#F4CF5B",
  bubbleCoral: "#E68D6A",
  twilightSkyTop: "#7B93B2",
  twilightSkyBot: "#D9CFC6",
  twilightPaper: "#EFE7D6",
  fireflyGlow: "#FCE68C",
} as const;

export const SCENE_DURATIONS_SEC = {
  intro: 40,
  cottage: 120,
  meadow: 150,
  lighthouse: 130,
  finale: 70,
} as const;

export const TOTAL_DURATION_SEC =
  SCENE_DURATIONS_SEC.intro +
  SCENE_DURATIONS_SEC.cottage +
  SCENE_DURATIONS_SEC.meadow +
  SCENE_DURATIONS_SEC.lighthouse +
  SCENE_DURATIONS_SEC.finale; // 510s = 8m 30s
