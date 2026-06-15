"use server";

import { redirect }  from "next/navigation";
import bcrypt        from "bcryptjs";
import { z }         from "zod";
import { auth, signOut } from "#/auth";
import { db }        from "@/lib/db";
import type { Result } from "@/types";

const nameSchema = z.string().min(2, "Name must be at least 2 characters.").max(60).trim();

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8,  "Must be at least 8 characters.")
      .max(72, "Password is too long.")
      .regex(/[A-Z]/, "Must contain an uppercase letter.")
      .regex(/[0-9]/, "Must contain a number.")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character."),
  });

export async function updateNameAction(name: string): Promise<Result> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not authenticated." };

  const parsed = nameSchema.safeParse(name);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await db.user.update({ where: { id: session.user.id }, data: { name: parsed.data } });
  return { ok: true, data: undefined };
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
): Promise<Result> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not authenticated." };

  const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const user = await db.user.findUnique({
    where:  { id: session.user.id },
    select: { passwordHash: true },
  });
  if (!user?.passwordHash) return { ok: false, error: "No password set on this account." };

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return { ok: false, error: "Current password is incorrect." };

  const hash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db.user.update({ where: { id: session.user.id }, data: { passwordHash: hash } });
  return { ok: true, data: undefined };
}

export async function deleteAccountAction(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  await db.user.delete({ where: { id: session.user.id } });
  await signOut({ redirect: false });
  redirect("/");
}
