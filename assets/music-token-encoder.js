"use strict";
var fs = require("fs");
var jwt = require("jsonwebtoken");
var privateKey = fs.readFileSync("AuthKey_4T5A5CRMMT.p8").toString();
var teamId = "C47UUJ4SQN";
var keyId = "4T5A5CRMMT";
var jwtToken = jwt.sign({}, privateKey, {
    algorithm: "ES256",
    expiresIn: "180d",
    issuer: teamId,
    header: {
        alg: "ES256",
        kid: keyId
    }
});
console.log(jwtToken);
