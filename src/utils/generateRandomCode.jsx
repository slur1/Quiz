export default function generateRandomCode(bytes = 32) {
  try {
    const arr = Array.from(crypto.getRandomValues(new Uint8Array(bytes)));
    return arr.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    console.error(err);
    const fallback = [];
    for (let i = 0; i < bytes; i++) fallback.push(Math.floor(Math.random() * 256));
    return fallback.map(b => b.toString(16).padStart(2, "0")).join("");
    }
}
