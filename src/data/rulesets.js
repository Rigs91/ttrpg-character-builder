import {
  EXTRA_5E_FEATS,
  EXTRA_35_FEATS,
  EXTRA_5E_ITEMS,
  EXTRA_35_ITEMS,
  EXTRA_5E_SPELLS,
  EXTRA_35_SPELLS,
  EXTRA_5E_FEATS_PASS2,
  EXTRA_35_FEATS_PASS2,
  EXTRA_5E_ITEMS_PASS2,
  EXTRA_35_ITEMS_PASS2,
  EXTRA_5E_SPELLS_PASS2,
  EXTRA_35_SPELLS_PASS2,
  EXTRA_5E_FEATS_PASS3,
  EXTRA_35_FEATS_PASS3,
  EXTRA_5E_ITEMS_PASS3,
  EXTRA_35_ITEMS_PASS3,
  EXTRA_5E_SPELLS_PASS3,
  EXTRA_35_SPELLS_PASS3
} from "./expansions.js";

export const ABILITY_NAMES = [
  { key: "str", short: "STR", label: "Strength", description: "Physical power and athletic force." },
  { key: "dex", short: "DEX", label: "Dexterity", description: "Agility, reflexes, and precision." },
  { key: "con", short: "CON", label: "Constitution", description: "Health, endurance, and vitality." },
  { key: "int", short: "INT", label: "Intelligence", description: "Reasoning, memory, and study." },
  { key: "wis", short: "WIS", label: "Wisdom", description: "Awareness, insight, and intuition." },
  { key: "cha", short: "CHA", label: "Charisma", description: "Presence, confidence, and force of personality." }
];

export const DEFAULT_ABILITY_SCORES = Object.freeze({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 });

const ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil"
];

const ABILITY_METHODS_5E = [
  {
    id: "point-buy",
    name: "Point Buy",
    description: "Spend points for balanced and legal starting stats.",
    budget: 27,
    min: 8,
    max: 15,
    costTable: { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
  },
  {
    id: "standard-array",
    name: "Standard Array",
    description: "Apply 15, 14, 13, 12, 10, 8.",
    array: [15, 14, 13, 12, 10, 8]
  },
  { id: "manual", name: "Manual", description: "Type scores manually; validation still applies." }
];

const ABILITY_METHODS_35 = [
  {
    id: "point-buy",
    name: "Point Buy",
    description: "Classic 32-point buy.",
    budget: 32,
    min: 8,
    max: 18,
    costTable: { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 6, 15: 8, 16: 10, 17: 13, 18: 16 }
  },
  {
    id: "standard-array",
    name: "Standard Array",
    description: "Apply 15, 14, 13, 12, 10, 8.",
    array: [15, 14, 13, 12, 10, 8]
  },
  { id: "manual", name: "Manual", description: "Manual assignment for custom table limits." }
];

const SKILLS_5E = [
  { slug: "acrobatics", name: "Acrobatics", ability: "dex" },
  { slug: "animal-handling", name: "Animal Handling", ability: "wis" },
  { slug: "arcana", name: "Arcana", ability: "int" },
  { slug: "athletics", name: "Athletics", ability: "str" },
  { slug: "deception", name: "Deception", ability: "cha" },
  { slug: "history", name: "History", ability: "int" },
  { slug: "insight", name: "Insight", ability: "wis" },
  { slug: "intimidation", name: "Intimidation", ability: "cha" },
  { slug: "investigation", name: "Investigation", ability: "int" },
  { slug: "medicine", name: "Medicine", ability: "wis" },
  { slug: "nature", name: "Nature", ability: "int" },
  { slug: "perception", name: "Perception", ability: "wis" },
  { slug: "performance", name: "Performance", ability: "cha" },
  { slug: "persuasion", name: "Persuasion", ability: "cha" },
  { slug: "religion", name: "Religion", ability: "int" },
  { slug: "sleight-of-hand", name: "Sleight of Hand", ability: "dex" },
  { slug: "stealth", name: "Stealth", ability: "dex" },
  { slug: "survival", name: "Survival", ability: "wis" }
];

const SKILLS_35 = [
  { slug: "appraise", name: "Appraise", ability: "int" },
  { slug: "balance", name: "Balance", ability: "dex" },
  { slug: "bluff", name: "Bluff", ability: "cha" },
  { slug: "climb", name: "Climb", ability: "str" },
  { slug: "concentration", name: "Concentration", ability: "con" },
  { slug: "craft", name: "Craft", ability: "int" },
  { slug: "diplomacy", name: "Diplomacy", ability: "cha" },
  { slug: "disable-device", name: "Disable Device", ability: "int" },
  { slug: "gather-information", name: "Gather Information", ability: "cha" },
  { slug: "heal", name: "Heal", ability: "wis" },
  { slug: "hide", name: "Hide", ability: "dex" },
  { slug: "intimidate", name: "Intimidate", ability: "cha" },
  { slug: "jump", name: "Jump", ability: "str" },
  { slug: "knowledge-arcana", name: "Knowledge (Arcana)", ability: "int" },
  { slug: "knowledge-history", name: "Knowledge (History)", ability: "int" },
  { slug: "listen", name: "Listen", ability: "wis" },
  { slug: "move-silently", name: "Move Silently", ability: "dex" },
  { slug: "open-lock", name: "Open Lock", ability: "dex" },
  { slug: "perform", name: "Perform", ability: "cha" },
  { slug: "ride", name: "Ride", ability: "dex" },
  { slug: "search", name: "Search", ability: "int" },
  { slug: "sense-motive", name: "Sense Motive", ability: "wis" },
  { slug: "spellcraft", name: "Spellcraft", ability: "int" },
  { slug: "spot", name: "Spot", ability: "wis" },
  { slug: "survival", name: "Survival", ability: "wis" },
  { slug: "tumble", name: "Tumble", ability: "dex" },
  { slug: "use-magic-device", name: "Use Magic Device", ability: "cha" }
];

const SPECIES_5E_2014 = [
  { slug: "human", name: "Human", speed: 30, size: "Medium", abilityBonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 }, traits: ["Versatile"] },
  { slug: "dwarf", name: "Dwarf", speed: 25, size: "Medium", abilityBonuses: { con: 2 }, traits: ["Darkvision", "Dwarven Resilience"] },
  { slug: "elf", name: "Elf", speed: 30, size: "Medium", abilityBonuses: { dex: 2 }, traits: ["Darkvision", "Keen Senses", "Trance"] },
  { slug: "halfling", name: "Halfling", speed: 25, size: "Small", abilityBonuses: { dex: 2 }, traits: ["Lucky", "Brave"] },
  { slug: "dragonborn", name: "Dragonborn", speed: 30, size: "Medium", abilityBonuses: { str: 2, cha: 1 }, traits: ["Breath Weapon"] },
  { slug: "tiefling", name: "Tiefling", speed: 30, size: "Medium", abilityBonuses: { int: 1, cha: 2 }, traits: ["Darkvision", "Infernal Legacy"] }
];

const SPECIES_5E_2024 = [
  { slug: "human", name: "Human", speed: 30, size: "Medium", abilityBonuses: {}, traits: ["Resourceful", "Skillful"] },
  { slug: "dwarf", name: "Dwarf", speed: 30, size: "Medium", abilityBonuses: {}, traits: ["Darkvision", "Dwarven Toughness"] },
  { slug: "elf", name: "Elf", speed: 30, size: "Medium", abilityBonuses: {}, traits: ["Darkvision", "Fey Ancestry"] },
  { slug: "halfling", name: "Halfling", speed: 30, size: "Small", abilityBonuses: {}, traits: ["Luck", "Brave"] },
  { slug: "gnome", name: "Gnome", speed: 30, size: "Small", abilityBonuses: {}, traits: ["Darkvision", "Gnomish Cunning"] },
  { slug: "orc", name: "Orc", speed: 30, size: "Medium", abilityBonuses: {}, traits: ["Adrenaline Rush", "Relentless Endurance"] },
  { slug: "dragonborn", name: "Dragonborn", speed: 30, size: "Medium", abilityBonuses: {}, traits: ["Breath Weapon", "Damage Resistance"] }
];

const RACES_35 = [
  { slug: "human", name: "Human", speed: 30, size: "Medium", abilityBonuses: {}, traits: ["Bonus feat", "Extra skill points"] },
  { slug: "dwarf", name: "Dwarf", speed: 20, size: "Medium", abilityBonuses: { con: 2, cha: -2 }, traits: ["Darkvision", "Stonecunning"] },
  { slug: "elf", name: "Elf", speed: 30, size: "Medium", abilityBonuses: { dex: 2, con: -2 }, traits: ["Low-light vision", "Keen senses"] },
  { slug: "gnome", name: "Gnome", speed: 20, size: "Small", abilityBonuses: { con: 2, str: -2 }, traits: ["Low-light vision", "Illusion affinity"] },
  { slug: "half-elf", name: "Half-Elf", speed: 30, size: "Medium", abilityBonuses: {}, traits: ["Low-light vision", "Diplomacy bonus"] },
  { slug: "half-orc", name: "Half-Orc", speed: 30, size: "Medium", abilityBonuses: { str: 2, int: -2, cha: -2 }, traits: ["Darkvision"] },
  { slug: "halfling", name: "Halfling", speed: 20, size: "Small", abilityBonuses: { dex: 2, str: -2 }, traits: ["Fear resistance", "Thrown weapon bonus"] }
];

const BACKGROUNDS_5E_2014 = [
  { slug: "acolyte", name: "Acolyte", skillProficiencies: ["Insight", "Religion"], toolProficiencies: [], languageProficiencies: 2, traits: ["Shelter of the Faithful"] },
  { slug: "criminal", name: "Criminal", skillProficiencies: ["Deception", "Stealth"], toolProficiencies: ["Thieves' Tools"], languageProficiencies: 0, traits: ["Criminal Contact"] },
  { slug: "folk-hero", name: "Folk Hero", skillProficiencies: ["Animal Handling", "Survival"], toolProficiencies: ["Artisan's Tools"], languageProficiencies: 0, traits: ["Rustic Hospitality"] },
  { slug: "sage", name: "Sage", skillProficiencies: ["Arcana", "History"], toolProficiencies: [], languageProficiencies: 2, traits: ["Researcher"] },
  { slug: "soldier", name: "Soldier", skillProficiencies: ["Athletics", "Intimidation"], toolProficiencies: ["Gaming Set"], languageProficiencies: 0, traits: ["Military Rank"] },
  { slug: "entertainer", name: "Entertainer", skillProficiencies: ["Acrobatics", "Performance"], toolProficiencies: ["Disguise Kit", "Musical Instrument"], languageProficiencies: 0, traits: ["By Popular Demand"] }
];

const BACKGROUNDS_5E_2024 = [
  { slug: "acolyte", name: "Acolyte", skillProficiencies: ["Insight", "Religion"], toolProficiencies: ["Calligrapher's Supplies"], languageProficiencies: 2, defaultAbilityBonuses: { wis: 2, int: 1 }, traits: ["Temple service"], originFeat: "Magic Initiate" },
  { slug: "artisan", name: "Artisan", skillProficiencies: ["Investigation", "Persuasion"], toolProficiencies: ["Artisan's Tools"], languageProficiencies: 1, defaultAbilityBonuses: { int: 2, dex: 1 }, traits: ["Guild ties"], originFeat: "Crafter" },
  { slug: "guard", name: "Guard", skillProficiencies: ["Athletics", "Perception"], toolProficiencies: ["Gaming Set"], languageProficiencies: 0, defaultAbilityBonuses: { str: 2, wis: 1 }, traits: ["Watch duty"], originFeat: "Alert" },
  { slug: "sage", name: "Sage", skillProficiencies: ["Arcana", "History"], toolProficiencies: ["Calligrapher's Supplies"], languageProficiencies: 2, defaultAbilityBonuses: { int: 2, wis: 1 }, traits: ["Academic access"], originFeat: "Skilled" },
  { slug: "soldier", name: "Soldier", skillProficiencies: ["Athletics", "Intimidation"], toolProficiencies: ["Vehicles (Land)"], languageProficiencies: 0, defaultAbilityBonuses: { str: 2, con: 1 }, traits: ["Military discipline"], originFeat: "Savage Attacker" },
  { slug: "wayfarer", name: "Wayfarer", skillProficiencies: ["Stealth", "Survival"], toolProficiencies: ["Thieves' Tools"], languageProficiencies: 1, defaultAbilityBonuses: { dex: 2, wis: 1 }, traits: ["Travel routes"], originFeat: "Lucky" }
];

const BACKGROUNDS_35 = [
  { slug: "apprentice", name: "Arcane Apprentice", skillProficiencies: ["Concentration", "Knowledge (Arcana)"], toolProficiencies: [], languageProficiencies: 1, traits: ["Mentor contact"] },
  { slug: "mercenary", name: "Mercenary", skillProficiencies: ["Intimidate", "Ride"], toolProficiencies: ["Gaming Set"], languageProficiencies: 0, traits: ["Camp routines"] },
  { slug: "scholar", name: "Scholar", skillProficiencies: ["Knowledge (History)", "Search"], toolProficiencies: [], languageProficiencies: 2, traits: ["Library access"] },
  { slug: "street-urchin", name: "Street Urchin", skillProficiencies: ["Hide", "Move Silently"], toolProficiencies: ["Thieves' Tools"], languageProficiencies: 0, traits: ["Urban contacts"] },
  { slug: "temple-servant", name: "Temple Servant", skillProficiencies: ["Heal", "Diplomacy"], toolProficiencies: [], languageProficiencies: 1, traits: ["Sanctuary access"] }
];

const FIVE_E_CLASSES = [
  { slug: "barbarian", name: "Barbarian", hitDie: 12, primaryAbilities: ["str", "con"], savingThrowProficiencies: ["str", "con"], skillChoices: 2, skillOptions: ["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"], spellcasting: null, subclasses: [{ slug: "berserker", name: "Path of the Berserker" }, { slug: "totem-warrior", name: "Path of the Totem Warrior" }], featuresByLevel: [{ level: 1, name: "Rage", description: "Damage boost and resistance while raging." }, { level: 1, name: "Unarmored Defense", description: "AC from Dex and Con while unarmored." }, { level: 2, name: "Reckless Attack", description: "Advantage now, danger later." }, { level: 3, name: "Primal Path", description: "Choose subclass." }, { level: 5, name: "Extra Attack", description: "Two attacks with Attack action." }], startingEquipment: ["Greataxe", "Two handaxes", "Explorer's Pack"] },
  { slug: "bard", name: "Bard", hitDie: 8, primaryAbilities: ["cha", "dex"], savingThrowProficiencies: ["dex", "cha"], skillChoices: 3, skillOptions: SKILLS_5E.map((s) => s.name), spellcasting: { ability: "cha", cantripsAtLevel1: 2, spellsKnownAtLevel1: 4 }, subclasses: [{ slug: "lore", name: "College of Lore" }, { slug: "valor", name: "College of Valor" }], featuresByLevel: [{ level: 1, name: "Bardic Inspiration", description: "Give allies bonus dice." }, { level: 1, name: "Spellcasting", description: "Arcane support and control." }, { level: 2, name: "Jack of All Trades", description: "Half proficiency to many checks." }, { level: 3, name: "Bard College", description: "Choose subclass." }, { level: 5, name: "Font of Inspiration", description: "Refresh on short rest." }], startingEquipment: ["Rapier", "Lute", "Leather Armor"] },
  { slug: "cleric", name: "Cleric", hitDie: 8, primaryAbilities: ["wis", "con"], savingThrowProficiencies: ["wis", "cha"], skillChoices: 2, skillOptions: ["History", "Insight", "Medicine", "Persuasion", "Religion"], spellcasting: { ability: "wis", cantripsAtLevel1: 3, spellsKnownAtLevel1: 0, preparedBy: "wisdom-plus-level" }, subclasses: [{ slug: "life", name: "Life Domain" }, { slug: "light", name: "Light Domain" }], featuresByLevel: [{ level: 1, name: "Spellcasting", description: "Prepare divine spells daily." }, { level: 1, name: "Divine Domain", description: "Choose domain." }, { level: 2, name: "Channel Divinity", description: "Harness divine power." }, { level: 5, name: "Destroy Undead", description: "Improved turning." }], startingEquipment: ["Mace", "Shield", "Holy Symbol"] },
  { slug: "druid", name: "Druid", hitDie: 8, primaryAbilities: ["wis", "con"], savingThrowProficiencies: ["int", "wis"], skillChoices: 2, skillOptions: ["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"], spellcasting: { ability: "wis", cantripsAtLevel1: 2, spellsKnownAtLevel1: 0, preparedBy: "wisdom-plus-level" }, subclasses: [{ slug: "land", name: "Circle of the Land" }, { slug: "moon", name: "Circle of the Moon" }], featuresByLevel: [{ level: 1, name: "Druidic", description: "Secret druid language." }, { level: 1, name: "Spellcasting", description: "Nature magic." }, { level: 2, name: "Wild Shape", description: "Transform into beasts." }, { level: 2, name: "Druid Circle", description: "Choose circle." }, { level: 5, name: "Improved Wild Shape", description: "Expanded forms." }], startingEquipment: ["Scimitar", "Wooden Shield", "Explorer's Pack"] },
  { slug: "fighter", name: "Fighter", hitDie: 10, primaryAbilities: ["str", "dex", "con"], savingThrowProficiencies: ["str", "con"], skillChoices: 2, skillOptions: ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"], spellcasting: null, subclasses: [{ slug: "champion", name: "Champion" }, { slug: "battle-master", name: "Battle Master" }], featuresByLevel: [{ level: 1, name: "Fighting Style", description: "Choose combat specialty." }, { level: 1, name: "Second Wind", description: "Recover HP as bonus action." }, { level: 2, name: "Action Surge", description: "Gain extra action on turn." }, { level: 3, name: "Martial Archetype", description: "Choose subclass." }, { level: 5, name: "Extra Attack", description: "Two attacks with Attack action." }], startingEquipment: ["Chain Mail", "Longsword", "Shield"] },
  { slug: "monk", name: "Monk", hitDie: 8, primaryAbilities: ["dex", "wis"], savingThrowProficiencies: ["str", "dex"], skillChoices: 2, skillOptions: ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"], spellcasting: null, subclasses: [{ slug: "open-hand", name: "Way of the Open Hand" }, { slug: "shadow", name: "Way of Shadow" }], featuresByLevel: [{ level: 1, name: "Martial Arts", description: "Unarmed techniques." }, { level: 1, name: "Unarmored Defense", description: "AC from Dex and Wis." }, { level: 2, name: "Ki", description: "Use ki techniques." }, { level: 3, name: "Monastic Tradition", description: "Choose subclass." }, { level: 5, name: "Extra Attack", description: "Two attacks with Attack action." }], startingEquipment: ["Shortsword", "Darts (10)"] },
  { slug: "paladin", name: "Paladin", hitDie: 10, primaryAbilities: ["str", "cha", "con"], savingThrowProficiencies: ["wis", "cha"], skillChoices: 2, skillOptions: ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"], spellcasting: { ability: "cha", cantripsAtLevel1: 0, spellsKnownAtLevel1: 0 }, subclasses: [{ slug: "devotion", name: "Oath of Devotion" }, { slug: "vengeance", name: "Oath of Vengeance" }], featuresByLevel: [{ level: 1, name: "Divine Sense", description: "Sense celestial/fiend/undead." }, { level: 1, name: "Lay on Hands", description: "Healing pool." }, { level: 2, name: "Divine Smite", description: "Convert slots into radiant burst." }, { level: 3, name: "Sacred Oath", description: "Choose subclass." }, { level: 5, name: "Extra Attack", description: "Two attacks with Attack action." }], startingEquipment: ["Chain Mail", "Holy Symbol", "Shield"] },
  { slug: "ranger", name: "Ranger", hitDie: 10, primaryAbilities: ["dex", "wis"], savingThrowProficiencies: ["str", "dex"], skillChoices: 3, skillOptions: ["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"], spellcasting: { ability: "wis", cantripsAtLevel1: 0, spellsKnownAtLevel1: 0 }, subclasses: [{ slug: "hunter", name: "Hunter" }, { slug: "beast-master", name: "Beast Master" }], featuresByLevel: [{ level: 1, name: "Favored Enemy", description: "Expertise against chosen foe types." }, { level: 1, name: "Natural Explorer", description: "Terrain advantages." }, { level: 2, name: "Fighting Style", description: "Combat specialization." }, { level: 2, name: "Spellcasting", description: "Ranger spells." }, { level: 5, name: "Extra Attack", description: "Two attacks with Attack action." }], startingEquipment: ["Longbow", "Shortswords (2)", "Explorer's Pack"] },
  { slug: "rogue", name: "Rogue", hitDie: 8, primaryAbilities: ["dex", "int", "cha"], savingThrowProficiencies: ["dex", "int"], skillChoices: 4, skillOptions: ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"], spellcasting: null, subclasses: [{ slug: "thief", name: "Thief" }, { slug: "assassin", name: "Assassin" }], featuresByLevel: [{ level: 1, name: "Expertise", description: "Double proficiency in chosen skills." }, { level: 1, name: "Sneak Attack", description: "Precision damage once per turn." }, { level: 2, name: "Cunning Action", description: "Bonus Dash/Disengage/Hide." }, { level: 3, name: "Roguish Archetype", description: "Choose subclass." }, { level: 5, name: "Uncanny Dodge", description: "Use reaction to halve attack damage." }], startingEquipment: ["Rapier", "Shortbow", "Thieves' Tools"] },
  { slug: "sorcerer", name: "Sorcerer", hitDie: 6, primaryAbilities: ["cha", "con"], savingThrowProficiencies: ["con", "cha"], skillChoices: 2, skillOptions: ["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"], spellcasting: { ability: "cha", cantripsAtLevel1: 4, spellsKnownAtLevel1: 2 }, subclasses: [{ slug: "draconic", name: "Draconic Bloodline" }, { slug: "wild-magic", name: "Wild Magic" }], featuresByLevel: [{ level: 1, name: "Spellcasting", description: "Innate arcane magic." }, { level: 1, name: "Sorcerous Origin", description: "Choose origin." }, { level: 2, name: "Font of Magic", description: "Gain sorcery points." }, { level: 3, name: "Metamagic", description: "Modify spells." }, { level: 5, name: "Metamagic Expansion", description: "More spell options." }], startingEquipment: ["Light Crossbow", "Component Pouch"] },
  { slug: "warlock", name: "Warlock", hitDie: 8, primaryAbilities: ["cha", "con"], savingThrowProficiencies: ["wis", "cha"], skillChoices: 2, skillOptions: ["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"], spellcasting: { ability: "cha", cantripsAtLevel1: 2, spellsKnownAtLevel1: 2, slotStyle: "pact" }, subclasses: [{ slug: "fiend", name: "The Fiend" }, { slug: "great-old-one", name: "The Great Old One" }], featuresByLevel: [{ level: 1, name: "Otherworldly Patron", description: "Choose patron." }, { level: 1, name: "Pact Magic", description: "Short-rest slots." }, { level: 2, name: "Eldritch Invocations", description: "Customize with invocations." }, { level: 3, name: "Pact Boon", description: "Choose pact gift." }, { level: 5, name: "Invocation Expansion", description: "Additional invocation slots." }], startingEquipment: ["Simple Weapon", "Light Crossbow", "Component Pouch"] },
  { slug: "wizard", name: "Wizard", hitDie: 6, primaryAbilities: ["int", "con"], savingThrowProficiencies: ["int", "wis"], skillChoices: 2, skillOptions: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"], spellcasting: { ability: "int", cantripsAtLevel1: 3, spellsKnownAtLevel1: 6, preparedBy: "intelligence-plus-level" }, subclasses: [{ slug: "evocation", name: "School of Evocation" }, { slug: "abjuration", name: "School of Abjuration" }], featuresByLevel: [{ level: 1, name: "Spellcasting", description: "Spellbook-based arcane casting." }, { level: 1, name: "Arcane Recovery", description: "Recover spell slots on short rest." }, { level: 2, name: "Arcane Tradition", description: "Choose school tradition." }, { level: 5, name: "Tradition Feature", description: "Stronger school feature." }], startingEquipment: ["Quarterstaff", "Spellbook", "Component Pouch"] }
];

const THREE_FIVE_CLASSES = [
  { slug: "barbarian", name: "Barbarian", hitDie: 12, primaryAbilities: ["str", "con"], savingThrowProficiencies: ["fort"], skillChoices: 4, baseAttackProgression: "good", spellcasting: null, subclasses: [], featuresByLevel: [{ level: 1, name: "Rage", description: "Combat fury boosts damage and toughness." }, { level: 1, name: "Fast Movement", description: "Faster movement in light gear." }, { level: 2, name: "Uncanny Dodge", description: "Keep Dex bonus when surprised." }, { level: 5, name: "Improved Uncanny Dodge", description: "Resist flanking." }], startingEquipment: ["Greataxe", "Javelins", "Light armor"] },
  { slug: "bard", name: "Bard", hitDie: 6, primaryAbilities: ["cha", "dex"], savingThrowProficiencies: ["ref", "will"], skillChoices: 6, baseAttackProgression: "average", spellcasting: { ability: "cha", cantripsAtLevel1: 2, spellsKnownAtLevel1: 4 }, subclasses: [], featuresByLevel: [{ level: 1, name: "Bardic Music", description: "Songs empower allies." }, { level: 1, name: "Bardic Knowledge", description: "Lore checks on history and legends." }, { level: 2, name: "Countersong", description: "Defensive musical effect." }, { level: 5, name: "Inspire Courage +2", description: "Improved morale bonus." }], startingEquipment: ["Rapier", "Instrument", "Leather armor"] },
  { slug: "cleric", name: "Cleric", hitDie: 8, primaryAbilities: ["wis", "con"], savingThrowProficiencies: ["fort", "will"], skillChoices: 2, baseAttackProgression: "average", spellcasting: { ability: "wis", cantripsAtLevel1: 3, spellsKnownAtLevel1: 0, preparedBy: "wisdom" }, subclasses: [], featuresByLevel: [{ level: 1, name: "Turn Undead", description: "Repel or destroy undead." }, { level: 1, name: "Domains", description: "Choose two divine domains." }, { level: 2, name: "Divine Channeling", description: "More powerful turning attempts." }, { level: 5, name: "Turn Scaling", description: "Stronger anti-undead effects." }], startingEquipment: ["Mace", "Shield", "Holy Symbol"] },
  { slug: "druid", name: "Druid", hitDie: 8, primaryAbilities: ["wis", "con"], savingThrowProficiencies: ["fort", "will"], skillChoices: 4, baseAttackProgression: "average", spellcasting: { ability: "wis", cantripsAtLevel1: 3, spellsKnownAtLevel1: 0, preparedBy: "wisdom" }, subclasses: [], featuresByLevel: [{ level: 1, name: "Nature Sense", description: "Enhanced nature skills." }, { level: 1, name: "Animal Companion", description: "Bond with creature companion." }, { level: 2, name: "Woodland Stride", description: "Move easily through terrain." }, { level: 5, name: "Wild Shape", description: "Take beast forms." }], startingEquipment: ["Scimitar", "Wooden shield"] },
  { slug: "fighter", name: "Fighter", hitDie: 10, primaryAbilities: ["str", "dex", "con"], savingThrowProficiencies: ["fort"], skillChoices: 2, baseAttackProgression: "good", spellcasting: null, subclasses: [], featuresByLevel: [{ level: 1, name: "Bonus Feat", description: "Gain a combat feat." }, { level: 2, name: "Bonus Feat", description: "Another combat feat." }, { level: 4, name: "Bonus Feat", description: "Further specialization." }, { level: 5, name: "Weapon Mastery", description: "Improved martial reliability." }], startingEquipment: ["Martial weapon", "Heavy armor", "Shield"] },
  { slug: "monk", name: "Monk", hitDie: 8, primaryAbilities: ["dex", "wis", "str"], savingThrowProficiencies: ["fort", "ref", "will"], skillChoices: 4, baseAttackProgression: "average", spellcasting: null, subclasses: [], featuresByLevel: [{ level: 1, name: "Flurry of Blows", description: "Extra attacks in full attack." }, { level: 1, name: "Unarmed Strike", description: "Enhanced unarmed combat." }, { level: 2, name: "Evasion", description: "Avoid area effects with reflex." }, { level: 5, name: "Purity of Body", description: "Immunity to disease." }], startingEquipment: ["Monk weapon", "Traveler gear"] },
  { slug: "paladin", name: "Paladin", hitDie: 10, primaryAbilities: ["str", "cha", "con"], savingThrowProficiencies: ["fort", "will"], skillChoices: 2, baseAttackProgression: "good", spellcasting: { ability: "wis", cantripsAtLevel1: 0, spellsKnownAtLevel1: 0 }, subclasses: [], featuresByLevel: [{ level: 1, name: "Detect Evil", description: "Sense evil aura." }, { level: 1, name: "Smite Evil", description: "Burst damage against evil foes." }, { level: 2, name: "Divine Grace", description: "Charisma bonus to saves." }, { level: 5, name: "Special Mount", description: "Summon holy mount." }], startingEquipment: ["Martial weapon", "Heavy armor", "Holy Symbol"] },
  { slug: "ranger", name: "Ranger", hitDie: 8, primaryAbilities: ["dex", "wis"], savingThrowProficiencies: ["fort", "ref"], skillChoices: 4, baseAttackProgression: "good", spellcasting: { ability: "wis", cantripsAtLevel1: 0, spellsKnownAtLevel1: 0 }, subclasses: [], featuresByLevel: [{ level: 1, name: "Favored Enemy", description: "Bonuses against chosen enemy types." }, { level: 1, name: "Track", description: "Advanced tracking skills." }, { level: 2, name: "Combat Style", description: "Choose archery or two-weapon path." }, { level: 5, name: "Second Favored Enemy", description: "Broaden expertise." }], startingEquipment: ["Longbow", "Short swords", "Leather armor"] },
  { slug: "rogue", name: "Rogue", hitDie: 6, primaryAbilities: ["dex", "int", "cha"], savingThrowProficiencies: ["ref"], skillChoices: 8, baseAttackProgression: "average", spellcasting: null, subclasses: [], featuresByLevel: [{ level: 1, name: "Sneak Attack", description: "Precision bonus damage." }, { level: 1, name: "Trapfinding", description: "Find and disarm advanced traps." }, { level: 2, name: "Evasion", description: "Negate area effects on successful save." }, { level: 5, name: "Sneak Attack +3d6", description: "Improved precision damage." }], startingEquipment: ["Rapier", "Shortbow", "Thieves' tools"] },
  { slug: "sorcerer", name: "Sorcerer", hitDie: 4, primaryAbilities: ["cha", "con"], savingThrowProficiencies: ["will"], skillChoices: 2, baseAttackProgression: "poor", spellcasting: { ability: "cha", cantripsAtLevel1: 4, spellsKnownAtLevel1: 2 }, subclasses: [], featuresByLevel: [{ level: 1, name: "Spellcasting", description: "Spontaneous arcane casting." }, { level: 1, name: "Familiar", description: "Arcane companion option." }, { level: 3, name: "Spell Progression", description: "Gain stronger spell access." }, { level: 5, name: "Spell Growth", description: "Higher volume of spells per day." }], startingEquipment: ["Quarterstaff", "Component pouch"] },
  { slug: "wizard", name: "Wizard", hitDie: 4, primaryAbilities: ["int", "con"], savingThrowProficiencies: ["will"], skillChoices: 2, baseAttackProgression: "poor", spellcasting: { ability: "int", cantripsAtLevel1: 3, spellsKnownAtLevel1: 3, preparedBy: "intelligence" }, subclasses: [], featuresByLevel: [{ level: 1, name: "Spellbook", description: "Prepare spells from spellbook." }, { level: 1, name: "Scribe Scroll", description: "Craft spell scrolls." }, { level: 1, name: "Familiar", description: "Arcane familiar companion." }, { level: 5, name: "Bonus Feat", description: "Gain wizard bonus feat." }], startingEquipment: ["Spellbook", "Quarterstaff", "Component pouch"] }
];

const FEATS_5E = [
  { slug: "alert", name: "Alert", description: "Boost initiative and avoid surprise." },
  { slug: "athlete", name: "Athlete", description: "Improved climbing and jumping." },
  { slug: "charger", name: "Charger", description: "Charge for burst melee output." },
  { slug: "crossbow-expert", name: "Crossbow Expert", description: "Close-range crossbow efficiency." },
  { slug: "defensive-duelist", name: "Defensive Duelist", description: "Reaction AC boost with finesse weapon." },
  { slug: "dual-wielder", name: "Dual Wielder", description: "Stronger two-weapon fighting." },
  { slug: "great-weapon-master", name: "Great Weapon Master", description: "High-risk, high-reward heavy attacks." },
  { slug: "healer", name: "Healer", description: "Greatly improve healing kit usage." },
  { slug: "inspiring-leader", name: "Inspiring Leader", description: "Grant temporary HP to allies." },
  { slug: "lucky", name: "Lucky", description: "Reroll key d20 tests." },
  { slug: "resilient", name: "Resilient", description: "Gain save proficiency and stat increase." },
  { slug: "sharpshooter", name: "Sharpshooter", description: "Long-range precision and power attacks." },
  { slug: "tough", name: "Tough", description: "Increase hit points per level." },
  { slug: "war-caster", name: "War Caster", description: "Better concentration and occupied-hand casting." }
];

const FEATS_35 = [
  { slug: "combat-casting", name: "Combat Casting", description: "Bonus concentration while threatened." },
  { slug: "cleave", name: "Cleave", description: "Extra attack after dropping foe." },
  { slug: "dodge", name: "Dodge", description: "AC bonus against one chosen target." },
  { slug: "great-cleave", name: "Great Cleave", description: "Chain cleave attacks through enemies." },
  { slug: "improved-initiative", name: "Improved Initiative", description: "Large initiative bonus." },
  { slug: "mobility", name: "Mobility", description: "Better AC against attacks of opportunity." },
  { slug: "point-blank-shot", name: "Point Blank Shot", description: "Ranged bonuses within short range." },
  { slug: "power-attack", name: "Power Attack", description: "Trade attack bonus for melee damage." },
  { slug: "spell-focus", name: "Spell Focus", description: "Increase save DC for one school." },
  { slug: "toughness", name: "Toughness", description: "Flat hit point increase." },
  { slug: "weapon-focus", name: "Weapon Focus", description: "Attack bonus with selected weapon." }
];

const ITEMS_5E = [
  { slug: "club", name: "Club", category: "Weapon", cost: "1 sp", weight: 2, properties: "1d4 bludgeoning, light" },
  { slug: "dagger", name: "Dagger", category: "Weapon", cost: "2 gp", weight: 1, properties: "1d4 piercing, finesse, thrown" },
  { slug: "longsword", name: "Longsword", category: "Weapon", cost: "15 gp", weight: 3, properties: "1d8 slashing, versatile" },
  { slug: "greatsword", name: "Greatsword", category: "Weapon", cost: "50 gp", weight: 6, properties: "2d6 slashing, heavy, two-handed" },
  { slug: "rapier", name: "Rapier", category: "Weapon", cost: "25 gp", weight: 2, properties: "1d8 piercing, finesse" },
  { slug: "shortbow", name: "Shortbow", category: "Weapon", cost: "25 gp", weight: 2, properties: "1d6 piercing, ranged" },
  { slug: "longbow", name: "Longbow", category: "Weapon", cost: "50 gp", weight: 2, properties: "1d8 piercing, heavy ranged" },
  { slug: "quarterstaff", name: "Quarterstaff", category: "Weapon", cost: "2 sp", weight: 4, properties: "1d6 bludgeoning, versatile" },
  { slug: "leather-armor", name: "Leather Armor", category: "Armor", cost: "10 gp", weight: 10, properties: "AC 11 + Dex" },
  { slug: "chain-shirt", name: "Chain Shirt", category: "Armor", cost: "50 gp", weight: 20, properties: "AC 13 + Dex (max 2)" },
  { slug: "chain-mail", name: "Chain Mail", category: "Armor", cost: "75 gp", weight: 55, properties: "AC 16" },
  { slug: "shield", name: "Shield", category: "Armor", cost: "10 gp", weight: 6, properties: "+2 AC" },
  { slug: "explorers-pack", name: "Explorer's Pack", category: "Adventuring Gear", cost: "10 gp", weight: 59, properties: "Bedroll, rope, rations, torch" },
  { slug: "dungeoneers-pack", name: "Dungeoneer's Pack", category: "Adventuring Gear", cost: "12 gp", weight: 61, properties: "Rope, torches, rations, hammer" },
  { slug: "priests-pack", name: "Priest's Pack", category: "Adventuring Gear", cost: "19 gp", weight: 24, properties: "Candles, incense, vestments" },
  { slug: "scholars-pack", name: "Scholar's Pack", category: "Adventuring Gear", cost: "40 gp", weight: 10, properties: "Books, parchment, ink" },
  { slug: "component-pouch", name: "Component Pouch", category: "Focus", cost: "25 gp", weight: 2, properties: "Spell components" },
  { slug: "holy-symbol", name: "Holy Symbol", category: "Focus", cost: "5 gp", weight: 1, properties: "Divine spellcasting focus" },
  { slug: "thieves-tools", name: "Thieves' Tools", category: "Tool", cost: "25 gp", weight: 1, properties: "Lockpicking and trap disarming" },
  { slug: "healers-kit", name: "Healer's Kit", category: "Tool", cost: "5 gp", weight: 3, properties: "Stabilize wounded characters" }
];

const ITEMS_35 = [
  { slug: "club", name: "Club", category: "Weapon", cost: "0 gp", weight: 3, properties: "1d6 bludgeoning" },
  { slug: "dagger", name: "Dagger", category: "Weapon", cost: "2 gp", weight: 1, properties: "1d4 piercing, thrown" },
  { slug: "longsword", name: "Longsword", category: "Weapon", cost: "15 gp", weight: 4, properties: "1d8 slashing" },
  { slug: "greatsword", name: "Greatsword", category: "Weapon", cost: "50 gp", weight: 8, properties: "2d6 slashing" },
  { slug: "shortbow", name: "Shortbow", category: "Weapon", cost: "30 gp", weight: 2, properties: "1d6 piercing" },
  { slug: "light-crossbow", name: "Light Crossbow", category: "Weapon", cost: "35 gp", weight: 4, properties: "1d8 piercing" },
  { slug: "padded-armor", name: "Padded Armor", category: "Armor", cost: "5 gp", weight: 10, properties: "AC +1" },
  { slug: "leather-armor", name: "Leather Armor", category: "Armor", cost: "10 gp", weight: 15, properties: "AC +2" },
  { slug: "chain-shirt", name: "Chain Shirt", category: "Armor", cost: "100 gp", weight: 25, properties: "AC +4" },
  { slug: "chainmail", name: "Chainmail", category: "Armor", cost: "150 gp", weight: 40, properties: "AC +5" },
  { slug: "full-plate", name: "Full Plate", category: "Armor", cost: "1500 gp", weight: 50, properties: "AC +8" },
  { slug: "heavy-steel-shield", name: "Heavy Steel Shield", category: "Shield", cost: "20 gp", weight: 15, properties: "Shield +2" },
  { slug: "backpack", name: "Backpack", category: "Adventuring Gear", cost: "2 gp", weight: 2, properties: "Storage gear" },
  { slug: "bedroll", name: "Bedroll", category: "Adventuring Gear", cost: "1 sp", weight: 5, properties: "Resting gear" },
  { slug: "grappling-hook", name: "Grappling Hook", category: "Adventuring Gear", cost: "1 gp", weight: 4, properties: "Climbing utility" },
  { slug: "rope-hempen", name: "Hempen Rope (50 ft)", category: "Adventuring Gear", cost: "1 gp", weight: 10, properties: "General utility rope" },
  { slug: "spell-component-pouch", name: "Spell Component Pouch", category: "Focus", cost: "5 gp", weight: 2, properties: "Material components" },
  { slug: "holy-symbol", name: "Holy Symbol", category: "Focus", cost: "1 gp", weight: 0, properties: "Divine focus" }
];

const SPELLS_5E = [
  { slug: "acid-splash", name: "Acid Splash", level: 0, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Hurl acid at nearby targets." },
  { slug: "guidance", name: "Guidance", level: 0, school: "Divination", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Concentration, 1 minute", classes: ["cleric", "druid"], description: "Add 1d4 to one ability check." },
  { slug: "mage-hand", name: "Mage Hand", level: 0, school: "Conjuration", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "1 minute", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Summon a spectral hand." },
  { slug: "minor-illusion", name: "Minor Illusion", level: 0, school: "Illusion", castingTime: "1 action", range: "30 feet", components: "S, M", duration: "1 minute", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Create a basic image or sound." },
  { slug: "sacred-flame", name: "Sacred Flame", level: 0, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous", classes: ["cleric"], description: "Radiant damage to one target." },
  { slug: "eldritch-blast", name: "Eldritch Blast", level: 0, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Instantaneous", classes: ["warlock"], description: "Iconic force beam attack." },
  { slug: "cure-wounds", name: "Cure Wounds", level: 1, school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous", classes: ["bard", "cleric", "druid", "paladin", "ranger"], description: "Restore hit points." },
  { slug: "healing-word", name: "Healing Word", level: 1, school: "Evocation", castingTime: "1 bonus action", range: "60 feet", components: "V", duration: "Instantaneous", classes: ["bard", "cleric", "druid"], description: "Quick ranged healing." },
  { slug: "guiding-bolt", name: "Guiding Bolt", level: 1, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "1 round", classes: ["cleric"], description: "Radiant strike grants next-hit advantage." },
  { slug: "magic-missile", name: "Magic Missile", level: 1, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Auto-hit force darts." },
  { slug: "shield", name: "Shield", level: 1, school: "Abjuration", castingTime: "1 reaction", range: "Self", components: "V, S", duration: "1 round", classes: ["wizard", "sorcerer"], description: "Reaction +5 AC until next turn." },
  { slug: "sleep", name: "Sleep", level: 1, school: "Enchantment", castingTime: "1 action", range: "90 feet", components: "V, S, M", duration: "1 minute", classes: ["bard", "wizard", "sorcerer"], description: "Put creatures to sleep by HP pool." },
  { slug: "burning-hands", name: "Burning Hands", level: 1, school: "Evocation", castingTime: "1 action", range: "Self (15-foot cone)", components: "V, S", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Cone of fire damage." },
  { slug: "faerie-fire", name: "Faerie Fire", level: 1, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V", duration: "Concentration, 1 minute", classes: ["bard", "druid"], description: "Outline enemies and grant attack advantage." },
  { slug: "hunters-mark", name: "Hunter's Mark", level: 1, school: "Divination", castingTime: "1 bonus action", range: "90 feet", components: "V", duration: "Concentration, 1 hour", classes: ["ranger"], description: "Bonus damage against marked target." },
  { slug: "misty-step", name: "Misty Step", level: 2, school: "Conjuration", castingTime: "1 bonus action", range: "Self", components: "V", duration: "Instantaneous", classes: ["sorcerer", "warlock", "wizard"], description: "Teleport up to 30 feet." },
  { slug: "invisibility", name: "Invisibility", level: 2, school: "Illusion", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, 1 hour", classes: ["bard", "wizard", "sorcerer", "warlock"], description: "Target turns invisible." },
  { slug: "spiritual-weapon", name: "Spiritual Weapon", level: 2, school: "Evocation", castingTime: "1 bonus action", range: "60 feet", components: "V, S", duration: "1 minute", classes: ["cleric"], description: "Summon force weapon for bonus attacks." },
  { slug: "scorching-ray", name: "Scorching Ray", level: 2, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Launch multiple fire rays." },
  { slug: "fireball", name: "Fireball", level: 3, school: "Evocation", castingTime: "1 action", range: "150 feet", components: "V, S, M", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "20-foot-radius explosion." },
  { slug: "counterspell", name: "Counterspell", level: 3, school: "Abjuration", castingTime: "1 reaction", range: "60 feet", components: "S", duration: "Instantaneous", classes: ["wizard", "sorcerer", "warlock"], description: "Interrupt enemy spellcasting." },
  { slug: "fly", name: "Fly", level: 3, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, 10 minutes", classes: ["wizard", "sorcerer", "warlock"], description: "Grant flying speed." },
  { slug: "haste", name: "Haste", level: 3, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["wizard", "sorcerer"], description: "Boost speed and action economy." }
];

const SPELLS_35 = [
  { slug: "acid-splash", name: "Acid Splash", level: 0, school: "Conjuration", castingTime: "1 standard action", range: "Close", components: "V, S", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Hurl small acid orb." },
  { slug: "detect-magic", name: "Detect Magic", level: 0, school: "Divination", castingTime: "1 standard action", range: "60-foot cone", components: "V, S", duration: "Concentration", classes: ["cleric", "druid", "wizard", "sorcerer"], description: "Detect magical auras." },
  { slug: "light", name: "Light", level: 0, school: "Evocation", castingTime: "1 standard action", range: "Touch", components: "V, M", duration: "10 min/level", classes: ["cleric", "wizard", "sorcerer", "bard"], description: "Object emits bright light." },
  { slug: "ray-of-frost", name: "Ray of Frost", level: 0, school: "Evocation", castingTime: "1 standard action", range: "Close", components: "V, S", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Cold ray attack." },
  { slug: "cure-light-wounds", name: "Cure Light Wounds", level: 1, school: "Conjuration", castingTime: "1 standard action", range: "Touch", components: "V, S", duration: "Instantaneous", classes: ["bard", "cleric", "druid", "paladin", "ranger"], description: "Heal 1d8 + level (max +5)." },
  { slug: "bless", name: "Bless", level: 1, school: "Enchantment", castingTime: "1 standard action", range: "50 ft", components: "V, S, DF", duration: "1 min/level", classes: ["cleric", "paladin"], description: "Allies gain morale bonuses." },
  { slug: "magic-missile", name: "Magic Missile", level: 1, school: "Evocation", castingTime: "1 standard action", range: "Medium", components: "V, S", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Auto-hit force darts." },
  { slug: "mage-armor", name: "Mage Armor", level: 1, school: "Conjuration", castingTime: "1 standard action", range: "Touch", components: "V, S, F", duration: "1 hour/level", classes: ["wizard", "sorcerer"], description: "Target gains armor bonus." },
  { slug: "sleep", name: "Sleep", level: 1, school: "Enchantment", castingTime: "1 round", range: "Medium", components: "V, S, M", duration: "1 min/level", classes: ["bard", "wizard", "sorcerer"], description: "Put low-HD creatures asleep." },
  { slug: "burning-hands", name: "Burning Hands", level: 1, school: "Evocation", castingTime: "1 standard action", range: "15-foot cone", components: "V, S", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Cone of fire." },
  { slug: "entangle", name: "Entangle", level: 1, school: "Transmutation", castingTime: "1 standard action", range: "Long", components: "V, S, DF", duration: "1 min/level", classes: ["druid", "ranger"], description: "Plants restrain movement." },
  { slug: "invisibility", name: "Invisibility", level: 2, school: "Illusion", castingTime: "1 standard action", range: "Touch", components: "V, S, M", duration: "1 min/level", classes: ["bard", "wizard", "sorcerer"], description: "Target becomes invisible." },
  { slug: "scorching-ray", name: "Scorching Ray", level: 2, school: "Evocation", castingTime: "1 standard action", range: "Close", components: "V, S", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Ranged touch fire rays." },
  { slug: "web", name: "Web", level: 2, school: "Conjuration", castingTime: "1 standard action", range: "Medium", components: "V, S, M", duration: "10 min/level", classes: ["wizard", "sorcerer"], description: "Area control with sticky webs." },
  { slug: "dispel-magic", name: "Dispel Magic", level: 3, school: "Abjuration", castingTime: "1 standard action", range: "Medium", components: "V, S", duration: "Instantaneous", classes: ["bard", "cleric", "druid", "paladin", "wizard", "sorcerer"], description: "End magical effects." },
  { slug: "fireball", name: "Fireball", level: 3, school: "Evocation", castingTime: "1 standard action", range: "Long", components: "V, S, M", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "20-foot burst fire blast." },
  { slug: "fly", name: "Fly", level: 3, school: "Transmutation", castingTime: "1 standard action", range: "Touch", components: "V, S, F", duration: "1 min/level", classes: ["wizard", "sorcerer"], description: "Target can fly." },
  { slug: "haste", name: "Haste", level: 3, school: "Transmutation", castingTime: "1 standard action", range: "Close", components: "V, S, M", duration: "1 round/level", classes: ["wizard", "sorcerer"], description: "Speed and attack boosts." }
];

function decorateCollection(prefix, collection) {
  return collection.map((entry) => ({ ...entry, id: `${prefix}-${entry.slug}` }));
}

function decorateClasses(prefix, collection) {
  return collection.map((entry) => ({
    ...entry,
    id: `${prefix}-class-${entry.slug}`,
    subclasses: (entry.subclasses || []).map((subclass) => ({
      ...subclass,
      id: `${prefix}-subclass-${entry.slug}-${subclass.slug}`
    }))
  }));
}

const FIVE_E_FEATURES_PASS4 = {
  barbarian: [
    { level: 6, name: "Primal Path Feature", description: "Subclass feature that defines your advanced rage style." },
    { level: 7, name: "Feral Instinct", description: "Act quickly in battle and reduce surprise vulnerability." },
    { level: 9, name: "Brutal Critical", description: "Critical hits roll extra weapon damage dice." },
    { level: 11, name: "Relentless Rage", description: "Chance to remain fighting after dropping to 0 HP." },
    { level: 13, name: "Brutal Critical Improvement", description: "Critical hit damage bonus increases." },
    { level: 15, name: "Persistent Rage", description: "Rage lasts through minor interruptions." },
    { level: 17, name: "Brutal Critical Mastery", description: "Maximum extra critical damage progression." },
    { level: 18, name: "Indomitable Might", description: "Strength checks cannot roll below your Strength score." },
    { level: 20, name: "Primal Champion", description: "Strength and Constitution increase dramatically." }
  ],
  bard: [
    { level: 6, name: "Countercharm", description: "Use performance to protect allies from fear/charm effects." },
    { level: 6, name: "Bard College Feature", description: "Subclass feature from your chosen college." },
    { level: 8, name: "Ability Score Improvement", description: "Increase key stats or choose a feat." },
    { level: 10, name: "Expertise Expansion", description: "Double proficiency in additional skills." },
    { level: 10, name: "Magical Secrets", description: "Learn spells from classes outside the bard list." },
    { level: 14, name: "College Feature", description: "Advanced college specialization feature." },
    { level: 18, name: "Magical Secrets Mastery", description: "Highest-tier off-list spell access." },
    { level: 20, name: "Superior Inspiration", description: "Recover Bardic Inspiration when entering combat dry." }
  ],
  cleric: [
    { level: 6, name: "Channel Divinity Improvement", description: "Additional channel options or stronger effects." },
    { level: 8, name: "Divine Strike/Potent Spellcasting", description: "Subclass damage or cantrip scaling boost." },
    { level: 10, name: "Divine Intervention", description: "Call on your deity for major aid." },
    { level: 14, name: "Destroy Undead Upgrade", description: "Turning becomes more effective against stronger undead." },
    { level: 17, name: "Domain Capstone", description: "High-level subclass-defining divine feature." },
    { level: 20, name: "Improved Divine Intervention", description: "Reliable direct divine aid." }
  ],
  druid: [
    { level: 6, name: "Circle Feature", description: "Subclass growth tied to your druid circle." },
    { level: 8, name: "Wild Shape Improvement", description: "Expanded shape options and combat utility." },
    { level: 10, name: "Circle Feature", description: "Mid-tier specialization feature." },
    { level: 14, name: "Thousand Forms", description: "High-tier shapeshifting expression and adaptation." },
    { level: 18, name: "Beast Spells", description: "Cast spells while in Wild Shape." },
    { level: 20, name: "Archdruid", description: "Peak druidic mastery and Wild Shape efficiency." }
  ],
  fighter: [
    { level: 6, name: "Ability Score Improvement", description: "Increase core stats or choose feats." },
    { level: 7, name: "Martial Archetype Feature", description: "Subclass combat specialization deepens." },
    { level: 9, name: "Indomitable", description: "Reroll failed saving throws a limited number of times." },
    { level: 10, name: "Martial Archetype Feature", description: "Advanced subclass toolkit." },
    { level: 11, name: "Extra Attack (2)", description: "Three attacks with Attack action." },
    { level: 14, name: "Ability Score Improvement", description: "Further build tuning." },
    { level: 17, name: "Action Surge (2) / Indomitable (3)", description: "Top-end burst and save reliability." },
    { level: 20, name: "Extra Attack (3)", description: "Four attacks with Attack action." }
  ],
  monk: [
    { level: 6, name: "Ki-Empowered Strikes", description: "Unarmed strikes count as magical." },
    { level: 7, name: "Evasion / Stillness of Mind", description: "Defensive core survivability package." },
    { level: 10, name: "Purity of Body", description: "Immunity to disease and poison." },
    { level: 14, name: "Diamond Soul", description: "Proficiency in all saving throws." },
    { level: 15, name: "Timeless Body", description: "Aging pressure and sustenance needs are reduced." },
    { level: 18, name: "Empty Body", description: "Powerful defensive and mobility ki options." },
    { level: 20, name: "Perfect Self", description: "Regain ki at the start of combat when empty." }
  ],
  paladin: [
    { level: 6, name: "Aura of Protection", description: "Allies near you add your Charisma to saving throws." },
    { level: 7, name: "Sacred Oath Aura", description: "Subclass aura shaping frontline identity." },
    { level: 10, name: "Aura of Courage", description: "You and nearby allies resist fear." },
    { level: 11, name: "Improved Divine Smite", description: "Weapon attacks gain baseline radiant bonus damage." },
    { level: 14, name: "Cleansing Touch", description: "End harmful spells with divine focus." },
    { level: 18, name: "Aura Improvements", description: "Paladin aura range expands." },
    { level: 20, name: "Sacred Oath Capstone", description: "Final oath-specific transformation feature." }
  ],
  ranger: [
    { level: 6, name: "Favored Enemy/Foe Improvement", description: "Enhanced hunting profile versus priority targets." },
    { level: 8, name: "Land's Stride", description: "Move through natural hazards more efficiently." },
    { level: 10, name: "Hide in Plain Sight", description: "Advanced stealth preparation in terrain." },
    { level: 11, name: "Ranger Archetype Feature", description: "Subclass tactical identity expansion." },
    { level: 14, name: "Vanish", description: "Bonus-action Hide and anti-tracking features." },
    { level: 18, name: "Feral Senses", description: "Improved awareness against hidden threats." },
    { level: 20, name: "Foe Slayer", description: "Capstone combat pressure versus hunted targets." }
  ],
  rogue: [
    { level: 6, name: "Expertise Expansion", description: "More skills with doubled proficiency." },
    { level: 7, name: "Evasion", description: "Avoid area damage with successful Dexterity saves." },
    { level: 9, name: "Roguish Archetype Feature", description: "Subclass toolkit grows." },
    { level: 11, name: "Reliable Talent", description: "Treat low rolls as 10 on proficient checks." },
    { level: 14, name: "Blindsense", description: "Perceive hidden nearby creatures." },
    { level: 15, name: "Slippery Mind", description: "Wisdom save proficiency for mental resilience." },
    { level: 18, name: "Elusive", description: "Harder for enemies to gain attack advantage." },
    { level: 20, name: "Stroke of Luck", description: "Turn misses/failures into successful outcomes." }
  ],
  sorcerer: [
    { level: 6, name: "Sorcerous Origin Feature", description: "Mid-tier bloodline power." },
    { level: 10, name: "Metamagic Expansion", description: "Additional metamagic options unlock." },
    { level: 11, name: "High-Level Spellcasting", description: "Access to stronger spell tiers." },
    { level: 14, name: "Sorcerous Origin Feature", description: "High-impact origin ability." },
    { level: 17, name: "Top-Tier Spellcasting", description: "Late-game arcane capability unlocked." },
    { level: 18, name: "Sorcerous Origin Feature", description: "Final bloodline shaping feature." },
    { level: 20, name: "Sorcerous Restoration", description: "Recover sorcery points more reliably." }
  ],
  warlock: [
    { level: 6, name: "Patron Feature", description: "Subclass patron influence expands." },
    { level: 7, name: "Invocation Expansion", description: "Additional eldritch customization options." },
    { level: 11, name: "Mystic Arcanum (6th)", description: "One high-level spell known and cast once per long rest." },
    { level: 13, name: "Mystic Arcanum (7th)", description: "Expanded single-use top-tier magic." },
    { level: 15, name: "Mystic Arcanum (8th)", description: "Late-game warlock power spike." },
    { level: 17, name: "Mystic Arcanum (9th)", description: "Highest-tier pact magic expression." },
    { level: 20, name: "Eldritch Master", description: "Rapidly recover pact slots outside combat pressure." }
  ],
  wizard: [
    { level: 6, name: "Arcane Tradition Feature", description: "School specialization mid-tier feature." },
    { level: 10, name: "Arcane Tradition Feature", description: "Advanced school identity." },
    { level: 14, name: "Arcane Tradition Feature", description: "High-tier specialization effect." },
    { level: 18, name: "Spell Mastery", description: "Cast selected lower-level spells at will." },
    { level: 20, name: "Signature Spells", description: "Peak efficiency with chosen core spells." }
  ]
};

const THREE_FIVE_FEATURES_PASS4 = {
  barbarian: [
    { level: 6, name: "Trap Sense +2", description: "Improved reaction against traps." },
    { level: 7, name: "Damage Reduction 1/-", description: "Reduce incoming weapon damage." },
    { level: 8, name: "Rage 3/day", description: "Additional daily rage usage." },
    { level: 11, name: "Greater Rage", description: "Rage grants stronger combat bonuses." },
    { level: 14, name: "Indomitable Will", description: "Improved defenses against mental control." },
    { level: 17, name: "Tireless Rage", description: "Fatigue penalty from rage is reduced." },
    { level: 20, name: "Mighty Rage", description: "Final rage progression bonus." }
  ],
  bard: [
    { level: 6, name: "Suggestion (Music)", description: "Use bardic performance to compel behavior." },
    { level: 8, name: "Inspire Courage +2", description: "Improved morale bonuses to allies." },
    { level: 9, name: "Inspire Greatness", description: "Grant allies combat-focused temporary boosts." },
    { level: 12, name: "Song of Freedom", description: "Use music to break enchantments." },
    { level: 15, name: "Inspire Heroics", description: "Major defensive performance buff." },
    { level: 18, name: "Mass Suggestion", description: "Affect multiple targets via performance." },
    { level: 20, name: "Inspire Courage +4", description: "Peak morale support progression." }
  ],
  cleric: [
    { level: 6, name: "Turning Progression", description: "Higher effectiveness against undead." },
    { level: 8, name: "Domain Power Growth", description: "Stronger domain identity effects." },
    { level: 11, name: "Greater Turning Access", description: "Short burst of stronger turning influence." },
    { level: 14, name: "Divine Spell Potency", description: "Reliable high-level divine throughput." },
    { level: 17, name: "Domain Mastery", description: "Late-game domain expression." },
    { level: 20, name: "Avatar of Faith", description: "Capstone divine authority feature." }
  ],
  druid: [
    { level: 6, name: "Wild Shape (Large)", description: "Expand shapeshift forms to larger beasts." },
    { level: 8, name: "Wild Shape (Tiny)", description: "Gain small infiltration-oriented forms." },
    { level: 10, name: "Wild Shape (Elemental)", description: "Access elemental transformation options." },
    { level: 12, name: "Wild Shape Progression", description: "Improved flexibility and durability in forms." },
    { level: 15, name: "Timeless Body", description: "Reduced aging and bodily decline." },
    { level: 18, name: "Elemental Mastery", description: "High-tier elemental shaping capability." },
    { level: 20, name: "Nature's Mastery", description: "Final druidic capstone progression." }
  ],
  fighter: [
    { level: 6, name: "Bonus Feat", description: "Additional combat feat selection." },
    { level: 8, name: "Bonus Feat", description: "Further martial customization." },
    { level: 10, name: "Bonus Feat", description: "Expanded tactical toolkit." },
    { level: 12, name: "Bonus Feat", description: "Continued specialization." },
    { level: 14, name: "Bonus Feat", description: "High-level combat adaptation." },
    { level: 16, name: "Bonus Feat", description: "Late-game feat progression." },
    { level: 18, name: "Bonus Feat", description: "Near-capstone martial choice." },
    { level: 20, name: "Bonus Feat", description: "Final fighter bonus feat." }
  ],
  monk: [
    { level: 6, name: "Ki Strike (Magic)", description: "Unarmed attacks bypass magical resistance." },
    { level: 7, name: "Wholeness of Body", description: "Self-healing through disciplined focus." },
    { level: 10, name: "Ki Strike (Lawful)", description: "Unarmed strikes gain lawful alignment power." },
    { level: 12, name: "Abundant Step", description: "Short-range teleport mobility option." },
    { level: 13, name: "Diamond Body", description: "Immunity to poison effects." },
    { level: 15, name: "Quivering Palm", description: "Delayed high-risk finishing technique." },
    { level: 19, name: "Empty Body", description: "Powerful defensive spiritual state." },
    { level: 20, name: "Perfect Self", description: "Final expression of monk discipline." }
  ],
  paladin: [
    { level: 6, name: "Remove Disease (1/week)", description: "Cure disease through divine touch." },
    { level: 8, name: "Remove Disease (2/week)", description: "Additional weekly disease cures." },
    { level: 11, name: "Aura Progression", description: "Improved paladin aura presence." },
    { level: 14, name: "Remove Disease (3/week)", description: "Further disease-cleansing capacity." },
    { level: 17, name: "Remove Disease (4/week)", description: "High-frequency divine cleansing." },
    { level: 20, name: "Holy Champion", description: "Capstone holy warrior expression." }
  ],
  ranger: [
    { level: 6, name: "Improved Combat Style", description: "Second-tier combat style benefit." },
    { level: 8, name: "Swift Tracker", description: "Track efficiently without losing pace." },
    { level: 11, name: "Combat Style Mastery", description: "High-level style option unlock." },
    { level: 13, name: "Camouflage", description: "Blend with natural terrain more effectively." },
    { level: 17, name: "Hide in Plain Sight", description: "Stealth without full cover in favored terrain." },
    { level: 20, name: "Master Hunter", description: "Capstone predator efficiency feature." }
  ],
  rogue: [
    { level: 6, name: "Trap Sense +2", description: "Improved defensive sense versus traps." },
    { level: 8, name: "Improved Uncanny Dodge", description: "Harder to flank and ambush." },
    { level: 10, name: "Special Ability", description: "Choose high-impact rogue technique." },
    { level: 13, name: "Sneak Attack Progression", description: "Increased precision damage output." },
    { level: 16, name: "Special Ability", description: "Additional advanced rogue feature." },
    { level: 19, name: "Special Ability", description: "Late-game rogue flexibility." },
    { level: 20, name: "Master Opportunist", description: "Capstone precision and positioning potential." }
  ],
  sorcerer: [
    { level: 6, name: "Arcane Progression", description: "Improved spontaneous arcane throughput." },
    { level: 8, name: "Familiar Resilience", description: "Stronger magical companion endurance." },
    { level: 10, name: "Metamagic Affinity", description: "Better high-level spell adaptation." },
    { level: 12, name: "Arcane Progression", description: "Continued spell progression scaling." },
    { level: 15, name: "Arcane Surge", description: "Late-tier spontaneous magic spike." },
    { level: 18, name: "Arcane Mastery", description: "Near-capstone spellcasting reach." },
    { level: 20, name: "Arcane Apotheosis", description: "Final sorcerous culmination." }
  ],
  wizard: [
    { level: 6, name: "School Mastery", description: "Arcane school specialization refinement." },
    { level: 10, name: "Bonus Feat", description: "Wizard bonus feat progression." },
    { level: 12, name: "School Mastery", description: "Advanced school-specific utility." },
    { level: 15, name: "Bonus Feat", description: "Further late-game build specialization." },
    { level: 18, name: "School Mastery", description: "Near-capstone school expression." },
    { level: 20, name: "Bonus Feat", description: "Final wizard bonus feat." }
  ]
};

function mergeFeaturesByLevel(baseFeatures, extraFeatures) {
  const seen = new Set();
  const merged = [];
  for (const feature of [...(baseFeatures || []), ...(extraFeatures || [])]) {
    const key = `${feature.level}:${feature.name}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    merged.push(feature);
  }
  return merged.sort((a, b) => {
    if (a.level !== b.level) {
      return a.level - b.level;
    }
    return a.name.localeCompare(b.name);
  });
}

function applyFeaturePass(classes, featureMap) {
  return (classes || []).map((entry) => ({
    ...entry,
    featuresByLevel: mergeFeaturesByLevel(entry.featuresByLevel, featureMap[entry.slug] || [])
  }));
}

const FIVE_E_CLASSES_PASS4 = applyFeaturePass(FIVE_E_CLASSES, FIVE_E_FEATURES_PASS4);
const THREE_FIVE_CLASSES_PASS4 = applyFeaturePass(THREE_FIVE_CLASSES, THREE_FIVE_FEATURES_PASS4);

const FIVE_E_CLASSES_2024 = FIVE_E_CLASSES_PASS4.map((cls) => {
  if (cls.slug !== "fighter" && cls.slug !== "ranger") {
    return cls;
  }

  return {
    ...cls,
    featuresByLevel: cls.featuresByLevel.map((feature) => {
      if (cls.slug === "fighter" && feature.name === "Fighting Style") {
        return { ...feature, description: "Choose style and weapon mastery options." };
      }
      if (cls.slug === "ranger" && feature.name === "Favored Enemy") {
        return { ...feature, name: "Favored Foe", description: "Mark and pressure priority enemies." };
      }
      return feature;
    })
  };
});

function mergeBySlug(baseCollection, extraCollection) {
  const seen = new Set();
  const output = [];
  for (const entry of [...(baseCollection || []), ...(extraCollection || [])]) {
    if (!entry?.slug || seen.has(entry.slug)) {
      continue;
    }
    seen.add(entry.slug);
    output.push(entry);
  }
  return output;
}

const COVERAGE_TARGETS = {
  "5e-2024": {
    spells: 170,
    items: 115,
    feats: 48,
    classes: 12,
    species: 7,
    backgrounds: 6
  },
  "5e-2014": {
    spells: 160,
    items: 110,
    feats: 45,
    classes: 12,
    species: 6,
    backgrounds: 6
  },
  "3.5e": {
    spells: 190,
    items: 130,
    feats: 70,
    classes: 11,
    species: 7,
    backgrounds: 5
  }
};

const FEATS_5E_ALL = mergeBySlug(FEATS_5E, [...EXTRA_5E_FEATS, ...EXTRA_5E_FEATS_PASS2, ...EXTRA_5E_FEATS_PASS3]);
const FEATS_35_ALL = mergeBySlug(FEATS_35, [...EXTRA_35_FEATS, ...EXTRA_35_FEATS_PASS2, ...EXTRA_35_FEATS_PASS3]);
const ITEMS_5E_ALL = mergeBySlug(ITEMS_5E, [...EXTRA_5E_ITEMS, ...EXTRA_5E_ITEMS_PASS2, ...EXTRA_5E_ITEMS_PASS3]);
const ITEMS_35_ALL = mergeBySlug(ITEMS_35, [...EXTRA_35_ITEMS, ...EXTRA_35_ITEMS_PASS2, ...EXTRA_35_ITEMS_PASS3]);
const SPELLS_5E_ALL = mergeBySlug(SPELLS_5E, [...EXTRA_5E_SPELLS, ...EXTRA_5E_SPELLS_PASS2, ...EXTRA_5E_SPELLS_PASS3]);
const SPELLS_35_ALL = mergeBySlug(SPELLS_35, [...EXTRA_35_SPELLS, ...EXTRA_35_SPELLS_PASS2, ...EXTRA_35_SPELLS_PASS3]);

export const RULESETS = [
  {
    id: "5e-2024",
    name: "Dungeons & Dragons 5e (2024 SRD 5.2.1)",
    shortName: "5e 2024",
    editionYear: 2024,
    family: "5e",
    licenseNotice: "Uses SRD 5.2.1 reference material under Creative Commons Attribution 4.0 (CC-BY-4.0).",
    beginnerTips: [
      "Pick class first, then place high scores in its primary abilities.",
      "Background ability bonuses matter in the 2024 rules flow.",
      "Start with a focused spell list and expand as you level."
    ],
    levelBounds: { min: 1, max: 20 },
    abilityMethods: ABILITY_METHODS_5E,
    alignments: ALIGNMENTS,
    skills: decorateCollection("5e24-skill", SKILLS_5E),
    species: decorateCollection("5e24-species", SPECIES_5E_2024),
    backgrounds: decorateCollection("5e24-background", BACKGROUNDS_5E_2024),
    classes: decorateClasses("5e24", FIVE_E_CLASSES_2024),
    feats: decorateCollection("5e24-feat", FEATS_5E_ALL),
    items: decorateCollection("5e24-item", ITEMS_5E_ALL),
    spells: decorateCollection("5e24-spell", SPELLS_5E_ALL)
  },
  {
    id: "5e-2014",
    name: "Dungeons & Dragons 5e (2014 SRD 5.1)",
    shortName: "5e 2014",
    editionYear: 2014,
    family: "5e",
    licenseNotice: "Uses SRD 5.1 reference material under Creative Commons Attribution 4.0 (CC-BY-4.0).",
    beginnerTips: [
      "Standard array is the quickest legal option for new players.",
      "Fighter, Rogue, and Cleric are smooth first-time classes.",
      "Pick two to four signature spells, then add utility."
    ],
    levelBounds: { min: 1, max: 20 },
    abilityMethods: ABILITY_METHODS_5E,
    alignments: ALIGNMENTS,
    skills: decorateCollection("5e14-skill", SKILLS_5E),
    species: decorateCollection("5e14-species", SPECIES_5E_2014),
    backgrounds: decorateCollection("5e14-background", BACKGROUNDS_5E_2014),
    classes: decorateClasses("5e14", FIVE_E_CLASSES_PASS4),
    feats: decorateCollection("5e14-feat", FEATS_5E_ALL),
    items: decorateCollection("5e14-item", ITEMS_5E_ALL),
    spells: decorateCollection("5e14-spell", SPELLS_5E_ALL)
  },
  {
    id: "3.5e",
    name: "Dungeons & Dragons 3.5e (SRD)",
    shortName: "3.5e",
    editionYear: 2003,
    family: "3.5e",
    licenseNotice: "References D&D 3.5 SRD content published under OGL-era terms. Verify legal scope for non-SRD supplements.",
    beginnerTips: [
      "Skill points and feat planning strongly affect 3.5 builds.",
      "Martial classes are usually easier for first-time 3.5 players.",
      "Use point-buy and keep your first spell list compact."
    ],
    levelBounds: { min: 1, max: 20 },
    abilityMethods: ABILITY_METHODS_35,
    alignments: ALIGNMENTS,
    skills: decorateCollection("35-skill", SKILLS_35),
    species: decorateCollection("35-race", RACES_35),
    backgrounds: decorateCollection("35-background", BACKGROUNDS_35),
    classes: decorateClasses("35", THREE_FIVE_CLASSES_PASS4),
    feats: decorateCollection("35-feat", FEATS_35_ALL),
    items: decorateCollection("35-item", ITEMS_35_ALL),
    spells: decorateCollection("35-spell", SPELLS_35_ALL)
  }
];

function percent(part, whole) {
  if (!whole) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round((part / whole) * 100)));
}

export function getCoverageReport(rulesetId) {
  const ruleset = getRulesetById(rulesetId);
  const targets = COVERAGE_TARGETS[ruleset.id] || {};
  const counts = {
    spells: ruleset.spells.length,
    items: ruleset.items.length,
    feats: ruleset.feats.length,
    classes: ruleset.classes.length,
    species: ruleset.species.length,
    backgrounds: ruleset.backgrounds.length
  };

  const classesWithFeatures = ruleset.classes.map((entry) => {
    const maxFeatureLevel = Math.max(0, ...(entry.featuresByLevel || []).map((feature) => feature.level || 0));
    return {
      className: entry.name,
      maxFeatureLevel
    };
  });

  const averageFeatureLevelCoverage = classesWithFeatures.length
    ? Math.round(
        (classesWithFeatures.reduce((sum, entry) => sum + Math.min(20, entry.maxFeatureLevel), 0) /
          (classesWithFeatures.length * 20)) *
          100
      )
    : 0;

  return {
    rulesetId: ruleset.id,
    counts,
    targets,
    percentages: {
      spells: percent(counts.spells, targets.spells || counts.spells || 1),
      items: percent(counts.items, targets.items || counts.items || 1),
      feats: percent(counts.feats, targets.feats || counts.feats || 1),
      classes: percent(counts.classes, targets.classes || counts.classes || 1),
      species: percent(counts.species, targets.species || counts.species || 1),
      backgrounds: percent(counts.backgrounds, targets.backgrounds || counts.backgrounds || 1),
      classFeatureProgression: averageFeatureLevelCoverage
    },
    classesWithFeatures
  };
}

export function getRulesetById(rulesetId) {
  return RULESETS.find((entry) => entry.id === rulesetId) || RULESETS[0];
}

export function findById(collection, id) {
  return (collection || []).find((entry) => entry.id === id) || null;
}

export function findClassById(ruleset, classId) {
  return findById(ruleset?.classes, classId);
}

export function findSubclassById(characterClass, subclassId) {
  return (characterClass?.subclasses || []).find((entry) => entry.id === subclassId) || null;
}

export function getAbilityLabel(abilityKey) {
  return ABILITY_NAMES.find((entry) => entry.key === abilityKey)?.label || abilityKey.toUpperCase();
}
