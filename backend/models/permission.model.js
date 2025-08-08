const mongoose = require('mongoose');
// permission schema creation
const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  codeName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;
