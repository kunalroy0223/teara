// The sound of the hills, made in the browser with the Web Audio API.
// No audio files: wind, birds, a far-off flute, and the toy train itself.
// Nothing plays until the visitor turns sound on.

type Listener = (on: boolean) => void;

const KEY = 'teara-sound';
const PENTA = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25]; // D major pentatonic

function noiseBuffer(ctx: AudioContext, seconds: number, pink = false) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (!pink) { d[i] = w; continue; }
      b0 = 0.99765 * b0 + w * 0.099046;
      b1 = 0.963 * b1 + w * 0.2965164;
      b2 = 0.57 * b2 + w * 1.0526913;
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2;
    }
  }
  return buf;
}

function impulse(ctx: AudioContext, seconds: number, decay: number) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

class Hills {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private space!: GainNode;     // send into the valley reverb
  private noise!: AudioBuffer;
  private chugGain!: GainNode;
  private hiss!: GainNode;
  private timers: number[] = [];
  private listeners = new Set<Listener>();
  private nextChuff = 0;
  private speed = 0;
  private stopped = true;
  on = false;

  constructor() {
    if (typeof window === 'undefined') return;
    let stored = false;
    try { stored = localStorage.getItem(KEY) === 'on'; } catch { /* storage blocked */ }
    if (stored) {
      // browsers only allow sound after a tap, click or key press
      const resume = () => { this.set(true); off(); };
      const off = () => ['pointerdown', 'keydown', 'touchend'].forEach((e) => removeEventListener(e, resume));
      ['pointerdown', 'keydown', 'touchend'].forEach((e) => addEventListener(e, resume, { once: true }));
      this.wanted = true;
    }
  }
  wanted = false;

  subscribe(fn: Listener) { this.listeners.add(fn); fn(this.on || this.wanted); return () => { this.listeners.delete(fn); }; }

  toggle() { this.set(!this.on); }

  set(on: boolean) {
    this.on = on;
    this.wanted = on;
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* storage blocked */ }
    if (on) {
      if (!this.ctx) this.build();
      const ctx = this.ctx!;
      ctx.resume();
      this.master.gain.cancelScheduledValues(ctx.currentTime);
      this.master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.8);
    } else if (this.ctx) {
      const ctx = this.ctx;
      this.master.gain.cancelScheduledValues(ctx.currentTime);
      this.master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
      window.setTimeout(() => { if (!this.on) ctx.suspend(); }, 1500);
    }
    this.listeners.forEach((fn) => fn(on));
  }

  // Called every frame by the Home journey: 0 = standing, 1 = full speed.
  train(speed: number) {
    this.speed = Math.max(0, Math.min(1, speed));
    if (!this.ctx || !this.on) return;
    const t = this.ctx.currentTime;
    this.chugGain.gain.setTargetAtTime(Math.min(1, this.speed * 1.6), t, 0.2);
    // a soft hiss of steam while the engine waits at a station
    this.hiss.gain.setTargetAtTime(this.stopped ? 0 : (this.speed < 0.04 ? 0.035 : 0.0), t, 0.6);
  }

  // The engine is on screen (Home) or not (other pages).
  engine(present: boolean) { this.stopped = !present; if (!present) this.speed = 0; }

  whistle(long = false) {
    if (!this.ctx || !this.on) return;
    const ctx = this.ctx, t = ctx.currentTime + 0.02;
    const dur = long ? 1.5 : 0.75;
    const out = ctx.createGain();
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 0.7;
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime(0.11, t + 0.08);
    out.gain.setValueAtTime(0.11, t + dur);
    out.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.45);
    const vib = ctx.createOscillator(); const vibG = ctx.createGain();
    vib.frequency.value = 5.5; vibG.gain.value = 6;
    vib.connect(vibG);
    [880, 1108, 1320].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? 'triangle' : 'sine';
      o.frequency.setValueAtTime(f * 0.96, t);
      o.frequency.linearRampToValueAtTime(f, t + 0.12);
      vibG.connect(o.frequency);
      const g = ctx.createGain(); g.gain.value = [0.6, 0.35, 0.3][i];
      o.connect(g).connect(bp);
      o.start(t); o.stop(t + dur + 0.6);
    });
    // breath of steam under the tone
    const n = ctx.createBufferSource(); n.buffer = this.noise;
    const nf = ctx.createBiquadFilter(); nf.type = 'highpass'; nf.frequency.value = 2500;
    const ng = ctx.createGain(); ng.gain.value = 0.25;
    n.connect(nf).connect(ng).connect(bp);
    n.start(t, Math.random() * 2, dur + 0.5);
    vib.start(t); vib.stop(t + dur + 0.6);
    bp.connect(out);
    out.connect(this.master);
    out.connect(this.space);
  }

  private build() {
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.noise = noiseBuffer(ctx, 4);
    const pink = noiseBuffer(ctx, 6, true);

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 3;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(comp).connect(ctx.destination);

    // the valley: a long soft reverb
    const verb = ctx.createConvolver();
    verb.buffer = impulse(ctx, 3.8, 2.6);
    const verbOut = ctx.createGain(); verbOut.gain.value = 0.55;
    this.space = ctx.createGain(); this.space.gain.value = 1;
    this.space.connect(verb).connect(verbOut).connect(this.master);

    // wind through the tea bushes: pink noise, slowly moving filter and level
    const wind = ctx.createBufferSource(); wind.buffer = pink; wind.loop = true;
    const wf = ctx.createBiquadFilter(); wf.type = 'lowpass'; wf.frequency.value = 520; wf.Q.value = 0.6;
    const wg = ctx.createGain(); wg.gain.value = 0.32;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
    const lfoF = ctx.createGain(); lfoF.gain.value = 260;
    const lfo2 = ctx.createOscillator(); lfo2.frequency.value = 0.031;
    const lfoG = ctx.createGain(); lfoG.gain.value = 0.14;
    lfo.connect(lfoF).connect(wf.frequency);
    lfo2.connect(lfoG).connect(wg.gain);
    wind.connect(wf).connect(wg).connect(this.master);
    wind.start(); lfo.start(); lfo2.start();

    // a far, high whistle of wind over the ridge
    const high = ctx.createBufferSource(); high.buffer = pink; high.loop = true; high.playbackRate.value = 0.8;
    const hf = ctx.createBiquadFilter(); hf.type = 'bandpass'; hf.frequency.value = 1700; hf.Q.value = 4;
    const hg = ctx.createGain(); hg.gain.value = 0.02;
    const lfo3 = ctx.createOscillator(); lfo3.frequency.value = 0.05;
    const lfo3g = ctx.createGain(); lfo3g.gain.value = 500;
    lfo3.connect(lfo3g).connect(hf.frequency);
    high.connect(hf).connect(hg).connect(this.space);
    high.start(); lfo3.start();

    // a quiet drone, like a held note far down the valley
    const drone = ctx.createGain(); drone.gain.value = 0.0;
    drone.gain.setTargetAtTime(0.03, ctx.currentTime + 2, 4);
    const df = ctx.createBiquadFilter(); df.type = 'lowpass'; df.frequency.value = 700;
    [146.83, 220.0, 293.66].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = (i - 1) * 4;
      const g = ctx.createGain(); g.gain.value = [0.6, 0.35, 0.22][i];
      const tr = ctx.createOscillator(); tr.frequency.value = 0.09 + i * 0.04;
      const trg = ctx.createGain(); trg.gain.value = 0.18;
      tr.connect(trg).connect(g.gain);
      o.connect(g).connect(df);
      o.start(); tr.start();
    });
    df.connect(drone).connect(this.master);
    drone.connect(this.space);

    // the train: chuffs and rail joints, scheduled ahead of time
    this.chugGain = ctx.createGain(); this.chugGain.gain.value = 0;
    this.chugGain.connect(this.master);
    const hissSrc = ctx.createBufferSource(); hissSrc.buffer = this.noise; hissSrc.loop = true;
    const hissF = ctx.createBiquadFilter(); hissF.type = 'highpass'; hissF.frequency.value = 3800;
    this.hiss = ctx.createGain(); this.hiss.gain.value = 0;
    hissSrc.connect(hissF).connect(this.hiss).connect(this.master);
    hissSrc.start();

    this.timers.push(window.setInterval(() => this.scheduleTrain(), 40));
    this.loop(() => this.birds(), 2500, 7000);
    this.loop(() => this.cuckoo(), 14000, 26000);
    this.loop(() => this.flute(), 9000, 17000);
    this.loop(() => this.bowl(), 30000, 50000);
  }

  private loop(fn: () => void, min: number, max: number) {
    const go = () => {
      if (this.on) fn();
      this.timers.push(window.setTimeout(go, min + Math.random() * (max - min)));
    };
    this.timers.push(window.setTimeout(go, min * 0.5 + Math.random() * min));
  }

  private scheduleTrain() {
    const ctx = this.ctx!;
    if (!this.on || this.stopped || this.speed < 0.03) { this.nextChuff = 0; return; }
    const now = ctx.currentTime;
    if (this.nextChuff < now) this.nextChuff = now + 0.05;
    const gap = 1 / (1.2 + this.speed * 5.5); // chuffs per second rise with speed
    let beat = 0;
    while (this.nextChuff < now + 0.2) {
      this.chuff(this.nextChuff, beat++ % 4 === 0);
      this.nextChuff += gap;
    }
  }

  private chuff(t: number, strong: boolean) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource(); src.buffer = this.noise;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = strong ? 620 : 900; bp.Q.value = 0.9;
    const g = ctx.createGain();
    const peak = strong ? 0.5 : 0.32;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.19);
    src.connect(bp).connect(g).connect(this.chugGain);
    src.start(t, Math.random() * 3, 0.25);
    if (strong) {
      // low thump of the pistons
      const o = ctx.createOscillator(); o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
      const og = ctx.createGain();
      og.gain.setValueAtTime(0.0001, t);
      og.gain.exponentialRampToValueAtTime(0.35, t + 0.01);
      og.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.connect(og).connect(this.chugGain);
      o.start(t); o.stop(t + 0.2);
      // and the click of a rail joint
      const c = ctx.createBufferSource(); c.buffer = this.noise;
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2200;
      const cg = ctx.createGain();
      const tc = t + 0.06;
      cg.gain.setValueAtTime(0.0001, tc);
      cg.gain.exponentialRampToValueAtTime(0.12, tc + 0.003);
      cg.gain.exponentialRampToValueAtTime(0.0001, tc + 0.04);
      c.connect(hp).connect(cg).connect(this.chugGain);
      c.start(tc, Math.random() * 3, 0.06);
    }
  }

  private birds() {
    const ctx = this.ctx!;
    const pan = ctx.createStereoPanner(); pan.pan.value = Math.random() * 1.6 - 0.8;
    const out = ctx.createGain(); out.gain.value = 0.5 + Math.random() * 0.5;
    out.connect(pan); pan.connect(this.master); pan.connect(this.space);
    const notes = 2 + Math.floor(Math.random() * 4);
    const base = 2600 + Math.random() * 1600;
    let t = ctx.currentTime + 0.05;
    for (let i = 0; i < notes; i++) {
      const o = ctx.createOscillator(); o.type = 'sine';
      const f = base * (1 + (Math.random() - 0.3) * 0.25);
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * (1.25 + Math.random() * 0.4), t + 0.07);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.045, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      o.connect(g).connect(out);
      o.start(t); o.stop(t + 0.12);
      t += 0.1 + Math.random() * 0.09;
    }
  }

  // two falling notes from across the valley
  private cuckoo() {
    const ctx = this.ctx!;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
    const out = ctx.createGain(); out.gain.value = 0.5;
    const pan = ctx.createStereoPanner(); pan.pan.value = Math.random() > 0.5 ? 0.6 : -0.6;
    lp.connect(out).connect(pan); pan.connect(this.space); pan.connect(this.master);
    const reps = 2 + Math.floor(Math.random() * 2);
    let t = ctx.currentTime + 0.1;
    for (let r = 0; r < reps; r++) {
      [[700, 0.18], [560, 0.32]].forEach(([f, d]) => {
        const o = ctx.createOscillator(); o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.05, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g).connect(lp); o.start(t); o.stop(t + d + 0.05);
        t += d + 0.04;
      });
      t += 0.5;
    }
  }

  // a few breathy notes, like a bamboo flute from a village below
  private flute() {
    const ctx = this.ctx!;
    const out = ctx.createGain(); out.gain.value = 0.55;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
    lp.connect(out); out.connect(this.space); out.connect(this.master);
    let t = ctx.currentTime + 0.1;
    let idx = Math.floor(Math.random() * 4) + 1;
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      idx = Math.max(0, Math.min(PENTA.length - 1, idx + [-1, 1, 2, -2][Math.floor(Math.random() * 4)]));
      const f = PENTA[idx];
      const d = 0.9 + Math.random() * 1.2;
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(f * 0.985, t);
      o.frequency.linearRampToValueAtTime(f, t + 0.12);
      const vib = ctx.createOscillator(); vib.frequency.value = 4.8;
      const vg = ctx.createGain(); vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(f * 0.006, t + d * 0.6);
      vib.connect(vg).connect(o.frequency);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.03, t + 0.18);
      g.gain.setValueAtTime(0.03, t + d * 0.7);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      const h = ctx.createOscillator(); h.frequency.value = f * 2; const hg = ctx.createGain(); hg.gain.value = 0.12;
      h.connect(hg).connect(g);
      const b = ctx.createBufferSource(); b.buffer = this.noise;
      const bf = ctx.createBiquadFilter(); bf.type = 'bandpass'; bf.frequency.value = f * 2; bf.Q.value = 3;
      const bg = ctx.createGain(); bg.gain.value = 0.25;
      b.connect(bf).connect(bg).connect(g);
      o.connect(g).connect(lp);
      [o, vib, h].forEach((x) => { x.start(t); x.stop(t + d + 0.1); });
      b.start(t, Math.random() * 3, d);
      t += d * (0.85 + Math.random() * 0.3);
    }
  }

  // a singing bowl, struck once, very far away
  private bowl() {
    const ctx = this.ctx!;
    const t = ctx.currentTime + 0.05;
    const out = ctx.createGain(); out.gain.value = 0.35;
    out.connect(this.space); out.connect(this.master);
    const f = 220 + Math.random() * 40;
    [[1, 0.05], [2.76, 0.025], [5.4, 0.012], [8.9, 0.006]].forEach(([m, a], i) => {
      const o = ctx.createOscillator(); o.frequency.value = f * m; o.detune.value = Math.random() * 6;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(a, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 7 - i * 1.4);
      o.connect(g).connect(out); o.start(t); o.stop(t + 7.2);
    });
  }
}

export const sound = new Hills();
