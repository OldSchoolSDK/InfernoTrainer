declare module "*.png" {
  const value: string;
  export default value;
}
declare module "*.gif";
declare module "*.ogg" {
  const value: string;
  export default value;
}
declare module "*.glb" {
  const value: string;
  export default value;
}
declare module "*.gltf" {
  const value: string;
  export default value;
}
declare module "*.html" {
  const value: string;
  export default value;
}

export * from "./test";
export * from "./src/sdk";
export * from "./src/sdk/rendering";
export * from "./src/content";