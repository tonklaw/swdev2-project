const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export async function getRequests(token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/requests`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch requests");
  }
  return await response.json();
}

export async function createRequest(token: string, requestData: Request) {
  const response = await fetch(`${API_URL}/requests`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error("Failed to create request");
  }
  return await response.json();
}

export async function getRequestById(token: string, requestId: string) {
  const response = await fetch(`${API_URL}/requests/${requestId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch request");
  }
  return await response.json();
}

export async function updateRequest(
  token: string,
  requestId: string,
  requestData: Partial<Request>,
) {
  const response = await fetch(`${API_URL}/requests/${requestId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error("Failed to update request");
  }
  return await response.json();
}

export async function deleteRequest(token: string, requestId: string) {
  const response = await fetch(`${API_URL}/requests/${requestId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete request");
  }
  return await response.json();
}
