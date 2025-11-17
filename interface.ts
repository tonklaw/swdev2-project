/* eslint-disable @typescript-eslint/no-unused-vars */
interface User {
  name: string;
  email: string;
  tel: string;
  role: "staff" | "admin";
  password: string;
  createdAt?: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  unit: string;
  picture: string;
  isActive?: boolean;
}

interface Request {
  id: string;
  transactionDate: string;
  transactionType: "stockIn" | "stockOut";
  itemAmount: number;
  product_id: string;
}
