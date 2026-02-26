# AR Surgical Hub — User Flows

---

## 👤 Customer Flow

### 1. Registration & Login
```
Visit /login
  ├── Click "Create one" → switch to Register form
  │     ├── Fill: Full Name, Phone, Email, Password
  │     └── Click "Sign Up" → POST /api/users/register
  │           └── Auto-switches back to Login form
  └── Enter Email + Password → "Sign In" → POST /api/users/login
        ├── JWT stored in localStorage + AuthContext
        └── Redirect → Home (/)
```

### 2. Home Page (/)
```
Home page sections (in order):
  ├── Hero Banner
  │     ├── "Explore Products" → /shop
  │     └── "Request Bulk Quote" → /quotes
  ├── Trust Bar: Genuine Brand, Free Shipping, ISO Certified, 24/7 Support, Quality Assured
  ├── "Why Choose Us" — about section with stats (15k+ products, 200+ countries, 30+ years)
  ├── Featured Products (up to 4 ProductCards) → View All → /shop
  ├── Promo Banner — "Get a Free Quote" CTA → /quotes
  ├── Latest Products / New Arrivals (up to 6 ProductCards) → View All → /shop
  ├── Promo Banner 2 — "Shop Now" CTA → /shop
  ├── Trending Products (up to 4 ProductCards) → View All → /shop
  ├── "Why Choose AR Surgical?" feature cards (4 cards: Premium Material, Precision, Logistics, Consultation)
  └── Latest Blogs section (3 static articles with tag, author, date)
```

### 3. Browse & Discover
```
Header nav
  ├── Products → /shop
  │     ├── Lists ALL active products as ProductCards
  │     └── Auto-filters if URL has ?category=<id>
  └── Categories → /categories
        ├── Grid of all category cards (name + description)
        └── Click "Browse Collection →" → /shop?category=<id>
              └── Shop automatically filters by that category
```

### 4. Product Detail (/product/:id)
```
/product/:id
  ├── Product image (placeholder if none)
  ├── "Precision Grade" badge, name, price ($), description
  ├── Trust badges: "2 Year Warranty", "FDA Approved"
  ├── Stock count: "In Stock: X units"
  ├── "Add to Cart" button → addToCart() → CartContext
  ├── "Wishlist / In Wishlist" button (heart fill toggles) → WishlistContext
  ├── Customer Reviews section
  │     └── Each review: reviewer name, star rating (1-5), comment, date
  └── Write a Review form
        ├── ⚠️  If NOT logged in → shows "please login" link → /login
        └── If logged in:
              ├── Clickable star rating selector (1–5)
              ├── Comment textarea (required)
              └── "Submit Review" → POST /api/reviews → refreshes reviews
```

### 5. Cart (/cart)
```
Header Cart icon (shows live item count badge) → /cart
  ├── If cart is EMPTY → "Your cart is empty" + "Start Shopping" → /shop
  └── If cart has items:
        ├── List: product image, name, price, quantity, subtotal per item
        ├── "🗑️ Remove" button per item → removeFromCart()
        ├── "Clear Cart" button → clearCart()
        ├── Order Summary: Subtotal, Shipping (FREE), Total
        └── "Proceed to Checkout →" → /checkout
```

### 6. Checkout (/checkout)
```
/checkout
  ├── ⚠️  If NOT logged in on submit → alert + redirect to /login
  └── If logged in:
        ├── Shipping Information: Full Shipping Address (textarea, required)
        ├── Payment Method (radio buttons):
        │     ├── 💳 Credit Card (default selected)
        │     └── 🏦 Bank Transfer
        ├── Order Review panel: all cart items (name x qty = $subtotal), Total to Pay
        └── "Place Secure Order" → POST /api/orders
              ├── On success → alert "Order placed!" → clearCart() → redirect to /
              └── On failure → alert "Failed to place order."
```

### 7. Wishlist (/wishlist)
```
Header Heart icon → /wishlist
  ├── If EMPTY → "Your wishlist is empty" + "Explore Products" → /shop
  └── If has items → full ProductCard grid
        ├── Each card: image, name, price, Add to Cart, Quick View, toggle wishlist
        └── Click heart on card → toggleWishlist() → removes from wishlist
```

### 8. Get a Quote (/quotes)
```
Header → "Get a Quote" → /quotes
  ├── Info cards: "Bulk Orders" info, "Custom Packages" info
  ├── Enquiry form (works for both guests and logged-in users)
  │     └── Large textarea: describe requirements (items, quantities, models)
  └── "Submit Request" → POST /api/quotes (user_id: null if guest)
        ├── On success → alert "Quote request sent!" → clears form
        └── On failure → alert "Failed to send."
```

### 9. Careers (/careers)
```
Header → Careers → /careers
  ├── Heading: "Join Our Team" + subtitle
  ├── If NO vacancies → "No Active Openings" empty state
  └── If vacancies exist → job cards (per vacancy):
        ├── Position title + "Full-Time" badge
        ├── 📍 Location, 💵 Salary Range, 🕐 Posted Date
        └── "Apply Now" button (UI only, no backend action)
```

### 10. Logout
```
Header top bar → "Logout" button (only shown when logged in)
  └── logout() → removes token from localStorage → resets user to null → guest mode
```


---

## 🔐 Admin Flow

### 1. Admin Login & Route Guard
```
Visit /login
  └── Enter admin credentials
        (default: admin@arsurgical.com / admin123)
        └── Receive JWT with role: "admin"
              └── Redirect → /admin (AdminPanel)

AdminRoute guard:
  ├── No user → redirect to /login
  └── User role ≠ admin → redirect to / (home)
```

### 2. Admin Panel Layout
```
/admin
  ├── Sidebar
  │     ├── Logo + "Admin Panel" label
  │     ├── Navigation tabs: Dashboard, Products, Categories, Orders, Users
  │     └── Logout button → clears auth → redirect to /
  └── Topbar
        ├── Page title (changes per tab)
        └── Admin badge showing: "👤 <name/email>  [Admin]"
```

### 3. Dashboard
```
Dashboard tab
  ├── Stats cards (live from API)
  │     ├── 📦 Total Products
  │     ├── 👥 Total Users
  │     ├── 🛍️ Total Orders
  │     └── 💵 Revenue (from paid orders only, formatted as $X)
  └── Recent Orders table (last 5)
        ├── Order ID (truncated)
        ├── Customer name or email (or "Guest")
        ├── Amount ($)
        ├── Status badge (color-coded)
        └── Date
```

### 4. Product Management
```
Products tab
  ├── Table view: Image thumb, Name, Category, Price, Stock, Actions
  ├── Add Product → opens modal
  │     ├── Fields: Name, Description, Price (number), Stock (number), Image URL
  │     ├── Category dropdown (populated from existing categories)
  │     └── "Add Product" → POST /api/admin/products → refresh list
  ├── Edit Product (✏️ Pencil button)
  │     └── Pre-fills modal with current data → "Save Changes" → PUT /api/admin/products/:id
  └── Delete Product (🗑️ Trash button)
        └── Confirm dialog → DELETE /api/admin/products/:id → refresh list
```

### 5. Category Management
```
Categories tab
  ├── Table view: Image, Name, Description, Actions
  ├── Add Category → opens modal
  │     ├── Category Name (required — Save button disabled until filled)
  │     ├── Description (optional textarea)
  │     └── Icon/Image URL (optional) → "Create Category" → POST
  ├── Edit Category (✏️ Pencil button)
  │     └── Pre-fills modal → "Save Changes" → PUT /api/admin/categories/:id
  └── Delete Category (🗑️ Trash button)
        └── Confirm dialog (warns products may become unlinked!) → DELETE
```

### 6. Order Management
```
Orders tab
  ├── Table view: Order ID, Customer, Amount, Payment Status badge, Status dropdown, Date
  ├── Payment status badge: "paid" (green) / "unpaid" (yellow)
  └── Status dropdown (inline, updates immediately)
        └── Options: pending → processing → shipped → delivered → cancelled
              └── On change → PUT /api/admin/orders/:id/status → refresh list
```

### 7. User Management
```
Users tab
  └── Table view (read-only, no edit/delete)
        └── Columns: Name, Email, Phone, Role badge (admin/customer), Joined Date
```

### 8. Admin Logout
```
Sidebar → Logout button
  └── logout() → clears token & user from context/localStorage
        └── navigate('/') → back to public home page
```


---

## 🔒 Access Control Summary

| Action | Guest | Customer | Admin |
|--------|-------|----------|-------|
| Browse products & categories | ✅ | ✅ | ✅ |
| Add to cart / wishlist | ✅ | ✅ | — |
| Register / Login | ✅ | — | — |
| Submit quote request | ✅ | ✅ | — |
| Place order (checkout) | ❌ (redirect to login) | ✅ | — |
| Write product review | ❌ (shows login link) | ✅ | — |
| View reviews / careers | ✅ | ✅ | ✅ |
| Admin panel | ❌ | ❌ | ✅ |
| Manage products | ❌ | ❌ | ✅ |
| Manage categories | ❌ | ❌ | ✅ |
| Manage orders | ❌ | ❌ | ✅ |
| View all users | ❌ | ❌ | ✅ |
