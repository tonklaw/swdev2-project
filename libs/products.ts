const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // if (!response.ok) {
  //   throw new Error("Failed to fetch products");
  // }
  return await response.json();
}

export async function createProduct(
  token: string,
  productData: Omit<Product, "id" | "_id">,
) {
  console.log("Creating product with data:", productData);
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  // if (!response.ok) {
  //   throw new Error("Failed to create product");
  // }
  return await response.json();
}

export async function getProductById(productId: string) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // if (!response.ok) {
  //   throw new Error("Failed to fetch product");
  // }
  return await response.json();
}

export async function updateProduct(
  token: string,
  productId: string,
  productData: Partial<Product>,
) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  // if (!response.ok) {
  //   throw new Error("Failed to update product");
  // }
  return await response.json();
}

export async function deleteProduct(token: string, productId: string) {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // if (!response.ok) {
  //   throw new Error("Failed to delete product");
  // }
  return await response.json();
}

export async function updateProductStock(
  token: string,
  productId: string,
  quantity: number,
) {
  const response = await fetch(`${API_URL}/products/${productId}/stock`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stockQuantity: quantity }),
  });

  // if (!response.ok) {
  //   throw new Error("Failed to update product stock");
  // }
  return await response.json();
}
