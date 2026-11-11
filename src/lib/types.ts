export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: string | boolean;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface NewsRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "published" | "draft";
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrderRecord {
  id: string;
  user_id: string;
  user_email: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
  recipient_name: string;
  phone: string;
  shipping_address: string;
  notes: string;
  payment_method: string;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan";
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  role_id: string;
}
