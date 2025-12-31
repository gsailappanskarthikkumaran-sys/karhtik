import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    aadharNumber: { type: String },
    panNumber: { type: String },
    photo: {
        type: String, // Path to stored image
    },
    aadharCard: { type: String }, // Path to Aadhar image
    panCard: { type: String },    // Path to PAN image
    // Deprecated generic idProof, keeping for backward config if needed or can remove
    idProof: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
