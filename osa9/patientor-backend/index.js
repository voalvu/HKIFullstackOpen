"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/ping', function (_req, res) {
    res.send("pong");
});
var PORT = 3003;
app.listen(PORT, function () {
    console.log("server running ".concat(PORT));
});
