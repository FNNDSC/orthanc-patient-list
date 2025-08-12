use std::process::Command;

fn main() {
    let output = Command::new("./print_version.sh").output().unwrap();
    if !output.status.success() {
        panic!("./print_version.sh errored")
    }
    let version = String::from_utf8(output.stdout).unwrap();
    println!("cargo::rustc-env=VERSION={version}")
}
