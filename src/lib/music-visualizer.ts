import { delay } from "utils/helpers";

export class MusicVisualizer {
  private visualizerCanvas!: HTMLCanvasElement;

  private getVisualizerCanvas = () => this.visualizerCanvas;

  private setVisualizerCanvas = (visualizerCanvas: HTMLCanvasElement) => (this.visualizerCanvas = visualizerCanvas);

  private visualizerCtx!: CanvasRenderingContext2D;

  private getVisualizerCtx = () => this.visualizerCtx;

  private setVisualizerCtx = (visualizerCtx: CanvasRenderingContext2D) => (this.visualizerCtx = visualizerCtx);

  private audioContext: AudioContext | undefined;

  public getAudioContext = () => this.audioContext;

  private setAudioContext = (audioContext: AudioContext) => (this.audioContext = audioContext);

  private analyser!: AnalyserNode;

  public getAnalyser = () => this.analyser;

  private setAnalyser = (analyser: AnalyserNode) => (this.analyser = analyser);

  private bufferLength!: number;

  public getBufferLength = () => this.bufferLength;

  private setBufferLength = (bufferLength: number) => (this.bufferLength = bufferLength);

  private dataArray!: Uint8Array;

  public getDataArray = () => this.dataArray;

  private setDataArray = (dataArray: Uint8Array) => (this.dataArray = dataArray);

  private duration: number = 0;

  public getDuration = () => this.duration;

  private setDuration = (duration: number) => (this.duration = duration);

  constructor() {
    this.bindListeners();
    this.runSetup();
  }

  private runSetup = async () => {
    const el = document.getElementById("visualizer") as HTMLCanvasElement;
    // keep trying until the element is found
    if (!el) {
      await delay(0.1);
      this.runSetup();
    }
    this.setVisualizerCanvas(el);
    this.setVisualizerCtx(el.getContext("2d")!);
  };

  private setCanvasSize = () => {
    this.getVisualizerCanvas().width = window.innerWidth;
    this.getVisualizerCanvas().height = window.innerHeight;
  };

  private animate = () => {
    this.getAnalyser().getByteFrequencyData(this.getDataArray());

    this.getVisualizerCtx().clearRect(0, 0, this.getVisualizerCanvas().width, this.getVisualizerCanvas().height);

    this.draw();

    requestAnimationFrame(this.animate);
  };

  private drawRoundedBar = (x: number, y: number, width: number, height: number) => {
    const radius = width / 2; // Half of the width to get a semi-circle
    this.getVisualizerCtx().beginPath();

    // Draw the rectangle part of the bar
    this.getVisualizerCtx().rect(x, y + radius, width, height - radius);

    // Draw the rounded top part of the bar
    this.getVisualizerCtx().arc(x + radius, y + radius, radius, 0, Math.PI, true);

    this.getVisualizerCtx().closePath();
    this.getVisualizerCtx().fill();
  };

  private draw = () => {
    const barWidth: number = Math.round(this.getVisualizerCanvas().width / this.getBufferLength() / 2);
    const pos: number = this.getVisualizerCanvas().width / 2; // Start at the center

    for (let i = 0; i < this.getBufferLength(); i++) {
      const barHeight: number = this.getDataArray()[i];

      // Dynamic pink/purple color based on bar height
      const red = 255;
      const green = 20 + (barHeight / 256) * 50; // This will vary based on the bar height
      const blue = 150 + (barHeight / 256) * 105;

      this.getVisualizerCtx().fillStyle = `rgb(${red}, ${green}, ${blue})`;

      // Draw the left side
      this.drawRoundedBar(pos - barWidth * (i + 1), this.getVisualizerCanvas().height - barHeight, barWidth, barHeight);

      // Draw the right side
      this.drawRoundedBar(pos + barWidth * i, this.getVisualizerCanvas().height - barHeight, barWidth, barHeight);
    }
  };

  public setupAudio = async (src: string) => {
    this.setCanvasSize();

    const audioContext = new AudioContext();
    this.setAudioContext(audioContext);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    this.setAnalyser(analyser);

    const bufferLength = analyser.frequencyBinCount;
    this.setBufferLength(bufferLength);

    const dataArray = new Uint8Array(bufferLength);
    this.setDataArray(dataArray);

    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    this.setDuration(audioBuffer.duration);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.getAnalyser());

    this.getAnalyser().connect(audioContext.destination);

    source.start();

    this.animate();
  };

  public getElapsedTime = (): number => this.getAudioContext()?.currentTime ?? 0;

  private handleResize = () => {
    this.setCanvasSize();
  };

  private bindListeners = () => {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("unload", this.handleUnload);
  };

  private handleUnload = () => {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("unload", this.handleUnload);
  };
}
