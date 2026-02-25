import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const url = categoryId
                    ? `http://localhost:5000/api/products?category=${categoryId}`
                    : 'http://localhost:5000/api/products';
                const res = await axios.get(url);
                setProducts(res.data);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);

    return (
        <div className="shop container">
            <div className="section-header">
                <h1>Catalog <span>Instruments</span></h1>
                <p>Premium selection of FDA approved surgical tools.</p>
            </div>

            {loading ? (
                <div className="loading">Loading instruments...</div>
            ) : (
                <div className="product-grid">
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="no-products">
                            No products found. Please check back later.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Shop;
