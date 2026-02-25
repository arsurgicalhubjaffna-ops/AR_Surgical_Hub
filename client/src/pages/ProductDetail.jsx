import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Heart, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState(null);
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [newReviewComment, setNewReviewComment] = useState('');
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const fetchDetails = async () => {
        try {
            const [productRes, reviewsRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/products/${id}`),
                axios.get(`http://localhost:5000/api/reviews/${id}`)
            ]);
            setProduct(productRes.data);
            setReviews(reviewsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to leave a review.');
            return;
        }
        setReviewLoading(true);
        try {
            await axios.post('http://localhost:5000/api/reviews', {
                product_id: id,
                user_id: user.id,
                rating: newReviewRating,
                comment: newReviewComment
            });
            setNewReviewComment('');
            setNewReviewRating(5);
            fetchDetails(); // Refresh reviews
        } catch (err) {
            setReviewError('Failed to submit review.');
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return <div className="loading container">Loading details...</div>;
    if (!product) return <div className="error container">Product not found.</div>;

    return (
        <div className="product-detail container">
            <div className="detail-grid">
                <div className="detail-image bg-glass">
                    <img src={product.image_url || 'https://via.placeholder.com/600x400'} alt={product.name} />
                </div>
                <div className="detail-info">
                    <span className="badge">Precision Grade</span>
                    <h1>{product.name}</h1>
                    <p className="price">${product.price}</p>
                    <p className="description">{product.description}</p>

                    <div className="trust-badges">
                        <div className="trust-item"><Shield size={18} /> 2 Year Warranty</div>
                        <div className="trust-item"><CheckCircle size={18} /> FDA Approved</div>
                    </div>

                    <div className="detail-actions">
                        <button className="btn-primary" onClick={() => addToCart(product)}>
                            <ShoppingCart size={18} /> Add to Cart
                        </button>
                        <button
                            className={`btn-secondary ${isInWishlist(product.id) ? 'active' : ''}`}
                            onClick={() => toggleWishlist(product)}
                        >
                            <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                            {isInWishlist(product.id) ? 'In Wishlist' : 'Wishlist'}
                        </button>
                    </div>

                    <div className="stock-info">
                        In Stock: <strong>{product.stock} units</strong>
                    </div>
                </div>
            </div>

            <div className="reviews-section">
                <h2>Customer <span>Reviews</span></h2>
                {reviewLoading ? (
                    <div className="loading">Loading reviews...</div>
                ) : reviewError ? (
                    <div className="error">{reviewError}</div>
                ) : (
                    <div className="reviews-list">
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review.id} className="review-card bg-glass">
                                    <div className="review-header">
                                        <strong>{review.full_name}</strong>
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < review.rating ? 'star filled' : 'star'}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p>{review.comment}</p>
                                    <small>{new Date(review.created_at).toLocaleDateString()}</small>
                                </div>
                            ))
                        ) : (
                            <p className="no-reviews">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                )}

                <div className="add-review-form bg-glass">
                    <h3>Write a Review</h3>
                    {user ? (
                        <form onSubmit={handleReviewSubmit}>
                            <div className="form-group">
                                <label>Rating:</label>
                                <div className="rating-select">
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <span
                                            key={num}
                                            className={num <= newReviewRating ? 'star filled clickable' : 'star clickable'}
                                            onClick={() => setNewReviewRating(num)}
                                        >★</span>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <textarea
                                    placeholder="Share your experience with this instrument..."
                                    value={newReviewComment}
                                    onChange={(e) => setNewReviewComment(e.target.value)}
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn-primary" disabled={reviewLoading}>
                                {reviewLoading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    ) : (
                        <p>Please <Link to="/login">login</Link> to write a review.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
