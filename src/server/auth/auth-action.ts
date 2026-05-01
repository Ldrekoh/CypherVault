"use server";

import { db } from "@/db/drizzle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const currentUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, session.user.id),
    with: {
      keys: true, // Inclure les clés de l'utilisateur
    },
  });

  if (!currentUser) {
    redirect("/signin");
  }

  return {
    ...session,
    currentUser,
  };
};

export const signUpAction = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return {
      success: true,
      message:
        "Sign-up successful! Please check your email to verify your account.",
    };
  } catch (error) {
    const e = error as Error;
    console.error("Sign-up error:", e);
    return {
      success: false,
      message: "Sign-up failed. Please try again.",
    };
  }
};

export const signInAction = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      message: "Sign-in successful!",
    };
  } catch (error) {
    const e = error as Error;
    console.error("Sign-in error:", e);
    return {
      success: false,
      message: "Sign-in failed. Please check your credentials.",
    };
  }
};
