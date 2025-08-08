const Permission = require("../models/permission.model");

const registerPermission = async (req, res) => {
    try {
        const { name, code, description } = req.body;
        if (!name || !code) {
            return res.status(400).json({
                message: 'Name and code are required',
                status: "fail"
            });
        }  
        // remove spaces
        const trimmedCode = code.trim();

        const isExist = await Permission.findOne({ code: trimmedCode });
        if (isExist) {
            return res.status(409).json({
                message: 'Permission with this code already exists',
                status: "fail"
            });
        }
        const newPermission = await Permission.create({
            name: name,
            code: trimmedCode,
            description: description || ''
        });

        res.status(201).json({
            message: 'Permission registered successfully',
            permission: newPermission,
            status: 'success'
        });
    } catch (error) {
        console.error('Register permission error:', error);
        res.status(500).json({
            message: 'Server error while creating permission',
            status: 'error'
        });
    }
};
const deletePermission = async (req, res) => {
    const { permissionId } = req.params
    try {
        if (!permissionId) {
            return res.status(400).json({
                message: 'PermissionId is required.',
                status: "fail"
            });
        }
        const isExist = await Permission.findById(permissionId);
        if (!isExist) {
            return res.status(409).json({
                message: 'Permission with this code is not exist ',
                status: "fail"
            });
        }
        await Permission.findByIdAndDelete(permissionId)

        res.status(203).json({
            message: 'Permission Deleted successfully',
            status: 'success'
        });
    } catch (error) {
        console.error('Register permission error:', error);
        res.status(500).json({
            message: 'Server error while creating permission',
            status: 'error'
        });
    }
};

module.exports = {
    registerPermission,
    deletePermission
};
