import { User } from "@prisma/client";
import Dataloader from "dataloader";
import { prisma } from "../index";

type BatchUser = (ids: number[]) => Promise<User[]>;

const batchUsers: BatchUser = async (ids) => {
  const users = await prisma.user.findMany({
    where: {
      id: { in: ids },
    },
  });

  const userMap: { [key: string]: User } = {};

  users.forEach((user) => {
    userMap[user.id] = user;
  });

  return ids.map((id) => {
    return userMap[id];
  });
};

//@ts-ignore
export const userLoader = new Dataloader<number, User>(batchUsers);
