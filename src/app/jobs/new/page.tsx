import { MobileShell } from "@/components/layout/MobileShell";
import { JobForm } from "@/features/jobs/components/JobForm";

export default function NewJobPage() {
  return (
    <MobileShell back={{ href: "/jobs", label: "공고" }} title="공고 올리기">
      <JobForm />
    </MobileShell>
  );
}
