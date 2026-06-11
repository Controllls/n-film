import { MobileShell } from "@/components/layout/MobileShell";
import { JobDetail } from "@/features/jobs/components/JobDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <MobileShell back={{ href: "/jobs", label: "전체 공고" }}>
      <JobDetail id={id} />
    </MobileShell>
  );
}
