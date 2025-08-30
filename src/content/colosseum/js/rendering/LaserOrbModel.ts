import * as THREE from "three";
import { Model, Location } from "@supalosa/oldschool-trainer-sdk";

import { Edge, LaserOrb, ORB_SHOOT_DIRECTIONS } from "../entities/LaserOrb";
import { ColosseumConstants } from "../Constants";

export class LaserOrbModel implements Model {
  static forLaserOrb(r: LaserOrb) {
    return new LaserOrbModel(r);
  }

  private material: THREE.MeshBasicMaterial;
  private cube: THREE.Mesh;

  private beamGeometry: THREE.CylinderGeometry;
  private beamMaterial: THREE.MeshBasicMaterial;
  private beam: THREE.Mesh;

  private projectile: THREE.Mesh;

  private outline: THREE.LineSegments;

  constructor(
    private laserOrb: LaserOrb,
    onTop = true,
  ) {
    const { size } = laserOrb;
    this.material = new THREE.MeshBasicMaterial({
      color: laserOrb.colorHex,
      side: THREE.FrontSide,
      transparent: true,
    });
    const geometry = new THREE.BoxGeometry(size * 0.75, size * 0.75, size * 0.75);
    this.cube = new THREE.Mesh(geometry, this.material);
    this.cube.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

    this.beamMaterial = new THREE.MeshBasicMaterial({
      color: laserOrb.colorHex,
      side: THREE.FrontSide,
      transparent: true,
      opacity: 0.5,
    });
    this.beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);
    // set origin to the bottom of the cylinder.
    this.beamGeometry.translate(0, 0.5, 0);
    this.beam = new THREE.Mesh(this.beamGeometry, this.beamMaterial);
    this.beam.rotation.order = "YXZ";
    this.beam.rotation.set(Math.PI / 2, this.getYaw(), 0);

    const projectileMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.FrontSide,
      transparent: true,
      opacity: 0.75,
    });
    const projectileGeometry = new THREE.SphereGeometry(0.25, 8, 8);
    this.projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: laserOrb.colorHex,
      linewidth: 2,
    });
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(size, 0, 0),
      new THREE.Vector3(size, 0, 0),
      new THREE.Vector3(size, 0, -size),
      new THREE.Vector3(size, 0, -size),
      new THREE.Vector3(0, 0, -size),
      new THREE.Vector3(0, 0, -size),
      new THREE.Vector3(0, 0, 0),
    ];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

    this.outline = new THREE.LineSegments(lineGeometry, lineMaterial);
  }

  draw(scene: THREE.Scene, clockDelta: number, tickPercent: number, location: Location) {
    if (this.cube.parent !== scene) {
      scene.add(this.cube);
      scene.add(this.outline);
    }
    const { x, y } = location;
    this.cube.visible = this.laserOrb.visible(tickPercent);
    this.material.opacity = this.laserOrb.opacity(tickPercent);
    this.material.color.lerp(new THREE.Color(this.laserOrb.colorHex), tickPercent);
    this.cube.position.x = x + this.laserOrb.size / 2;
    this.cube.position.y = 0;
    this.cube.position.z = y - this.laserOrb.size / 2;

    this.cube.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), (Math.PI / 2) * tickPercent);
    if (this.laserOrb.isFiring) {
      this.cube.scale.set(1 + tickPercent / 4, 1 + tickPercent / 4, 1 + tickPercent / 4);
    } else {
      this.cube.scale.set(1, 1, 1);
    }
    const beamMaxLength = this.getBeamMaxLength(tickPercent);
    if (this.laserOrb.showBeam) {
      if (this.beam.parent !== scene) {
        scene.add(this.beam);
      }
      const beamLength = beamMaxLength * this.laserOrb.beamPercent(tickPercent);
      this.beam.position.x = x + this.laserOrb.size / 2;
      this.beam.position.y = 0;
      this.beam.position.z = y - this.laserOrb.size / 2;
      this.beam.scale.set(1, beamLength, 1);
    } else if (this.beam.parent === scene) {
      scene.remove(this.beam);
    }
    const projectilePct = this.laserOrb.projectilePercent(tickPercent);
    if (projectilePct > 0 && projectilePct < 1) {
      if (this.projectile.parent !== scene) {
        scene.add(this.projectile);
      }
      this.projectile.position.x =
        this.laserOrb.location.x + ORB_SHOOT_DIRECTIONS[this.laserOrb.edge].x * projectilePct * beamMaxLength + 0.5;
      this.projectile.position.y = 0;
      this.projectile.position.z =
        this.laserOrb.location.y + ORB_SHOOT_DIRECTIONS[this.laserOrb.edge].y * projectilePct * beamMaxLength - 0.5;
    } else if (this.projectile.parent === scene) {
      scene.remove(this.projectile);
    }

    this.outline.position.x = this.laserOrb.location.x;
    this.outline.position.y = -0.49;
    this.outline.position.z = this.laserOrb.location.y;
  }

  getYaw() {
    switch (this.laserOrb.edge) {
      case Edge.NORTH:
        return 0;
      case Edge.EAST:
        return (3 * Math.PI) / 2;
      case Edge.SOUTH:
        return Math.PI;
      case Edge.WEST:
        return Math.PI / 2;
    }
  }

  getBeamMaxLength(tickPercent: number): number {
    const arenaLength =
      this.laserOrb.edge === Edge.NORTH || this.laserOrb.edge === Edge.SOUTH
        ? ColosseumConstants.ARENA_SOUTH - ColosseumConstants.ARENA_NORTH
        : ColosseumConstants.ARENA_EAST - ColosseumConstants.ARENA_WEST;
    const beamLength = arenaLength - 1;
    return beamLength;
  }

  destroy(scene: THREE.Scene) {
    if (this.cube.parent === scene) {
      scene.remove(this.cube);
      scene.remove(this.outline);
    }
    if (this.beam.parent === scene) {
      scene.remove(this.beam);
    }
  }

  getWorldPosition(): THREE.Vector3 {
    return this.cube.getWorldPosition(new THREE.Vector3());
  }

  async preload() {
    //
  }
}
