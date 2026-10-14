const dns = require('dns');
const mongoose = require('mongoose');

// Some networks block SRV lookups; use public DNS servers for MongoDB Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);

module.exports = () => mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillbridge');