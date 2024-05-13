import * as THREE from "three";

export const drawLineOnTop = (mesh: THREE.Line, renderOrder: number) => {
  mesh.renderOrder = renderOrder;
  (mesh.material as THREE.Material).depthTest = false;
  (mesh.material as THREE.Material).transparent = true;
};

export const drawLineNormally = (mesh: THREE.Line) => {
  mesh.renderOrder = 0;
  (mesh.material as THREE.Material).depthTest = true;
  (mesh.material as THREE.Material).transparent = false;
};
