export function isValidEmail(email) {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email.trim());
}

export function isStrongPassword(password) {
  if (typeof password !== "string") return false;
  const trimmed = password.trim();
  return (
    trimmed.length >= 8 &&
    /[a-z]/.test(trimmed) &&
    /[A-Z]/.test(trimmed) &&
    /[0-9]/.test(trimmed) &&
    /[^A-Za-z0-9]/.test(trimmed)
  );
}
