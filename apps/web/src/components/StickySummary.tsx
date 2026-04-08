import type { CharacterIssue, DerivedCharacter } from "@forge/rules-core";
import { Badge, Card, SectionHeading } from "@forge/ui";

type StickySummaryProps = {
  derived: DerivedCharacter | null;
  issues: CharacterIssue[];
  savedLabel: string;
};

function issueTone(errors: number, warnings: number) {
  if (errors > 0) {
    return "danger" as const;
  }
  if (warnings > 0) {
    return "warning" as const;
  }
  return "success" as const;
}

export function StickySummary({ derived, issues, savedLabel }: StickySummaryProps) {
  const errors = issues.filter((entry) => entry.severity === "error").length;
  const warnings = issues.filter((entry) => entry.severity === "warning").length;

  return (
    <div className="app-sticky-column">
      <Card
        eyebrow="Live Summary"
        title={derived?.className ? `${derived.className} snapshot` : "Draft snapshot"}
        detail={derived ? `${derived.rulesetName} • Level ${derived.level}` : "Pick a ruleset to start deriving stats."}
        tone="highlight"
      >
        <div className="app-summary-grid">
          <div>
            <span className="app-muted">Saved</span>
            <strong>{savedLabel}</strong>
          </div>
          <div>
            <span className="app-muted">Validation</span>
            <Badge tone={issueTone(errors, warnings)}>{`${errors} errors / ${warnings} warnings`}</Badge>
          </div>
          <div>
            <span className="app-muted">HP / AC</span>
            <strong>{derived ? `${derived.hitPoints} / ${derived.armorClass}` : "—"}</strong>
          </div>
          <div>
            <span className="app-muted">Initiative</span>
            <strong>{derived ? `${derived.initiative >= 0 ? "+" : ""}${derived.initiative}` : "—"}</strong>
          </div>
        </div>
      </Card>

      <Card title="Print-grade sheet preview" detail="Derived outputs that will publish to PDF and DM sessions.">
        {derived ? (
          <div className="app-sheet-preview">
            <SectionHeading title="Core combat" />
            <div className="app-chip-grid">
              <Badge tone="accent">{`Passive Perception ${derived.passivePerception}`}</Badge>
              <Badge>{`Speed ${derived.speed} ft`}</Badge>
              <Badge>{`Carrying ${derived.carryingCapacity}`}</Badge>
              <Badge>{`Languages ${derived.languageProficiencies}`}</Badge>
            </div>

            <SectionHeading title="Attacks" />
            <div className="app-mini-list">
              {derived.attacks.length ? derived.attacks.map((attack) => (
                <div key={attack.name} className="app-mini-row">
                  <strong>{attack.name}</strong>
                  <span>{`${attack.attackBonus >= 0 ? "+" : ""}${attack.attackBonus} • ${attack.damage}`}</span>
                </div>
              )) : <p className="app-muted">No equipped attacks yet.</p>}
            </div>

            <SectionHeading title="Features" />
            <div className="app-chip-grid">
              {derived.classFeatures.slice(0, 8).map((feature) => (
                <Badge key={`${feature.level}-${feature.name}`}>{`L${feature.level} ${feature.name}`}</Badge>
              ))}
            </div>
          </div>
        ) : (
          <p className="app-muted">Derived summary will populate as soon as the draft is valid enough to compute.</p>
        )}
      </Card>
    </div>
  );
}
