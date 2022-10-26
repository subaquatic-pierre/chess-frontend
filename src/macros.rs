#[macro_export]
macro_rules! console_log {
    ($($t:tt)*) => {
        use crate::js::log;
        (log(&format_args!($($t)*).to_string()))
    }

}
