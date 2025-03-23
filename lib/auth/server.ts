import prisma from "@/lib/prisma";
import { findOneAuthConfig } from "@/queries/auth-config";
import { findEnabledOAuthCredentials } from "@/queries/oauth-credentials";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, multiSession, twoFactor } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";

type OAuthCredential = {
  clientId: string;
  clientSecret: string;
};

type OAuthCredentialsMap = Record<string, OAuthCredential>;

const getSocialProviders = async (): Promise<OAuthCredentialsMap> => {
  const oAuthCredentials = await findEnabledOAuthCredentials();

  return oAuthCredentials.reduce<OAuthCredentialsMap>((acc, credential) => {
    acc[credential.oAuthProvider.type.toLowerCase()] = {
      clientId: credential.clientId,
      clientSecret: credential.clientSecret,
    };
    return acc;
  }, {});
};

const setupAuthServer = async () => {
  const oAuthProviders = await getSocialProviders();
  const authConfig = await findOneAuthConfig();

  return betterAuth({
    appName: process.env.NEXT_PUBLIC_SITE_NAME,
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    session: {
      expiresIn: authConfig.sessionExpiresIn || undefined,
      updateAge: authConfig.sessionUpdateAge || undefined,
      freshAge: authConfig.sessionFreshAge || undefined,
    },
    plugins: [nextCookies(), twoFactor(), passkey(), admin(), multiSession()],
    emailVerification: {
      sendOnSignUp: authConfig.sendEmailVerificationOnSignUp,
      autoSignInAfterVerification: authConfig.autoSignInAfterVerification,
      sendVerificationEmail: async (data) => {
        try {
          // const template = EmailTemplates.EMAIL_VERIFICATION;
        } catch (error) {
          console.error("Error sending email:", error);
          throw new Error("Failed to send email. Please try again later.");
        }
      },
    },
    user: {
      changeEmail: {
        enabled: authConfig.changeUserEmailEnabled,
        sendChangeEmailVerification: async (data) => {
          try {
            // const template = EmailTemplates.CHANGE_EMAIL;
          } catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send email. Please try again later.");
          }
        },
      },
      deleteUser: {
        enabled: authConfig.deleteUserEnabled,
        sendDeleteAccountVerification: async (data) => {
          try {
            // const template = EmailTemplates.DELETE_USER;
          } catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send email. Please try again later.");
          }
        },
      },
    },
    account: {
      accountLinking: {
        enabled: authConfig.accountLinkingEnabled,
        allowDifferentEmails: authConfig.allowDifferentLinkedEmails,
        trustedProviders: Object.keys(oAuthProviders),
      },
    },
    emailAndPassword: {
      enabled: authConfig.emailPasswordEnabled,
      requireEmailVerification: authConfig.requireEmailVerification,
      disableSignUp: authConfig.emailAndPasswordSignUpDisabled,
      sendResetPassword: async (data) => {
        try {
          // const template = EmailTemplates.DELETE_USER;
        } catch (error) {
          console.error("Error sending email:", error);
          throw new Error("Failed to send email. Please try again later.");
        }
      },
    },
    socialProviders: oAuthProviders,
    advanced: {
      generateId: false,
    },
  });
};

export const auth = await setupAuthServer();
