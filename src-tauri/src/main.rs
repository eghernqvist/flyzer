#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

fn main() {
    // Generate tauri context
    let context = tauri::generate_context!();

    // Build app
    tauri::Builder
        ::default()
        .invoke_handler(tauri::generate_handler![open_window])
        .run(context)
        .expect("error while running tauri application");
}

#[tauri::command]
async fn open_window(app_handle: tauri::AppHandle) {
    let window = tauri::WindowBuilder
        ::new(
            &app_handle,
            "client",
            tauri::WindowUrl::External("https://universe.flyff.com/play".parse().unwrap())
        )
        //.resizable(false)
        .center()
        .inner_size(800.0, 600.0)
        .title(format!("Flyzer | Flyff Universe"))
        .build()
        .unwrap();
    drop(window.show());
}