import { delay, getFftSize } from "utils/helpers";

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

  private audioBuffer!: AudioBuffer;

  public getAudioBuffer = () => this.audioBuffer;

  private setAudioBuffer = (audioBuffer: AudioBuffer) => (this.audioBuffer = audioBuffer);

  private duration: number = 0;

  public getDuration = () => this.duration;

  private setDuration = (duration: number) => (this.duration = duration);

  private sourceNode!: AudioBufferSourceNode;

  public getSourceNode = () => this.sourceNode;

  private setSourceNode = (sourceNode: AudioBufferSourceNode) => (this.sourceNode = sourceNode);

  private gainNode!: GainNode;

  public getGainNode = () => this.gainNode;

  private setGainNode = (gainNode: GainNode) => (this.gainNode = gainNode);

  private defaultGainValue: number = 1;

  public getDefaultGainValue = () => this.defaultGainValue;

  public setDefaultGainValue = (defaultGainValue: number) => (this.defaultGainValue = defaultGainValue);

  private offset: number = 0;

  public getOffset = () => this.offset;

  private setOffset = (offset: number) => (this.offset = offset);

  private startTime: number = 0;

  public getStartTime = () => this.startTime;

  private setStartTime = (startTime: number) => (this.startTime = startTime);

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
      const barHeight: number = Math.round(this.getDataArray()[i]);

      // Dynamic pink/purple color based on bar height
      const red = 255;
      const green = 20 + (barHeight / 256) * 50; // This will vary based on the bar height
      const blue = 150 + (barHeight / 256) * 105;

      this.getVisualizerCtx().fillStyle = `rgb(${red}, ${green}, ${blue})`;

      // Draw the left side
      this.drawRoundedBar(
        Math.round(pos - barWidth * (i + 1)),
        this.getVisualizerCanvas().height - barHeight,
        barWidth,
        barHeight,
      );

      // Draw the right side
      this.drawRoundedBar(
        Math.round(pos + barWidth * i),
        this.getVisualizerCanvas().height - barHeight,
        barWidth,
        barHeight,
      );
    }
  };

  private setCanvasSize = () => {
    this.getVisualizerCanvas().width = window.innerWidth;
    this.getVisualizerCanvas().height = window.innerHeight;
  };

  public setupAudio = async (src: string) => {
    this.setCanvasSize();

    const audioContext = new AudioContext();
    this.setAudioContext(audioContext);

    this.setAnalyserData();

    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    this.setAudioBuffer(audioBuffer);
    this.setDuration(audioBuffer.duration);

    const gainNode = audioContext.createGain();
    gainNode.gain.value = this.getDefaultGainValue();
    const sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;

    sourceNode.connect(this.getAnalyser()); // Connect source to analyser
    this.getAnalyser().connect(gainNode); // Connect analyser to gain node
    gainNode.connect(audioContext.destination); // Connect gain node to destination

    sourceNode.start();

    this.setSourceNode(sourceNode);
    this.setGainNode(gainNode);

    this.animate();
  };

  private setAnalyserData = () => {
    const audioContext = this.getAudioContext();
    if (!audioContext) {
      return;
    }

    let analyser = this.getAnalyser();
    if (!analyser) {
      analyser = audioContext.createAnalyser();
    }
    analyser.fftSize = getFftSize();
    this.setAnalyser(analyser);
    this.setBufferLength(analyser.frequencyBinCount);
    this.setDataArray(new Uint8Array(analyser.frequencyBinCount));
  };

  public playFromOffset = async (seconds: number) => {
    const audioContext = this.getAudioContext();
    if (!audioContext) {
      return;
    }

    let sourceNode = this.getSourceNode();
    if (sourceNode) {
      sourceNode.stop(); // Stop any previous playback
    }

    this.setOffset(seconds); // Set the current offset to the passed value

    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = this.getAudioBuffer();
    sourceNode.connect(this.getAnalyser());
    this.getAnalyser().connect(this.getGainNode());
    this.getGainNode().connect(audioContext.destination);

    // Start the audio from the specified offset
    sourceNode.start(0, seconds);
    this.setSourceNode(sourceNode);

    this.setStartTime(audioContext.currentTime);
  };

  public getPlaybackTime = (): number => {
    const audioContext = this.getAudioContext();
    if (audioContext) {
      return audioContext.currentTime - this.getStartTime() + this.getOffset();
    }
    return 0;
  };

  private handleResize = () => {
    this.setCanvasSize();
    this.setAnalyserData();
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
