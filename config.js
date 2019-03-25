'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/mood-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/mood-blog-app';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.EXPIRY = process.env.EXPIRY || '3h';