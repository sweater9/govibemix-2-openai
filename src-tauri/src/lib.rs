mod audio;
mod storage;

use std::sync::Mutex;
use audio::AudioEngine;

struct AppState { audio: Mutex<AudioEngine> }

#[tauri::command]
fn save_project(app: tauri::AppHandle, project_json: String) -> Result<String, String> {
    let root = app.path().app_local_data_dir().map_err(|e| e.to_string())?.join("projects");
    storage::save(&root, &project_json).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_project(app: tauri::AppHandle, project_id: String) -> Result<Option<String>, String> {
    let root = app.path().app_local_data_dir().map_err(|e| e.to_string())?.join("projects");
    storage::load(&root, &project_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn audio_status(state: tauri::State<'_, AppState>) -> Result<AudioEngine, String> {
    state.audio.lock().map(|engine| engine.clone()).map_err(|_| "audio engine lock poisoned".into())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState { audio: Mutex::new(AudioEngine::default()) })
        .invoke_handler(tauri::generate_handler![save_project, load_project, audio_status])
        .run(tauri::generate_context!())
        .expect("error while running GoVibeMix");
}

