import { canvas, ctx } from "utils/elements";

export class MusicVisualizer {
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

  constructor() {}

  private animate = () => {
    this.getAnalyser().getByteFrequencyData(this.getDataArray());

    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.draw();

    requestAnimationFrame(this.animate);
  };

  private drawRoundedBar = (x: number, y: number, width: number, height: number) => {
    const radius = width / 2; // Half of the width to get a semi-circle
    ctx.beginPath();

    // Draw the rectangle part of the bar
    ctx.rect(x, y + radius, width, height - radius);

    // Draw the rounded top part of the bar
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI, true);

    ctx.closePath();
    ctx.fill();
  };

  private draw = () => {
    const barWidth: number = canvas.width / this.getBufferLength() / 2;
    const pos: number = canvas.width / 2; // Start at the center

    for (let i = 0; i < this.getBufferLength(); i++) {
      const barHeight: number = this.getDataArray()[i];

      // Dynamic pink/purple color based on bar height
      const red = 255;
      const green = 20 + (barHeight / 256) * 50; // This will vary based on the bar height
      const blue = 150 + (barHeight / 256) * 105;

      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;

      // Draw the left side
      this.drawRoundedBar(pos - barWidth * (i + 1), canvas.height - barHeight, barWidth, barHeight);

      // Draw the right side
      this.drawRoundedBar(pos + barWidth * i, canvas.height - barHeight, barWidth, barHeight);
    }
  };

  protected setupAudio = async (src: string) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const audioContext = new AudioContext();
    this.setAudioContext(audioContext);

    const analyser = audioContext.createAnalyser();
    // analyser.fftSize = 256;
    analyser.fftSize = 128;
    this.setAnalyser(analyser);

    const bufferLength = analyser.frequencyBinCount;
    this.setBufferLength(bufferLength);

    const dataArray = new Uint8Array(bufferLength);
    this.setDataArray(dataArray);

    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.getAnalyser());

    this.getAnalyser().connect(audioContext.destination);

    source.start();

    this.animate();
  };
}
