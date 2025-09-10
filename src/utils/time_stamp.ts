export function getVNISOString(date: Date = new Date()): string {
  const vnOffset = 7 * 60; // UTC+7 (theo phút)
  const localTime = new Date(date.getTime() + vnOffset * 60 * 1000);

  // Lấy từng thành phần
  const year = localTime.getUTCFullYear();
  const month = String(localTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(localTime.getUTCDate()).padStart(2, "0");
  const hours = String(localTime.getUTCHours()).padStart(2, "0");
  const minutes = String(localTime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(localTime.getUTCSeconds()).padStart(2, "0");
  const millis = String(localTime.getUTCMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${millis}`;
}
