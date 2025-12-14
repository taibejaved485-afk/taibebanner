import { PromptOption } from "./types";

export const DEFAULT_PROMPT = "Transform this image into a high-end promotional banner for a Web Design & Development Agency. Add technological overlays, coding symbols, and a modern cyberpunk aesthetic. Include a subtle 'Build Your Future' visual text effect.";

export const PRESET_PROMPTS: PromptOption[] = [
  {
    id: 'clean-modern',
    label: 'Clean & Modern',
    text: "Make it a clean, minimalist web design banner with whitespace and modern typography. Professional blue and white color scheme."
  },
  {
    id: 'dark-mode',
    label: 'Dark Mode Dev',
    text: "Apply a dark mode developer aesthetic. Use dark grays, neon syntax highlighting colors, and terminal-like visual elements."
  },
  {
    id: 'creative-studio',
    label: 'Creative Studio',
    text: "Make it artistic and vibrant, suitable for a creative digital agency. Use bold gradients and abstract geometric shapes."
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    text: "Add a futuristic cyberpunk neon filter, glitch effects, and high-tech HUD overlays."
  },
  {
    id: 'enterprise',
    label: 'Enterprise Corp',
    text: "Design a professional corporate banner. Use a navy blue and gold color palette, geometric grid patterns, and sleek, trustworthy business imagery."
  },
  {
    id: 'isometric-3d',
    label: '3D Isometric',
    text: "Transform the image into a trendy 3D isometric style. Use glassmorphism effects, floating UI elements, and soft, colorful lighting."
  },
  {
    id: 'retro-wave',
    label: 'Retro Synthwave',
    text: "Apply an 80s Retro Synthwave aesthetic. Use sunburst gradients, laser grids, neon purple grid lines, and a magenta-cyan color scheme."
  },
  {
    id: 'blueprint',
    label: 'Tech Blueprint',
    text: "Create a technical blueprint look. Use white schematic lines on a deep engineering blue background, looking like a software architecture diagram."
  }
];