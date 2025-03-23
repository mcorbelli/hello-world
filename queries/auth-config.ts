import prisma from "@/lib/prisma";
import { type AuthConfig } from "@prisma/client";

export const findOneAuthConfig = async (): Promise<AuthConfig> => {
  const authConfig = await prisma.authConfig.findFirst();

  if (!authConfig) {
    throw new Error("AuthConfiguration not found");
  }

  return authConfig;
};
