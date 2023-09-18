import van from "vanjs-core";

const { canvas } = van.tags;

export const Visualizer = () => {
  return canvas({
    id: "visualizer",
  });
};
