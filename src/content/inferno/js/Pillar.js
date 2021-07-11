'use strict';
import Constants from "../../../sdk/Constants";
import { Entity } from "../../../sdk/Entity";
import Point from "../../../sdk/Point";

export class Pillar extends Entity{

  static addPillarsToStage(stage) {
    [
      new Point(0, 9),
      new Point(17, 7),
      new Point(10, 23)
    ].forEach((position) => stage.addEntity(new Pillar(position, 3)));    
  }
}
