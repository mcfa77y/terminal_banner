import figlet from "figlet";
import { ChalkAnimation } from "@figliolia/chalk-animation";
const goodFontList: string[] = [
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
];
const skipFontList = ["Bear", "Twisted", "Chiseled"];
function applyRandomFigletFont(text: string) {
  const fontList = figlet.fontsSync();
  const filteredFontList: string[] = fontList
    .filter((font) => !skipFontList.includes(font))
    .filter((font) => goodFontList.includes(font));

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
    // {
    //   animationFunction: ChalkAnimation.pulse,
    //   speed: 2,
    //   timeout: 1285,
    //   type: "pulse",
    // },
    {
      animationFunction: ChalkAnimation.radar,
      speed: 2,
      timeout: lengthDependentTimeout,
      type: "pulse",
    },
  ];
  // const animationIndex = Math.floor(Math.random() * animationList.length);
  const animationIndex = 3;
  const { animationFunction, speed, timeout, type } =
    animationList[animationIndex];
  return { animation: animationFunction(previewText, speed), timeout, type };
}
async function showFont(text: string = "") {
  const { figletText, font } = applyRandomFigletFont(text);
  const { animation, timeout, type } = applyRandomAnimation(figletText);
  animation.start();
  setTimeout(() => {
    // const rowCount = figletText.split("\n")[0].length;
    // const rowRatio = rowCount / (timeout / 1000);
    animation.stop();
    console.log(`${type} - ${font}`);
  }, timeout);
}

showFont("Fresh");
