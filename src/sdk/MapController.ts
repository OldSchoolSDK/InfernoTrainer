import MapBoarder from "../assets/images/interface/map_border.png";
import MapSelectedNumberOrb from "../assets/images/interface/map_selected_num_orb.png";
import MapNumberOrb from "../assets/images/interface/map_num_orb.png";
import MapBorderMask from "../assets/images/interface/map_border_mask.png";
import CompassIcon from "../assets/images/interface/compass.png";
import MapHitpointOrb from "../assets/images/interface/map_hitpoint_orb.png";
import MapPrayerOrb from "../assets/images/interface/map_prayer_orb.png";
import MapPrayerSelectedOrb from "../assets/images/interface/map_prayer_on_orb.png";

import MapRunOrb from "../assets/images/interface/map_run_orb.png";
import MapNoSpecOrb from "../assets/images/interface/map_no_spec_orb.png";
import MapSpecOrb from "../assets/images/interface/map_spec_orb.png";
import MapSpecOnOrb from "../assets/images/interface/map_spec_on_orb.png";

import MapXpButton from "../assets/images/interface/map_xp_button.png";
import MapXpHoverButton from "../assets/images/interface/map_xp_hover_button.png";

import MapHitpointIcon from "../assets/images/interface/map_hitpoint_icon.png";
import MapPrayerIcon from "../assets/images/interface/map_prayer_icon.png";
import MapWalkIcon from "../assets/images/interface/map_walk_icon.png";
import MapRunIcon from "../assets/images/interface/map_run_icon.png";
import MapStamIcon from "../assets/images/interface/map_stam_icon.png";
import MapSpecIcon from "../assets/images/interface/map_spec_icon.png";

import ColorScale from "color-scales";
import { PlayerStats } from "./PlayerStats";
import { ImageLoader } from "./utils/ImageLoader";
import { Settings } from "./Settings";
import { ControlPanelController } from "./ControlPanelController";
import { MenuOption } from "./ContextMenu";
import { Chrome } from "./Chrome";
import { Viewport } from "./Viewport";

/* eslint-disable @typescript-eslint/no-explicit-any */

enum MapHover {
  NONE = 0,
  HITPOINT = 1,
  PRAYER = 2,
  RUN = 3,
  SPEC = 4,
  XP = 5,
}

const INITIAL_WIDTH = 210;
const INITIAL_HEIGHT = 180;

export class MapController {
  static controller = new MapController();

  colorScale: ColorScale = new ColorScale(0, 1, ["#FF0000", "#FF7300", "#00FF00"], 1);

  outlineImage: HTMLImageElement = ImageLoader.createImage(MapBoarder);
  mapAlphaImage: HTMLImageElement = ImageLoader.createImage(MapBorderMask);
  mapNumberOrb = ImageLoader.createImage(MapNumberOrb);
  mapSelectedNumberOrb = ImageLoader.createImage(MapSelectedNumberOrb);
  mapHitpointOrb = ImageLoader.createImage(MapHitpointOrb);
  mapPrayerOrb = ImageLoader.createImage(MapPrayerOrb);
  mapPrayerSelectedOrb = ImageLoader.createImage(MapPrayerSelectedOrb);
  mapRunOrb = ImageLoader.createImage(MapRunOrb);
  mapNoSpecOrb = ImageLoader.createImage(MapNoSpecOrb);
  mapSpecOrb = ImageLoader.createImage(MapSpecOrb);
  mapSpecOnOrb = ImageLoader.createImage(MapSpecOnOrb);
  mapHitpointIcon = ImageLoader.createImage(MapHitpointIcon);
  mapPrayerIcon = ImageLoader.createImage(MapPrayerIcon);
  mapWalkIcon = ImageLoader.createImage(MapWalkIcon);
  mapRunIcon = ImageLoader.createImage(MapRunIcon);
  mapStamIcon = ImageLoader.createImage(MapStamIcon);
  mapSpecIcon = ImageLoader.createImage(MapSpecIcon);
  mapXpButton = ImageLoader.createImage(MapXpButton);
  mapXpHoverButton = ImageLoader.createImage(MapXpHoverButton);

  mapCanvas: OffscreenCanvas;

  compassImage: OffscreenCanvas;
  mapHitpointOrbMasked: OffscreenCanvas;
  mapPrayerOrbMasked: OffscreenCanvas;
  mapRunOrbMasked: OffscreenCanvas;
  mapSpecOrbMasked: OffscreenCanvas;

  currentStats: PlayerStats;
  stats: PlayerStats;

  hovering: MapHover = null;

  width: number;
  height: number;
  constructor() {
    this.width = INITIAL_WIDTH;
    this.height = INITIAL_HEIGHT;

    this.hovering = MapHover.NONE;
    this.loadImages();
  }

  updateOrbsMask(currentStats: PlayerStats, stats: PlayerStats) {
    if (currentStats) {
      this.currentStats = currentStats;
    }
    if (stats) {
      this.stats = stats;
    }

    if (!this.mapHitpointOrb || !this.mapPrayerOrb || !this.mapRunOrb || !this.mapSpecOrb) {
      return;
    }
    const hitpointPercentage = this.currentStats.hitpoint / this.stats.hitpoint;

    this.mapHitpointOrbMasked = new OffscreenCanvas(this.mapHitpointOrb.width, this.mapHitpointOrb.height);
    let ctx = this.mapHitpointOrbMasked.getContext("2d");

    ctx.fillStyle = "white";
    ctx.drawImage(this.mapHitpointOrb, 0, 0);
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillRect(
      0,
      this.mapHitpointOrb.height * (1 - hitpointPercentage),
      this.mapHitpointOrb.width,
      this.mapHitpointOrb.height * hitpointPercentage,
    );
    ctx.globalCompositeOperation = "source-over";

    const prayerPercentage = this.currentStats.prayer / this.stats.prayer;
    this.mapPrayerOrbMasked = new OffscreenCanvas(this.mapPrayerOrb.width, this.mapPrayerOrb.height);
    ctx = this.mapPrayerOrbMasked.getContext("2d");
    ctx.fillStyle = "white";
    ctx.drawImage(
      ControlPanelController.controls.PRAYER.hasQuickPrayersActivated ? this.mapPrayerSelectedOrb : this.mapPrayerOrb,
      0,
      0,
    );
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillRect(
      0,
      this.mapPrayerOrb.height * (1 - prayerPercentage),
      this.mapPrayerOrb.width,
      this.mapPrayerOrb.height * prayerPercentage,
    );
    ctx.globalCompositeOperation = "source-over";

    const runPercentage = this.currentStats.run / 10000;
    this.mapRunOrbMasked = new OffscreenCanvas(this.mapRunOrb.width, this.mapRunOrb.height);
    ctx = this.mapRunOrbMasked.getContext("2d");
    ctx.fillStyle = "white";
    ctx.drawImage(Viewport.viewport.player.running ? this.mapRunOrb : this.mapNoSpecOrb, 0, 0);
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillRect(
      0,
      this.mapRunOrb.height * (1 - runPercentage),
      this.mapRunOrb.width,
      this.mapRunOrb.height * runPercentage,
    );
    ctx.globalCompositeOperation = "source-over";

    const specPercentage = this.currentStats.specialAttack / 100;
    this.mapSpecOrbMasked = new OffscreenCanvas(this.mapSpecOrb.width, this.mapSpecOrb.height);
    ctx = this.mapSpecOrbMasked.getContext("2d");
    ctx.fillStyle = "white";
    let specOrb = this.mapNoSpecOrb;
    if (Viewport.viewport.player.equipment.weapon && Viewport.viewport.player.equipment.weapon.hasSpecialAttack()) {
      if (Viewport.viewport.player.useSpecialAttack) {
        specOrb = this.mapSpecOnOrb;
      } else {
        specOrb = this.mapSpecOrb;
      }
    }
    ctx.drawImage(specOrb, 0, 0);
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillRect(
      0,
      this.mapSpecOrb.height * (1 - specPercentage),
      this.mapRunOrb.width,
      this.mapRunOrb.height * specPercentage,
    );
    ctx.globalCompositeOperation = "source-over";
  }

  loadImages() {
    const compassImage = ImageLoader.createImage(CompassIcon);

    compassImage.addEventListener("load", () => {
      this.compassImage = new OffscreenCanvas(51, 51);

      const context = this.compassImage.getContext("2d");

      context.drawImage(compassImage, 0, 0);

      // only draw image where mask is
      context.globalCompositeOperation = "destination-in";

      // draw our circle mask
      context.fillStyle = "#000";
      context.beginPath();
      const size = 38;
      context.arc(
        (51 - size) * 0.5 + size * 0.5, // x
        (51 - size) * 0.5 + size * 0.5, // y
        size * 0.5, // radius
        0, // start angle
        2 * Math.PI, // end angle
      );
      context.fill();

      // restore to default composite operation (is draw over current image)
      context.globalCompositeOperation = "source-over";
    });
  }

  generateMaskedMap() {
    this.mapCanvas = new OffscreenCanvas(152, 152);
    const mapContext = this.mapCanvas.getContext("2d");

    mapContext.save();
    mapContext.translate(76, 76);
    mapContext.rotate(Viewport.viewport.getMapRotation());
    mapContext.translate(-76, -76);

    if (Viewport.viewport.player.region.mapImage) {
      const compatCtx = mapContext as any;
      compatCtx.webkitImageSmoothingEnabled = false;
      compatCtx.mozImageSmoothingEnabled = false;
      compatCtx.imageSmoothingEnabled = false;
      mapContext.drawImage(Viewport.viewport.player.region.mapImage, 0, 0, 152, 152);
      compatCtx.webkitImageSmoothingEnabled = true;
      compatCtx.mozImageSmoothingEnabled = true;
      compatCtx.imageSmoothingEnabled = true;
    }

    mapContext.globalCompositeOperation = "destination-out";
    mapContext.drawImage(this.mapAlphaImage, 0, 0);
    mapContext.globalCompositeOperation = "source-over";
    mapContext.restore();
  }

  cursorMovedTo(event: MouseEvent) {
    const { width } = Chrome.size();
    const scale = Settings.minimapScale;
    const offset = width - this.width - (Settings.menuVisible ? 232 : 0);
    const x = (event.offsetX - offset) / scale;
    const y = event.offsetY / scale;

    this.hovering = MapHover.NONE;
    if (x > 4 && x < 28 && y > 31 && y < 56) {
      this.hovering = MapHover.XP;
    } else if (x > 4 && x < 53 && y > 53 && y < 81) {
      this.hovering = MapHover.HITPOINT;
    } else if (x > 4 && x < 53 && y > 90 && y < 113) {
      this.hovering = MapHover.PRAYER;
    } else if (x > 15 && x < 67 && y > 122 && y < 149) {
      this.hovering = MapHover.RUN;
    } else if (x > 38 && x < 90 && y > 148 && y < 173) {
      this.hovering = MapHover.SPEC;
    }
  }

  rightClick(event: MouseEvent): boolean {
    let menuOptions: MenuOption[] = [];

    let intercepted = false;

    const { width } = Chrome.size();
    const scale = Settings.minimapScale;
    const offset = width - this.width - (Settings.menuVisible ? 232 : 0);
    const x = (event.offsetX - offset) / scale;
    const y = event.offsetY / scale;

    if (x > 4 && x < 20 && y > 31 && y < 48) {
      intercepted = true;
      if (Settings.displayXpDrops === true) {
        menuOptions = [
          {
            text: [
              { text: "Hide ", fillStyle: "white" },
              { text: "XP drops", fillStyle: "#FF911F" },
            ],
            action: () => {
              Settings.displayXpDrops = false;
            },
          },
        ];
      } else {
        menuOptions = [
          {
            text: [
              { text: "Show ", fillStyle: "white" },
              { text: "XP drops", fillStyle: "#FF911F" },
            ],
            action: () => {
              Settings.displayXpDrops = true;
            },
          },
        ];
      }
    } else if (x > 33 && x < 64 && y > 5 && y < 36) {
      intercepted = true;
      menuOptions = [
        {
          text: [{ text: "Look North", fillStyle: "white" }],
          action: () => {
            Viewport.viewport.rotateNorth();
          },
        },
        {
          text: [{ text: "Look South", fillStyle: "white" }],
          action: () => {
            Viewport.viewport.rotateSouth();
          },
        },
      ];
    } else if (x > 4 && x < 52 && y > 53 && y < 73) {
      // intercepted = true;
      // hitpoint
    } else if (x > 4 && x < 53 && y > 90 && y < 113) {
      intercepted = true;
      // prayer
      menuOptions = [
        {
          text: [{ text: "Activate Quick-prayers", fillStyle: "white" }],
          action: () => {
            this.toggleQuickprayers();
          },
        },
      ];
    } else if (x > 15 && x < 67 && y > 122 && y < 149) {
      intercepted = true;
      // run
      menuOptions = [
        {
          text: [{ text: "Toggle Run", fillStyle: "white" }],
          action: () => {
            Viewport.viewport.player.running = !Viewport.viewport.player.running;
          },
        },
      ];
    } else if (x > 38 && x < 90 && y > 148 && y < 175) {
      if (this.canSpecialAttack()) {
        intercepted = true;
        // special attack
        menuOptions = [
          {
            text: [
              { text: "Use ", fillStyle: "white" },
              { text: "Special Attack", fillStyle: "#FF911F" },
            ],
            action: () => {
              this.toggleSpecialAttack();
            },
          },
        ];
      }
    }

    Viewport.viewport.contextMenu.setMenuOptions(menuOptions);
    Viewport.viewport.contextMenu.setActive();

    return intercepted;
  }

  leftClickDown(event: MouseEvent): boolean {
    let intercepted = false;
    const { width } = Chrome.size();
    const scale = Settings.minimapScale;
    const offset = width - this.width - (Settings.menuVisible ? 232 : 0);
    const x = (event.offsetX - offset) / scale;
    const y = event.offsetY / scale;

    if (x > 4 && x < 20 && y > 31 && y < 48) {
      Settings.displayXpDrops = !Settings.displayXpDrops;
      intercepted = true;
      Settings.persistToStorage();
    } else if (x > 33 && x < 64 && y > 5 && y < 36) {
      intercepted = true;
      if (Viewport.viewport.getMapRotation() === 0) {
        Viewport.viewport.rotateSouth();
      } else {
        Viewport.viewport.rotateNorth();
      }
      Settings.persistToStorage();
    } else if (x > 4 && x < 52 && y > 53 && y < 73) {
      intercepted = true;
      // this.hovering = MapHover.HITPOINT;
    } else if (x > 4 && x < 53 && y > 90 && y < 113) {
      intercepted = true;
      this.toggleQuickprayers();
    } else if (x > 15 && x < 67 && y > 122 && y < 149) {
      intercepted = true;
      Viewport.viewport.player.running = !Viewport.viewport.player.running;
    } else if (x > 38 && x < 90 && y > 148 && y < 175) {
      intercepted = true;
      this.toggleSpecialAttack();
    }
    this.updateOrbsMask(this.currentStats, this.stats);
    return intercepted;
  }

  canSpecialAttack() {
    return Viewport.viewport.player.equipment.weapon && Viewport.viewport.player.equipment.weapon.hasSpecialAttack();
  }

  toggleSpecialAttack() {
    if (this.canSpecialAttack()) {
      Viewport.viewport.player.useSpecialAttack = !Viewport.viewport.player.useSpecialAttack;
    }
  }

  toggleQuickprayers() {
    if (ControlPanelController.controls.PRAYER.hasQuickPrayersActivated) {
      ControlPanelController.controls.PRAYER.deactivateAllPrayers();
      Viewport.viewport.player.prayerController.drainCounter = 0;
    } else {
      ControlPanelController.controls.PRAYER.activateQuickPrayers();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { width } = Chrome.size();

    const gameHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    Settings.minimapScale = (gameHeight / 500 > 1 ? 1 : gameHeight / 500) * Settings.maxUiScale;

    const scale = Settings.minimapScale;
    this.width = INITIAL_WIDTH * scale;
    this.height = INITIAL_HEIGHT * scale;
    const offset = width - this.width - (Settings.menuVisible ? 232 : 0);

    ctx.font = 16 * scale + "px Stats_11";
    ctx.textAlign = "center";

    this.generateMaskedMap();
    ctx.drawImage(this.mapCanvas, offset + 52 * scale, 8, 152 * scale, 152 * scale);

    // draw compass
    ctx.save();
    ctx.translate(offset + 50.5 * scale, 23.5 * scale);
    ctx.rotate(Viewport.viewport.getMapRotation());
    ctx.translate(-50.5 * scale, -23.5 * scale);
    if (this.compassImage) {
      ctx.drawImage(this.compassImage, 25 * scale, -2, 51 * scale, 51 * scale);
    }
    ctx.restore();

    ctx.drawImage(this.outlineImage, offset + 28 * scale, 0, 182 * scale, 166 * scale);
    ctx.drawImage(
      this.hovering == MapHover.XP ? this.mapXpHoverButton : this.mapXpButton,
      offset,
      26,
      27 * scale,
      27 * scale,
    );

    ctx.drawImage(
      this.hovering == MapHover.HITPOINT ? this.mapSelectedNumberOrb : this.mapNumberOrb,
      offset,
      47 * scale,
      57 * scale,
      34 * scale,
    );
    ctx.drawImage(
      this.hovering == MapHover.PRAYER ? this.mapSelectedNumberOrb : this.mapNumberOrb,
      offset,
      81 * scale,
      57 * scale,
      34 * scale,
    );
    ctx.drawImage(
      this.hovering == MapHover.RUN ? this.mapSelectedNumberOrb : this.mapNumberOrb,
      offset + 10 * scale,
      114 * scale,
      57 * scale,
      34 * scale,
    );
    ctx.drawImage(
      this.hovering == MapHover.SPEC ? this.mapSelectedNumberOrb : this.mapNumberOrb,
      offset + 32 * scale,
      140 * scale,
      57 * scale,
      34 * scale,
    );

    ctx.drawImage(this.mapHitpointOrbMasked, offset + 27 * scale, 51 * scale, 26 * scale, 26 * scale);
    ctx.drawImage(this.mapHitpointIcon, offset + 27 * scale, 51 * scale, 26 * scale, 26 * scale);
    ctx.drawImage(this.mapPrayerOrbMasked, offset + 27 * scale, 85 * scale, 26 * scale, 26 * scale);
    ctx.drawImage(this.mapPrayerIcon, offset + 27 * scale, 85 * scale, 26 * scale, 26 * scale);
    ctx.drawImage(this.mapRunOrbMasked, offset + 37 * scale, 118 * scale, 26 * scale, 26 * scale);

    let mapRunIcon = this.mapWalkIcon;
    if (Viewport.viewport.player.effects.stamina) {
      mapRunIcon = this.mapStamIcon;
    } else if (Viewport.viewport.player.running) {
      mapRunIcon = this.mapRunIcon;
    }
    ctx.drawImage(mapRunIcon, offset + 37 * scale, 118 * scale, 26 * scale, 26 * scale);
    ctx.drawImage(this.mapSpecOrbMasked, offset + 59 * scale, 144 * scale, 26 * scale, 26 * scale);
    ctx.drawImage(this.mapSpecIcon, offset + 57 * scale, 142 * scale, 30 * scale, 30 * scale);

    // // hitpoints
    ctx.fillStyle = "black";
    ctx.fillText(String(this.currentStats.hitpoint), offset + 15 * scale, 74 * scale);
    ctx.fillStyle = this.colorScale.getColor(this.currentStats.hitpoint / this.stats.hitpoint).toHexString();
    ctx.fillText(String(this.currentStats.hitpoint), offset + 14 * scale, 73 * scale);
    // prayer
    ctx.fillStyle = "black";
    ctx.fillText(String(this.currentStats.prayer), offset + 15 * scale, 108 * scale);
    ctx.fillStyle = this.colorScale.getColor(this.currentStats.prayer / this.stats.prayer).toHexString();
    ctx.fillText(String(this.currentStats.prayer), offset + 14 * scale, 107 * scale);

    // run
    ctx.fillStyle = "black";
    ctx.fillText(String(Math.floor(this.currentStats.run / 100)), offset + 25 * scale, 140 * scale);
    ctx.fillStyle = this.colorScale.getColor(this.currentStats.run / 10000).toHexString();
    ctx.fillText(String(Math.floor(this.currentStats.run / 100)), offset + 24 * scale, 139 * scale);

    // spec
    ctx.fillStyle = "black";
    ctx.fillText(String(this.currentStats.specialAttack), offset + 47 * scale, 166 * scale);
    ctx.fillStyle = this.colorScale.getColor(this.currentStats.specialAttack / 100).toHexString();
    ctx.fillText(String(this.currentStats.specialAttack), offset + 46 * scale, 165 * scale);
  }
}
