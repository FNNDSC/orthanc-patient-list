use std::{path::Path, process::Command};

fn main() {
    let output = Command::new("./print_version.sh").output().unwrap();
    if !output.status.success() {
        panic!("./print_version.sh errored")
    }
    let version = String::from_utf8(output.stdout).unwrap();
    println!("cargo::rustc-env=VERSION={version}");

    let metadata = std::fs::metadata("../dist/index.html").unwrap();
    let modified = metadata.modified().unwrap();
    let date = httpdate::fmt_http_date(modified);
    let out_dir = std::env::var_os("OUT_DIR").unwrap();
    let path = Path::new(&out_dir).join("last_modified.rs");
    let code = format!("pub const LAST_MODIFIED: &std::ffi::CStr = c\"{date}\";");
    std::fs::write(&path, code).unwrap();

    println!("cargo::rerun-if-changed=build.rs")
}
