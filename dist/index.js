"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = require("./config");
const routes_1 = require("./routes/routes");
const app = (0, express_1.default)();
//middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
//database connection
if (!config_1.config.MONGODB_URI) {
    console.error("MONGODB_URI is not defined in config.");
    process.exit(1);
}
mongoose_1.default.connect(config_1.config.MONGODB_URI)
    .then(() => console.log("Connected to database"))
    .catch((error) => {
    console.log("Failed to connect to db", error);
    process.exit(1);
});
//routes
app.use("/api", routes_1.router);
app.listen(config_1.config.PORT, () => {
    console.log(`Server running on port ${config_1.config.PORT}`);
});
