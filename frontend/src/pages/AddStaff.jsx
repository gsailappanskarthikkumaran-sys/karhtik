import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { Save, X, User, Lock, Briefcase, MapPin, CreditCard, Phone } from 'lucide-react';
import './Staff.css';
import './AddStaff.css';

const AddStaff = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        phoneNumber: '',
        idProofNumber: '',
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchStaffData();
        }
    }, [id]);

    const fetchStaffData = async () => {
        try {
            const { data } = await api.get('/staff');
            const member = data.find(s => s._id === id);
            if (member) {
                setFormData({
                    fullName: member.fullName,
                    address: member.address || '',
                    phoneNumber: member.phoneNumber || '',
                    idProofNumber: member.idProofNumber || '',
                    username: member.username,
                    password: '',
                });
            } else {
                alert('Staff not found');
                navigate('/staff');
            }
        } catch (error) {
            console.error(error);
            navigate('/staff');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            fullName: formData.fullName,
            address: formData.address,
            phoneNumber: formData.phoneNumber,
            idProofNumber: formData.idProofNumber,
            username: formData.username
        };

        if (formData.password) {
            payload.password = formData.password;
        }

        try {
            if (isEditMode) {
                await api.put(`/staff/${id}`, payload);
                alert('Staff Updated Successfully!');
            } else {
                await api.post('/staff', payload);
                alert('Staff Added Successfully!');
            }
            navigate('/staff');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save staff');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="page-header">
                <div className="page-title">
                    <h1>{isEditMode ? 'Edit Staff Member' : 'Add Staff Member'}</h1>
                    <p>{isEditMode ? 'Update staff details' : 'Onboard a new staff member'}</p>
                </div>
            </div>

            <div className="staff-card add-staff-form">
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label className="form-label"><Briefcase size={16} style={{ display: 'inline', marginRight: '6px' }} /> Full Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                            placeholder="e.g. Jane Doe"
                        />
                    </div>

                    {/* 2. Address */}
                    <div className="form-group">
                        <label className="form-label"><MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} /> Address</label>
                        <textarea
                            className="input-field"
                            rows="2"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Full residential address"
                        ></textarea>
                    </div>

                    {/* 3. Phone Number */}
                    <div className="form-group">
                        <label className="form-label"><Phone size={16} style={{ display: 'inline', marginRight: '6px' }} /> Phone Number</label>
                        <input
                            type="tel"
                            className="input-field"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            placeholder="e.g. 9876543210"
                        />
                    </div>

                    {/* 4. ID Proof Number */}
                    <div className="form-group">
                        <label className="form-label"><CreditCard size={16} style={{ display: 'inline', marginRight: '6px' }} /> ID Proof Number</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.idProofNumber}
                            onChange={(e) => setFormData({ ...formData, idProofNumber: e.target.value })}
                            placeholder="e.g. staff id number"
                        />
                    </div>

                    {/* 5. Staff ID (Username) */}
                    <div className="form-group">
                        <label className="form-label"><User size={16} style={{ display: 'inline', marginRight: '6px' }} /> Set Staff ID (Login Username)</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            placeholder="e.g. STF001"
                        />
                    </div>

                    {/* 6. Staff Password */}
                    <div className="form-group">
                        <label className="form-label"><Lock size={16} style={{ display: 'inline', marginRight: '6px' }} /> Set Staff Password {isEditMode && '(Leave blank to keep current)'}</label>
                        <input
                            type="password"
                            className="input-field"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required={!isEditMode}
                            placeholder={isEditMode ? "Enter new password to change" : "Set initial password"}
                            minLength="6"
                        />
                    </div>

                    <div className="form-actions border-t pt-4 mt-6 flex justify-end gap-3">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/staff')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : (isEditMode ? 'Update Staff Member' : 'Add Staff Member')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaff;
