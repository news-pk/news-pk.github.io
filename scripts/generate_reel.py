#!/usr/bin/env python3
"""
Automated Social Media News Reel Generator with Thrill Audio & Animated Frames
Generates viral, 1080x1920 9:16 vertical video reels with:
- High-pitch thrilling news synth music (138 BPM arpeggio, urgent alert stabs, clock tick, sub-bass kick)
- Professional neural news anchor voiceover (English or Urdu)
- Dynamic neon cyber frame with corner brackets
- Real-time blinking "LIVE NEWS" indicator
- Animated scrolling lower-third breaking news ticker
- Beat-synced camera zoom pulse and burned-in subtitles
"""

import sys
import os
import subprocess
import argparse
import numpy as np
import wave

VOICES = {
    "news_male_en": "en-US-ChristopherNeural",
    "news_female_en": "en-US-JennyNeural",
    "urdu_male": "ur-PK-AsadNeural",
    "urdu_female": "ur-PK-UzmaNeural"
}

def generate_thrill_music(duration, out_wav_path):
    """Synthesizes an intense high-pitch electronic news tension music track."""
    sr = 44100
    t = np.linspace(0, duration, int(sr * duration), endpoint=False)
    bpm = 138
    beat_dur = 60.0 / bpm
    sixteenth = beat_dur / 4.0

    # 1. High-pitch thrilling synth arpeggio (Minor key: A5, C6, E6, G6, F6)
    pitches = [880.0, 1046.5, 1318.5, 1568.0, 1396.9, 1318.5, 1046.5, 1174.7]
    arpeggio = np.zeros_like(t)
    for i in range(int(duration / sixteenth)):
        t_start = i * sixteenth
        idx_start = int(t_start * sr)
        idx_end = min(int((i + 1) * sixteenth * sr), len(t))
        n_samples = idx_end - idx_start
        if n_samples <= 0:
            continue
        freq = pitches[i % len(pitches)]
        local_t = np.linspace(0, n_samples / sr, n_samples, endpoint=False)
        env = np.exp(-local_t * 18.0)
        tone = 0.5 * np.sin(2 * np.pi * freq * local_t) + 0.3 * np.sin(2 * np.pi * freq * 2 * local_t) + 0.2 * np.sin(2 * np.pi * freq * 3 * local_t)
        arpeggio[idx_start:idx_end] += tone * env

    # 2. High-pitch urgent warning alarm stabs
    alarm = np.zeros_like(t)
    four_beats = beat_dur * 4
    for i in range(int(duration / four_beats)):
        idx = int(i * four_beats * sr)
        hit_len = int(0.18 * sr)
        if idx + hit_len < len(t):
            local_t = np.linspace(0, 0.18, hit_len, endpoint=False)
            stab = 0.4 * np.sin(2 * np.pi * 1760 * local_t) * np.exp(-local_t * 8.0)
            stab += 0.4 * np.sin(2 * np.pi * 2093 * local_t) * np.exp(-local_t * 12.0)
            alarm[idx:idx + hit_len] += stab

    # 3. Metallic clock ticking tension
    ticks = np.zeros_like(t)
    for i in range(int(duration / sixteenth)):
        idx = int(i * sixteenth * sr)
        tick_len = int(0.015 * sr)
        if idx + tick_len < len(t):
            noise = (np.random.rand(tick_len) * 2 - 1) * np.exp(-np.linspace(0, 1, tick_len) * 30.0)
            ticks[idx:idx + tick_len] += noise * 0.25

    # 4. Driving sub-bass kick heartbeat
    kick = np.zeros_like(t)
    for i in range(int(duration / beat_dur)):
        idx = int(i * beat_dur * sr)
        k_len = int(0.25 * sr)
        if idx + k_len < len(t):
            local_t = np.linspace(0, 0.25, k_len, endpoint=False)
            k_freq = 45 + 95 * np.exp(-local_t * 25.0)
            phase = 2 * np.pi * np.cumsum(k_freq) / sr
            k_env = np.exp(-local_t * 9.0)
            kick[idx:idx + k_len] += np.sin(phase) * k_env * 0.7

    # 5. Dramatic rising tension sweep
    riser = np.zeros_like(t)
    cycle_len = beat_dur * 8
    for i in range(int(duration / cycle_len)):
        t_start = i * cycle_len
        idx = int(t_start * sr)
        r_len = int(cycle_len * sr)
        if idx + r_len <= len(t):
            local_t = np.linspace(0, cycle_len, r_len, endpoint=False)
            sweep_freq = 600 + 2400 * (local_t / cycle_len) ** 2
            phase = 2 * np.pi * np.cumsum(sweep_freq) / sr
            r_env = (local_t / cycle_len) ** 2 * 0.3
            riser[idx:idx + r_len] += np.sin(phase) * r_env

    mix = 0.55 * arpeggio + 0.45 * alarm + 0.35 * ticks + 0.65 * kick + 0.3 * riser
    mix = np.tanh(mix * 1.3)
    mix = (mix * 32767 * 0.85).astype(np.int16)

    with wave.open(out_wav_path, "w") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sr)
        f.writeframes(mix.tobytes())

def generate_voiceover(text, voice, out_audio_path, out_vtt_path=None):
    cmd = ["edge-tts", "--voice", voice, "--text", text, "--write-media", out_audio_path]
    if out_vtt_path:
        cmd.extend(["--write-subtitles", out_vtt_path])
    print(f"[*] Generating voiceover with voice: {voice}...")
    subprocess.run(cmd, check=True)

def render_thrill_reel(image_path, audio_path, music_path, subtitle_path, output_mp4_path, ticker_text):
    print("[*] Mixing voiceover with high-pitch thrilling news soundtrack...")
    mixed_audio = "/tmp/thrill_mixed_audio.mp3"
    mix_cmd = [
        "ffmpeg", "-y", "-i", audio_path,
        "-i", music_path,
        "-filter_complex", "[1:a]volume=0.38[music];[0:a]volume=1.0[voice];[voice][music]amix=inputs=2:duration=first:dropout_transition=2[aout]",
        "-map", "[aout]", mixed_audio
    ]
    subprocess.run(mix_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    print("[*] Rendering 1080x1920 vertical video with animated cyber frames, ticker & beat-pulse...")
    clean_ticker = ticker_text.replace("'", "").replace(":", "-").replace("%", " pct")
    
    filtergraph = (
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
        "zoompan=z='1.02 + 0.02*sin(2*PI*on/13.04)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,"
        "drawbox=x=24:y=24:w=1032:h=1872:color=0xFFD700@0.75:t=4,"
        "drawbox=x=36:y=36:w=1008:h=1848:color=0x00F0FF@0.45:t=2,"
        "drawbox=x=24:y=24:w=60:h=60:color=0x00F0FF@0.9:t=6,"
        "drawbox=x=996:y=24:w=60:h=60:color=0x00F0FF@0.9:t=6,"
        "drawbox=x=24:y=1836:w=60:h=60:color=0x00F0FF@0.9:t=6,"
        "drawbox=x=996:y=1836:w=60:h=60:color=0x00F0FF@0.9:t=6,"
        "drawtext=fontfile=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf:text='●  LIVE NEWS':x=65:y=85:fontsize=32:fontcolor=white:box=1:boxcolor=0xDC2626@0.95:boxborderw=10:enable='mod(floor(t*2),2)',"
        "drawbox=x=0:y=1800:w=1080:h=90:color=0x0A0A0A@0.95:t=fill,"
        "drawbox=x=0:y=1800:w=260:h=90:color=0xE11D48@1:t=fill,"
        "drawtext=fontfile=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf:text='BREAKING':x=38:y=1832:fontsize=36:fontcolor=white,"
        f"drawtext=fontfile=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf:text='{clean_ticker}':x='1080-mod(t*220,3800)':y=1834:fontsize=30:fontcolor=0xFDE047"
    )

    if subtitle_path and os.path.exists(subtitle_path):
        filtergraph += f",subtitles={subtitle_path}:force_style='FontName=Liberation Sans,FontSize=20,PrimaryColour=&H0000FFFF,OutlineColour=&H00000000,BorderStyle=3,Outline=3,Shadow=2,Alignment=2,MarginV=180'"

    filtergraph += "[v]"

    render_cmd = [
        "ffmpeg", "-y", "-loop", "1", "-i", image_path,
        "-i", mixed_audio,
        "-filter_complex", filtergraph,
        "-map", "[v]", "-map", "1:a",
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", "-pix_fmt", "yuv420p",
        output_mp4_path
    ]
    subprocess.run(render_cmd, check=True)
    print(f"[✓] Successfully rendered thrill animated reel: {output_mp4_path}")

def main():
    parser = argparse.ArgumentParser(description="Generate social media news reel with thrill music & animated HUD frames")
    parser.add_argument("--image", required=True, help="Path to input poster image")
    parser.add_argument("--text", required=True, help="News broadcast narration script")
    parser.add_argument("--output", default="public/thrill_reel.mp4", help="Output MP4 file path")
    parser.add_argument("--voice", default="news_male_en", choices=list(VOICES.keys()), help="Voice persona")
    parser.add_argument("--ticker", default="⚡ PAKISTAN FINTECH CROSSES $1 BILLION UNICORN STATUS   ⚡ VC INFLOWS SURGE 450 pct   ⚡ ISLAMABAD AI SUMMIT 2026   ⚡ HISTORIC FOREIGN INVESTMENT", help="Scrolling marquee ticker text")

    args = parser.parse_args()

    temp_audio = "/tmp/temp_voice.mp3"
    temp_vtt = "/tmp/temp_sub.vtt"
    temp_music = "/tmp/temp_music.wav"

    voice_name = VOICES[args.voice]

    generate_voiceover(args.text, voice_name, temp_audio, temp_vtt)
    # Estimate duration with ffprobe
    dur_proc = subprocess.run(["ffprobe", "-i", temp_audio, "-show_entries", "format=duration", "-v", "quiet", "-of", "csv=p=0"], capture_output=True, text=True)
    dur = float(dur_proc.stdout.strip()) + 1.0

    print(f"[*] Generating procedural 138 BPM thrill music track ({dur:.1f}s)...")
    generate_thrill_music(dur, temp_music)

    render_thrill_reel(args.image, temp_audio, temp_music, temp_vtt, args.output, args.ticker)

if __name__ == "__main__":
    main()
