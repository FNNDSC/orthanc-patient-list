#![allow(non_snake_case)]

use std::ffi::{CStr, CString};
use std::sync::RwLock;

use include_dir::include_dir;
use orthanc_sdk::bindings;

/// Base path of web app bundle (hard-coded into vite build command)
const BASE_PATH: &str = "/patient_list_ui";
/// Regular expression matching files which should be served from [BASE_PATH].
const BASE_PATH_RE: &CStr = c"/patient_list_ui/?(.*)";

struct OrthancContext(*mut bindings::OrthancPluginContext);

unsafe impl Send for OrthancContext {}
unsafe impl Sync for OrthancContext {}

struct AppState {
    context: OrthancContext,
    bundle: orthanc_sdk::webapp::PreparedBundle<'static>,
}

#[derive(serde::Deserialize)]
struct UiConfig {
    #[serde(rename = "RouterBasename")]
    basename: String,
}

impl Default for UiConfig {
    fn default() -> Self {
        UiConfig {
            basename: "/pui".to_string(),
        }
    }
}

#[derive(serde::Deserialize)]
struct OrthancConfig {
    #[serde(rename = "PatientListUI")]
    ui: Option<UiConfig>,
}

static GLOBAL_STATE: RwLock<Option<AppState>> = RwLock::new(None);

const DIST: include_dir::Dir = include_dir!("$CARGO_MANIFEST_DIR/../dist");
include!(concat!(env!("OUT_DIR"), "/last_modified.rs"));

#[unsafe(no_mangle)]
pub extern "C" fn OrthancPluginGetName() -> *const u8 {
    c"orthanc_patient_ui".as_ptr() as *const u8
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
    orthanc_sdk::register_rest_no_lock(context, BASE_PATH_RE, Some(serve_under_static_path));

    let configuration: OrthancConfig = orthanc_sdk::get_configuration(context)
        .unwrap()
        .deserialize()
        .unwrap();
    let basename = configuration.ui.unwrap_or_default().basename;

    /*
     * Web app bundle contains hard-coded base path, which may be different
     * from the base path this plugin is configured with. In this case, we
     * need to serve the web app from _both_ the hard-coded and configured
     * paths.
     */
    if basename != BASE_PATH {
        let path_regex = CString::new(format!("{}/?(.*)", &basename)).unwrap();
        orthanc_sdk::register_rest_no_lock(context, &path_regex, Some(serve_under_custom_path));
    }

    let mut global_state = GLOBAL_STATE.try_write().unwrap();
    *global_state = Some(AppState {
        context: OrthancContext(context),
        bundle: orthanc_sdk::webapp::prepare_bundle(
            &DIST,
            |p| p.starts_with("assets/"),
            |_| LAST_MODIFIED,
        ),
    });

    bindings::OrthancPluginErrorCode_OrthancPluginErrorCode_Success
}

/// Called when Orthanc is shutting down. The plugin must release all allocated resources.
#[unsafe(no_mangle)]
pub extern "C" fn OrthancPluginFinalize() {
    let mut global_context = GLOBAL_STATE.try_write().expect("unable to obtain lock");
    *global_context = None;
}

extern "C" fn serve_under_static_path(
    output: *mut bindings::OrthancPluginRestOutput,
    _url: *const std::ffi::c_char,
    request: *const bindings::OrthancPluginHttpRequest,
) -> bindings::OrthancPluginErrorCode {
    if let Ok(global_context) = GLOBAL_STATE.try_read().as_ref()
        && let Some(AppState {
            context, bundle, ..
        }) = global_context.as_ref()
    {
        orthanc_sdk::serve_static_file(context.0, output, request, bundle)
    } else {
        bindings::OrthancPluginErrorCode_OrthancPluginErrorCode_InternalError
    }
}

extern "C" fn serve_under_custom_path(
    output: *mut bindings::OrthancPluginRestOutput,
    _url: *const std::ffi::c_char,
    request: *const bindings::OrthancPluginHttpRequest,
) -> bindings::OrthancPluginErrorCode {
    if let Ok(global_context) = GLOBAL_STATE.try_read().as_ref()
        && let Some(AppState {
            context, bundle, ..
        }) = global_context.as_ref()
    {
        orthanc_sdk::serve_static_file(context.0, output, request, bundle)
    } else {
        bindings::OrthancPluginErrorCode_OrthancPluginErrorCode_InternalError
    }
}
