import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { inngest } from "../inngest/client.js";

export const signup = async (req, res) => {
  
  const { email, password, role = "user", skills = "" } = req.body;

  try {
    // Validate input
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Email, password, and role are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashcode = await bcrypt.hash(password, 10);

    // Build user data
    const userData = {
      email,
      password: hashcode,
      role,
    };

    // Create user
    const user = await User.create(userData);

    // Fire Inngest event
    await inngest.send({
      name: "user/signup",
      data: { email, role },
    });

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
};

export const login = async (req, res) => {
//  console.log("Incoming request body:", req.body);
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    // ✅ Role check (must match selected role in frontend)
    if (user.role !== role) {
      return res.status(403).json({
        error: `Unauthorized: Account is registered as '${user.role}', not '${role}'`,
      });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Unauthorized User" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Unauthorized User" });
    });

    return res.json({ message: "Logout Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed", details: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { email, skills = [], role } = req.body;

  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    await User.updateOne(
      { email },
      { skills: skills.length ? skills : user.skills, role }
    );
    return res.json({ message: "User Update successfully" });
  } catch (error) {
    res.status(500).json({ error: "update failed", details: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve users", details: error.message });
  }
};
