const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
