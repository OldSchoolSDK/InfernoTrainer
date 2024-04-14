import InventoryPanel from "../../assets/images/panels/inventory.png";
import CombatTab from "../../assets/images/tabs/combat.png";
import { ControlPanelController } from "../ControlPanelController";
import { ImageLoader } from "../utils/ImageLoader";
import { BaseControls } from "./BaseControls";
import SelectedCombatStyleButtonImage from "../../assets/images/attackstyles/interface/attack_style_button_highlighted.png";
import CombatStyleButtonImage from "../../assets/images/attackstyles/interface/attack_style_button.png";
import SelectedAutoRetaliateButtonImage from "../../assets/images/attackstyles/interface/auto_retal_button_highlighted.png";
import AutoRetaliateButtonImage from "../../assets/images/attackstyles/interface/auto_retal_button.png";
import SpecialAttackBarBackground from "../../assets/images/attackstyles/interface/special_attack_background.png";
import { AttackStyle, AttackStylesController } from "../AttackStylesController";
import { Weapon } from "../gear/Weapon";
import { Location } from "../../sdk/Location";
import { startCase, toLower } from "lodash";
import { Settings } from "../Settings";
import { Viewport } from "../Viewport";
import { PlayerStats } from "../PlayerStats";

export class CombatControls extends BaseControls {
  private playerStats: PlayerStats;

  selectedCombatStyleButtonImage: HTMLImageElement = ImageLoader.createImage(SelectedCombatStyleButtonImage);
  combatStyleButtonImage: HTMLImageElement = ImageLoader.createImage(CombatStyleButtonImage);
  autoRetailButtonImage: HTMLImageElement = ImageLoader.createImage(AutoRetaliateButtonImage);
  selectedAutoRetailButtonImage: HTMLImageElement = ImageLoader.createImage(SelectedAutoRetaliateButtonImage);
  specialAttackBarBackground: HTMLImageElement = ImageLoader.createImage(SpecialAttackBarBackground);

  get panelImageReference() {
    return InventoryPanel;
  }

  get tabImageReference() {
    return CombatTab;
  }

  get keyBinding() {
    return Settings.combat_key;
  }

  updateStats(playerStats: PlayerStats) {
    this.playerStats = playerStats;
  }

  panelClickDown(x: number, y: number) {
    const scale = Settings.controlPanelScale;

    x = x / scale;
    y = y / scale;

    const attackStyleOffsets = [
      { x: 25, y: 45 },
      { x: 105, y: 45 },
      { x: 25, y: 100 },
      { x: 105, y: 100 },
    ];
    const weapon = Viewport.viewport.player.equipment.weapon;
    const attackStyles = weapon.attackStyles();

    attackStyleOffsets.slice(0, attackStyles.length).forEach((offset: Location, index: number) => {
      if (offset.x < x && x < offset.x + 70 && offset.y < y && y < offset.y + 48) {
        AttackStylesController.controller.setWeaponAttackStyle(weapon, attackStyles[index]);
      }
    });

    if (x > 28 && x < 175 && y > 160 && y < 200) {
      Viewport.viewport.player.autoRetaliate = !Viewport.viewport.player.autoRetaliate;
    }
    if (
      x > 25 &&
      y > 210 &&
      x < 25 + this.specialAttackBarBackground.width &&
      y < 210 + this.specialAttackBarBackground.height
    ) {
      const canSpec =
        Viewport.viewport.player.equipment.weapon && Viewport.viewport.player.equipment.weapon.hasSpecialAttack();
      if (canSpec) {
        Viewport.viewport.player.useSpecialAttack = !Viewport.viewport.player.useSpecialAttack;
      }
    }
  }

  get isAvailable(): boolean {
    return true;
  }

  drawAttackStyleButton(
    context: CanvasRenderingContext2D,
    weapon: Weapon,
    attackStyle: AttackStyle,
    attackStyleImage: HTMLImageElement,
    x: number,
    y: number,
  ) {
    const scale = Settings.controlPanelScale;
    const currentAttackStyle = weapon.attackStyle();

    const currentAttackStyleImage =
      currentAttackStyle === attackStyle ? this.selectedCombatStyleButtonImage : this.combatStyleButtonImage;
    context.drawImage(
      currentAttackStyleImage,
      x,
      y,
      currentAttackStyleImage.width * scale,
      currentAttackStyleImage.height * scale,
    );

    context.drawImage(
      attackStyleImage,
      x + (35 - Math.floor(attackStyleImage.width / 2)) * scale,
      y + 5 * scale,
      attackStyleImage.width * scale,
      attackStyleImage.height * scale,
    );

    context.font = 16 * scale + "px Stats_11";
    context.textAlign = "center";

    context.fillStyle = "#000";
    context.fillText(startCase(toLower(attackStyle)), x + 36 * scale, y + 41 * scale);

    context.fillStyle = "#FF9700";
    context.fillText(startCase(toLower(attackStyle)), x + 35 * scale, y + 40 * scale);
  }

  draw(context: CanvasRenderingContext2D, ctrl: ControlPanelController, x: number, y: number) {
    super.draw(context, ctrl, x, y);

    const scale = Settings.controlPanelScale;

    const weapon = Viewport.viewport.player.equipment.weapon;

    if (!weapon) {
      return;
    }

    context.font = 21 * scale + "px Stats_11";
    context.textAlign = "center";

    context.fillStyle = "#000";
    context.fillText(startCase(toLower(weapon.itemName)), x + 101 * scale, y + 31 * scale);

    context.fillStyle = "#FF9700";
    context.fillText(startCase(toLower(weapon.itemName)), x + 100 * scale, y + 30 * scale);

    const attackStyleOffsets = [
      { x: 25, y: 45 },
      { x: 105, y: 45 },
      { x: 25, y: 100 },
      { x: 105, y: 100 },
    ];

    const attackStyles = weapon.attackStyles();

    const imageMap = AttackStylesController.attackStyleImageMap[weapon.attackStyleCategory()];
    if (imageMap) {
      attackStyles.forEach((style: AttackStyle, index: number) => {
        const offsets = attackStyleOffsets[index];

        const attackStyleImage = imageMap[weapon.attackStyles()[index]];
        if (attackStyleImage) {
          this.drawAttackStyleButton(
            context,
            weapon,
            weapon.attackStyles()[index],
            attackStyleImage,
            x + offsets.x * scale,
            y + offsets.y * scale,
          );
        }
      });
    }

    const autoRetailateImage = Viewport.viewport.player.autoRetaliate
      ? this.selectedAutoRetailButtonImage
      : this.autoRetailButtonImage;
    context.drawImage(
      autoRetailateImage,
      x + 25 * scale,
      y + 155 * scale,
      autoRetailateImage.width * scale,
      autoRetailateImage.height * scale,
    );

    context.font = 19 * scale + "px Stats_11";
    context.textAlign = "center";

    context.fillStyle = "#000";
    context.fillText("Auto Retaliate", x + 116 * scale, y + 183 * scale);

    context.fillStyle = "#FF9700";
    context.fillText("Auto Retaliate", x + 115 * scale, y + 182 * scale);

    const canSpec =
      Viewport.viewport.player.equipment.weapon && Viewport.viewport.player.equipment.weapon.hasSpecialAttack();
    const isUsingSpec = canSpec && Viewport.viewport.player.useSpecialAttack;

    if (canSpec) {
      const specAmount = (Viewport.viewport.player?.currentStats.specialAttack ?? 0.0) / 100.0;
      context.drawImage(
        this.specialAttackBarBackground,
        x + 25 * scale,
        y + 210 * scale,
        this.specialAttackBarBackground.width * scale,
        this.specialAttackBarBackground.height * scale,
      );

      context.fillStyle = "#730606";
      context.fillRect(x + 28 * scale, y + 216 * scale, 144 * scale, 14 * scale);
      context.fillStyle = "#397d3b";
      context.fillRect(x + 28 * scale, y + 216 * scale, 144 * scale * specAmount, 14 * scale);
      context.fillStyle = "#000000";
      context.globalAlpha = 0.5;
      context.strokeRect(x + 28 * scale, y + 216 * scale, 144 * scale, 14 * scale);
      context.globalAlpha = 1;
      context.font = `${16 * scale}px Stats_11`;
      context.textAlign = "center";
      context.fillStyle = isUsingSpec ? "#FFFF00" : "#000000";
      context.fillText(`Special Attack: ${Math.round(specAmount * 100)}%`, x + 100 * scale, y + 227 * scale);
    }
  }
}
