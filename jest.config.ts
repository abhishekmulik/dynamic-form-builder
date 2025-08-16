module.exports = {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(t|j)sx?$": "babel-jest",   // use babel-jest for TS/JS
    },
    transformIgnorePatterns: [
        "node_modules/(?!(@chakra-ui|@emotion|framer-motion)/)"
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
