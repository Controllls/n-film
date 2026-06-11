import Link from "next/link";
import { Button } from "@/components/ui";
import { MobileShell } from "@/components/layout/MobileShell";
import { JobsFeed } from "@/features/jobs/components/JobsFeed";

export default function JobsPage() {
  return (
    <MobileShell
      action={
        <Link href="/jobs/new">
          <Button size="md">+ 공고</Button>
        </Link>
      }
    >
      <JobsFeed />
    </MobileShell>
  );
}
