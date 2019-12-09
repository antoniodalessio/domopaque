"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register');
require('dotenv').config();
const config_1 = require("./config");
const app_1 = require("./app");
new app_1.default(config_1.config);
//# sourceMappingURL=index.js.map