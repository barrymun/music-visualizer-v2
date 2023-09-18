import van from "vanjs-core";

const { canvas, div } = van.tags;

export const Visualizer = () => {
  return div(
    {
      class: "visualizer-cntr",
    },
    canvas({
      id: "visualizer",
    }),
  );
};
