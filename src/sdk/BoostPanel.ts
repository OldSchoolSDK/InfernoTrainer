"use strict";

import { PlayerStats } from "./PlayerStats";
import { Viewport } from "./Viewport";

import AttackXpDropImage from "../assets/images/xpdrops/attack.png";
import StrengthXpDropImage from "../assets/images/xpdrops/strength.png";
import DefenceXpDropImage from "../assets/images/xpdrops/defence.png";
import RangeXpDropImage from "../assets/images/xpdrops/range.png";
import MagicXpDropImage from "../assets/images/xpdrops/magic.png";
import { ImageLoader } from "./utils/ImageLoader";

const BOOST_VISIBLE_STATS: (keyof PlayerStats)[] = [
  "attack",
  "strength",
  "defence",
  "range",
  "magic",
];

const BOOST_IMAGE_SRC: {[type in keyof PlayerStats]?: string} = {
  "attack": AttackXpDropImage,
  "strength": StrengthXpDropImage,
  "defence": DefenceXpDropImage,
  "range": RangeXpDropImage,
  "magic": MagicXpDropImage,
};

const BOOST_IMAGES = {};

Object.entries(BOOST_IMAGE_SRC).forEach(([skill, src]) => {
  BOOST_IMAGES[skill] = ImageLoader.createImage(src);
});

export class BoostPanel {
  

  draw(context: CanvasRenderingContext2D, scale: number, xLeft: number, yBottom: number) {
    const player = Viewport.viewport.player;
    if (!player) {
      return;
    }
    context.save();
    const boostedStats = BOOST_VISIBLE_STATS.filter((stat) => player.currentStats[stat] !== player.stats[stat]);
    context.globalAlpha = 0.5;
    context.fillStyle = "black";
    const CELL_SIZE = 24;
    const width = scale * CELL_SIZE;
    const height = scale * CELL_SIZE * boostedStats.length;
    context.fillRect(xLeft, yBottom - height, width, height)
    context.globalAlpha = 1;
    let y = yBottom - scale * CELL_SIZE;
    context.font = `${scale * 12}px OSRS`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    for (const boostedStat of boostedStats) {
      const current = player.currentStats[boostedStat];
      const target = player.stats[boostedStat];
      context.drawImage(
        BOOST_IMAGES[boostedStat],
        xLeft,
        y,
        scale * CELL_SIZE,
        scale * CELL_SIZE,
      );
      context.fillStyle = "black";
      context.fillText(`${current}`, xLeft + (scale * CELL_SIZE) / 2 + 1, y + (scale * CELL_SIZE) / 2 + 1);
      if (current < target) {
        context.fillStyle = "red";
      } else {
        context.fillStyle = "lime";
      }
      context.fillText(`${current}`, xLeft + (scale * CELL_SIZE) / 2, y + (scale * CELL_SIZE) / 2);
      y -= scale * CELL_SIZE;
    }
    context.restore();
  }
}
