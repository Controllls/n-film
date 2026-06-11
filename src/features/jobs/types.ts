export type Role =
  | "directing"
  | "camera"
  | "lighting"
  | "grip"
  | "art"
  | "sound"
  | "makeup"
  | "costume"
  | "production"
  | "data"
  | "script"
  | "etc";

export type GenderPref = "any" | "male" | "female";

export type ApplyField =
  | "name"
  | "age"
  | "gender"
  | "contact"
  | "career"
  | "address"
  | "physical"
  | "license"
  | "note";

export type JobStatus = "open" | "closed";

export type Job = {
  id: string;
  role: Role;
  shootDate: string;
  headcount: number;
  genderPref: GenderPref;
  pay: string;
  transport: string | null;
  callTime: string;
  location: string;
  endTime: string | null;
  notes: string | null;
  applyFields: ApplyField[];
  status: JobStatus;
  authorName: string;
  createdAt: string;
};

export type JobInput = Omit<Job, "id" | "status" | "createdAt">;
