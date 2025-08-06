#![allow(non_snake_case)]

use std::sync::RwLock;

use include_dir::include_dir;
use orthanc_sdk::bindings;

struct OrthancContext(*mut bindings::OrthancPluginContext);

unsafe impl Send for OrthancContext {}
unsafe impl Sync for OrthancContext {}

static CONTEXT: RwLock<Option<OrthancContext>> = RwLock::new(None);

const BASE_PATH: &'static str = env!("BASE_PATH");
const PATH_REGEX: &'static str = concat!(env!("BASE_PATH"), "(/.*)?");
const DIST: include_dir::Dir = include_dir!("$CARGO_MANIFEST_DIR/../dist");

#[unsafe(no_mangle)]
pub extern "C" fn OrthancPluginGetName() -> *const u8 {
    "orthanc_patient_ui\0".as_ptr()
}

#[unsafe(no_mangle)]
pub extern "C" fn OrthancPluginGetVersion() -> *const u8 {
    concat!(env!("VERSION"), "\0").as_ptr()
}

#[allow(clippy::not_unsafe_ptr_arg_deref)]
#[unsafe(no_mangle)]
pub extern "C" fn OrthancPluginInitialize(
    context: *mut bindings::OrthancPluginContext,
) -> bindings::OrthancPluginErrorCode {
    let mut global_context = CONTEXT.try_write().unwrap();
    *global_context = Some(OrthancContext(context));

    let path_regex = std::ffi::CString::new(PATH_REGEX).unwrap();
    orthanc_sdk::register_rest_no_lock(context, &path_regex, Some(rest_callback));

    bindings::OrthancPluginErrorCode_OrthancPluginErrorCode_Success
}

/// Called when Orthanc is shutting down. The plugin must release all allocated resources.
#[unsafe(no_mangle)]
pub extern "C" fn OrthancPluginFinalize() {
    let mut global_context = CONTEXT.try_write().expect("unable to obtain lock");
    *global_context = None;
}

extern "C" fn rest_callback(
    output: *mut bindings::OrthancPluginRestOutput,
    url: *const std::ffi::c_char,
    request: *const bindings::OrthancPluginHttpRequest,
) -> bindings::OrthancPluginErrorCode {
    if let Ok(global_context) = CONTEXT.try_read().as_ref()
        && let Some(context) = global_context.as_ref()
    {
        orthanc_sdk::serve_static_file(context.0, output, url, request, &DIST, BASE_PATH)
    } else {
        bindings::OrthancPluginErrorCode_OrthancPluginErrorCode_InternalError
    }
}
