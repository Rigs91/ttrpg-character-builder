import {
  ABILITY_NAMES as RAW_ABILITY_NAMES,
  DEFAULT_ABILITY_SCORES as RAW_DEFAULT_ABILITY_SCORES,
  RULESETS as RAW_RULESETS,
  findById as rawFindById,
  findClassById as rawFindClassById,
  findSubclassById as rawFindSubclassById,
  getAbilityLabel as rawGetAbilityLabel,
  getCoverageReport as rawGetCoverageReport,
  getRulesetById as rawGetRulesetById
} from "./data/rulesets.js";
import type { AbilityKey, AbilityScores } from "./contracts.js";

export interface AbilityDescriptor {
  key: AbilityKey;
  short: string;
  label: string;
  description: string;
}

export interface CatalogEntry {
  id: string;
  slug: string;
  name: string;
}

export interface AbilityMethod {
  id: string;
  name: string;
  description: string;
  budget?: number;
  min?: number;
  max?: number;
  array?: number[];
  costTable?: Record<number, number>;
}

export interface SkillEntry extends CatalogEntry {
  ability: AbilityKey;
}

export interface SpeciesEntry extends CatalogEntry {
  speed: number;
  size: string;
  abilityBonuses: Partial<Record<AbilityKey, number>>;
  traits: string[];
}

export interface BackgroundEntry extends CatalogEntry {
  skillProficiencies: string[];
  toolProficiencies: string[];
  languageProficiencies: number;
  traits: string[];
  defaultAbilityBonuses?: Partial<Record<AbilityKey, number>>;
  originFeat?: string;
}

export interface SubclassEntry extends CatalogEntry {}

export interface ClassFeature {
  level: number;
  name: string;
  description: string;
}

export interface SpellcastingProfile {
  ability: AbilityKey;
  cantripsAtLevel1: number;
  spellsKnownAtLevel1: number;
  preparedBy?: string;
  slotStyle?: string;
}

export interface ClassEntry extends CatalogEntry {
  hitDie: number;
  primaryAbilities: AbilityKey[];
  savingThrowProficiencies: string[];
  skillChoices: number;
  skillOptions?: string[];
  spellcasting: SpellcastingProfile | null;
  subclasses: SubclassEntry[];
  featuresByLevel: ClassFeature[];
  startingEquipment: string[];
  baseAttackProgression?: "good" | "average" | "poor";
}

export interface FeatEntry extends CatalogEntry {
  description: string;
}

export interface ItemEntry extends CatalogEntry {
  category: string;
  cost: string;
  weight?: number;
  properties: string;
}

export interface SpellEntry extends CatalogEntry {
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  classes: string[];
  description: string;
}

export interface RulesetRecord {
  id: string;
  name: string;
  shortName: string;
  editionYear: number;
  family: "5e" | "3.5e";
  licenseNotice: string;
  beginnerTips: string[];
  levelBounds: { min: number; max: number };
  abilityMethods: AbilityMethod[];
  alignments: string[];
  skills: SkillEntry[];
  species: SpeciesEntry[];
  backgrounds: BackgroundEntry[];
  classes: ClassEntry[];
  feats: FeatEntry[];
  items: ItemEntry[];
  spells: SpellEntry[];
}

export interface CoverageReport {
  rulesetId: string;
  counts: Record<string, number>;
  targets: Record<string, number>;
  percentages: Record<string, number>;
  classesWithFeatures: Array<{ className: string; maxFeatureLevel: number }>;
}

export const ABILITY_NAMES = RAW_ABILITY_NAMES as unknown as AbilityDescriptor[];
export const DEFAULT_ABILITY_SCORES = RAW_DEFAULT_ABILITY_SCORES as AbilityScores;
export const RULESETS = RAW_RULESETS as unknown as RulesetRecord[];

export function getCoverageReport(rulesetId: string): CoverageReport {
  return rawGetCoverageReport(rulesetId) as CoverageReport;
}

export function getRulesetById(rulesetId: string): RulesetRecord {
  return rawGetRulesetById(rulesetId) as RulesetRecord;
}

export function findById<T extends { id: string }>(collection: T[] | undefined, id: string | undefined): T | null {
  return rawFindById(collection, id) as T | null;
}

export function findClassById(ruleset: RulesetRecord | null | undefined, classId: string | undefined): ClassEntry | null {
  return rawFindClassById(ruleset, classId) as ClassEntry | null;
}

export function findSubclassById(characterClass: ClassEntry | null | undefined, subclassId: string | undefined): SubclassEntry | null {
  return rawFindSubclassById(characterClass, subclassId) as SubclassEntry | null;
}

export function getAbilityLabel(abilityKey: AbilityKey): string {
  return rawGetAbilityLabel(abilityKey);
}
