import { Level } from '../types';
import {Game1originalImage,Game1modifiedImage, Game2originalImage,Game2modifiedImage, Game3originalImage,Game3modifiedImage,Game4originalImage,Game4modifiedImage,Game5originalImage,Game5modifiedImage, } from '../lib/images';
export const LEVELS: Level[] = [
  {
    id: 1,
    originalImage: Game1originalImage,
    modifiedImage: Game1modifiedImage,
    coverImage: Game1originalImage,
    differences: [
      { x: 80, y: 89, radius: 17 },
      { x: 49, y: 255, radius: 17 },
      { x: 189, y: 150, radius: 17 },
      { x: 162, y: 85, radius: 17 },
      { x: 176, y: 245, radius: 17 },
      { x: 389, y: 187, radius: 17 },
      { x: 276, y: 206, radius: 17 },
      { x: 291, y: 136, radius: 17 },
      { x: 325, y: 273, radius: 17 },
      { x: 94, y: 141, radius: 17 },

    ],
    isLocked: false
  },
  {
    id: 2,
    originalImage: Game2originalImage,
    modifiedImage:Game2modifiedImage,
    coverImage: Game2originalImage,
    differences: [
      { x: 371, y: 153, radius: 17 },
      { x: 300, y: 252, radius: 17 },
      { x: 384, y: 264, radius: 17 },
      { x: 131, y: 202, radius: 17 },
      { x: 220, y: 144, radius: 17 },
      { x: 208, y: 237, radius: 17 },
      { x: 81, y: 155, radius: 17 },
      { x: 48, y: 280, radius: 17 },
      { x: 98, y: 85, radius: 17 },
      { x: 298, y: 126, radius: 17 },

    ],
    isLocked: false
  },
  {
    id: 3,
    originalImage: Game3originalImage,
    modifiedImage: Game3modifiedImage,
    coverImage: Game3originalImage,
    differences: [
      { x: 388, y: 127, radius: 17 },
      { x: 147, y: 228, radius: 17 },
      { x: 306, y: 96, radius: 17 },
      { x: 205, y: 119, radius: 17 },
      { x: 295, y: 158, radius: 17 },
      { x: 67, y: 158, radius: 17 },
      { x: 343, y: 249, radius: 17 },
      { x: 88, y: 226, radius: 17 },
      { x: 222, y: 221, radius: 17 },
      { x: 360, y: 203, radius: 17 },

    ],
    isLocked: false
  },
  {
    id: 4,
    originalImage: Game4originalImage,
    modifiedImage: Game4modifiedImage,
    coverImage: Game4originalImage,
    differences: [
      { x: 176, y: 66, radius: 17 },
      { x: 132, y: 92, radius: 17 },
      { x: 215, y: 131, radius: 17 },
      { x: 235, y: 174, radius: 17 },
      { x: 64, y: 217, radius: 17 },
      { x: 188, y: 223, radius: 17 },
      { x: 117, y: 264, radius: 17 },
      { x: 280, y: 234, radius: 17 },
      { x: 326, y: 243, radius: 17 },
      { x: 379, y: 185, radius: 17 },
    ],
    isLocked: false
  },
  {
    id: 5,
    originalImage: Game5originalImage,
    modifiedImage: Game5modifiedImage,
    coverImage: Game5originalImage,
    differences: [
      { x: 323, y: 90, radius: 17 },
      { x: 224, y: 109, radius: 17 },
      { x: 348, y: 115, radius: 17 },
      { x: 327, y: 173, radius: 17 },
      { x: 356, y: 216, radius: 17 },
      { x: 253, y: 232, radius: 17 },
      { x: 162, y: 270, radius: 17 },
      { x: 58, y: 96, radius: 17 },
      { x: 84, y: 206, radius: 17 },
      { x: 93, y: 283, radius: 17 },
    ],
    isLocked: false
  },

];