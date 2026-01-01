import User from '../models/User.js';

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private/Admin
const getAllStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: 'staff' }).select('-password');
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Add new staff
// @route   POST /api/staff
// @access  Private/Admin
const addStaff = async (req, res) => {
    const { fullName, address, phoneNumber, idProofNumber, branch, email } = req.body;

    try {
        // Auto-generate credentials
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const username = `STF${randomSuffix}`;
        const password = Math.random().toString(36).slice(-8); // 8 char random string

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = await User.create({
            username,
            password,
            fullName,
            address,
            phoneNumber,
            idProofNumber,
            branch,
            email,
            role: 'staff'
        });

        if (user) {
            // Return credentials to Admin
            res.status(201).json({
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                role: user.role,
                branch: user.branch,
                generatedPassword: password // Only returned once
            });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid user data', error: error.message });
    }
};

// @desc    Update staff
// @route   PUT /api/staff/:id
// @access  Private/Admin
const updateStaff = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.fullName = req.body.fullName || user.fullName;
        user.address = req.body.address || user.address;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.idProofNumber = req.body.idProofNumber || user.idProofNumber;
        user.branch = req.body.branch || user.branch;
        user.email = req.body.email || user.email;

        // Allow Admin to manually change username/password if needed
        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            fullName: updatedUser.fullName,
            role: updatedUser.role
        });

    } catch (error) {
        res.status(400).json({ message: 'Error updating staff', error: error.message });
    }
};

// @desc    Delete staff
// @route   DELETE /api/staff/:id
// @access  Private/Admin
const deleteStaff = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin' });

        await user.deleteOne();
        res.json({ message: 'Staff removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getAllStaff, addStaff, updateStaff, deleteStaff };
