import Branch from '../models/Branch.js';

// @desc    Get all branches
// @route   GET /api/branches
// @access  Private/Admin
const getBranches = async (req, res) => {
    try {
        const branches = await Branch.find({});
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add new branch
// @route   POST /api/branches
// @access  Private/Admin
const addBranch = async (req, res) => {
    const { name, address } = req.body;

    try {
        const branchExists = await Branch.findOne({ name });

        if (branchExists) {
            return res.status(400).json({ message: 'Branch already exists' });
        }

        const branch = await Branch.create({
            name,
            address,
        });

        res.status(201).json(branch);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete branch
// @route   DELETE /api/branches/:id
// @access  Private/Admin
const deleteBranch = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);

        if (branch) {
            await branch.deleteOne();
            res.json({ message: 'Branch removed' });
        } else {
            res.status(404).json({ message: 'Branch not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getBranches, addBranch, deleteBranch };
