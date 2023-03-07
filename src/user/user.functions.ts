export function generateId() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = String(today.getFullYear()).slice(-1);
  const seconds = String(today.getSeconds());
  const hours = String(today.getHours());
  const minutes = String(today.getMinutes());

  const id = `${day}${month}${year}${hours}${minutes}${seconds}`;

  return id;
}
