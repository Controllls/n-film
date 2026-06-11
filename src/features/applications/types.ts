export type Application = {
  id: string;
  jobId: string;
  applicantId: string;
  applicantNickname: string;
  data: Record<string, string>;
  createdAt: string;
};

export type ApplicationInput = Omit<Application, "id" | "createdAt">;
