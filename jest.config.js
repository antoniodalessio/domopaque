module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
        "/node_modules/"
    ],
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.json",
            enableTsDiagnostics: true
        }
    },
    moduleFileExtensions: [
        "ts",
        "js",
        "node"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    transformIgnorePatterns: [
        "<rootDir>/node_modules/(?!@foo)"
    ],
    moduleNameMapper: {
        "@routes": "<rootDir>/src/routes/",
        "@controller": "<rootDir>/src/controller/",
        "@helpers": "<rootDir>/src/helpers/",
        "@interface": "<rootDir>/src/interface/",
        "@model": "<rootDir>/src/model/",
    },
    testMatch: [
        "**/domopaque/src/__tests__/**/*.test.(ts|js)"
    ]
  };