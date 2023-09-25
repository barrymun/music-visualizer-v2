import { tracks } from "utils/constants";
import { getFftSize } from "utils/helpers";
import { ChangeTrackCallback, Track } from "utils/types";

let requestId: number;

export class MusicVisualizer {
  #window: Window;
  #changeTrackCallback: ChangeTrackCallback;
  #visualizerCanvas?: HTMLCanvasElement;
  #visualizerCtx?: CanvasRenderingContext2D;
  #audioContext?: AudioContext;
  #analyser?: AnalyserNode;
  #bufferLength?: number;
  #dataArray?: Uint8Array;
  #audioBuffer?: AudioBuffer;
  #sourceNode?: AudioBufferSourceNode;
  #gainNode?: GainNode;
  #duration = 0;
  #offset = 0;
  #startTime = 0;
  #currentTrack?: Track;
  #defaultGainValue = 1;

  constructor({
    windowObj, // dependency injection
    changeTrackCallback,
  }: {
    windowObj: Window;
    changeTrackCallback: ChangeTrackCallback;
  }) {
    this.#window = windowObj;
    this.#changeTrackCallback = changeTrackCallback;
    this.bindListeners();
  }

  get visualizerCanvas() {
    return this.#visualizerCanvas;
  }

  set visualizerCanvas(canvas: HTMLCanvasElement | undefined) {
    this.#visualizerCanvas = canvas;
  }

  get visualizerCtx() {
    return this.#visualizerCtx;
  }

  set visualizerCtx(ctx: CanvasRenderingContext2D | undefined) {
    this.#visualizerCtx = ctx;
  }

  get audioContext() {
    return this.#audioContext;
  }

  set audioContext(context: AudioContext | undefined) {
    this.#audioContext = context;
  }

  get analyser() {
    return this.#analyser;
  }

  set analyser(analyser: AnalyserNode | undefined) {
    this.#analyser = analyser;
  }

  get bufferLength() {
    return this.#bufferLength;
  }

  set bufferLength(length: number | undefined) {
    this.#bufferLength = length;
  }

  get dataArray() {
    return this.#dataArray;
  }

  set dataArray(array: Uint8Array | undefined) {
    this.#dataArray = array;
  }

  get audioBuffer() {
    return this.#audioBuffer;
  }

  set audioBuffer(buffer: AudioBuffer | undefined) {
    this.#audioBuffer = buffer;
  }

  get sourceNode() {
    return this.#sourceNode;
  }

  set sourceNode(node: AudioBufferSourceNode | undefined) {
    this.#sourceNode = node;
  }

  get gainNode() {
    return this.#gainNode;
  }

  set gainNode(node: GainNode | undefined) {
    this.#gainNode = node;
  }

  get duration() {
    return this.#duration;
  }

  set duration(duration: number) {
    this.#duration = duration;
  }

  get offset() {
    return this.#offset;
  }

  set offset(offset: number) {
    this.#offset = offset;
  }

  get startTime() {
    return this.#startTime;
  }

  set startTime(time: number) {
    this.#startTime = time;
  }

  get currentTrack() {
    return this.#currentTrack;
  }

  set currentTrack(track: Track | undefined) {
    this.#currentTrack = track;
  }

  get defaultGainValue() {
    return this.#defaultGainValue;
  }

  set defaultGainValue(value: number) {
    this.#defaultGainValue = value;
  }

  private animate = () => {
    if (!this.visualizerCtx || !this.visualizerCanvas) return;

    if (!this.audioContext) {
      cancelAnimationFrame(requestId);
      this.visualizerCtx.clearRect(0, 0, this.visualizerCanvas.width, this.visualizerCanvas.height);
      return;
    }

    this.analyser!.getByteFrequencyData(this.dataArray!);
    this.visualizerCtx.clearRect(0, 0, this.visualizerCanvas.width, this.visualizerCanvas.height);
    this.draw();
    requestId = requestAnimationFrame(this.animate);
  };

  private drawRoundedBar = (x: number, y: number, width: number, height: number) => {
    if (!this.visualizerCtx) return;

    const radius = width / 2;
    this.visualizerCtx.beginPath();
    this.visualizerCtx.rect(x, y + radius, width, height - radius);
    this.visualizerCtx.arc(x + radius, y + radius, radius, 0, Math.PI, true);
    this.visualizerCtx.closePath();
    this.visualizerCtx.fill();
  };

  private draw = () => {
    if (!this.visualizerCtx || !this.visualizerCanvas) return;

    const barWidth: number = Math.round(this.visualizerCanvas.width / this.bufferLength! / 2);
    const pos: number = this.visualizerCanvas.width / 2;

    for (let i = 0; i < this.bufferLength!; i++) {
      const barHeight: number = Math.round(this.dataArray![i]);
      const red = 255;
      const green = 20 + (barHeight / 256) * 50;
      const blue = 150 + (barHeight / 256) * 105;

      this.visualizerCtx.fillStyle = `rgb(${red}, ${green}, ${blue})`;

      this.drawRoundedBar(
        Math.round(pos - barWidth * (i + 1)),
        this.visualizerCanvas.height - barHeight,
        barWidth,
        barHeight,
      );

      this.drawRoundedBar(
        Math.round(pos + barWidth * i),
        this.visualizerCanvas.height - barHeight,
        barWidth,
        barHeight,
      );
    }
  };

  public setCanvasSize = () => {
    if (!this.visualizerCanvas) return;

    this.visualizerCanvas.width = this.#window.innerWidth;
    this.visualizerCanvas.height = this.#window.innerHeight;
  };

  public setupAudio = async (track?: Track | undefined) => {
    this.setCanvasSize();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioContext = new ((this.#window as any).AudioContext || (this.#window as any).webkitAudioContext)({
      sampleRate: 44100,
    });
    if (!audioContext) {
      return;
    }
    this.#audioContext = audioContext;

    this.setAnalyserData();

    this.#currentTrack = track ?? tracks[0];

    const response = await fetch(this.#currentTrack!.src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    this.#audioBuffer = audioBuffer;
    this.#duration = audioBuffer.duration;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = this.#defaultGainValue;
    const sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;

    sourceNode.connect(this.#analyser!); // Connect source to analyser
    this.#analyser!.connect(gainNode); // Connect analyser to gain node
    gainNode.connect(audioContext.destination); // Connect gain node to destination

    sourceNode.start();
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    this.#sourceNode = sourceNode;
    this.#gainNode = gainNode;

    this.animate();
  };

  private setAnalyserData = () => {
    if (!this.#audioContext) {
      return;
    }

    let analyser = this.#analyser;
    if (!analyser) {
      analyser = this.#audioContext.createAnalyser();
    }
    analyser.fftSize = getFftSize();
    this.#analyser = analyser;
    this.#bufferLength = analyser.frequencyBinCount;
    this.#dataArray = new Uint8Array(analyser.frequencyBinCount);
  };

  public playFromOffset = async (seconds: number) => {
    if (!this.#audioContext || !this.#gainNode) {
      return;
    }

    let sourceNode = this.#sourceNode;
    if (sourceNode) {
      sourceNode.stop(); // Stop any previous playback
    }

    this.#offset = seconds; // Set the current offset to the passed value

    sourceNode = this.#audioContext.createBufferSource();
    sourceNode.buffer = this.#audioBuffer!;
    sourceNode.connect(this.#analyser!);
    this.#analyser!.connect(this.#gainNode);
    this.#gainNode.connect(this.#audioContext!.destination);

    // Start the audio from the specified offset
    sourceNode.start(0, seconds);
    if (this.#audioContext.state === "suspended") {
      await this.#audioContext.resume();
    }
    this.#sourceNode = sourceNode;
    this.#startTime = this.#audioContext.currentTime;
  };

  public destroy = async () => {
    if (!this.#audioContext) {
      return;
    }

    this.#sourceNode?.disconnect();
    this.#gainNode?.disconnect();
    this.#analyser?.disconnect();
    await this.#audioContext.close();
    this.#audioContext = undefined;
    this.#analyser = undefined;
    this.#bufferLength = undefined;
    this.#dataArray = undefined;
    this.#audioBuffer = undefined;
    this.#duration = 0;
    this.#sourceNode = undefined;
    this.#gainNode = undefined;
    this.#offset = 0;
    this.#startTime = 0;
  };

  public isEnded = (): boolean => {
    if (!this.#audioContext) {
      return false;
    }
    return this.#audioContext.currentTime - this.#startTime + this.#offset >= this.#duration;
  };

  public getPlaybackTime = (): number => {
    if (!this.#audioContext) {
      return 0;
    }
    if (this.isEnded()) {
      return this.#duration;
    }
    return this.#audioContext.currentTime - this.#startTime + this.#offset;
  };

  public changeTrack = async (trackIndex: number) => {
    await this.destroy();
    this.#currentTrack = tracks[trackIndex];

    // saving the original gain value so that if the default becomes 0
    // from muting, the previously set value is still known
    let gv = this.#defaultGainValue;
    gv = this.#changeTrackCallback();

    this.#defaultGainValue = gv;
    await this.setupAudio(tracks[trackIndex]);
  };

  private handleResize = () => {
    this.setCanvasSize();
    this.setAnalyserData();
  };

  private bindListeners = () => {
    this.#window.addEventListener("resize", this.handleResize);
    this.#window.addEventListener("unload", this.handleUnload);
  };

  private handleUnload = () => {
    this.#window.removeEventListener("resize", this.handleResize);
    this.#window.removeEventListener("unload", this.handleUnload);
  };
}
