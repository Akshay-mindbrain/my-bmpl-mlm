import bcrypt from "bcryptjs";
import * as userRepository from "../data/repositories/UserRepository";
import AppError from "../errors/AppError";

export const createUser = async (data: any, adminId: number, adminUsername: string) => {
    // Check for existing username
    const existingUsername = await userRepository.getUserByUsername(data.username);
    if (existingUsername) {
        throw AppError.conflict("Username already exists.");
    }

    // Check for existing email
    const existingEmail = await userRepository.getUserByEmail(data.email);
    if (existingEmail) {
        throw AppError.conflict("Email already exists.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await userRepository.createUser({
        ...data,
        password: hashedPassword,
        createdBy: adminUsername,
        admin: { connect: { id: adminId } }
    }, adminId);
};

export const getUsers = async (adminId: number) => {
    return await userRepository.listUsersByAdmin(adminId);
};

export const getUser = async (id: number, adminId: number) => {
    const user = await userRepository.getUserById(id);
    if (!user || user.adminId !== adminId) {
        throw AppError.notFound("User not found or you don't have access.");
    }
    return user;
};

export const updateUser = async (id: number, data: any, adminId: number, adminUsername: string) => {
    await getUser(id, adminId);

    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }

    return await userRepository.updateUser(id, {
        ...data,
        updatedBy: adminUsername
    }, adminId);
};

export const deleteUser = async (id: number, adminId: number) => {
    await getUser(id, adminId);
    return await userRepository.deleteUser(id, adminId);
};
