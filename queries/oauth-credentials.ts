import prisma from "@/lib/prisma";
import { type OAuthCredentials, type OAuthProvider } from "@prisma/client";

export type OAuthCredentialsWithProvider = OAuthCredentials & {
  oAuthProvider: OAuthProvider;
};

export const findEnabledOAuthCredentials = async (): Promise<
  OAuthCredentialsWithProvider[]
> => {
  return await prisma.oAuthCredentials.findMany({
    where: {
      enabled: true,
      oAuthProvider: {
        enabled: true,
      },
    },
    include: {
      oAuthProvider: true,
    },
  });
};
