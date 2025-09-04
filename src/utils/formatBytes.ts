export function formatBytes(bytes?: number | null): string {
    if (bytes == null) return "-";
    const thresh = 1024;
    if (Math.abs(bytes) < thresh) return bytes + " B";
    const units = ["KB", "MB", "GB", "TB"];
    let u = -1;
    let b = bytes;
    do {
        b /= thresh;
        ++u;
    } while (Math.abs(b) >= thresh && u < units.length - 1);
    return b.toFixed(1) + " " + units[u];
}