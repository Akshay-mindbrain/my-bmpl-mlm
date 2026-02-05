import bcrypt from "bcryptjs";
import AppError from "../errors/AppError";
import * as userRepository from "../data/repositories/Users.Repository";
import * as userhelperRepository from "../data/repositories/UserHelper.Repository";

export const createUser = async (data: any) => {
  let createdUser = null;

  const existingEmail = await userRepository.getUserByEmail(data.email);
  if (existingEmail) {
    throw AppError.conflict("Email already exists.");
  }

  const existingMobile = await userRepository.getUserByMobile(data.mobile);
  if (existingMobile) {
    throw AppError.conflict("Mobile number already exists.");
  }

  const totalUsers = await userRepository.countUsers();
  const hashedPassword = await bcrypt.hash(data.password, 10);

  if (totalUsers === 0) {
    if (data.legPosition !== null && data.legPosition !== undefined) {
      throw AppError.badRequest("Root user cannot have a leg position.");
    }

    createdUser = await userRepository.createUser({
      ...data,
      password: hashedPassword,
      createdBy: "SYSTEM",
      lineagePath: "",
    });

    await userRepository.createRootLineage(createdUser.id);
  }

  if (totalUsers > 0) {
    if (!data.sponsorId) {
      throw AppError.badRequest("sponsorId is required.");
    }

    if (!data.legPosition) {
      throw AppError.badRequest("legPosition is required.");
    }

    const sponsorUser = await userRepository.getUserById(data.sponsorId);
    if (!sponsorUser) {
      throw AppError.notFound("Sponsor user not found.");
    }

    const placementParentId = await userRepository.findPlacementParent(
      sponsorUser.id,
      data.legPosition,
    );

    if (!placementParentId) {
      throw AppError.badRequest("Unable to find placement parent.");
    }

    createdUser = await userRepository.createUser({
      ...data,
      password: hashedPassword,
      sponsorId: sponsorUser.id,
      parentId: placementParentId,
      lineagePath: "",
    });
    await userRepository.incrementDirectCount(sponsorUser.id);

    await userRepository.createChildLineage({
      userId: createdUser.id,
      parentId: placementParentId,
    });

    await userRepository.updateParentChildPointer({
      parentId: placementParentId,
      childId: createdUser.id,
      legPosition: data.legPosition,
    });
    //await userhelperRepository.updateAncestorLastNodes(placementParentId,data.legPosition);
  }

  return createdUser;
};

export const getAllUsers = async () => {
  return userRepository.getUsers();
};

export const getUserById = async (id: number) => {
  const user = await userRepository.getUserById(id);

  if (!user) {
    throw AppError.notFound("User not found.");
  }

  return user;
};

export const updateUser = async (id: number, data: any) => {
  const isExist = await getUserById(id);

  if (!isExist) {
    throw AppError.notFound(`User with given ${id} doesnot exist`);
  }

  if (data === data.password) {
    throw AppError.notAcceptable("password cannot be updated");
  }

  return userRepository.updateUser(id, {
    ...data,
    updatedBy: isExist.id,
  });
};

export const deleteUser = async (id: number) => {
  const isExist = await getUserById(id);

  if (!isExist) {
    throw AppError.notFound(`User with given ${id} doesnot exist`);
  }

  return userRepository.deleteUser(id);
};

//Helper Services
export const getAllDownlineByUserId = async (userId: number) => {
  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw AppError.notFound(`User with given ${userId} does not exist`);
  }

  if (!user.lineagePath) {
    return [];
  }

  return userhelperRepository.getAllDownline(user.lineagePath);
};

export const getAllUpLineByUserId = async (userId: number) => {
  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw AppError.notFound(`User with given ${userId} does not exist`);
  }

  if (!user.lineagePath) {
    return [];
  }

  return userhelperRepository.getAllUpLine(user.lineagePath);
};

export const updateLastNodeByLeg = async (
  userId: number,
  legPosition: "LEFT" | "RIGHT",
) => {
  const immediateChild = await userhelperRepository.getImmediateChild(
    userId,
    legPosition,
  );

  if (!immediateChild) return null;

  const nodes = await userhelperRepository.getLastNode(immediateChild.lineagePath);

  if (!nodes.length) return null;

  let lastNode = nodes[0];

  for (const node of nodes) {
    const nodeDepth = node.lineagePath.split(",").length;
    const lastDepth = lastNode.lineagePath.split(",").length;

    if (nodeDepth > lastDepth) {
      lastNode = node;
    }
  }

  const updatenode = await userRepository.updateUser()

  return lastNode;
};

