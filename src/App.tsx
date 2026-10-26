import { useEffect, useMemo, useState } from "react";
import { CircleDot, Disc3, FolderOpen, Headphones, Music2, Pause, Play, Plus, Redo2, Save, Settings2, SkipBack, Square, Undo2, Volume2, Waves } from "lucide-react";
import { createProject, type Project, type Track } from "./domain/project";
import { loadProject, saveProject } from "./services/projectStore";

const BAR_WIDTH = 104;

function TrackControls({ track, onChange }: { track: Track; onChange: (track: Track) => void }) {
  const toggle = (key: "muted" | "solo" | "armed") => onChange({ ...track, [key]: !track[key] });
  return <div className="track-controls">
    <div className="track-icon">{track.kind === "audio" ? <Waves size={15} /> : <Music2 size={15} />}</div>
    <div className="track-title"><strong>{track.name}</strong><span>{track.kind === "audio" ? "Audio" : "Instrument"}</span></div>
    <button className={track.muted ? "active" : ""} onClick={() => toggle("muted")} aria-label={`Mute ${track.name}`}>M</button>
    <button className={track.solo ? "active solo" : ""} onClick={() => toggle("solo")} aria-label={`Solo ${track.name}`}>S</button>
    <button className={track.armed ? "active record" : ""} onClick={() => toggle("armed")} aria-label={`Arm ${track.name}`}>●</button>
    <input aria-label={`${track.name} volume`} type="range" min="0" max="1" step="0.01" value={track.volume} onChange={e => onChange({ ...track, volume: Number(e.target.value) })} />
  </div>;
}

export default function App() {
  const seed = useMemo(createProject, []);
  const [project, setProject] = useState<Project>(seed);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(2.4);
  const [status, setStatus] = useState("Local project");

  useEffect(() => { loadProject(seed).then(setProject); }, [seed]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setPosition(value => (value + 0.05) % 16), 50);
    return () => window.clearInterval(timer);
  }, [playing]);

  const updateTrack = (next: Track) => setProject(value => ({ ...value, tracks: value.tracks.map(track => track.id === next.id ? next : track) }));
  const persist = async () => { setStatus("Saving…"); await saveProject(project); setStatus("Saved offline"); };

  return <main className="studio-shell">
    <header className="app-header">
      <div className="brand"><div className="brand-mark"><Disc3 size={22} /></div><div><b>GoVibeMix</b><span>STUDIO 2</span></div></div>
      <nav><button><FolderOpen size={16} /> Open</button><button onClick={persist}><Save size={16} /> Save</button><i /> <button aria-label="Undo"><Undo2 size={16} /></button><button aria-label="Redo"><Redo2 size={16} /></button></nav>
      <div className="project-state"><span className="sync-dot" />{status}<button aria-label="Settings"><Settings2 size={17} /></button></div>
    </header>

    <section className="transport">
      <div className="project-name"><span>PROJECT</span><input value={project.name} onChange={e => setProject({ ...project, name: e.target.value })} /></div>
      <div className="transport-center">
        <button aria-label="Return to start" onClick={() => setPosition(0)}><SkipBack size={17} /></button>
        <button aria-label="Stop" onClick={() => { setPlaying(false); setPosition(0); }}><Square size={14} fill="currentColor" /></button>
        <button className="play" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button>
        <button className="record-button" aria-label="Record"><CircleDot size={18} /></button>
        <div className="time"><b>{String(Math.floor(position / 4) + 1).padStart(2, "0")}</b><span>:</span><b>{String(Math.floor(position % 4) + 1).padStart(2, "0")}</b><span>:</span><b>{String(Math.floor(position * 4) % 4).padStart(2, "0")}</b></div>
      </div>
      <div className="tempo"><label><span>BPM</span><input type="number" value={project.tempo} onChange={e => setProject({ ...project, tempo: Number(e.target.value) })} /></label><label><span>SIGNATURE</span><b>{project.timeSignature.join(" / ")}</b></label></div>
    </section>

    <section className="workspace">
      <aside className="library"><div className="panel-title"><b>Sounds</b><button><Plus size={15} /></button></div><input className="search" placeholder="Search your sounds" /><div className="collection active"><span>●</span> Essentials <em>42</em></div><div className="collection"><span>◐</span> Drum Kits <em>18</em></div><div className="collection"><span>≋</span> Instruments <em>12</em></div><div className="collection"><span>♫</span> One Shots <em>26</em></div><h4>RECENT</h4>{["Velvet Kick", "Glass Hat", "Analog Bloom", "Room Clap"].map((name, i) => <div className="sample" key={name}><button>▶</button><div><b>{name}</b><span>{i % 2 ? "Texture" : "Drums"}</span></div><Waves size={30} /></div>)}</aside>

      <div className="arrangement">
        <div className="ruler"><div className="ruler-spacer"><button><Plus size={14} /> Add track</button></div><div className="bars">{[1,2,3,4,5].map(n => <span key={n} style={{ left: (n - 1) * BAR_WIDTH }}>{n}</span>)}</div></div>
        <div className="tracks" style={{ "--playhead": `${position * (BAR_WIDTH / 4)}px` } as React.CSSProperties}>
          <div className="playhead" />
          {project.tracks.map(track => <div className="track-row" key={track.id}>
            <TrackControls track={track} onChange={updateTrack} />
            <div className="track-lane">{track.clips.map(clip => <div className="clip" key={clip.id} style={{ left: clip.start * (BAR_WIDTH / 4), width: clip.duration * (BAR_WIDTH / 4) - 4, "--clip": clip.color } as React.CSSProperties}><b>{clip.name}</b><div className="waveform">{Array.from({length: 28}, (_, i) => <i key={i} style={{height: `${18 + ((i * 13) % 29)}%`}} />)}</div></div>)}</div>
          </div>)}
          <button className="add-track"><Plus size={14} /> Add track</button>
        </div>
      </div>
    </section>

    <section className="mixer">
      <div className="mixer-label"><b>MIXER</b><span>4 TRACKS</span></div>
      {project.tracks.map(track => <div className="channel" key={track.id}><div className="meter"><i style={{height: `${track.volume * 72}%`}} /></div><input aria-label={`${track.name} mixer level`} className="fader" type="range" min="0" max="1" step="0.01" value={track.volume} onChange={e => updateTrack({...track, volume: Number(e.target.value)})} /><div className="channel-name"><span style={{background: track.clips[0]?.color}} />{track.name}</div></div>)}
      <div className="channel master"><div className="master-icon"><Volume2 size={18} /></div><div className="meter stereo"><i /><i /></div><div className="channel-name"><span />MASTER</div></div>
    </section>
    <footer><div><Headphones size={14} /> Audio: Built-in Output</div><div>44.1 kHz · 24 bit <span className="cpu">CPU <i /></span></div></footer>
  </main>;
}

