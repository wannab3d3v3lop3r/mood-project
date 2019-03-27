'use strict';

module.exports = {
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost/mood',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://localhost/mood-test',
    PROD_DATABASE_URL: process.env.PROD_DATABASE_URL,
    PORT: process.env.PORT || 8080,
    JWT_SECRET: process.env.JWT_SECRET || 'eruruu',
    JWT_EXPIRY: process.env.EXPIRY || '7d',

}