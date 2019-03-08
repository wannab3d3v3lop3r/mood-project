module.exports = {
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/mood',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/mood-test'
};
