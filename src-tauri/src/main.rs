#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use std::{ fs::{ self }, path::{ PathBuf } };

const FLYFF_URI: &str = "https://universe.flyff.com/play";

fn main() {
    // Generate context
    let context = tauri::generate_context!();

    // Run application
    tauri::Builder
        ::default()
        .invoke_handler(
            tauri::generate_handler![
                open_window,
                list_profiles,
                create_profile,
                delete_profile,
                open_all_profiles,
                update_profile
            ]
        )
        .run(context)
        .expect("error while running application");
}

/**
 * Get the application directory path
 * @param app_handle The application handle
 * @return The application directory path
 */
fn get_app_dir_path(app_handle: &tauri::AppHandle) -> String {
    app_handle.path_resolver().app_dir().unwrap().to_string_lossy().to_string()
}

fn get_profile_folder_path(app_handle: &tauri::AppHandle) -> PathBuf {
    let path: PathBuf = [get_app_dir_path(&app_handle), "profiles".to_string()].iter().collect();
    path
}

fn get_profile_path(app_handle: &tauri::AppHandle, profile_id: &String) -> PathBuf {
    let path: PathBuf = [
        get_profile_folder_path(app_handle).to_string_lossy().to_string(),
        profile_id.to_string(),
    ]
        .iter()
        .collect();
    path
}

#[tauri::command]
fn open_window(profile_id: String, app_handle: tauri::AppHandle) {
    // Create data directory path
    let data_directory: PathBuf = get_profile_path(&app_handle, &profile_id);

    // Create window
    let window = tauri::WindowBuilder
        ::new(
            &app_handle,
            format!("client_{}", profile_id),
            tauri::WindowUrl::External(FLYFF_URI.parse().unwrap())
        )
        .data_directory(data_directory)
        .center()
        .inner_size(800.0, 600.0)
        .title(format!("Flyzer | {}", profile_id))
        .build()
        .unwrap();

    #[cfg(target_os = "macos")]
    {
        unsafe {
            let ns_window = window.ns_window().unwrap() as cocoa::base::id;
            NSWindow::setAllowsAutomaticWindowTabbing_(ns_window, cocoa::base::NO);
        }
    }

    // Open window
    drop(window.show());
}

#[tauri::command]
fn open_all_profiles(app_handle: tauri::AppHandle) {
    for profile_id in list_profiles(app_handle.clone()) {
        open_window(profile_id, app_handle.clone());
    }
}

#[tauri::command]
fn list_profiles(app_handle: tauri::AppHandle) -> Vec<String> {
    drop(fs::create_dir(get_profile_folder_path(&app_handle).to_string_lossy().to_string()));
    let paths = fs::read_dir(get_profile_folder_path(&app_handle)).unwrap();
    let mut profiles = vec![];

    for path in paths {
        if let Ok(entry) = path {
            profiles.push(String::from(&*entry.file_name().to_str().unwrap()));
        }
    }

    profiles
}

#[tauri::command]
fn create_profile(profile_id: String, app_handle: tauri::AppHandle) {
    println!("Creating profile: {}", profile_id);
    drop(fs::create_dir(get_profile_path(&app_handle, &profile_id)));
}

#[tauri::command]
fn delete_profile(profile_id: String, app_handle: tauri::AppHandle) {
    drop(fs::remove_dir_all(get_profile_path(&app_handle, &profile_id)));
}

#[tauri::command]
fn update_profile(profile_id: String, new_profile_id: String, app_handle: tauri::AppHandle) {
    drop(
        fs::rename(
            get_profile_path(&app_handle, &profile_id),
            get_profile_path(&app_handle, &new_profile_id)
        )
    );
    drop(
        fs::rename(
            get_profile_path(&app_handle, &profile_id),
            get_profile_path(&app_handle, &new_profile_id).clone()
        )
    );
}