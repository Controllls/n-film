import { MobileShell } from "@/components/layout/MobileShell";
import { ApplyForm } from "@/features/applications/components/ApplyForm";

type Props = { params: Promise<{ id: string }> };

export default async function ApplyPage({ params }: Props) {
  const { id } = await params;
  return (
    <MobileShell back={{ href: "/jobs", label: "공고" }} title="신청">
      <ApplyForm jobId={id} />
    </MobileShell>
  );
}
