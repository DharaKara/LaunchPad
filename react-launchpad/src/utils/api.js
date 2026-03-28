const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function postJson(endpoint, body) {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(`Invalid JSON response from ${endpoint}`);
  }

  if (!response.ok) {
    const auditNote = data?.audit_note;
    const message = response.status === 500
      ? `Logic Error: Data Mismatch${auditNote ? ` - ${auditNote}` : ""}`
      : (data?.message || `Request failed with status ${response.status}`);

    const error = new Error(message);
    error.status = response.status;
    error.body = data;
    throw error;
  }

  return data;
}

export { postJson };