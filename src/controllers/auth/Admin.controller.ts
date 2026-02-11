import {
  createAdminServices,
  deleteAdmin,
  getAdminServices,
  updateAdmin,
} from "@/useCase/Admin.services";
import { Request, Response } from "express";
import { adminRegisterSchema } from "@/data/request-schemas";

export const createAdmincontroller = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { error } = adminRegisterSchema.validate(req.body);

    if (error) {
      res.status(400).json({
        msg: error.details[0].message,
      });
      return;
    }

    const admin = await createAdminServices(req.body);

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error: any) {
    console.log("ERROR:", error);

    if (error.status) {
      res.status(error.status).json({
        msg: error.message,
      });
      return;
    }

    res.status(500).json({
      msg: "Internal server error",
    });
  }
};
export const getAdmincontroller = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const Admin = await getAdminServices();

    if (!Admin) {
      res.status(404).json({ msg: "Admin not found" });
      return;
    }

    res.status(200).json({
      msg: "Admin fetched successfully",
      Admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const updateAdminController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ msg: "Invalid ID" });
      return;
    }

    const updatedAdmin = await updateAdmin(id, req.body);

    res.status(200).json({
      msg: "User updated successfully",
      updatedAdmin,
    });
  } catch (error: any) {
    // ⭐ Prisma record not found
    if (error.code === "P2025") {
      res.status(404).json({
        msg: "Admin not found",
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const deleteAdminController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      res.status(400).json({ msg: "Invalid ID" });
      return;
    }

    await deleteAdmin(id);

    res.status(200).json({
      msg: "Admin deleted successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({
        msg: "Admin not found",
      });
      return;
    }

    res.status(500).json({
      msg: "Internal server error",
    });
  }
};
