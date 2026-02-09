$env:TEMP = "F:\rust_env\tmp"
$env:TMP = "F:\rust_env\tmp"
$env:CARGO_HOME = "F:\rust_env\cargo"
$env:RUSTUP_HOME = "F:\rust_env\rustup"
Set-Location "F:\code\devbox"
npx tauri dev 2>&1
