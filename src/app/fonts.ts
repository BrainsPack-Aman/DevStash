// Every font the themes use. Each one only declares a CSS variable; themes pick
// theirs in globals.css and themes.css. The browser downloads a font once text
// is rendered in it, so only the default theme's body font is preloaded.
// Discord's and Claude's app fonts are proprietary: these are free look-alikes.
import {
  Figtree,
  Fira_Code,
  Fira_Sans,
  Geist,
  Geist_Mono,
  IBM_Plex_Sans,
  Inter,
  JetBrains_Mono,
  Noto_Sans,
  Source_Code_Pro,
  Source_Serif_4,
  Space_Grotesk,
} from "next/font/google";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

// Monospace fonts skip the generated fallback, which is based on a proportional
// font, so code stays monospace while they load.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
  adjustFontFallback: false,
});

const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], preload: false });

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  preload: false,
  adjustFontFallback: false,
});

// Not a variable font, so the weights in use are listed.
const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  preload: false,
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  preload: false,
});

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], preload: false });

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  preload: false,
  adjustFontFallback: false,
});

const notoSans = Noto_Sans({ variable: "--font-noto-sans", subsets: ["latin"], preload: false });

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  preload: false,
  adjustFontFallback: false,
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  preload: false,
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  preload: false,
});

export const FONT_VARIABLES = [
  geist,
  geistMono,
  figtree,
  firaCode,
  firaSans,
  plexSans,
  inter,
  jetBrainsMono,
  notoSans,
  sourceCodePro,
  sourceSerif,
  spaceGrotesk,
]
  .map((font) => font.variable)
  .join(" ");
