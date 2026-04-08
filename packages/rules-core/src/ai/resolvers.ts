import { RULESETS, type CatalogEntry, type ClassEntry, type RulesetRecord } from "../catalog.js";

function normalizeWhitespace(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function squashValue(value: string) {
  return normalizeWhitespace(value).replace(/\s+/g, "");
}

export function normalizeLookupValue(value: string) {
  return normalizeWhitespace(value);
}

function buildCandidateTokens(entry: Pick<CatalogEntry, "id" | "slug" | "name">) {
  return [entry.id, entry.slug, entry.name]
    .filter(Boolean)
    .map((value) => normalizeWhitespace(value))
    .filter(Boolean);
}

function scoreWordOverlap(queryWords: string[], candidateWords: string[]) {
  let overlap = 0;
  for (const queryWord of queryWords) {
    if (queryWord.length < 3) {
      continue;
    }
    if (candidateWords.some((candidateWord) => candidateWord.length >= 3 && (candidateWord === queryWord || candidateWord.startsWith(queryWord) || queryWord.startsWith(candidateWord)))) {
      overlap += 1;
    }
  }
  return overlap;
}

function scoreCatalogQuery(query: string, entry: Pick<CatalogEntry, "id" | "slug" | "name">) {
  const normalizedQuery = normalizeWhitespace(query);
  if (!normalizedQuery) {
    return 0;
  }
  const compactQuery = squashValue(query);
  const queryWords = normalizedQuery.split(" ");
  let bestScore = 0;

  for (const token of buildCandidateTokens(entry)) {
    const compactToken = token.replace(/\s+/g, "");
    const tokenWords = token.split(" ");

    if (token === normalizedQuery || compactToken === compactQuery) {
      return 120;
    }
    if (token.startsWith(normalizedQuery) || normalizedQuery.startsWith(token)) {
      bestScore = Math.max(bestScore, 100);
      continue;
    }
    if (token.includes(normalizedQuery) || normalizedQuery.includes(token)) {
      bestScore = Math.max(bestScore, 88);
      continue;
    }

    const overlap = scoreWordOverlap(queryWords, tokenWords);
    if (overlap > 0) {
      bestScore = Math.max(bestScore, 60 + overlap * 10);
    }
  }

  return bestScore;
}

export interface CatalogMatchResult<T extends CatalogEntry> {
  entry: T | null;
  suggestions: string[];
}

export function findCatalogEntry<T extends CatalogEntry>(collection: T[], query: string): CatalogMatchResult<T> {
  const scored = collection
    .map((entry) => ({ entry, score: scoreCatalogQuery(query, entry) }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.entry.name.localeCompare(right.entry.name));

  return {
    entry: scored[0]?.score >= 70 ? scored[0].entry : null,
    suggestions: scored.slice(0, 4).map((candidate) => candidate.entry.name)
  };
}

function uniqueIds(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export interface ResolveListResult<T extends CatalogEntry> {
  ids: string[];
  unresolved: Array<{ value: string; suggestions: string[] }>;
  matches: T[];
}

export function resolveCatalogEntries<T extends CatalogEntry>(collection: T[], values: string[]) {
  const ids: string[] = [];
  const matches: T[] = [];
  const unresolved: Array<{ value: string; suggestions: string[] }> = [];

  for (const value of values.map((entry) => entry.trim()).filter(Boolean)) {
    const result = findCatalogEntry(collection, value);
    if (result.entry) {
      ids.push(result.entry.id);
      matches.push(result.entry);
      continue;
    }
    unresolved.push({
      value,
      suggestions: result.suggestions
    });
  }

  return {
    ids: uniqueIds(ids),
    unresolved,
    matches
  } satisfies ResolveListResult<T>;
}

export function resolveRulesetQuery(query: string | undefined, currentRulesetId?: string) {
  if (!query?.trim()) {
    return {
      rulesetId: currentRulesetId ?? RULESETS[0].id,
      suggestions: RULESETS.map((ruleset) => ruleset.shortName)
    };
  }

  const normalized = normalizeWhitespace(query);
  if (["5e", "5th edition", "fifth edition"].includes(normalized)) {
    if (currentRulesetId && currentRulesetId.startsWith("5e-")) {
      return {
        rulesetId: currentRulesetId,
        suggestions: RULESETS.filter((ruleset) => ruleset.id.startsWith("5e-")).map((ruleset) => ruleset.shortName)
      };
    }
    return {
      rulesetId: "5e-2024",
      suggestions: RULESETS.filter((ruleset) => ruleset.id.startsWith("5e-")).map((ruleset) => ruleset.shortName)
    };
  }

  const aliasEntries = RULESETS.map((ruleset) => ({
    id: ruleset.id,
    slug: `${ruleset.family}-${ruleset.editionYear}`,
    name: `${ruleset.shortName} ${ruleset.name}`
  }));
  const match = findCatalogEntry(aliasEntries, query);
  return {
    rulesetId: match.entry?.id ?? null,
    suggestions: match.suggestions.length ? match.suggestions : RULESETS.map((ruleset) => ruleset.shortName)
  };
}

export function resolveAlignment(ruleset: RulesetRecord, query: string) {
  const scored = ruleset.alignments
    .map((alignment) => ({ alignment, score: scoreCatalogQuery(query, { id: alignment, slug: alignment, name: alignment }) }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.alignment.localeCompare(right.alignment));

  return {
    value: scored[0]?.score >= 70 ? scored[0].alignment : null,
    suggestions: scored.slice(0, 4).map((candidate) => candidate.alignment)
  };
}

export function resolveAbilityMethod(ruleset: RulesetRecord, query: string) {
  return findCatalogEntry(
    ruleset.abilityMethods.map((entry) => ({
      id: entry.id,
      slug: entry.id,
      name: entry.name
    })),
    query
  );
}

export function resolveSubclass(characterClass: ClassEntry | null, query: string) {
  if (!characterClass) {
    return {
      entry: null,
      suggestions: [] as string[]
    };
  }
  return findCatalogEntry(characterClass.subclasses, query);
}
