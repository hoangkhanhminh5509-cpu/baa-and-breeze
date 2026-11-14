import os
import wave
import numpy as np

SR = 44100
OUT_DIR = os.environ.get("AUDIO_OUT_DIR", "./public/audio")
os.makedirs(OUT_DIR, exist_ok=True)


def write_wav(filename: str, stereo: np.ndarray):
    path = os.path.join(OUT_DIR, filename)
    # Soft limiting / safety clip for toddler-safe smooth dynamic range
    peak = np.max(np.abs(stereo))
    if peak > 0.88:
        stereo = stereo * (0.88 / peak)
    pcm = np.clip(stereo * 32767.0, -32767, 32767).astype(np.int16)
    interleaved = pcm.T.reshape(-1)
    with wave.open(path, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(interleaved.tobytes())
    print(f"Generated {path} ({stereo.shape[1] / SR:.1f}s)")


def midi_to_hz(midi: float) -> float:
    return 440.0 * (2.0 ** ((midi - 69.0) / 12.0))


def add_stereo(buf: np.ndarray, sig: np.ndarray, start_s: float, pan: float = 0.0, gain: float = 1.0):
    """pan in [-1, 1]"""
    start_idx = int(round(start_s * SR))
    if start_idx >= buf.shape[1]:
        return
    end_idx = min(buf.shape[1], start_idx + len(sig))
    if end_idx <= start_idx:
        return
    seg = sig[: end_idx - start_idx] * gain
    l_gain = np.cos((pan + 1.0) * np.pi * 0.25)
    r_gain = np.sin((pan + 1.0) * np.pi * 0.25)
    buf[0, start_idx:end_idx] += seg * l_gain
    buf[1, start_idx:end_idx] += seg * r_gain


def synth_kalimba(midi: float, dur: float = 1.8) -> np.ndarray:
    """Warm wooden kalimba / music-box tone (pure fundamental + soft 2nd/3rd harmonics)."""
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    f = midi_to_hz(midi)
    attack = np.minimum(1.0, t / 0.008)
    env = attack * np.exp(-t * 2.8)
    thump = np.exp(-t * 55.0) * 0.12 * np.sin(2 * np.pi * f * 0.5 * t)
    tone = (
        0.78 * np.sin(2 * np.pi * f * t)
        + 0.16 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t * 4.5)
        + 0.06 * np.sin(2 * np.pi * f * 3.0 * t) * np.exp(-t * 8.0)
    )
    fade_out = np.minimum(1.0, (dur - t) / 0.05)
    return (tone * env + thump) * fade_out


def synth_felt_piano(midi: float, dur: float = 2.6) -> np.ndarray:
    """Mellow felt piano chord note."""
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    f = midi_to_hz(midi)
    attack = 1.0 - np.exp(-t / 0.018)
    env = attack * np.exp(-t * 1.45)
    tone = (
        0.75 * np.sin(2 * np.pi * f * t)
        + 0.20 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t * 2.8)
        + 0.05 * np.sin(2 * np.pi * f * 3.0 * t) * np.exp(-t * 5.0)
    )
    fade_out = np.minimum(1.0, (dur - t) / 0.08)
    return tone * env * fade_out


def synth_water_plink(midi: float, dur: float = 0.45) -> np.ndarray:
    """Gentle rising-pitch water drop bubble sound."""
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    f0 = midi_to_hz(midi)
    freq = f0 * (1.0 + 0.35 * (1.0 - np.exp(-t * 26.0)))
    phase = 2 * np.pi * np.cumsum(freq) / SR
    env = np.minimum(1.0, t / 0.005) * np.exp(-t * 14.0)
    return np.sin(phase) * env


def synth_bird_chirp(f_start: float, f_end: float, dur: float = 0.24) -> np.ndarray:
    """Sweet gentle ocarina-like songbird chirp."""
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    u = t / dur
    freq = f_start + (f_end - f_start) * (u ** 0.7) + 35.0 * np.sin(2 * np.pi * 12.0 * u)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    env = np.sin(np.pi * u) ** 1.3
    return (0.85 * np.sin(phase) + 0.15 * np.sin(2 * phase)) * env


def synth_lamb_baa(base_hz: float = 290.0, dur: float = 0.48) -> np.ndarray:
    """Cute soft musical lamb bleat with gentle vibrato (toddler-friendly)."""
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    u = t / dur
    vib = 1.0 + 0.045 * np.sin(2 * np.pi * 16.0 * t)
    contour = 1.0 + 0.09 * np.sin(np.pi * u) - 0.06 * u
    freq = base_hz * vib * contour
    phase = 2 * np.pi * np.cumsum(freq) / SR
    wave_sig = (
        0.58 * np.sin(phase)
        + 0.28 * np.sin(2 * phase)
        + 0.10 * np.sin(3 * phase)
        + 0.04 * np.sin(4 * phase)
    )
    env = np.minimum(1.0, t / 0.04) * np.minimum(1.0, (dur - t) / 0.08) * (0.85 + 0.15 * np.sin(2 * np.pi * 8.0 * t))
    return wave_sig * env


def synth_harbor_bell(midi: float, dur: float = 3.2) -> np.ndarray:
    """Soft brass harbor chime bell."""
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    f = midi_to_hz(midi)
    attack = np.minimum(1.0, t / 0.006)
    sig = (
        0.65 * np.sin(2 * np.pi * f * t) * np.exp(-t * 1.1)
        + 0.22 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t * 2.2)
        + 0.10 * np.sin(2 * np.pi * f * 2.98 * t) * np.exp(-t * 3.8)
    )
    fade_out = np.minimum(1.0, (dur - t) / 0.1)
    return sig * attack * fade_out


def synth_warm_pad(midis, dur: float, attack_s: float = 1.2, release_s: float = 1.2) -> np.ndarray:
    """Lush slow-breathing warm harmonic pad."""
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    out = np.zeros_like(t)
    for m in midis:
        f = midi_to_hz(m)
        out += 0.65 * np.sin(2 * np.pi * f * t) + 0.18 * np.sin(2 * np.pi * f * 2.0 * t)
    out /= max(1, len(midis))
    env = np.minimum(1.0, t / attack_s) * np.minimum(1.0, (dur - t) / release_s)
    lfo = 0.88 + 0.12 * np.sin(2 * np.pi * 0.22 * t)
    return out * env * lfo


def synth_soft_noise(dur: float, seed: int = 1, cutoff_hz: float = 900.0) -> np.ndarray:
    """Smooth filtered pink/brown-like nature ambience via simple moving average / IIR."""
    rng = np.random.default_rng(seed)
    n = int(SR * dur)
    white = rng.normal(0.0, 1.0, n).astype(np.float64)
    # 2-pole gentle lowpass via FFT for exact zero-ringing warm breeze/brook bed
    freqs = np.fft.rfftfreq(n, 1.0 / SR)
    spec = np.fft.rfft(white)
    # Pink-ish tilt + lowpass
    pink_tilt = 1.0 / np.maximum(freqs, 25.0) ** 0.55
    lp = 1.0 / (1.0 + (freqs / cutoff_hz) ** 2)
    shaped = np.fft.irfft(spec * pink_tilt * lp, n=n)
    mx = np.max(np.abs(shaped))
    if mx > 0:
        shaped /= mx
    return shaped


def build_scene1_intro():
    dur = 40.0
    buf = np.zeros((2, int(SR * dur)), dtype=np.float64)
    # Soft breeze wash
    breeze = synth_soft_noise(dur, seed=101, cutoff_hz=550.0)
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    breeze_env = 0.045 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.12 * t))
    breeze_env *= np.minimum(1.0, t / 2.0) * np.minimum(1.0, (dur - t) / 2.0)
    buf[0] += breeze * breeze_env
    buf[1] += np.roll(breeze, 800) * breeze_env

    # Opening music-box lullaby theme (C major / pentatonic warm)
    pad = synth_warm_pad([60, 64, 67, 71], 18.0, 2.5, 3.0)
    add_stereo(buf, pad, 1.0, 0.0, 0.14)
    pad2 = synth_warm_pad([65, 69, 72, 76], 18.0, 2.5, 3.0)
    add_stereo(buf, pad2, 19.0, 0.0, 0.13)

    melody = [
        (1.5, 72, 0.0), (2.5, 76, 0.15), (3.5, 79, -0.15), (4.5, 81, 0.1), (5.8, 79, 0.0),
        (8.0, 76, -0.2), (9.0, 74, 0.2), (10.0, 72, 0.0),
        # Mystery drifting bell motif at 14s
        (14.0, 84, -0.3), (15.2, 79, 0.0), (16.4, 76, 0.35),
        # Curious response & cheerful trot
        (23.5, 72, -0.2), (24.2, 74, -0.1), (24.9, 76, 0.1), (25.6, 79, 0.2),
        (28.0, 81, 0.0), (29.2, 79, -0.1), (31.0, 76, 0.1), (32.5, 72, 0.0),
    ]
    for st, note, pan in melody:
        add_stereo(buf, synth_kalimba(note, 2.4), st, pan, 0.24)

    # Mystery bell chime fading rightwards
    add_stereo(buf, synth_harbor_bell(84, 3.5), 13.8, 0.5, 0.18)
    # Curious Baa!
    add_stereo(buf, synth_lamb_baa(305.0, 0.46), 21.5, -0.2, 0.25)
    add_stereo(buf, synth_lamb_baa(330.0, 0.42), 27.2, 0.1, 0.22)

    write_wav("scene1_intro.wav", buf)


def build_scene2_cottage():
    dur = 120.0
    buf = np.zeros((2, int(SR * dur)), dtype=np.float64)
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)

    # Gentle babbling brook bed
    brook = synth_soft_noise(dur, seed=202, cutoff_hz=1100.0)
    mod = 0.055 * (0.7 + 0.3 * np.sin(2 * np.pi * 0.28 * t) * np.cos(2 * np.pi * 0.11 * t))
    mod *= np.minimum(1.0, t / 2.0) * np.minimum(1.0, (dur - t) / 2.0)
    buf[0] += brook * mod * 0.9
    buf[1] += np.roll(brook, 1400) * mod * 1.1

    # Warm felt piano progression every 16s
    chords = [
        (0.0, [60, 64, 67, 72]),
        (16.0, [65, 69, 72, 77]),
        (32.0, [67, 71, 74, 79]),
        (48.0, [60, 64, 67, 76]),
        (64.0, [62, 65, 69, 74]),
        (80.0, [65, 69, 72, 76]),
        (96.0, [67, 71, 74, 79]),
    ]
    for st, ch in chords:
        add_stereo(buf, synth_warm_pad(ch, 16.0, 2.0, 2.5), st, 0.0, 0.11)
        for i, m in enumerate(ch):
            add_stereo(buf, synth_felt_piano(m, 3.2), st + i * 0.9, -0.3 + i * 0.2, 0.16)

    # Water droplet marimba motif (0-45s & 80-115s)
    water_notes = [72, 74, 76, 79, 81, 79, 76, 74]
    for idx, sec in enumerate(np.arange(4.0, 42.0, 1.8)):
        n = water_notes[idx % len(water_notes)]
        add_stereo(buf, synth_water_plink(n + 12, 0.42), sec, -0.35 + (idx % 3) * 0.25, 0.24)
        add_stereo(buf, synth_kalimba(n, 1.5), sec + 0.03, -0.2, 0.15)

    # Birdsong call-and-response (42s - 82s)
    bird_rounds = [44.0, 56.0, 68.0]
    for r_idx, base_t in enumerate(bird_rounds):
        # 3 chirps from bird on tree
        add_stereo(buf, synth_bird_chirp(1550, 2050, 0.20), base_t + 0.0, 0.45, 0.18)
        add_stereo(buf, synth_bird_chirp(1750, 2300, 0.22), base_t + 0.35, 0.45, 0.19)
        add_stereo(buf, synth_bird_chirp(1950, 2500, 0.28), base_t + 0.72, 0.45, 0.20)
        # Kalimba mirror
        add_stereo(buf, synth_kalimba(76 + r_idx * 2, 1.6), base_t + 2.0, 0.2, 0.22)
        add_stereo(buf, synth_kalimba(79 + r_idx * 2, 1.6), base_t + 2.6, 0.2, 0.22)
        # Baa echoes happily!
        add_stereo(buf, synth_lamb_baa(300.0 + r_idx * 15, 0.45), base_t + 4.4, -0.3, 0.25)

    # Sound Bubble #1 Collected chime at 92s
    for i, m in enumerate([72, 76, 79, 84]):
        add_stereo(buf, synth_kalimba(m, 2.8), 92.0 + i * 0.35, -0.2 + i * 0.15, 0.26)
        add_stereo(buf, synth_water_plink(m + 12, 0.5), 92.1 + i * 0.35, 0.1, 0.20)

    # Continuation motif till 120s
    for idx, sec in enumerate(np.arange(96.0, 117.0, 2.0)):
        n = water_notes[idx % len(water_notes)]
        add_stereo(buf, synth_kalimba(n, 2.0), sec, 0.0, 0.18)

    write_wav("scene2_cottage.wav", buf)


def build_scene3_meadow():
    dur = 150.0
    buf = np.zeros((2, int(SR * dur)), dtype=np.float64)
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)

    # Gentle wheat-wind 3/4 waltz swishes
    wind = synth_soft_noise(dur, seed=303, cutoff_hz=720.0)
    waltz_swish = 0.055 * (0.45 + 0.55 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.42 * t)))
    waltz_swish *= np.minimum(1.0, t / 2.0) * np.minimum(1.0, (dur - t) / 2.0)
    buf[0] += wind * waltz_swish
    buf[1] += np.roll(wind, 2200) * waltz_swish

    # Golden F-major / C-major waltz chords
    waltz_chords = [
        [65, 69, 72], [60, 64, 67], [62, 65, 69], [67, 71, 74],
        [65, 69, 72], [64, 67, 71], [62, 65, 69], [60, 64, 67],
    ]
    beat = 0.75  # 80 BPM
    bar = beat * 3  # 2.25s per 3/4 bar
    total_bars = int(dur // bar)
    for b in range(total_bars):
        st = b * bar
        ch = waltz_chords[b % len(waltz_chords)]
        # Bass root on beat 1
        add_stereo(buf, synth_felt_piano(ch[0] - 12, 2.2), st, -0.15, 0.18)
        # Soft chord on beat 2 & 3
        add_stereo(buf, synth_felt_piano(ch[1], 1.5), st + beat, 0.1, 0.12)
        add_stereo(buf, synth_felt_piano(ch[2], 1.5), st + beat * 2, 0.2, 0.12)
        # Gentle kalimba melody
        if b % 2 == 0:
            add_stereo(buf, synth_kalimba(ch[2] + 12, 1.8), st, -0.25, 0.18)
            add_stereo(buf, synth_kalimba(ch[1] + 12, 1.6), st + beat * 2, 0.25, 0.14)

    # Baa & Pip greet each other at 18s & 32s
    add_stereo(buf, synth_lamb_baa(295.0, 0.42), 18.0, -0.35, 0.24)
    add_stereo(buf, synth_lamb_baa(350.0, 0.38), 19.0, 0.35, 0.22)

    # 1-2-3-4 Blooming Flower Counting Chimes (around 48s - 98s)
    bloom_cycles = [48.0, 66.0, 84.0]
    for cyc in bloom_cycles:
        for i, note in enumerate([72, 74, 76, 79]):
            add_stereo(buf, synth_kalimba(note + 12, 2.2), cyc + i * 2.2, -0.45 + i * 0.3, 0.25)
        add_stereo(buf, synth_lamb_baa(340.0, 0.38), cyc + 10.0, 0.2, 0.20)

    # Sound Bubble #2 Collected at 116s
    for i, note in enumerate([69, 72, 77, 81, 84]):
        add_stereo(buf, synth_kalimba(note, 2.6), 116.0 + i * 0.3, -0.3 + i * 0.15, 0.24)

    write_wav("scene3_meadow.wav", buf)


def build_scene4_lighthouse():
    dur = 130.0
    buf = np.zeros((2, int(SR * dur)), dtype=np.float64)
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)

    # Slow ocean tide (8s inhale / exhale wave cycle)
    ocean = synth_soft_noise(dur, seed=404, cutoff_hz=640.0)
    tide_env = 0.075 * (0.35 + 0.65 * (0.5 - 0.5 * np.cos(2 * np.pi * t / 8.0)))
    tide_env *= np.minimum(1.0, t / 2.5) * np.minimum(1.0, (dur - t) / 2.5)
    buf[0] += ocean * tide_env
    buf[1] += np.roll(ocean, 3100) * tide_env

    # Dreamy G-major / E-minor coastal lullaby pad
    coastal_chords = [
        [67, 71, 74, 79],
        [64, 67, 71, 76],
        [60, 64, 67, 74],
        [62, 66, 69, 74],
    ]
    for idx in range(8):
        st = idx * 16.0
        ch = coastal_chords[idx % len(coastal_chords)]
        add_stereo(buf, synth_warm_pad(ch, 16.0, 2.5, 2.5), st, 0.0, 0.14)
        for j, m in enumerate(ch):
            add_stereo(buf, synth_felt_piano(m, 3.6), st + j * 1.6, -0.25 + j * 0.18, 0.15)

    # Harbor Boat Bell chimes synchronized to wave peaks (every 8s starting at 32s)
    for idx, sec in enumerate(np.arange(28.0, 108.0, 8.0)):
        note = [79, 83, 86, 83][idx % 4]
        add_stereo(buf, synth_harbor_bell(note, 3.4), sec, 0.35, 0.22)
        if idx % 2 == 1:
            add_stereo(buf, synth_harbor_bell(note - 5, 3.0), sec + 1.2, 0.25, 0.16)

    # Sound Bubble #3 Collected at 104s
    for i, m in enumerate([74, 79, 83, 86]):
        add_stereo(buf, synth_harbor_bell(m, 3.2), 104.0 + i * 0.45, 0.0, 0.20)
        add_stereo(buf, synth_kalimba(m, 2.5), 104.0 + i * 0.45, -0.2 + i * 0.15, 0.22)

    write_wav("scene4_lighthouse.wav", buf)


def build_scene5_finale():
    dur = 70.0
    buf = np.zeros((2, int(SR * dur)), dtype=np.float64)
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)

    # Blended ocean + breeze quiet twilight ambience
    amb = synth_soft_noise(dur, seed=505, cutoff_hz=520.0)
    amb_env = 0.045 * np.minimum(1.0, t / 2.5) * np.minimum(1.0, (dur - t) / 5.0)
    buf[0] += amb * amb_env
    buf[1] += np.roll(amb, 1900) * amb_env

    # Full Warm Lullaby Reprise (C major)
    prog = [
        (0.0, [60, 64, 67, 72]),
        (10.0, [65, 69, 72, 76]),
        (20.0, [67, 71, 74, 79]),
        (30.0, [60, 64, 67, 76]),
        (40.0, [65, 69, 72, 76]),
        (50.0, [60, 64, 67, 74]),
    ]
    for st, ch in prog:
        d = 18.0 if st >= 50.0 else 10.5
        add_stereo(buf, synth_warm_pad(ch, d, 2.2, 4.0), st, 0.0, 0.15)
        for i, m in enumerate(ch):
            add_stereo(buf, synth_felt_piano(m, 4.0), st + i * 1.1, -0.3 + i * 0.2, 0.16)

    # All 3 Collected Elements Playing Together (0-48s)
    # 1. Water marimba plinks + kalimba
    lullaby_notes = [72, 76, 79, 81, 79, 76, 74, 72, 74, 76, 72]
    for i, sec in enumerate(np.arange(2.0, 48.0, 2.2)):
        n = lullaby_notes[i % len(lullaby_notes)]
        add_stereo(buf, synth_kalimba(n, 2.6), sec, -0.25 + (i % 3) * 0.25, 0.21)
        if i % 2 == 0:
            add_stereo(buf, synth_water_plink(n + 12, 0.45), sec + 0.5, -0.3, 0.14)
        if i % 4 == 0:
            add_stereo(buf, synth_harbor_bell(n + 12, 3.2), sec + 1.0, 0.35, 0.14)

    # Sleepy gentle final Baa at 44s & final resolved chime
    add_stereo(buf, synth_lamb_baa(275.0, 0.48), 44.0, -0.15, 0.16)
    add_stereo(buf, synth_harbor_bell(84, 5.0), 54.0, 0.0, 0.18)
    add_stereo(buf, synth_kalimba(72, 4.5), 56.5, 0.0, 0.20)

    write_wav("scene5_finale.wav", buf)


if __name__ == "__main__":
    build_scene1_intro()
    build_scene2_cottage()
    build_scene3_meadow()
    build_scene4_lighthouse()
    build_scene5_finale()
    print("All 5 episode scene soundtracks synthesized!")
