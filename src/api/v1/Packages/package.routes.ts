import express from "express";
import {
  createPackageController,
  deletePackageController,
  getAllPackagesController,
  getPackageByIdController,
  updatePackageController,
} from "@/controllers/auth/Package.Controller";
import { verifyAdmin } from "@/middleware/verifyToken";

const packagerouter = express.Router();

packagerouter.post("/create", verifyAdmin, createPackageController);

packagerouter.get("/get", verifyAdmin, getAllPackagesController);

packagerouter.get("/get/:id", verifyAdmin, getPackageByIdController);

packagerouter.put("/update/:id", verifyAdmin, updatePackageController);

packagerouter.delete("/delete/:id", verifyAdmin, deletePackageController);

export default packagerouter;
