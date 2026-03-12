export interface User {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    role: 'admin' | 'customer';
    is_active?: boolean;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
}

export interface Subcategory {
    id: string;
    category_id: string;
    name: string;
    description?: string;
    categories?: {
        name: string;
    };
}

export interface Product {
    id: string;
    category_id: string;
    subcategory_id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    is_active: boolean;
    categories?: {
        name: string;
    };
    subcategories?: {
        name: string;
    };
}

export interface Review {
    id: string;
    product_id: string;
    user_id: string;
    rating: number;
    comment: string;
    created_at: string;
    users?: {
        full_name: string;
    };
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'unpaid' | 'paid' | 'failed';
    payment_method?: string;
    shipping_address?: string;
    created_at: string;
    users?: {
        full_name: string;
        email: string;
    };
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
    products?: {
        name: string;
        image_url: string;
    };
}

export interface Blog {
    id: string;
    title: string;
    content: string;
    author_name: string;
    author_image?: string;
    featured_image?: string;
    tag?: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface Setting {
    id: string;
    key: string;
    value: string;
    description?: string;
    settings_group: string;
    field_type: 'text' | 'textarea' | 'number' | 'boolean';
    updated_at: string;
}

export interface WarrantyClaim {
    id: string;
    user_id: string;
    order_id: string;
    product_id: string;
    claim_type: 'defective' | 'damaged' | 'malfunction' | 'missing_parts' | 'other';
    description: string;
    status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'resolved';
    priority: 'low' | 'medium' | 'high' | 'critical';
    admin_notes?: string;
    resolution?: string;
    created_at: string;
    updated_at: string;
    users?: {
        full_name: string;
        email: string;
        phone?: string;
    };
    orders?: {
        id: string;
        total_amount: number;
        status: string;
        created_at: string;
    };
    products?: {
        name: string;
        image_url: string;
    };
}
