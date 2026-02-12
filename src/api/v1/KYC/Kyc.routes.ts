import express from "express";
import {
  createKycController,
  deleteKycController,
  getAllKycController,
  getKycByIdController,
  getKycByUserIdController,
  updateKycController,
} from "@/controllers/auth/Kyc.Controller";
import { verifyAdmin } from "@/middleware/verifyToken";

const kycrouter = express.Router();

kycrouter.post("/create", verifyAdmin, createKycController);

kycrouter.get("/get", getAllKycController);

kycrouter.get("/get/:id", getKycByIdController);

kycrouter.get("/user/:userId", getKycByUserIdController);

kycrouter.put("/update/:id", verifyAdmin, updateKycController);

kycrouter.delete("/delete/:id", deleteKycController);

export default kycrouter;
