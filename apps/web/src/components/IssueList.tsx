import type { CharacterIssue } from "@forge/rules-core";
import { Badge, Card } from "@forge/ui";

type IssueListProps = {
  issues: CharacterIssue[];
  title?: string;
  emptyLabel?: string;
};

function toneForIssue(severity: CharacterIssue["severity"]) {
  if (severity === "error") {
    return "danger" as const;
  }
  if (severity === "warning") {
    return "warning" as const;
  }
  return "accent" as const;
}

export function IssueList({ issues, title = "Validation", emptyLabel = "No issues in this section." }: IssueListProps) {
  return (
    <Card
      title={title}
      detail={issues.length ? `${issues.length} active signal${issues.length === 1 ? "" : "s"}` : emptyLabel}
      tone={issues.length ? "subtle" : "highlight"}
    >
      <div className="app-issue-list">
        {issues.length ? (
          issues.map((issue) => (
            <div key={`${issue.code}-${issue.field}`} className={`app-issue app-issue--${issue.severity}`}>
              <div className="app-issue__header">
                <strong>{issue.code}</strong>
                <Badge tone={toneForIssue(issue.severity)}>{issue.severity}</Badge>
              </div>
              <p>{issue.message}</p>
            </div>
          ))
        ) : (
          <p className="app-muted">{emptyLabel}</p>
        )}
      </div>
    </Card>
  );
}
