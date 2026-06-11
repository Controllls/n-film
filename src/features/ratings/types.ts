export type Rating = {
  id: string;
  raterId: string;
  raterNickname: string;
  rateeId: string;
  rateeNickname: string;
  jobId: string;
  stars: number;
  review: string | null;
  createdAt: string;
};

export type RatingInput = Omit<Rating, "id" | "createdAt">;

export type RatingSummary = {
  average: number;
  count: number;
};

export type CanRateResult =
  | { ok: true }
  | { ok: false; reason: string };
