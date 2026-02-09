import express from "express";
import * as kycController from "../../../controllers/Kyc.Controller";

const kycrouter = express.Router();

kycrouter.post("/", kycController.createKycController);

kycrouter.get("/", kycController.getAllKycController);

kycrouter.get("/:id", kycController.getKycByIdController);

kycrouter.get("/user/:userId", kycController.getKycByUserIdController);

kycrouter.put("/:id", kycController.updateKycController);

kycrouter.delete("/:id", kycController.deleteKycController);

export default kycrouter;
