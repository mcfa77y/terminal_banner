// @ts-ignore
import ChalkAnimation from "chalk-animation";
import { Command } from "commander";
import figlet, { Fonts } from "figlet";
import * as fs from "node:fs";
import * as path from "node:path";
const goodFontList: Set<string> = new Set([
  "Electronic",
  "Ghoulish",
  "Bloody",
  "Sub-Zero",
  "Crawford",
  "Small Slant",
  "Big Money-nw",
  "Bulbhead",
  "THIS",
  "ASCII New Roman",
  "Big Money-ne",
  "JS Block Letters",
  "Alligator",
  "Graceful",
  "Small Shadow",
  "Small",
  "NScript",
  "Calvin S",
  "Slant Relief",
  "Pepper",
  "Puffy",
  "DOS Rebel",
  "Dr Pepper",
  "Chunky",
  "AMC AAA01",
  "Script",
  "Varsity",
  "Soft",
  "3D Diagonal",
  "Sweet",
  "The Edge",
  "3D-ASCII",
  "Cursive",
  "Larry 3D",
  "Delta Corps Priest 1",
  "ANSI Shadow",
  "Invita",
  "Slant",
  "Santa Clara",
  "Swan",
  "Fraktur",
  "5 Line Oblique",
  "Caligraphy",
  "Doom",
  "Larry 3D 2",
  "Contessa",
  "NV Script",
  "Star Wars",
  "Jacky",
  "Big",
  "Ghost",
  "Merlin1",
  "Pagga",
  "Lean",
  "Elite",
  "Fire Font-k",
  "ANSI Regular",
  "Ogre",
  "Patorjk-HeX",
  "Standard",
  "Modular",
  "Roman",
  "SL Script",
]);
const skipFontList: Set<string> = new Set(["Bear", "Twisted", "Chiseled"]);

// Cooldown configuration
const COOLDOWN_FILE = path.join(process.cwd(), "figlet-cooldown.json");
const DEFAULT_COOLDOWN_HOURS = 1;

interface CooldownData {
  lastRun: number;
}

function readCooldownData(): CooldownData | null {
  try {
    if (!fs.existsSync(COOLDOWN_FILE)) {
      return null;
    }
    const data = fs.readFileSync(COOLDOWN_FILE, "utf8");
    return JSON.parse(data) as CooldownData;
  } catch (error) {
    console.error("Error reading cooldown data:", error);
    return null;
  }
}

function writeCooldownData(timestamp: number): void {
  try {
    const data: CooldownData = { lastRun: timestamp };
    fs.writeFileSync(COOLDOWN_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing cooldown data:", error);
  }
}

function isCooldownExpired(cooldownHours: number): boolean {
  const cooldownData = readCooldownData();
  if (!cooldownData) {
    return true; // No previous run, so cooldown is expired
  }

  const now = Date.now();
  const cooldownMs = cooldownHours * 60 * 60 * 1000;
  const timeSinceLastRun = now - cooldownData.lastRun;

  return timeSinceLastRun >= cooldownMs;
}

function applyRandomFigletFont(text: string) {
  const fontList: Fonts[] = figlet.fontsSync();
  const filteredFontList: Fonts[] = fontList
    .filter((font) => !skipFontList.has(font))
    .filter((font) => goodFontList.has(font));

  const fontIndex = Math.floor(Math.random() * filteredFontList.length);
  const font = filteredFontList[fontIndex];
  const figletText = figlet.textSync(text, { font: font });
  return { font, figletText };
}

function applyRandomAnimation(previewText: string) {
  const ratio = 0.33;
  const rowCount = previewText.split("\n")[0].length;
  const lengthDependentTimeout = Math.floor((rowCount / ratio) * 10);
  const animationList = [
    {
      animationFunction: ChalkAnimation.rainbow,
      speed: 1,
      timeout: 1000,
      type: "rainbow",
    },
    {
      animationFunction: ChalkAnimation.neon,
      speed: 1.5,
      timeout: 1200,
      type: "neon",
    },
    {
      animationFunction: ChalkAnimation.glitch,
      speed: 1.0,
      timeout: 1000,
      type: "glitch",
    },
    {
      animationFunction: ChalkAnimation.karaoke,
      speed: 2.5,
      timeout: lengthDependentTimeout,
      type: "karaoke",
    },

    {
      animationFunction: ChalkAnimation.radar,
      speed: 2,
      timeout: lengthDependentTimeout,
      type: "pulse",
    },
  ];
  const animationIndex = Math.floor(Math.random() * animationList.length);
  const { animationFunction, speed, timeout, type } =
    animationList[animationIndex];
  return { animation: animationFunction(previewText, speed), timeout, type };
}

async function showFont(text = "", useCoolDown = true, cooldownHours = DEFAULT_COOLDOWN_HOURS) {
  if (useCoolDown && !isCooldownExpired(cooldownHours)) {
    const cooldownData = readCooldownData();
    if (cooldownData) {
      const now = Date.now();
      const timeSinceLastRun = now - cooldownData.lastRun;
      const remainingMs = (cooldownHours * 60 * 60 * 1000) - timeSinceLastRun;
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
      console.log(`Cooldown active. Please wait ${remainingMinutes} more minutes.`);
    }
    return;
  }

  const { figletText, font } = applyRandomFigletFont(text);
  const { animation, timeout, type } = applyRandomAnimation(figletText);
  animation.start();
  setTimeout(() => {
    animation.stop();
    console.log(`${type} - ${font}`);
  }, timeout);

  // Update cooldown timestamp after successful execution
  if (useCoolDown) {
    writeCooldownData(Date.now());
  }
}

const program = new Command();

program
  .option("-t, --text <text>", "The text to display", "Fresh")
  .option("-f, --font <font>", "The font to use")
  .option("-c, --cooldown <hours>", "Cooldown period in hours", DEFAULT_COOLDOWN_HOURS.toString())
  .option("--no-cooldown", "Disable cooldown check")
  .action((options: any) => {
    const cooldownHours = Number.parseFloat(options.cooldown);
    showFont(options.text, options.cooldown, cooldownHours);
  })
  .parse(process.argv);
