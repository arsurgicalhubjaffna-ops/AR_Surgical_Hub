import React, { useState } from 'react';
import { Send, FileText, ClipboardList } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Quotes.css';

const Quotes = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        message: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/quotes', {
                ...formData,
                user_id: user ? user.id : null
            });
            alert('Quote request sent successfully!');
            setFormData({ message: '' });
        } catch (err) {
            alert('Failed to send quote request.');
        }
    };

    return (
        <div className="quotes-page container">
            <div className="section-header">
                <h1>Get a <span>Quote</span></h1>
                <p>Expert medical procurement solutions tailored to your institution.</p>
            </div>
            <div className="quotes-grid">
                <div className="quotes-info">
                    <div className="info-card bg-glass">
                        <ClipboardList className="info-icon" />
                        <h3>Bulk Orders</h3>
                        <p>Special pricing available for hospitals and clinics ordering in large quantities.</p>
                    </div>
                    <div className="info-card bg-glass">
                        <FileText className="info-icon" />
                        <h3>Custom Packages</h3>
                        <p>We can engineer specialized surgical kits based on your procedural needs.</p>
                    </div>
                </div>
                <form className="quotes-form bg-glass" onSubmit={handleSubmit}>
                    <h3>Enquiry Details</h3>
                    <div className="input-group">
                        <textarea
                            placeholder="Tell us about your requirements (items, quantities, specific models)..."
                            required
                            rows="8"
                            value={formData.message}
                            onChange={(e) => setFormData({ message: e.target.value })}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn-primary w-full quote-btn">
                        Submit Request <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Quotes;
