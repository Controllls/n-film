import { z } from "zod";

const ClientEnvSchema = z.object({
  NEXT_PUBLIC_USE_STUBS: z
    .string()
    .optional()
    .transform((v) => v !== "false"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional().default(""),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().default(""),
  NEXT_PUBLIC_KAKAO_REST_KEY: z.string().optional().default(""),
  NEXT_PUBLIC_KAKAO_REDIRECT_URI: z
    .string()
    .optional()
    .default("http://localhost:3000/api/auth/kakao/callback"),
});

const ServerEnvSchema = ClientEnvSchema.extend({
  KAKAO_CLIENT_SECRET: z.string().optional().default(""),
});

const rawClient = {
  NEXT_PUBLIC_USE_STUBS: process.env.NEXT_PUBLIC_USE_STUBS,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_KAKAO_REST_KEY: process.env.NEXT_PUBLIC_KAKAO_REST_KEY,
  NEXT_PUBLIC_KAKAO_REDIRECT_URI: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
};

const parsedClient = ClientEnvSchema.safeParse(rawClient);
if (!parsedClient.success) {
  throw new Error(
    `환경변수 검증 실패 (클라이언트): ${parsedClient.error.issues
      .map((i) => `${i.path.join(".")} ${i.message}`)
      .join(", ")}`,
  );
}

export const env = parsedClient.data;

export function getServerEnv() {
  const parsedServer = ServerEnvSchema.safeParse({
    ...rawClient,
    KAKAO_CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET,
  });
  if (!parsedServer.success) {
    throw new Error(
      `환경변수 검증 실패 (서버): ${parsedServer.error.issues
        .map((i) => `${i.path.join(".")} ${i.message}`)
        .join(", ")}`,
    );
  }
  return parsedServer.data;
}

export const USE_STUBS = env.NEXT_PUBLIC_USE_STUBS;
