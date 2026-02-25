import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';
import axios from 'axios';
import './Careers.css';

const Careers = () => {
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/vacancies');
                setVacancies(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVacancies();
    }, []);

    return (
        <div className="careers-page container">
            <div className="section-header">
                <h1>Join Our <span>Team</span></h1>
                <p>Build the future of surgical precision with AR Surgical Hub.</p>
            </div>

            <div className="vacancies-list">
                {loading ? (
                    <div className="loading">Checking open positions...</div>
                ) : vacancies.length > 0 ? (
                    vacancies.map(job => (
                        <div key={job.id} className="job-card bg-glass">
                            <div className="job-header">
                                <h3>{job.position}</h3>
                                <span className="job-type">Full-Time</span>
                            </div>
                            <div className="job-meta">
                                <span><MapPin size={16} /> {job.location}</span>
                                <span><DollarSign size={16} /> {job.salary_range}</span>
                                <span><Clock size={16} /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
                            </div>
                            <button className="btn-secondary">Apply Now</button>
                        </div>
                    ))
                ) : (
                    <div className="no-vacancies bg-glass">
                        <Briefcase size={48} className="empty-icon" />
                        <h3>No Active Openings</h3>
                        <p>We are not currently hiring, but stay tuned for future opportunities!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Careers;
