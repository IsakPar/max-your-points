"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Admin health check
router.get('/health', (req, res) => {
    res.json({ message: 'Admin routes available' });
});
// Admin media route (redirect to main media API)
router.get('/media', (req, res) => {
    // Forward to the main media API
    res.redirect('/api/media');
});
exports.default = router;
//# sourceMappingURL=admin.js.map