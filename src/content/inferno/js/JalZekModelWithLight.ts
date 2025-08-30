import { Assets, GLTFModel, Model, Location3, Renderable, GLTFModelOptions } from "@supalosa/oldschool-trainer-sdk";
import * as THREE from "three";
import { JalZek } from "./mobs/JalZek";

export class JalZekModelWithLight extends GLTFModel {
  underglowLight: THREE.PointLight | null = null;
  jalZekRenderable: JalZek;
  lightParented = false;
  primaryModelPath: string;

  // light props
  readonly NORMAL_UNDERGLOW_INTENSITY: number = 32.0;
  readonly FLICKER_OFF_INTENSITY: number = 0.05;
  readonly FLICKER_ON_INTENSITY: number = 50.0;

  constructor(renderable: JalZek, modelPath: string, options?: GLTFModelOptions) {
    super(renderable, [modelPath], options || {});
    this.jalZekRenderable = renderable;
    this.primaryModelPath = modelPath;
    this.createLight();
  }

  private createLight() {
    this.underglowLight = new THREE.PointLight(
      0xff0000, // red
      this.NORMAL_UNDERGLOW_INTENSITY,
      this.jalZekRenderable.size * 3.0, // reduced radius
      7, // increased decay for sharper falloff
    );
    this.underglowLight.position.set(0, -1.0, 0);
    this.underglowLight.visible = true;
    this.underglowLight.name = `JalZekUnderglow_${this.jalZekRenderable.mobId}`;
  }

  override async preload(): Promise<void> {
    await super.preload();
  }

  override draw(
    scene: THREE.Scene,
    clockDelta: number,
    tickPercent: number,
    location: Location3,
    rotation: number,
    pitch: number,
    modelIsVisible: boolean,
    modelOffsets: Location3[],
  ): void {
    super.draw(scene, clockDelta, tickPercent, location, rotation, pitch, modelIsVisible, modelOffsets);

    if (modelIsVisible && this.underglowLight && !this.lightParented) {
      if (this.primaryModelPath) {
        const sdkModelObject = scene.getObjectByName(this.primaryModelPath);
        if (sdkModelObject) {
          sdkModelObject.add(this.underglowLight);
          this.lightParented = true;
        }
      }
    }
    if (this.underglowLight) {
      this.underglowLight.visible = modelIsVisible;
    }
  }

  public setFlickerVisualState(isFlickering: boolean): void {
    if (this.underglowLight) {
      if (isFlickering) {
        // Double flicker: ON -> OFF -> ON -> OFF -> normal
        this.underglowLight.intensity = this.FLICKER_ON_INTENSITY;
        setTimeout(() => {
          if (this.underglowLight) {
            this.underglowLight.intensity = this.FLICKER_OFF_INTENSITY;
            setTimeout(() => {
              if (this.underglowLight) {
                this.underglowLight.intensity = this.FLICKER_ON_INTENSITY;
                setTimeout(() => {
                  if (this.underglowLight) {
                    this.underglowLight.intensity = this.FLICKER_OFF_INTENSITY;
                    setTimeout(() => {
                      if (this.underglowLight) {
                        this.underglowLight.intensity = this.NORMAL_UNDERGLOW_INTENSITY;
                      }
                    }, 50);
                  }
                }, 50);
              }
            }, 50);
          }
        }, 50);
      } else {
        this.underglowLight.intensity = this.NORMAL_UNDERGLOW_INTENSITY;
      }
    }
  }

  override destroy(scene: THREE.Scene): void {
    if (this.underglowLight) {
      if (this.underglowLight.parent) {
        this.underglowLight.parent.remove(this.underglowLight);
      }
      this.underglowLight.dispose();
      this.underglowLight = null;
    }
    this.lightParented = false;
    super.destroy(scene);
  }
}
