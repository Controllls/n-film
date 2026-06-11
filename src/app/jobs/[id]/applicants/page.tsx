import { MobileShell } from "@/components/layout/MobileShell";
import { ApplicantsList } from "@/features/applications/components/ApplicantsList";

type Props = { params: Promise<{ id: string }> };

export default async function ApplicantsPage({ params }: Props) {
  const { id } = await params;
  return (
    <MobileShell back={{ href: "/jobs", label: "공고" }} title="신청자 명단">
      <ApplicantsList jobId={id} />
    </MobileShell>
  );
}
