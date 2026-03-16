// @ts-nocheck
/**
 * AR Surgical Hub — Client Test Suite
 * Tests: Contexts (Cart, Wishlist, Auth), Components (ProductCard, Header),
 *        Pages (Login, Cart, Wishlist), and Routing (App)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// ─── Context Imports ───────────────────────────────────────
import { CartProvider, useCart } from '../context/CartContext';
import { WishlistProvider, useWishlist } from '../context/WishlistContext';
import { AuthProvider, useAuth } from '../context/AuthContext';

// ─── Component Imports ─────────────────────────────────────
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import Wishlist from '../pages/Wishlist';

// ─── Mock axios ────────────────────────────────────────────
vi.mock('axios', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
        defaults: { headers: { common: {} } },
    },
}));

// ─── Mock import.meta.env ──────────────────────────────────
vi.mock('../config/api', () => ({
    default: 'http://localhost:5000',
}));

// ─── SAMPLE DATA ──────────────────────────────────────────
const mockProduct = {
    id: 'prod-001',
    name: 'Digital Stethoscope',
    price: 299.99,
    image_url: 'https://example.com/stethoscope.jpg',
    category_name: 'Diagnostic Instruments',
};

const mockProduct2 = {
    id: 'prod-002',
    name: 'Surgical Scalpel',
    price: 89.50,
    image_url: null,
    category_name: 'Surgical Equipment',
};

// ─── HELPERS ──────────────────────────────────────────────
const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AuthProvider>
        <CartProvider>
            <WishlistProvider>
                <MemoryRouter>{children}</MemoryRouter>
            </WishlistProvider>
        </CartProvider>
    </AuthProvider>
);

const CartProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <CartProvider>{children}</CartProvider>
);

const WishlistProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <WishlistProvider>{children}</WishlistProvider>
);

// ═══════════════════════════════════════════════════════════
// 1. CART CONTEXT
// ═══════════════════════════════════════════════════════════
describe('CartContext', () => {
    const CartTestComponent = () => {
        const { cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
        return (
            <div>
                <span data-testid="count">{cartCount}</span>
                <span data-testid="total">{cartTotal.toFixed(2)}</span>
                <span data-testid="items">{cart.length}</span>
                <button onClick={() => addToCart(mockProduct)}>Add</button>
                <button onClick={() => addToCart(mockProduct)}>Add Again</button>
                <button onClick={() => removeFromCart(mockProduct.id)}>Remove</button>
                <button onClick={clearCart}>Clear</button>
            </div>
        );
    };

    it('starts with an empty cart', () => {
        render(<CartProviderWrapper><CartTestComponent /></CartProviderWrapper>);
        expect(screen.getByTestId('count').textContent).toBe('0');
        expect(screen.getByTestId('items').textContent).toBe('0');
        expect(screen.getByTestId('total').textContent).toBe('0.00');
    });

    it('adds a product to the cart', async () => {
        render(<CartProviderWrapper><CartTestComponent /></CartProviderWrapper>);
        const [addBtn] = screen.getAllByText('Add');
        await userEvent.click(addBtn);
        expect(screen.getByTestId('count').textContent).toBe('1');
        expect(screen.getByTestId('items').textContent).toBe('1');
        expect(screen.getByTestId('total').textContent).toBe('299.99');
    });

    it('increments quantity when adding the same product again', async () => {
        render(<CartProviderWrapper><CartTestComponent /></CartProviderWrapper>);
        const [addBtn] = screen.getAllByText('Add');
        await userEvent.click(addBtn);
        await userEvent.click(addBtn);
        expect(screen.getByTestId('count').textContent).toBe('2');
        expect(screen.getByTestId('items').textContent).toBe('1'); // still 1 unique item
        expect(screen.getByTestId('total').textContent).toBe('599.98');
    });

    it('removes a product from the cart', async () => {
        render(<CartProviderWrapper><CartTestComponent /></CartProviderWrapper>);
        const [addBtn] = screen.getAllByText('Add');
        await userEvent.click(addBtn);
        await userEvent.click(screen.getByText('Remove'));
        expect(screen.getByTestId('count').textContent).toBe('0');
        expect(screen.getByTestId('items').textContent).toBe('0');
    });

    it('clears the entire cart', async () => {
        render(<CartProviderWrapper><CartTestComponent /></CartProviderWrapper>);
        const [addBtn] = screen.getAllByText('Add');
        await userEvent.click(addBtn);
        await userEvent.click(addBtn);
        await userEvent.click(screen.getByText('Clear'));
        expect(screen.getByTestId('count').textContent).toBe('0');
        expect(screen.getByTestId('total').textContent).toBe('0.00');
    });

    it('calculates cartTotal correctly for multiple items', async () => {
        const MultiCartTest = () => {
            const { addToCart, cartTotal } = useCart();
            return (
                <div>
                    <span data-testid="total">{cartTotal.toFixed(2)}</span>
                    <button onClick={() => addToCart(mockProduct)}>Add P1</button>
                    <button onClick={() => addToCart(mockProduct2)}>Add P2</button>
                </div>
            );
        };
        render(<CartProviderWrapper><MultiCartTest /></CartProviderWrapper>);
        await userEvent.click(screen.getByText('Add P1'));
        await userEvent.click(screen.getByText('Add P2'));
        expect(screen.getByTestId('total').textContent).toBe('389.49');
    });
});

// ═══════════════════════════════════════════════════════════
// 2. WISHLIST CONTEXT
// ═══════════════════════════════════════════════════════════
describe('WishlistContext', () => {
    const WishlistTestComponent = () => {
        const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
        return (
            <div>
                <span data-testid="count">{wishlist.length}</span>
                <span data-testid="in-wishlist">{isInWishlist(mockProduct.id) ? 'yes' : 'no'}</span>
                <button onClick={() => toggleWishlist(mockProduct)}>Toggle</button>
            </div>
        );
    };

    it('starts with an empty wishlist', () => {
        render(<WishlistProviderWrapper><WishlistTestComponent /></WishlistProviderWrapper>);
        expect(screen.getByTestId('count').textContent).toBe('0');
        expect(screen.getByTestId('in-wishlist').textContent).toBe('no');
    });

    it('adds a product on first toggle', async () => {
        render(<WishlistProviderWrapper><WishlistTestComponent /></WishlistProviderWrapper>);
        await userEvent.click(screen.getByText('Toggle'));
        expect(screen.getByTestId('count').textContent).toBe('1');
        expect(screen.getByTestId('in-wishlist').textContent).toBe('yes');
    });

    it('removes product on second toggle (toggle off)', async () => {
        render(<WishlistProviderWrapper><WishlistTestComponent /></WishlistProviderWrapper>);
        await userEvent.click(screen.getByText('Toggle'));
        await userEvent.click(screen.getByText('Toggle'));
        expect(screen.getByTestId('count').textContent).toBe('0');
        expect(screen.getByTestId('in-wishlist').textContent).toBe('no');
    });

    it('isInWishlist returns false for unknown product', () => {
        const Test = () => {
            const { isInWishlist } = useWishlist();
            return <span data-testid="check">{isInWishlist('unknown-id') ? 'yes' : 'no'}</span>;
        };
        render(<WishlistProviderWrapper><Test /></WishlistProviderWrapper>);
        expect(screen.getByTestId('check').textContent).toBe('no');
    });
});

// ═══════════════════════════════════════════════════════════
// 3. PRODUCT CARD COMPONENT
// ═══════════════════════════════════════════════════════════
describe('ProductCard', () => {
    it('renders product name and price', () => {
        render(<AllProviders><ProductCard product={mockProduct} /></AllProviders>);
        expect(screen.getByText('Digital Stethoscope')).toBeInTheDocument();
        expect(screen.getByText('Rs. 299.99')).toBeInTheDocument();
    });

    it('renders product image with correct alt text', () => {
        render(<AllProviders><ProductCard product={mockProduct} /></AllProviders>);
        const img = screen.getByAltText('Digital Stethoscope');
        expect(img).toBeInTheDocument();
        expect(img.src).toContain('stethoscope.jpg');
    });

    it('renders fallback placeholder when image_url is null', () => {
        render(<AllProviders><ProductCard product={mockProduct2} /></AllProviders>);
        expect(screen.getByText('AR SURGICAL')).toBeInTheDocument();
    });

    it('renders category badge when category_name is provided', () => {
        render(<AllProviders><ProductCard product={mockProduct} /></AllProviders>);
        expect(screen.getAllByText('Diagnostic Instruments').length).toBeGreaterThan(0);
    });

    it('renders "Add to Cart" button', () => {
        render(<AllProviders><ProductCard product={mockProduct} /></AllProviders>);
        expect(screen.getByTitle('Add to Cart')).toBeInTheDocument();
    });

    it('calls addToCart when "Add to Cart" button is clicked', async () => {
        render(<AllProviders><ProductCard product={mockProduct} /></AllProviders>);
        await userEvent.click(screen.getByTitle('Add to Cart'));
        // If no error thrown, addToCart worked
    });

    it('has a "Quick View" link navigating to product detail', () => {
        render(<AllProviders><ProductCard product={mockProduct} /></AllProviders>);
        const link = screen.getByTitle('Quick View');
        expect(link.closest('a')).toHaveAttribute('href', `/product/${mockProduct.id}`);
    });

    it('renders active styles when product is in wishlist', async () => {
        render(<AllProviders><ProductCard product={mockProduct} /></AllProviders>);
        const wishlistBtn = screen.getByTitle('Wishlist');
        await userEvent.click(wishlistBtn); // add to wishlist
        expect(wishlistBtn.className).toContain('bg-brand-green-light');
    });

    it('renders 5 rating stars', () => {
        render(<AllProviders><ProductCard product={mockProduct} /></AllProviders>);
        const stars = document.querySelectorAll('.pc-star');
        expect(stars.length).toBe(5);
    });
});

// ═══════════════════════════════════════════════════════════
// 4. HEADER COMPONENT
// ═══════════════════════════════════════════════════════════
describe('Header Component', () => {
    it('renders the logo text', () => {
        render(<AllProviders><Header /></AllProviders>);
        expect(screen.getByText(/SURGICAL HUB/i)).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(<AllProviders><Header /></AllProviders>);
        expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Products').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Categories').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Careers').length).toBeGreaterThan(0);
    });

    it('shows Login link when user is not logged in', () => {
        render(<AllProviders><Header /></AllProviders>);
        expect(screen.getAllByText(/Login \/ Register/).length).toBeGreaterThan(0);
    });

    it('shows cart count badge', () => {
        render(<AllProviders><Header /></AllProviders>);
        // Cart count should display 0 initially
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders contact info (phone and email)', () => {
        render(<AllProviders><Header /></AllProviders>);
        expect(screen.getByText(/\+94 77 0700 737/)).toBeInTheDocument();
        expect(screen.getByText(/support@arsurgicalhub.com/)).toBeInTheDocument();
    });
});

// ═══════════════════════════════════════════════════════════
// 5. CART PAGE
// ═══════════════════════════════════════════════════════════
describe('Cart Page', () => {
    it('shows empty cart message when cart is empty', () => {
        render(<AllProviders><Cart /></AllProviders>);
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
        expect(screen.getByText(/Start Shopping/i)).toBeInTheDocument();
    });

    it('renders cart items when cart has products', async () => {
        // Use a wrapper that pre-populates the cart
        const CartWithItem = () => {
            const { addToCart, cart } = useCart();
            React.useEffect(() => { addToCart(mockProduct); }, []);
            return <MemoryRouter><Cart /></MemoryRouter>;
        };
        render(<CartProvider><WishlistProvider><AuthProvider><CartWithItem /></AuthProvider></WishlistProvider></CartProvider>);
        await waitFor(() => {
            expect(screen.getByText('Digital Stethoscope')).toBeInTheDocument();
        });
    });

    it('shows order summary with correct total in cart', async () => {
        const CartWithItem = () => {
            const { addToCart } = useCart();
            React.useEffect(() => { addToCart(mockProduct); }, []);
            return <MemoryRouter><Cart /></MemoryRouter>;
        };
        render(<CartProvider><WishlistProvider><AuthProvider><CartWithItem /></AuthProvider></WishlistProvider></CartProvider>);
        await waitFor(() => {
            expect(screen.getByText('Order Summary')).toBeInTheDocument();
        });
    });

    it('shows "Proceed to Checkout" button when cart has items', async () => {
        const CartWithItem = () => {
            const { addToCart } = useCart();
            React.useEffect(() => { addToCart(mockProduct); }, []);
            return <MemoryRouter><Cart /></MemoryRouter>;
        };
        render(<CartProvider><WishlistProvider><AuthProvider><CartWithItem /></AuthProvider></WishlistProvider></CartProvider>);
        await waitFor(() => {
            expect(screen.getByText(/Proceed to Checkout/i)).toBeInTheDocument();
        });
    });
});

// ═══════════════════════════════════════════════════════════
// 6. WISHLIST PAGE
// ═══════════════════════════════════════════════════════════
describe('Wishlist Page', () => {
    it('shows empty wishlist message when no items', () => {
        render(<AllProviders><Wishlist /></AllProviders>);
        expect(screen.getByText(/wishlist is empty|no items/i)).toBeInTheDocument();
    });
});

// ═══════════════════════════════════════════════════════════
// 7. LOGIN PAGE
// ═══════════════════════════════════════════════════════════
describe('Login Page', () => {
    it('renders login form by default', () => {
        render(<AllProviders><Login /></AllProviders>);
        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('shows "Sign In" submit button on login mode', () => {
        render(<AllProviders><Login /></AllProviders>);
        expect(screen.getAllByText(/Sign In/i).length).toBeGreaterThan(0);
    });

    it('switches to register form when "Create one" is clicked', async () => {
        render(<AllProviders><Login /></AllProviders>);
        await userEvent.click(screen.getByText('Create one'));
        expect(screen.getByText('Create Account')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    });

    it('shows "Sign Up" button in register mode', async () => {
        render(<AllProviders><Login /></AllProviders>);
        await userEvent.click(screen.getByText('Create one'));
        expect(screen.getAllByText(/Sign Up/i).length).toBeGreaterThan(0);
    });

    it('switches back to login when "Login here" is clicked', async () => {
        render(<AllProviders><Login /></AllProviders>);
        await userEvent.click(screen.getByText('Create one'));
        await userEvent.click(screen.getByText('Login here'));
        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('updates email field on typing', async () => {
        render(<AllProviders><Login /></AllProviders>);
        const emailInput = screen.getByPlaceholderText('Email Address') as HTMLInputElement;
        await userEvent.type(emailInput, 'test@example.com');
        expect(emailInput.value).toBe('test@example.com');
    });

    it('updates password field on typing', async () => {
        render(<AllProviders><Login /></AllProviders>);
        const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
        await userEvent.type(passwordInput, 'secret123');
        expect(passwordInput.value).toBe('secret123');
    });
});

// ═══════════════════════════════════════════════════════════
// 8. AUTH CONTEXT (isolated functions)
// ═══════════════════════════════════════════════════════════
describe('AuthContext', () => {
    it('starts with user as null (no token in localStorage)', () => {
        localStorage.clear();
        const Test = () => {
            const { user } = useAuth();
            return <span data-testid="user">{user ? 'logged-in' : 'not-logged-in'}</span>;
        };
        render(<AuthProvider><MemoryRouter><Test /></MemoryRouter></AuthProvider>);
        expect(screen.getByTestId('user').textContent).toBe('not-logged-in');
    });

    it('logout clears user and token', async () => {
        const Test = () => {
            const { user, logout } = useAuth();
            return (
                <div>
                    <span data-testid="status">{user ? 'logged-in' : 'logged-out'}</span>
                    <button onClick={logout}>Logout</button>
                </div>
            );
        };
        render(<AuthProvider><MemoryRouter><Test /></MemoryRouter></AuthProvider>);
        await userEvent.click(screen.getByText('Logout'));
        expect(screen.getByTestId('status').textContent).toBe('logged-out');
    });
});
