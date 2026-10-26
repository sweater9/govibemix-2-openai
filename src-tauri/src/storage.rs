use std::{fs, path::{Path, PathBuf}};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum StorageError {
    #[error("invalid project id")] InvalidId,
    #[error("project data is not valid JSON: {0}")] InvalidJson(#[from] serde_json::Error),
    #[error("could not access project storage: {0}")] Io(#[from] std::io::Error),
}

pub fn project_path(root: &Path, id: &str) -> Result<PathBuf, StorageError> {
    if id.is_empty() || !id.chars().all(|c| c.is_ascii_alphanumeric() || c == '-') { return Err(StorageError::InvalidId); }
    Ok(root.join(format!("{id}.gvm.json")))
}

pub fn save(root: &Path, project_json: &str) -> Result<String, StorageError> {
    let value: serde_json::Value = serde_json::from_str(project_json)?;
    let id = value.get("id").and_then(|v| v.as_str()).ok_or(StorageError::InvalidId)?;
    fs::create_dir_all(root)?;
    let path = project_path(root, id)?;
    let temporary = path.with_extension("tmp");
    fs::write(&temporary, serde_json::to_vec_pretty(&value)?)?;
    fs::rename(temporary, &path)?;
    Ok(path.to_string_lossy().into_owned())
}

pub fn load(root: &Path, id: &str) -> Result<Option<String>, StorageError> {
    let path = project_path(root, id)?;
    if !path.exists() { return Ok(None); }
    Ok(Some(fs::read_to_string(path)?))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn project_round_trip_is_atomic_and_local() {
        let temp = tempfile::tempdir().unwrap();
        let json = r#"{"id":"project-1","name":"Test"}"#;
        save(temp.path(), json).unwrap();
        assert_eq!(serde_json::from_str::<serde_json::Value>(&load(temp.path(), "project-1").unwrap().unwrap()).unwrap()["name"], "Test");
    }
    #[test] fn rejects_traversal_ids() { assert!(project_path(Path::new("/tmp"), "../escape").is_err()); }
}

