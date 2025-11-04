// src-tauri/src/main.rs
// Tauri v2 compatible version
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Emitter, menu::{Menu, MenuItem}, tray::TrayIconBuilder};
use std::process::Command;
use std::path::PathBuf;
use std::fs;

// Helper function to get project root (reusable)
fn get_project_root() -> Result<PathBuf, String> {
    let current_dir = std::env::current_dir()
        .map_err(|e| format!("Failed to get current dir: {}", e))?;
    
    let project_root = if current_dir.join("scripts").exists() {
        current_dir.clone()
    } else {
        current_dir.parent()
            .ok_or("Failed to find project root")?
            .to_path_buf()
    };
    
    if !project_root.join("scripts").exists() {
        return Err(format!("Scripts folder not found. Current dir: {:?}, Project root: {:?}", current_dir, project_root));
    }
    
    Ok(project_root)
}

// Fungsi yang dipanggil dari frontend React (API endpoint)
// Ini adalah jembatan yang menjalankan scripts/start.sh, scripts/stop.sh, dll.
#[tauri::command]
fn execute_bash_script(command: String) -> Result<String, String> {
    use std::io::Write;
    use chrono::Local;
    
    let project_root = get_project_root()?;
    let logs_dir = project_root.join("logs");
    
    // Buat folder logs jika belum ada
    if !logs_dir.exists() {
        fs::create_dir_all(&logs_dir)
            .map_err(|e| format!("Failed to create logs directory: {}", e))?;
    }
    
    // Determine log file based on command
    let log_filename = if command.contains("start.sh") {
        "gui_start.log"
    } else if command.contains("stop.sh") {
        "gui_stop.log"
    } else if command.contains("status.sh") {
        "gui_status.log"
    } else if command.contains("docker start") {
        "gui_docker_start.log"
    } else if command.contains("docker stop") {
        "gui_docker_stop.log"
    } else if command.contains("docker restart") {
        "gui_docker_restart.log"
    } else {
        "gui_commands.log"
    };
    
    let log_file_path = logs_dir.join(log_filename);
    let timestamp = Local::now().format("%Y-%m-%d %H:%M:%S");
    
    // Log command execution start
    let log_entry = format!("\n[{}] ═══════════════════════════════════════\n", timestamp);
    let log_command = format!("[{}] 🚀 EXECUTING: {}\n", timestamp, command);
    
    let mut log_file = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_file_path)
        .map_err(|e| format!("Failed to open log file: {}", e))?;
    
    log_file.write_all(log_entry.as_bytes())
        .map_err(|e| format!("Failed to write to log: {}", e))?;
    log_file.write_all(log_command.as_bytes())
        .map_err(|e| format!("Failed to write to log: {}", e))?;

    // Panggil 'bash' dengan current_dir di project root
    let output = Command::new("bash")
        .arg("-c")
        .arg(&command)
        .current_dir(&project_root)
        .output()
        .map_err(|e| format!("Gagal menjalankan command: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();
    
    // Log output
    if !stdout.is_empty() {
        let log_stdout = format!("[{}] STDOUT:\n{}\n", timestamp, stdout);
        log_file.write_all(log_stdout.as_bytes())
            .map_err(|e| format!("Failed to write stdout to log: {}", e))?;
    }
    
    if !stderr.is_empty() {
        let log_stderr = format!("[{}] STDERR:\n{}\n", timestamp, stderr);
        log_file.write_all(log_stderr.as_bytes())
            .map_err(|e| format!("Failed to write stderr to log: {}", e))?;
    }
    
    // Log result
    if output.status.success() {
        let log_success = format!("[{}] ✅ SUCCESS - Exit code: 0\n", timestamp);
        log_file.write_all(log_success.as_bytes())
            .map_err(|e| format!("Failed to write success to log: {}", e))?;
        Ok(stdout)
    } else {
        let exit_code = output.status.code().unwrap_or(-1);
        let log_error = format!("[{}] ❌ FAILED - Exit code: {}\n", timestamp, exit_code);
        log_file.write_all(log_error.as_bytes())
            .map_err(|e| format!("Failed to write error to log: {}", e))?;
        Err(format!("Command gagal (exit code {}):\n{}", exit_code, stderr))
    }
}

// Command untuk list semua log files di folder logs/
#[tauri::command]
fn list_logs_files() -> Result<Vec<String>, String> {
    let project_root = get_project_root()?;
    let logs_dir = project_root.join("logs");
    
    if !logs_dir.exists() {
        return Ok(vec![]);
    }
    
    let entries = fs::read_dir(&logs_dir)
        .map_err(|e| format!("Failed to read logs directory: {}", e))?;
    
    let mut log_files = Vec::new();
    for entry in entries {
        if let Ok(entry) = entry {
            if let Ok(file_type) = entry.file_type() {
                if file_type.is_file() {
                    if let Some(file_name) = entry.file_name().to_str() {
                        log_files.push(file_name.to_string());
                    }
                }
            }
        }
    }
    
    log_files.sort();
    Ok(log_files)
}

// Command untuk baca isi log file
#[tauri::command]
fn read_logs_file(filename: String) -> Result<String, String> {
    let project_root = get_project_root()?;
    let log_path = project_root.join("logs").join(&filename);
    
    if !log_path.exists() {
        return Err(format!("Log file tidak ditemukan: {}", filename));
    }
    
    fs::read_to_string(&log_path)
        .map_err(|e| format!("Failed to read log file: {}", e))
}

// Command untuk buka folder di file manager
#[tauri::command]
fn open_folder(folder_name: String) -> Result<String, String> {
    let project_root = get_project_root()?;
    let folder_path = project_root.join(&folder_name);
    
    if !folder_path.exists() {
        return Err(format!("Folder tidak ditemukan: {}", folder_name));
    }
    
    // Platform-specific command untuk buka file manager
    #[cfg(target_os = "linux")]
    let command = format!("xdg-open '{}'", folder_path.display());
    
    #[cfg(target_os = "macos")]
    let command = format!("open '{}'", folder_path.display());
    
    #[cfg(target_os = "windows")]
    let command = format!("explorer '{}'", folder_path.display());
    
    Command::new("bash")
        .arg("-c")
        .arg(&command)
        .output()
        .map_err(|e| format!("Failed to open folder: {}", e))?;
    
    Ok(format!("Folder {} dibuka", folder_name))
}

// Command untuk write log message dari frontend ke file logs
#[tauri::command]
fn write_log_message(message: String) -> Result<(), String> {
    use std::io::Write;
    use chrono::Local;
    
    let project_root = get_project_root()?;
    let logs_dir = project_root.join("logs");
    
    // Buat folder logs jika belum ada
    if !logs_dir.exists() {
        fs::create_dir_all(&logs_dir)
            .map_err(|e| format!("Failed to create logs directory: {}", e))?;
    }
    
    let log_file = logs_dir.join("gui_actions.log");
    let timestamp = Local::now().format("%Y-%m-%d %H:%M:%S");
    let log_entry = format!("[{}] {}\n", timestamp, message);
    
    let mut file = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_file)
        .map_err(|e| format!("Failed to open log file: {}", e))?;
    
    file.write_all(log_entry.as_bytes())
        .map_err(|e| format!("Failed to write to log file: {}", e))?;
    
    Ok(())
}

// Command untuk check Docker container status
#[tauri::command]
fn check_docker_containers() -> Result<String, String> {
    let project_root = get_project_root()?;
    
    // Run docker compose ps untuk check status containers
    let output = Command::new("docker")
        .arg("compose")
        .arg("ps")
        .arg("--format")
        .arg("json")
        .current_dir(&project_root)
        .output()
        .map_err(|e| format!("Failed to run docker compose: {}", e))?;
    
    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        // Jika gagal, return empty array JSON
        Ok("[]".to_string())
    }
}

// Command untuk get Docker logs dari container
#[tauri::command]
fn get_docker_logs(container_name: String, lines: u32) -> Result<String, String> {
    let output = Command::new("docker")
        .arg("logs")
        .arg("--tail")
        .arg(lines.to_string())
        .arg(&container_name)
        .output()
        .map_err(|e| format!("Failed to get docker logs: {}", e))?;
    
    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        let stderr = String::from_utf8_lossy(&output.stderr);
        Ok(format!("{}{}", stdout, stderr))
    } else {
        Err(format!("Container {} not found", container_name))
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            execute_bash_script,
            list_logs_files,
            read_logs_file,
            open_folder,
            write_log_message,
            check_docker_containers,
            get_docker_logs
        ])
        .setup(|app| {
            // Setup tray icon with simplified menu - HANYA 3 ITEM
            let start_i = MenuItem::with_id(app, "start_all", "▶️ Start All", true, None::<&str>)?;
            let stop_i = MenuItem::with_id(app, "stop_all", "⏹️ Stop All", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "❌ Exit", true, None::<&str>)?;
            
            let menu = Menu::with_items(app, &[
                &start_i, 
                &stop_i,
                &quit_i
            ])?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(move |app, event| {
                    match event.id.as_ref() {
                        "quit" => {
                            std::process::exit(0);
                        }
                        "start_all" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.emit("run_script", "start.sh");
                            }
                        }
                        "stop_all" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.emit("run_script", "stop.sh");
                            }
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let tauri::tray::TrayIconEvent::DoubleClick { .. } = event {
                        // Double click tray icon untuk show window
                        if let Some(app) = tray.app_handle().get_webview_window("main") {
                            let _ = app.show();
                            let _ = app.set_focus();
                        }
                    }
                })
                .build(app)?;

            // Handle window close event - Hide to tray instead of exit
            // User bisa close window dengan tombol X, window akan hide
            // Buka lagi dari tray icon
            if let Some(window) = app.get_webview_window("main") {
                let window_clone = window.clone();
                window.on_window_event(move |event| {
                    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                        // Prevent close dan hide window
                        api.prevent_close();
                        let _ = window_clone.hide();
                    }
                });
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}