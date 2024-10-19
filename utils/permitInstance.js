require('dotenv').config({ path: ".env" });
const { Permit } = require("permitio");

const permit = new Permit({
    token: process.env.PERMIT_TOKEN,
    pdp: "http://localhost:7766",
    debug: true,  // Enable debug mode
    log: {
        level: "debug"
    }
});

module.exports = permit;