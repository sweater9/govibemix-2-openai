use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum TransportState { Stopped, Playing, Recording }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AudioEngine {
    pub sample_rate: u32,
    pub buffer_size: u32,
    pub transport: TransportState,
    pub playhead_samples: u64,
}

impl Default for AudioEngine {
    fn default() -> Self { Self { sample_rate: 44_100, buffer_size: 256, transport: TransportState::Stopped, playhead_samples: 0 } }
}

impl AudioEngine {
    pub fn play(&mut self) { self.transport = TransportState::Playing; }
    pub fn stop(&mut self) { self.transport = TransportState::Stopped; self.playhead_samples = 0; }
    pub fn process_silence(&mut self, output: &mut [f32]) {
        output.fill(0.0);
        if self.transport != TransportState::Stopped { self.playhead_samples += (output.len() / 2) as u64; }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn transport_advances_only_while_running() {
        let mut engine = AudioEngine::default(); let mut output = [1.0; 512];
        engine.process_silence(&mut output); assert_eq!(engine.playhead_samples, 0);
        engine.play(); engine.process_silence(&mut output);
        assert_eq!(engine.playhead_samples, 256); assert!(output.iter().all(|sample| *sample == 0.0));
        engine.stop(); assert_eq!(engine.playhead_samples, 0);
    }
}

