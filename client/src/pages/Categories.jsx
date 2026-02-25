import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Categories.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/categories');
                setCategories(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="categories-page container">
            <div className="section-header">
                <h1>Instrument <span>Categories</span></h1>
                <p>Explore our specialized range of surgical equipment.</p>
            </div>

            {loading ? (
                <div className="loading">Loading categories...</div>
            ) : (
                <div className="categories-grid">
                    {categories.map((cat) => (
                        <Link to={`/shop?category=${cat.id}`} key={cat.id} className="category-card bg-glass">
                            <h3>{cat.name}</h3>
                            <p>{cat.description}</p>
                            <span className="view-more">Browse Collection →</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Categories;
