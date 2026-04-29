(() => {
  // src/data/expansions.js
  var EXTRA_5E_FEATS = [
    { slug: "mobile", name: "Mobile", description: "Higher speed and safer hit-and-run movement." },
    { slug: "observant", name: "Observant", description: "Improves passive awareness and detail reading." },
    { slug: "sentinel", name: "Sentinel", description: "Lock down enemies that try to move away." },
    { slug: "ritual-caster", name: "Ritual Caster", description: "Adds utility spellcasting via ritual book." },
    { slug: "elemental-adept", name: "Elemental Adept", description: "Improve damage consistency for one element." },
    { slug: "martial-adept", name: "Martial Adept", description: "Gain a battle maneuver and superiority die." },
    { slug: "magic-initiate", name: "Magic Initiate", description: "Pick up cantrips and a low-level spell." },
    { slug: "skulker", name: "Skulker", description: "Stealth-focused combat and ranged hiding benefits." }
  ];
  var EXTRA_35_FEATS = [
    { slug: "alertness", name: "Alertness", description: "Bonuses to Listen and Spot checks." },
    { slug: "combat-expertise", name: "Combat Expertise", description: "Trade attack bonus for Armor Class." },
    { slug: "great-fortitude", name: "Great Fortitude", description: "Bonus on Fortitude saves." },
    { slug: "iron-will", name: "Iron Will", description: "Bonus on Will saves." },
    { slug: "lightning-reflexes", name: "Lightning Reflexes", description: "Bonus on Reflex saves." },
    { slug: "improved-trip", name: "Improved Trip", description: "Trip opponents more effectively." },
    { slug: "spring-attack", name: "Spring Attack", description: "Move, attack, and keep moving in melee." },
    { slug: "weapon-specialization", name: "Weapon Specialization", description: "Damage bonus with selected weapon." }
  ];
  var EXTRA_5E_ITEMS = [
    { slug: "battleaxe", name: "Battleaxe", category: "Weapon", cost: "10 gp", weight: 4, properties: "1d8 slashing, versatile (1d10)" },
    { slug: "warhammer", name: "Warhammer", category: "Weapon", cost: "15 gp", weight: 2, properties: "1d8 bludgeoning, versatile (1d10)" },
    { slug: "maul", name: "Maul", category: "Weapon", cost: "10 gp", weight: 10, properties: "2d6 bludgeoning, heavy, two-handed" },
    { slug: "glaive", name: "Glaive", category: "Weapon", cost: "20 gp", weight: 6, properties: "1d10 slashing, heavy, reach, two-handed" },
    { slug: "halberd", name: "Halberd", category: "Weapon", cost: "20 gp", weight: 6, properties: "1d10 slashing, heavy, reach, two-handed" },
    { slug: "handaxe", name: "Handaxe", category: "Weapon", cost: "5 gp", weight: 2, properties: "1d6 slashing, light, thrown" },
    { slug: "javelin", name: "Javelin", category: "Weapon", cost: "5 sp", weight: 2, properties: "1d6 piercing, thrown" },
    { slug: "light-crossbow", name: "Light Crossbow", category: "Weapon", cost: "25 gp", weight: 5, properties: "1d8 piercing, loading, two-handed" },
    { slug: "heavy-crossbow", name: "Heavy Crossbow", category: "Weapon", cost: "50 gp", weight: 18, properties: "1d10 piercing, heavy, loading, two-handed" },
    { slug: "sling", name: "Sling", category: "Weapon", cost: "1 sp", weight: 0, properties: "1d4 bludgeoning, ammunition" },
    { slug: "pike", name: "Pike", category: "Weapon", cost: "5 gp", weight: 18, properties: "1d10 piercing, heavy, reach, two-handed" },
    { slug: "morningstar", name: "Morningstar", category: "Weapon", cost: "15 gp", weight: 4, properties: "1d8 piercing" },
    { slug: "shortsword", name: "Shortsword", category: "Weapon", cost: "10 gp", weight: 2, properties: "1d6 piercing, finesse, light" },
    { slug: "scimitar", name: "Scimitar", category: "Weapon", cost: "25 gp", weight: 3, properties: "1d6 slashing, finesse, light" },
    { slug: "hide-armor", name: "Hide Armor", category: "Armor", cost: "10 gp", weight: 12, properties: "AC 12 + Dex (max 2)" },
    { slug: "scale-mail", name: "Scale Mail", category: "Armor", cost: "50 gp", weight: 45, properties: "AC 14 + Dex (max 2)" },
    { slug: "breastplate", name: "Breastplate", category: "Armor", cost: "400 gp", weight: 20, properties: "AC 14 + Dex (max 2)" },
    { slug: "half-plate", name: "Half Plate", category: "Armor", cost: "750 gp", weight: 40, properties: "AC 15 + Dex (max 2)" },
    { slug: "splint", name: "Splint", category: "Armor", cost: "200 gp", weight: 60, properties: "AC 17" },
    { slug: "plate", name: "Plate", category: "Armor", cost: "1500 gp", weight: 65, properties: "AC 18" },
    { slug: "disguise-kit", name: "Disguise Kit", category: "Tool", cost: "25 gp", weight: 3, properties: "Identity and disguise work" },
    { slug: "herbalism-kit", name: "Herbalism Kit", category: "Tool", cost: "5 gp", weight: 3, properties: "Craft basic herbal remedies" },
    { slug: "calligraphers-supplies", name: "Calligrapher's Supplies", category: "Tool", cost: "10 gp", weight: 5, properties: "Fine writing and scroll work" },
    { slug: "tinkers-tools", name: "Tinker's Tools", category: "Tool", cost: "50 gp", weight: 10, properties: "Repair and craft small devices" },
    { slug: "alchemists-fire", name: "Alchemist's Fire", category: "Adventuring Gear", cost: "50 gp", weight: 1, properties: "Thrown flask of persistent fire" },
    { slug: "acid-vial", name: "Acid (Vial)", category: "Adventuring Gear", cost: "25 gp", weight: 1, properties: "Thrown acid splash" },
    { slug: "ball-bearings", name: "Ball Bearings", category: "Adventuring Gear", cost: "1 gp", weight: 2, properties: "Create slippery battlefield zones" },
    { slug: "caltrops", name: "Caltrops", category: "Adventuring Gear", cost: "1 gp", weight: 2, properties: "Slow pursuing enemies" },
    { slug: "lantern-hooded", name: "Hooded Lantern", category: "Adventuring Gear", cost: "5 gp", weight: 2, properties: "Directional light source" },
    { slug: "oil-flask", name: "Oil (Flask)", category: "Adventuring Gear", cost: "1 sp", weight: 1, properties: "Fuel or ignition setup" }
  ];
  var EXTRA_35_ITEMS = [
    { slug: "battleaxe", name: "Battleaxe", category: "Weapon", cost: "10 gp", weight: 6, properties: "1d8 slashing" },
    { slug: "warhammer", name: "Warhammer", category: "Weapon", cost: "12 gp", weight: 5, properties: "1d8 bludgeoning" },
    { slug: "morningstar", name: "Morningstar", category: "Weapon", cost: "8 gp", weight: 6, properties: "1d8 piercing" },
    { slug: "mace-heavy", name: "Heavy Mace", category: "Weapon", cost: "12 gp", weight: 8, properties: "1d8 bludgeoning" },
    { slug: "halberd", name: "Halberd", category: "Weapon", cost: "10 gp", weight: 12, properties: "1d10 slashing, reach" },
    { slug: "glaive", name: "Glaive", category: "Weapon", cost: "8 gp", weight: 10, properties: "1d10 slashing, reach" },
    { slug: "greataxe", name: "Greataxe", category: "Weapon", cost: "20 gp", weight: 12, properties: "1d12 slashing" },
    { slug: "shortsword", name: "Shortsword", category: "Weapon", cost: "10 gp", weight: 2, properties: "1d6 piercing" },
    { slug: "rapier", name: "Rapier", category: "Weapon", cost: "20 gp", weight: 2, properties: "1d6 piercing" },
    { slug: "scimitar", name: "Scimitar", category: "Weapon", cost: "15 gp", weight: 4, properties: "1d6 slashing" },
    { slug: "handaxe", name: "Handaxe", category: "Weapon", cost: "6 gp", weight: 3, properties: "1d6 slashing, thrown" },
    { slug: "javelin", name: "Javelin", category: "Weapon", cost: "1 gp", weight: 2, properties: "1d6 piercing, thrown" },
    { slug: "crossbow-heavy", name: "Heavy Crossbow", category: "Weapon", cost: "50 gp", weight: 8, properties: "1d10 piercing" },
    { slug: "sling", name: "Sling", category: "Weapon", cost: "0 gp", weight: 0, properties: "1d4 bludgeoning" },
    { slug: "studded-leather", name: "Studded Leather", category: "Armor", cost: "25 gp", weight: 20, properties: "AC +3" },
    { slug: "scale-mail", name: "Scale Mail", category: "Armor", cost: "50 gp", weight: 30, properties: "AC +4" },
    { slug: "breastplate", name: "Breastplate", category: "Armor", cost: "200 gp", weight: 30, properties: "AC +5" },
    { slug: "banded-mail", name: "Banded Mail", category: "Armor", cost: "250 gp", weight: 35, properties: "AC +6" },
    { slug: "splint-mail", name: "Splint Mail", category: "Armor", cost: "200 gp", weight: 45, properties: "AC +7" },
    { slug: "shield-light-wood", name: "Light Wooden Shield", category: "Shield", cost: "3 gp", weight: 5, properties: "Shield +1" },
    { slug: "shield-heavy-wood", name: "Heavy Wooden Shield", category: "Shield", cost: "7 gp", weight: 10, properties: "Shield +2" },
    { slug: "thieves-tools", name: "Thieves' Tools", category: "Tool", cost: "30 gp", weight: 1, properties: "Disable locks and traps" },
    { slug: "healers-kit", name: "Healer's Kit", category: "Tool", cost: "50 gp", weight: 1, properties: "First aid and stabilization" },
    { slug: "alchemists-lab", name: "Alchemist's Lab", category: "Tool", cost: "500 gp", weight: 40, properties: "Craft alchemical items" },
    { slug: "holy-water", name: "Holy Water", category: "Adventuring Gear", cost: "25 gp", weight: 1, properties: "Damage/ward against undead" },
    { slug: "sunrod", name: "Sunrod", category: "Adventuring Gear", cost: "2 gp", weight: 1, properties: "Bright light source" },
    { slug: "torch", name: "Torch", category: "Adventuring Gear", cost: "1 cp", weight: 1, properties: "Basic light source" },
    { slug: "tinderbox", name: "Tinderbox", category: "Adventuring Gear", cost: "1 gp", weight: 1, properties: "Start fires" },
    { slug: "signal-whistle", name: "Signal Whistle", category: "Adventuring Gear", cost: "8 sp", weight: 0, properties: "Coordinate party movement" },
    { slug: "waterskin", name: "Waterskin", category: "Adventuring Gear", cost: "1 gp", weight: 4, properties: "Carry water" }
  ];
  var EXTRA_5E_SPELLS = [
    { slug: "blade-ward", name: "Blade Ward", level: 0, school: "Abjuration", castingTime: "1 action", range: "Self", components: "V, S", duration: "1 round", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Gain temporary resistance to weapon damage." },
    { slug: "chill-touch", name: "Chill Touch", level: 0, school: "Necromancy", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "1 round", classes: ["sorcerer", "warlock", "wizard"], description: "Necrotic spell attack blocks healing." },
    { slug: "dancing-lights", name: "Dancing Lights", level: 0, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["bard", "sorcerer", "wizard"], description: "Create and move floating lights." },
    { slug: "friends", name: "Friends", level: 0, school: "Enchantment", castingTime: "1 action", range: "Self", components: "S, M", duration: "Concentration, 1 minute", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Gain advantage on Charisma checks with one creature." },
    { slug: "light", name: "Light", level: 0, school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, M", duration: "1 hour", classes: ["bard", "cleric", "sorcerer", "wizard"], description: "Object emits bright light." },
    { slug: "poison-spray", name: "Poison Spray", level: 0, school: "Conjuration", castingTime: "1 action", range: "10 feet", components: "V, S", duration: "Instantaneous", classes: ["druid", "sorcerer", "warlock", "wizard"], description: "Short-range poison blast." },
    { slug: "prestidigitation", name: "Prestidigitation", level: 0, school: "Transmutation", castingTime: "1 action", range: "10 feet", components: "V, S", duration: "Up to 1 hour", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Small magical utility effects." },
    { slug: "resistance", name: "Resistance", level: 0, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["cleric", "druid"], description: "Add 1d4 to one saving throw." },
    { slug: "shocking-grasp", name: "Shocking Grasp", level: 0, school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous", classes: ["sorcerer", "wizard"], description: "Melee lightning attack denies reactions." },
    { slug: "thorn-whip", name: "Thorn Whip", level: 0, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Instantaneous", classes: ["druid"], description: "Whip attack pulls target closer." },
    { slug: "vicious-mockery", name: "Vicious Mockery", level: 0, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V", duration: "Instantaneous", classes: ["bard"], description: "Psychic insult imposes attack disadvantage." },
    { slug: "word-of-radiance", name: "Word of Radiance", level: 0, school: "Evocation", castingTime: "1 action", range: "5 feet", components: "V, M", duration: "Instantaneous", classes: ["cleric"], description: "Radiant burst against nearby foes." },
    { slug: "toll-the-dead", name: "Toll the Dead", level: 0, school: "Necromancy", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous", classes: ["cleric", "warlock", "wizard"], description: "Necrotic damage based on target condition." },
    { slug: "bane", name: "Bane", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["bard", "cleric"], description: "Targets subtract 1d4 from attacks and saves." },
    { slug: "bless", name: "Bless", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["cleric", "paladin"], description: "Allies add 1d4 to attacks and saves." },
    { slug: "command", name: "Command", level: 1, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V", duration: "1 round", classes: ["cleric", "paladin"], description: "Force target to obey one-word command." },
    { slug: "detect-magic", name: "Detect Magic", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S", duration: "Concentration, 10 minutes", classes: ["bard", "cleric", "druid", "paladin", "ranger", "sorcerer", "wizard"], description: "Sense nearby magical auras." },
    { slug: "disguise-self", name: "Disguise Self", level: 1, school: "Illusion", castingTime: "1 action", range: "Self", components: "V, S", duration: "1 hour", classes: ["bard", "sorcerer", "wizard"], description: "Alter your appearance temporarily." },
    { slug: "feather-fall", name: "Feather Fall", level: 1, school: "Transmutation", castingTime: "1 reaction", range: "60 feet", components: "V, M", duration: "1 minute", classes: ["bard", "sorcerer", "wizard"], description: "Slow a falling creature safely." },
    { slug: "fog-cloud", name: "Fog Cloud", level: 1, school: "Conjuration", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Concentration, 1 hour", classes: ["druid", "ranger", "sorcerer", "wizard"], description: "Create heavily obscured area." },
    { slug: "heroism", name: "Heroism", level: 1, school: "Enchantment", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Concentration, 1 minute", classes: ["bard", "paladin"], description: "Target gains temporary HP and fear immunity." },
    { slug: "identify", name: "Identify", level: 1, school: "Divination", castingTime: "1 minute", range: "Touch", components: "V, S, M", duration: "Instantaneous", classes: ["bard", "wizard"], description: "Learn magical properties of object." },
    { slug: "protection-from-evil-and-good", name: "Protection from Evil and Good", level: 1, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, 10 minutes", classes: ["cleric", "paladin", "warlock", "wizard"], description: "Defensive ward against common creature types." },
    { slug: "sanctuary", name: "Sanctuary", level: 1, school: "Abjuration", castingTime: "1 bonus action", range: "30 feet", components: "V, S, M", duration: "1 minute", classes: ["cleric"], description: "Wards creature from direct attacks." },
    { slug: "shield-of-faith", name: "Shield of Faith", level: 1, school: "Abjuration", castingTime: "1 bonus action", range: "60 feet", components: "V, S, M", duration: "Concentration, 10 minutes", classes: ["cleric", "paladin"], description: "Grant +2 AC to target." },
    { slug: "silent-image", name: "Silent Image", level: 1, school: "Illusion", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, 10 minutes", classes: ["bard", "sorcerer", "wizard"], description: "Create controllable visual illusion." },
    { slug: "tashas-hideous-laughter", name: "Tasha's Hideous Laughter", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["bard", "wizard"], description: "Incapacitate target with uncontrollable laughter." },
    { slug: "hold-person", name: "Hold Person", level: 2, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["bard", "cleric", "druid", "sorcerer", "warlock", "wizard"], description: "Paralyze humanoid target." },
    { slug: "levitate", name: "Levitate", level: 2, school: "Transmutation", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, 10 minutes", classes: ["sorcerer", "wizard"], description: "Raise creature or object vertically." },
    { slug: "mirror-image", name: "Mirror Image", level: 2, school: "Illusion", castingTime: "1 action", range: "Self", components: "V, S", duration: "1 minute", classes: ["sorcerer", "wizard"], description: "Create duplicates to avoid hits." },
    { slug: "moonbeam", name: "Moonbeam", level: 2, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["druid"], description: "Radiant beam damages creatures each turn." },
    { slug: "pass-without-trace", name: "Pass without Trace", level: 2, school: "Abjuration", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "Concentration, 1 hour", classes: ["druid", "ranger"], description: "Stealth bonus and tracks suppression for group." },
    { slug: "ray-of-enfeeblement", name: "Ray of Enfeeblement", level: 2, school: "Necromancy", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Concentration, 1 minute", classes: ["warlock", "wizard"], description: "Weaken target's weapon attacks." },
    { slug: "suggestion", name: "Suggestion", level: 2, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, M", duration: "Concentration, 8 hours", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Influence target to follow plausible course of action." },
    { slug: "water-breathing", name: "Water Breathing", level: 3, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "24 hours", classes: ["druid", "ranger", "sorcerer", "wizard"], description: "Enable underwater breathing." },
    { slug: "remove-curse", name: "Remove Curse", level: 3, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous", classes: ["cleric", "paladin", "warlock", "wizard"], description: "End curses on target." },
    { slug: "lightning-bolt", name: "Lightning Bolt", level: 3, school: "Evocation", castingTime: "1 action", range: "Self (100-foot line)", components: "V, S, M", duration: "Instantaneous", classes: ["sorcerer", "wizard"], description: "Line of heavy lightning damage." },
    { slug: "hypnotic-pattern", name: "Hypnotic Pattern", level: 3, school: "Illusion", castingTime: "1 action", range: "120 feet", components: "S, M", duration: "Concentration, 1 minute", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Control spell that incapacitates many targets." },
    { slug: "sleet-storm", name: "Sleet Storm", level: 3, school: "Conjuration", castingTime: "1 action", range: "150 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["druid", "sorcerer", "wizard"], description: "Large-area disruption and difficult terrain." }
  ];
  var EXTRA_35_SPELLS = [
    { slug: "daze", name: "Daze", level: 0, school: "Enchantment", castingTime: "1 standard action", range: "Close", components: "V, S, M", duration: "1 round", classes: ["bard", "wizard", "sorcerer"], description: "Daze a humanoid with low HD." },
    { slug: "flare", name: "Flare", level: 0, school: "Evocation", castingTime: "1 standard action", range: "Close", components: "V", duration: "Instantaneous", classes: ["cleric", "druid", "bard"], description: "Light burst dazzles target." },
    { slug: "read-magic", name: "Read Magic", level: 0, school: "Divination", castingTime: "1 standard action", range: "Personal", components: "V, S, F", duration: "10 min/level", classes: ["wizard", "sorcerer", "bard"], description: "Read magical inscriptions and scrolls." },
    { slug: "resistance", name: "Resistance", level: 0, school: "Abjuration", castingTime: "1 standard action", range: "Touch", components: "V, S, M", duration: "1 minute", classes: ["cleric", "druid", "bard"], description: "Minor save bonus to target." },
    { slug: "virtue", name: "Virtue", level: 0, school: "Transmutation", castingTime: "1 standard action", range: "Touch", components: "V, S, DF", duration: "1 minute", classes: ["cleric", "druid"], description: "Gain small temporary HP buffer." },
    { slug: "command", name: "Command", level: 1, school: "Enchantment", castingTime: "1 standard action", range: "Close", components: "V", duration: "1 round", classes: ["cleric", "paladin"], description: "Compel target with one-word order." },
    { slug: "comprehend-languages", name: "Comprehend Languages", level: 1, school: "Divination", castingTime: "1 standard action", range: "Personal", components: "V, S, M", duration: "10 min/level", classes: ["bard", "wizard", "sorcerer"], description: "Understand written and spoken languages." },
    { slug: "feather-fall", name: "Feather Fall", level: 1, school: "Transmutation", castingTime: "Immediate", range: "Close", components: "V", duration: "1 round/level", classes: ["bard", "wizard", "sorcerer"], description: "Slow falling creatures." },
    { slug: "mage-armor", name: "Mage Armor", level: 1, school: "Conjuration", castingTime: "1 standard action", range: "Touch", components: "V, S, F", duration: "1 hour/level", classes: ["wizard", "sorcerer"], description: "Grant armor bonus without armor." },
    { slug: "protection-from-evil", name: "Protection from Evil", level: 1, school: "Abjuration", castingTime: "1 standard action", range: "Touch", components: "V, S, M, DF", duration: "1 min/level", classes: ["cleric", "paladin", "wizard", "sorcerer"], description: "Defensive ward against evil creatures." },
    { slug: "shield", name: "Shield", level: 1, school: "Abjuration", castingTime: "1 standard action", range: "Personal", components: "V, S", duration: "1 min/level", classes: ["wizard", "sorcerer"], description: "Force shield grants AC bonus." },
    { slug: "silent-image", name: "Silent Image", level: 1, school: "Illusion", castingTime: "1 standard action", range: "Long", components: "V, S, F", duration: "Concentration", classes: ["bard", "wizard", "sorcerer"], description: "Create visual illusion for tactics." },
    { slug: "alter-self", name: "Alter Self", level: 2, school: "Transmutation", castingTime: "1 standard action", range: "Personal", components: "V, S", duration: "10 min/level", classes: ["wizard", "sorcerer"], description: "Assume limited alternate form." },
    { slug: "blindness-deafness", name: "Blindness/Deafness", level: 2, school: "Necromancy", castingTime: "1 standard action", range: "Close", components: "V", duration: "Permanent", classes: ["bard", "cleric", "wizard", "sorcerer"], description: "Afflict target with blindness or deafness." },
    { slug: "bulls-strength", name: "Bull's Strength", level: 2, school: "Transmutation", castingTime: "1 standard action", range: "Touch", components: "V, S, M", duration: "1 min/level", classes: ["cleric", "druid", "wizard", "sorcerer"], description: "Enhancement bonus to Strength." },
    { slug: "cats-grace", name: "Cat's Grace", level: 2, school: "Transmutation", castingTime: "1 standard action", range: "Touch", components: "V, S, M", duration: "1 min/level", classes: ["bard", "druid", "wizard", "sorcerer"], description: "Enhancement bonus to Dexterity." },
    { slug: "cure-moderate-wounds", name: "Cure Moderate Wounds", level: 2, school: "Conjuration", castingTime: "1 standard action", range: "Touch", components: "V, S", duration: "Instantaneous", classes: ["bard", "cleric", "druid"], description: "Heal moderate damage." },
    { slug: "darkness", name: "Darkness", level: 2, school: "Evocation", castingTime: "1 standard action", range: "Touch", components: "V, M", duration: "10 min/level", classes: ["bard", "cleric", "wizard", "sorcerer"], description: "Create shadowy illumination area." },
    { slug: "foxs-cunning", name: "Fox's Cunning", level: 2, school: "Transmutation", castingTime: "1 standard action", range: "Touch", components: "V, S, M", duration: "1 min/level", classes: ["bard", "wizard", "sorcerer"], description: "Enhancement bonus to Intelligence." },
    { slug: "invisibility", name: "Invisibility", level: 2, school: "Illusion", castingTime: "1 standard action", range: "Touch", components: "V, S, M", duration: "1 min/level", classes: ["bard", "wizard", "sorcerer"], description: "Make creature unseen." },
    { slug: "knock", name: "Knock", level: 2, school: "Transmutation", castingTime: "1 standard action", range: "Medium", components: "V", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Open locked or sealed objects." },
    { slug: "remove-paralysis", name: "Remove Paralysis", level: 2, school: "Conjuration", castingTime: "1 standard action", range: "Close", components: "V, S", duration: "Instantaneous", classes: ["cleric", "paladin"], description: "Free one or more paralyzed creatures." },
    { slug: "see-invisibility", name: "See Invisibility", level: 2, school: "Divination", castingTime: "1 standard action", range: "Personal", components: "V, S, M", duration: "10 min/level", classes: ["bard", "wizard", "sorcerer"], description: "Perceive invisible creatures." },
    { slug: "clairaudience-clairvoyance", name: "Clairaudience/Clairvoyance", level: 3, school: "Divination", castingTime: "10 minutes", range: "Long", components: "V, S, F", duration: "1 min/level", classes: ["bard", "cleric", "wizard", "sorcerer"], description: "Remote sensing at chosen location." },
    { slug: "daylight", name: "Daylight", level: 3, school: "Evocation", castingTime: "1 standard action", range: "Touch", components: "V, S", duration: "10 min/level", classes: ["bard", "cleric", "druid", "paladin", "wizard", "sorcerer"], description: "Brightly illuminate large area." },
    { slug: "heroism", name: "Heroism", level: 3, school: "Enchantment", castingTime: "1 standard action", range: "Touch", components: "V, S", duration: "10 min/level", classes: ["bard", "wizard", "sorcerer"], description: "Morale bonuses and temporary HP." },
    { slug: "lightning-bolt", name: "Lightning Bolt", level: 3, school: "Evocation", castingTime: "1 standard action", range: "120 feet", components: "V, S, M", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Line-based heavy electricity damage." },
    { slug: "protection-from-energy", name: "Protection from Energy", level: 3, school: "Abjuration", castingTime: "1 standard action", range: "Touch", components: "V, S", duration: "10 min/level", classes: ["cleric", "druid", "ranger", "wizard", "sorcerer"], description: "Absorb selected energy damage type." },
    { slug: "remove-curse", name: "Remove Curse", level: 3, school: "Abjuration", castingTime: "1 standard action", range: "Touch", components: "V, S", duration: "Instantaneous", classes: ["bard", "cleric", "paladin", "wizard", "sorcerer"], description: "Lift magical curses." },
    { slug: "slow", name: "Slow", level: 3, school: "Transmutation", castingTime: "1 standard action", range: "Close", components: "V, S, M", duration: "1 round/level", classes: ["bard", "wizard", "sorcerer"], description: "Reduce enemy speed and actions." }
  ];
  var EXTRA_5E_FEATS_PASS2 = [
    { slug: "actor", name: "Actor", description: "Boost social impersonation and vocal mimicry." },
    { slug: "durable", name: "Durable", description: "Improves hit-die healing efficiency." },
    { slug: "grappler", name: "Grappler", description: "Specialized control in close-quarters grapples." },
    { slug: "heavy-armor-master", name: "Heavy Armor Master", description: "Reduce incoming nonmagical weapon damage." },
    { slug: "heavily-armored", name: "Heavily Armored", description: "Gain heavy armor proficiency and stat boost." },
    { slug: "keen-mind", name: "Keen Mind", description: "Sharper memory and directional awareness." },
    { slug: "lightly-armored", name: "Lightly Armored", description: "Gain light armor proficiency and stat boost." },
    { slug: "medium-armor-master", name: "Medium Armor Master", description: "Better Dex efficiency in medium armor." },
    { slug: "moderately-armored", name: "Moderately Armored", description: "Gain medium armor and shield proficiency." },
    { slug: "mounted-combatant", name: "Mounted Combatant", description: "Protect mount and pressure unmounted foes." },
    { slug: "polearm-master", name: "Polearm Master", description: "Extra reach control and bonus-action strikes." },
    { slug: "savage-attacker", name: "Savage Attacker", description: "Reroll melee weapon damage once per turn." },
    { slug: "shield-master", name: "Shield Master", description: "Defensive and shove utility with shield builds." },
    { slug: "skilled", name: "Skilled", description: "Gain broad additional proficiencies." },
    { slug: "spell-sniper", name: "Spell Sniper", description: "Extend attack spell range and ignore cover." },
    { slug: "telekinetic", name: "Telekinetic", description: "Minor telekinetic utility and battlefield nudging." },
    { slug: "telepathic", name: "Telepathic", description: "Gain mental communication and utility casting." },
    { slug: "weapon-master", name: "Weapon Master", description: "Broaden weapon proficiency access." }
  ];
  var EXTRA_35_FEATS_PASS2 = [
    { slug: "blind-fight", name: "Blind-Fight", description: "Mitigate miss chance in concealed combat." },
    { slug: "combat-reflexes", name: "Combat Reflexes", description: "Take more attacks of opportunity per round." },
    { slug: "deflect-arrows", name: "Deflect Arrows", description: "Negate one ranged attack each round." },
    { slug: "diehard", name: "Diehard", description: "Continue acting while below 0 hit points." },
    { slug: "endurance", name: "Endurance", description: "Improved resistance to fatigue and environmental strain." },
    { slug: "improved-disarm", name: "Improved Disarm", description: "Disarm enemies with reduced risk." },
    { slug: "improved-feint", name: "Improved Feint", description: "Feint quickly to deny enemy defenses." },
    { slug: "improved-grapple", name: "Improved Grapple", description: "Enter and control grapples more effectively." },
    { slug: "improved-overrun", name: "Improved Overrun", description: "Overrun opponents with stronger positioning." },
    { slug: "improved-shield-bash", name: "Improved Shield Bash", description: "Retain shield bonus when shield-bashing." },
    { slug: "improved-sunder", name: "Improved Sunder", description: "Destroy enemy equipment more safely." },
    { slug: "improved-two-weapon-fighting", name: "Improved Two-Weapon Fighting", description: "Gain additional off-hand attacks." },
    { slug: "manyshot", name: "Manyshot", description: "Fire multiple arrows in one action." },
    { slug: "quick-draw", name: "Quick Draw", description: "Draw weapons as free action." },
    { slug: "rapid-shot", name: "Rapid Shot", description: "Extra ranged attack with accuracy tradeoff." },
    { slug: "run", name: "Run", description: "Faster overland and tactical sprinting." },
    { slug: "shot-on-the-run", name: "Shot on the Run", description: "Move, shoot, and keep moving." },
    { slug: "whirlwind-attack", name: "Whirlwind Attack", description: "Single action attack against nearby enemies." }
  ];
  var EXTRA_5E_ITEMS_PASS2 = [
    { slug: "flail", name: "Flail", category: "Weapon", cost: "10 gp", weight: 2, properties: "1d8 bludgeoning" },
    { slug: "whip", name: "Whip", category: "Weapon", cost: "2 gp", weight: 3, properties: "1d4 slashing, finesse, reach" },
    { slug: "trident", name: "Trident", category: "Weapon", cost: "5 gp", weight: 4, properties: "1d6 piercing, thrown, versatile" },
    { slug: "lance", name: "Lance", category: "Weapon", cost: "10 gp", weight: 6, properties: "1d12 piercing, reach, special" },
    { slug: "net", name: "Net", category: "Weapon", cost: "1 gp", weight: 3, properties: "Restraining thrown weapon" },
    { slug: "war-pick", name: "War Pick", category: "Weapon", cost: "5 gp", weight: 2, properties: "1d8 piercing" },
    { slug: "sickle", name: "Sickle", category: "Weapon", cost: "1 gp", weight: 2, properties: "1d4 slashing, light" },
    { slug: "mace", name: "Mace", category: "Weapon", cost: "5 gp", weight: 4, properties: "1d6 bludgeoning" },
    { slug: "warhammer-2h", name: "Warhammer (Two-handed style)", category: "Weapon", cost: "15 gp", weight: 2, properties: "1d8 bludgeoning, versatile" },
    { slug: "blowgun", name: "Blowgun", category: "Weapon", cost: "10 gp", weight: 1, properties: "1 piercing, loading" },
    { slug: "padded-armor", name: "Padded Armor", category: "Armor", cost: "5 gp", weight: 8, properties: "AC 11 + Dex" },
    { slug: "ring-mail", name: "Ring Mail", category: "Armor", cost: "30 gp", weight: 40, properties: "AC 14" },
    { slug: "smiths-tools", name: "Smith's Tools", category: "Tool", cost: "20 gp", weight: 8, properties: "Metalworking and repairs" },
    { slug: "brewers-supplies", name: "Brewer's Supplies", category: "Tool", cost: "20 gp", weight: 9, properties: "Brew beverages and ferment goods" },
    { slug: "cartographers-tools", name: "Cartographer's Tools", category: "Tool", cost: "15 gp", weight: 6, properties: "Mapmaking and route planning" },
    { slug: "cobblers-tools", name: "Cobbler's Tools", category: "Tool", cost: "5 gp", weight: 5, properties: "Footwear crafting and repair" },
    { slug: "glassblowers-tools", name: "Glassblower's Tools", category: "Tool", cost: "30 gp", weight: 5, properties: "Glass shaping and repair" },
    { slug: "jewelers-tools", name: "Jeweler's Tools", category: "Tool", cost: "25 gp", weight: 2, properties: "Gem appraisal and setting" },
    { slug: "masons-tools", name: "Mason's Tools", category: "Tool", cost: "10 gp", weight: 8, properties: "Stonework and structural checks" },
    { slug: "navigators-tools", name: "Navigator's Tools", category: "Tool", cost: "25 gp", weight: 2, properties: "Sea navigation and direction" },
    { slug: "poisoners-kit", name: "Poisoner's Kit", category: "Tool", cost: "50 gp", weight: 2, properties: "Craft and identify poisons" },
    { slug: "potters-tools", name: "Potter's Tools", category: "Tool", cost: "10 gp", weight: 3, properties: "Ceramic crafting" },
    { slug: "weavers-tools", name: "Weaver's Tools", category: "Tool", cost: "1 gp", weight: 5, properties: "Textile and cloth work" },
    { slug: "woodcarvers-tools", name: "Woodcarver's Tools", category: "Tool", cost: "1 gp", weight: 5, properties: "Wood carving and shaping" },
    { slug: "climbers-kit", name: "Climber's Kit", category: "Adventuring Gear", cost: "25 gp", weight: 12, properties: "Anchors and harness for climbing" },
    { slug: "crowbar", name: "Crowbar", category: "Adventuring Gear", cost: "2 gp", weight: 5, properties: "Leverage tool for forced entry" },
    { slug: "grappling-hook", name: "Grappling Hook", category: "Adventuring Gear", cost: "2 gp", weight: 4, properties: "Hooked climbing utility" },
    { slug: "manacles", name: "Manacles", category: "Adventuring Gear", cost: "2 gp", weight: 6, properties: "Restrain captured targets" },
    { slug: "piton", name: "Piton", category: "Adventuring Gear", cost: "5 cp", weight: 0.25, properties: "Anchor spikes for climbing" },
    { slug: "ten-foot-pole", name: "Ten-foot Pole", category: "Adventuring Gear", cost: "5 cp", weight: 7, properties: "Probe traps and terrain safely" }
  ];
  var EXTRA_35_ITEMS_PASS2 = [
    { slug: "flail", name: "Flail", category: "Weapon", cost: "8 gp", weight: 5, properties: "1d8 bludgeoning" },
    { slug: "heavy-flail", name: "Heavy Flail", category: "Weapon", cost: "15 gp", weight: 10, properties: "1d10 bludgeoning" },
    { slug: "longspear", name: "Longspear", category: "Weapon", cost: "5 gp", weight: 9, properties: "1d8 piercing, reach" },
    { slug: "trident", name: "Trident", category: "Weapon", cost: "15 gp", weight: 4, properties: "1d8 piercing, thrown" },
    { slug: "lance", name: "Lance", category: "Weapon", cost: "10 gp", weight: 10, properties: "1d8 piercing, mounted" },
    { slug: "warpick", name: "Warpick", category: "Weapon", cost: "8 gp", weight: 6, properties: "1d8 piercing" },
    { slug: "falchion", name: "Falchion", category: "Weapon", cost: "75 gp", weight: 8, properties: "2d4 slashing" },
    { slug: "scythe", name: "Scythe", category: "Weapon", cost: "18 gp", weight: 10, properties: "2d4 slashing" },
    { slug: "spiked-chain", name: "Spiked Chain", category: "Weapon", cost: "25 gp", weight: 10, properties: "2d4 piercing, reach" },
    { slug: "hand-crossbow", name: "Hand Crossbow", category: "Weapon", cost: "100 gp", weight: 2, properties: "1d4 piercing" },
    { slug: "crossbow-repeating-light", name: "Repeating Light Crossbow", category: "Weapon", cost: "250 gp", weight: 6, properties: "1d8 piercing" },
    { slug: "crossbow-repeating-heavy", name: "Repeating Heavy Crossbow", category: "Weapon", cost: "400 gp", weight: 12, properties: "1d10 piercing" },
    { slug: "tower-shield", name: "Tower Shield", category: "Shield", cost: "30 gp", weight: 45, properties: "Shield +4" },
    { slug: "buckler", name: "Buckler", category: "Shield", cost: "15 gp", weight: 5, properties: "Shield +1" },
    { slug: "hide-armor", name: "Hide Armor", category: "Armor", cost: "15 gp", weight: 25, properties: "AC +4" },
    { slug: "breastplate-masterwork", name: "Masterwork Breastplate", category: "Armor", cost: "350 gp", weight: 30, properties: "AC +5" },
    { slug: "chainmail-masterwork", name: "Masterwork Chainmail", category: "Armor", cost: "300 gp", weight: 40, properties: "AC +5" },
    { slug: "spiked-shield", name: "Spiked Shield", category: "Shield", cost: "10 gp", weight: 15, properties: "Shield +2 and bash option" },
    { slug: "alchemists-fire", name: "Alchemist's Fire", category: "Adventuring Gear", cost: "20 gp", weight: 1, properties: "Splash fire damage" },
    { slug: "antitoxin", name: "Antitoxin", category: "Adventuring Gear", cost: "50 gp", weight: 0, properties: "Temporary poison resistance bonus" },
    { slug: "chalk", name: "Chalk", category: "Adventuring Gear", cost: "1 cp", weight: 0, properties: "Marking and mapping" },
    { slug: "mirror-small-steel", name: "Mirror (Small Steel)", category: "Adventuring Gear", cost: "10 gp", weight: 0.5, properties: "Corner scouting and line checks" },
    { slug: "spyglass", name: "Spyglass", category: "Adventuring Gear", cost: "1000 gp", weight: 1, properties: "Long-range observation" },
    { slug: "crowbar", name: "Crowbar", category: "Adventuring Gear", cost: "2 gp", weight: 5, properties: "Force open stuck objects" },
    { slug: "lantern-bullseye", name: "Bullseye Lantern", category: "Adventuring Gear", cost: "12 gp", weight: 3, properties: "Directed beam lighting" },
    { slug: "lantern-hooded", name: "Hooded Lantern", category: "Adventuring Gear", cost: "7 gp", weight: 2, properties: "Adjustable lantern light" },
    { slug: "ink-vial", name: "Ink (1 oz vial)", category: "Adventuring Gear", cost: "8 gp", weight: 0, properties: "Writing and scribing" },
    { slug: "paper-sheet", name: "Paper (sheet)", category: "Adventuring Gear", cost: "4 sp", weight: 0, properties: "Documentation and maps" },
    { slug: "parchment-sheet", name: "Parchment (sheet)", category: "Adventuring Gear", cost: "2 sp", weight: 0, properties: "Durable writing surface" },
    { slug: "smokestick", name: "Smokestick", category: "Adventuring Gear", cost: "20 gp", weight: 0.5, properties: "Creates smoke concealment" }
  ];
  var EXTRA_5E_SPELLS_PASS2 = [
    { slug: "message", name: "Message", level: 0, school: "Transmutation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "1 round", classes: ["bard", "sorcerer", "wizard"], description: "Whisper short messages magically." },
    { slug: "mending", name: "Mending", level: 0, school: "Transmutation", castingTime: "1 minute", range: "Touch", components: "V, S, M", duration: "Instantaneous", classes: ["bard", "cleric", "druid", "sorcerer", "wizard"], description: "Repair small breaks in objects." },
    { slug: "produce-flame", name: "Produce Flame", level: 0, school: "Conjuration", castingTime: "1 action", range: "Self", components: "V, S", duration: "10 minutes", classes: ["druid"], description: "Create controllable flame or ranged fire attack." },
    { slug: "spare-the-dying", name: "Spare the Dying", level: 0, school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous", classes: ["cleric"], description: "Stabilize a dying creature." },
    { slug: "thaumaturgy", name: "Thaumaturgy", level: 0, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V", duration: "Up to 1 minute", classes: ["cleric"], description: "Minor divine sensory effects." },
    { slug: "true-strike", name: "True Strike", level: 0, school: "Divination", castingTime: "1 action", range: "30 feet", components: "S", duration: "Concentration, 1 round", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Gain advantage on your next attack roll." },
    { slug: "animal-friendship", name: "Animal Friendship", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "24 hours", classes: ["bard", "druid", "ranger"], description: "Charm a beast if it fails save." },
    { slug: "charm-person", name: "Charm Person", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "1 hour", classes: ["bard", "druid", "sorcerer", "warlock", "wizard"], description: "Humanoid regards you as friendly acquaintance." },
    { slug: "color-spray", name: "Color Spray", level: 1, school: "Illusion", castingTime: "1 action", range: "Self (15-foot cone)", components: "V, S, M", duration: "1 round", classes: ["bard", "sorcerer", "wizard"], description: "Dazzle and potentially disable nearby creatures." },
    { slug: "comprehend-languages", name: "Comprehend Languages", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "1 hour", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Understand spoken and written languages." },
    { slug: "create-or-destroy-water", name: "Create or Destroy Water", level: 1, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Instantaneous", classes: ["cleric", "druid"], description: "Create clean water or remove water from container." },
    { slug: "detect-evil-and-good", name: "Detect Evil and Good", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S", duration: "Concentration, 10 minutes", classes: ["cleric", "paladin"], description: "Sense extraplanar and supernatural creature types." },
    { slug: "detect-poison-and-disease", name: "Detect Poison and Disease", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "Concentration, 10 minutes", classes: ["cleric", "druid", "paladin", "ranger"], description: "Detect poison, poisonous creatures, and disease." },
    { slug: "expeditious-retreat", name: "Expeditious Retreat", level: 1, school: "Transmutation", castingTime: "1 bonus action", range: "Self", components: "V, S", duration: "Concentration, 10 minutes", classes: ["sorcerer", "warlock", "wizard"], description: "Gain dash mobility every round." },
    { slug: "false-life", name: "False Life", level: 1, school: "Necromancy", castingTime: "1 action", range: "Self", components: "V, S, M", duration: "1 hour", classes: ["sorcerer", "wizard"], description: "Gain temporary hit points." },
    { slug: "find-familiar", name: "Find Familiar", level: 1, school: "Conjuration", castingTime: "1 hour", range: "10 feet", components: "V, S, M", duration: "Instantaneous", classes: ["wizard"], description: "Summon familiar spirit companion." },
    { slug: "floating-disk", name: "Tenser's Floating Disk", level: 1, school: "Conjuration", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "1 hour", classes: ["wizard"], description: "Summon floating platform for carrying loads." },
    { slug: "goodberry", name: "Goodberry", level: 1, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Instantaneous", classes: ["druid", "ranger"], description: "Create berries that nourish and heal." },
    { slug: "grease", name: "Grease", level: 1, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "1 minute", classes: ["wizard", "sorcerer"], description: "Create slippery terrain zone." },
    { slug: "hex", name: "Hex", level: 1, school: "Enchantment", castingTime: "1 bonus action", range: "90 feet", components: "V, S, M", duration: "Concentration, 1 hour", classes: ["warlock"], description: "Mark target for extra damage and debuff." },
    { slug: "inflict-wounds", name: "Inflict Wounds", level: 1, school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous", classes: ["cleric"], description: "High single-target necrotic damage." },
    { slug: "jump", name: "Jump", level: 1, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "1 minute", classes: ["druid", "ranger", "sorcerer", "wizard"], description: "Triples jump distance." },
    { slug: "longstrider", name: "Longstrider", level: 1, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "1 hour", classes: ["bard", "druid", "ranger", "wizard"], description: "Increase movement speed by 10 feet." },
    { slug: "purify-food-and-drink", name: "Purify Food and Drink", level: 1, school: "Transmutation", castingTime: "1 action", range: "10 feet", components: "V, S", duration: "Instantaneous", classes: ["cleric", "druid", "paladin"], description: "Remove poison/rot from food and drink." },
    { slug: "speak-with-animals", name: "Speak with Animals", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S", duration: "10 minutes", classes: ["bard", "druid", "ranger"], description: "Communicate simple ideas with beasts." },
    { slug: "thunderous-smite", name: "Thunderous Smite", level: 1, school: "Evocation", castingTime: "1 bonus action", range: "Self", components: "V", duration: "Concentration, 1 minute", classes: ["paladin"], description: "Empower next melee hit with thunder force." },
    { slug: "unseen-servant", name: "Unseen Servant", level: 1, school: "Conjuration", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "1 hour", classes: ["bard", "warlock", "wizard"], description: "Summon invisible mindless helper." },
    { slug: "aid", name: "Aid", level: 2, school: "Abjuration", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "8 hours", classes: ["cleric", "paladin"], description: "Increase max and current HP for allies." },
    { slug: "arcane-lock", name: "Arcane Lock", level: 2, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Until dispelled", classes: ["wizard"], description: "Magically secure a door or container." },
    { slug: "blindness-deafness", name: "Blindness/Deafness", level: 2, school: "Necromancy", castingTime: "1 action", range: "30 feet", components: "V", duration: "1 minute", classes: ["bard", "cleric", "sorcerer", "wizard"], description: "Inflict blindness or deafness." },
    { slug: "blur", name: "Blur", level: 2, school: "Illusion", castingTime: "1 action", range: "Self", components: "V", duration: "Concentration, 1 minute", classes: ["sorcerer", "wizard"], description: "Attackers have disadvantage to hit you." },
    { slug: "darkness", name: "Darkness", level: 2, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, M", duration: "Concentration, 10 minutes", classes: ["sorcerer", "warlock", "wizard"], description: "Create magical darkness sphere." },
    { slug: "darkvision", name: "Darkvision", level: 2, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "8 hours", classes: ["druid", "ranger", "sorcerer", "wizard"], description: "Grant darkvision to target." },
    { slug: "enhance-ability", name: "Enhance Ability", level: 2, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, 1 hour", classes: ["bard", "cleric", "druid", "sorcerer", "wizard"], description: "Grant advantage and bonus effect to ability checks." },
    { slug: "enlarge-reduce", name: "Enlarge/Reduce", level: 2, school: "Transmutation", castingTime: "1 action", range: "30 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["sorcerer", "wizard"], description: "Alter creature size and damage profile." },
    { slug: "gentle-repose", name: "Gentle Repose", level: 2, school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "10 days", classes: ["cleric", "wizard"], description: "Preserve corpse and delay undeath." },
    { slug: "gust-of-wind", name: "Gust of Wind", level: 2, school: "Evocation", castingTime: "1 action", range: "Self (60-foot line)", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["druid", "sorcerer", "wizard"], description: "Push creatures and disperse gases." },
    { slug: "heat-metal", name: "Heat Metal", level: 2, school: "Transmutation", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["bard", "druid"], description: "Superheat metal item for repeated damage." },
    { slug: "magic-weapon", name: "Magic Weapon", level: 2, school: "Transmutation", castingTime: "1 bonus action", range: "Touch", components: "V, S", duration: "Concentration, 1 hour", classes: ["paladin", "ranger", "wizard", "sorcerer"], description: "Turn weapon magical with attack/damage bonus." },
    { slug: "shatter", name: "Shatter", level: 2, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Instantaneous", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Thunder burst damages creatures and objects." },
    { slug: "spider-climb", name: "Spider Climb", level: 2, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, 1 hour", classes: ["sorcerer", "warlock", "wizard"], description: "Climb walls and ceilings." },
    { slug: "warding-bond", name: "Warding Bond", level: 2, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "1 hour", classes: ["cleric"], description: "Link defensive bonuses between caster and ally." },
    { slug: "bestow-curse", name: "Bestow Curse", level: 3, school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Concentration, 1 minute", classes: ["bard", "cleric", "wizard"], description: "Apply debilitating curse effects." },
    { slug: "blink", name: "Blink", level: 3, school: "Transmutation", castingTime: "1 action", range: "Self", components: "V, S", duration: "1 minute", classes: ["sorcerer", "wizard"], description: "Phase between planes for defense and mobility." },
    { slug: "clairvoyance", name: "Clairvoyance", level: 3, school: "Divination", castingTime: "10 minutes", range: "1 mile", components: "V, S, M", duration: "Concentration, 10 minutes", classes: ["bard", "cleric", "sorcerer", "wizard"], description: "Create remote sensor for scouting." },
    { slug: "daylight", name: "Daylight", level: 3, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "1 hour", classes: ["cleric", "druid", "paladin", "ranger", "sorcerer", "wizard"], description: "Shed bright magical light." },
    { slug: "fear", name: "Fear", level: 3, school: "Illusion", castingTime: "1 action", range: "Self (30-foot cone)", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Force creatures to flee in panic." },
    { slug: "gaseous-form", name: "Gaseous Form", level: 3, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, 1 hour", classes: ["sorcerer", "warlock", "wizard"], description: "Turn target into mist for infiltration." },
    { slug: "glyph-of-warding", name: "Glyph of Warding", level: 3, school: "Abjuration", castingTime: "1 hour", range: "Touch", components: "V, S, M", duration: "Until dispelled", classes: ["bard", "cleric", "wizard"], description: "Place magical trap glyph." },
    { slug: "major-image", name: "Major Image", level: 3, school: "Illusion", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, 10 minutes", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Complex audiovisual illusion." },
    { slug: "mass-healing-word", name: "Mass Healing Word", level: 3, school: "Evocation", castingTime: "1 bonus action", range: "60 feet", components: "V", duration: "Instantaneous", classes: ["cleric"], description: "Heal multiple allies at range." },
    { slug: "nondetection", name: "Nondetection", level: 3, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "8 hours", classes: ["bard", "ranger", "wizard"], description: "Hide target from divination." },
    { slug: "protection-from-energy", name: "Protection from Energy", level: 3, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Concentration, 1 hour", classes: ["cleric", "druid", "ranger", "sorcerer", "wizard"], description: "Absorb elemental damage up to threshold." },
    { slug: "revivify", name: "Revivify", level: 3, school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Instantaneous", classes: ["cleric", "paladin"], description: "Return recently deceased creature to life." }
  ];
  var EXTRA_35_SPELLS_PASS2 = [
    { slug: "detect-poison", name: "Detect Poison", level: 0, school: "Divination", castingTime: "1 standard action", range: "Close", components: "V, S", duration: "Instantaneous", classes: ["cleric", "druid", "wizard", "sorcerer"], description: "Detect poison in creature or object." },
    { slug: "disrupt-undead", name: "Disrupt Undead", level: 0, school: "Necromancy", castingTime: "1 standard action", range: "Close", components: "V, S", duration: "Instantaneous", classes: ["cleric", "wizard", "sorcerer"], description: "Ray that damages undead only." },
    { slug: "ghost-sound", name: "Ghost Sound", level: 0, school: "Illusion", castingTime: "1 standard action", range: "Close", components: "V, S, M", duration: "1 round/level", classes: ["bard", "wizard", "sorcerer"], description: "Create illusory sound." },
    { slug: "mage-hand", name: "Mage Hand", level: 0, school: "Transmutation", castingTime: "1 standard action", range: "Close", components: "V, S", duration: "Concentration", classes: ["bard", "wizard", "sorcerer"], description: "Manipulate small objects at range." },
    { slug: "mending", name: "Mending", level: 0, school: "Transmutation", castingTime: "10 minutes", range: "10 feet", components: "V, S, M", duration: "Instantaneous", classes: ["cleric", "druid", "wizard", "sorcerer"], description: "Repair small breakage in objects." },
    { slug: "open-close", name: "Open/Close", level: 0, school: "Transmutation", castingTime: "1 standard action", range: "Close", components: "V, S, F", duration: "Instantaneous", classes: ["bard", "wizard", "sorcerer"], description: "Open or close small doors/containers." },
    { slug: "touch-of-fatigue", name: "Touch of Fatigue", level: 0, school: "Necromancy", castingTime: "1 standard action", range: "Touch", components: "V, S", duration: "1 round/level", classes: ["wizard", "sorcerer"], description: "Fatigue humanoid target." },
    { slug: "alarm", name: "Alarm", level: 1, school: "Abjuration", castingTime: "1 minute", range: "Close", components: "V, S, F", duration: "2 hours/level", classes: ["wizard", "sorcerer", "ranger"], description: "Ward an area with audible or mental alarm." },
    { slug: "cause-fear", name: "Cause Fear", level: 1, school: "Necromancy", castingTime: "1 standard action", range: "Close", components: "V, S", duration: "1d4 rounds", classes: ["wizard", "sorcerer", "cleric"], description: "Frighten target creature." },
    { slug: "charm-person-35", name: "Charm Person", level: 1, school: "Enchantment", castingTime: "1 standard action", range: "Close", components: "V, S", duration: "1 hour/level", classes: ["bard", "wizard", "sorcerer"], description: "Humanoid treats caster as trusted friend." },
    { slug: "chill-touch", name: "Chill Touch", level: 1, school: "Necromancy", castingTime: "1 standard action", range: "Touch", components: "V, S", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Melee touch with necrotic effect." },
    { slug: "color-spray", name: "Color Spray", level: 1, school: "Illusion", castingTime: "1 standard action", range: "15-foot cone", components: "V, S, M", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Cone that stuns/blinds weaker foes." },
    { slug: "disguise-self", name: "Disguise Self", level: 1, school: "Illusion", castingTime: "1 standard action", range: "Personal", components: "V, S", duration: "10 min/level", classes: ["bard", "wizard", "sorcerer"], description: "Alter your own appearance." },
    { slug: "divine-favor", name: "Divine Favor", level: 1, school: "Evocation", castingTime: "1 standard action", range: "Personal", components: "V, S, DF", duration: "1 minute", classes: ["cleric", "paladin"], description: "Gain luck bonus on attack and damage." },
    { slug: "endure-elements", name: "Endure Elements", level: 1, school: "Abjuration", castingTime: "1 standard action", range: "Touch", components: "V, S", duration: "24 hours", classes: ["cleric", "druid", "paladin", "ranger"], description: "Protect target from severe weather." },
    { slug: "enlarge-person", name: "Enlarge Person", level: 1, school: "Transmutation", castingTime: "1 standard action", range: "Close", components: "V, S, M", duration: "1 min/level", classes: ["wizard", "sorcerer"], description: "Increase humanoid size and strength." },
    { slug: "expeditious-retreat", name: "Expeditious Retreat", level: 1, school: "Transmutation", castingTime: "1 standard action", range: "Personal", components: "V, S", duration: "1 min/level", classes: ["wizard", "sorcerer"], description: "Boost movement speed." },
    { slug: "identify", name: "Identify", level: 1, school: "Divination", castingTime: "1 hour", range: "Touch", components: "V, S, M", duration: "Instantaneous", classes: ["bard", "wizard", "sorcerer"], description: "Reveal magic item properties." },
    { slug: "jump-35", name: "Jump", level: 1, school: "Transmutation", castingTime: "1 standard action", range: "Touch", components: "V, S, M", duration: "1 min/level", classes: ["druid", "ranger", "wizard", "sorcerer"], description: "Enhance jump capability." },
    { slug: "magic-weapon-35", name: "Magic Weapon", level: 1, school: "Transmutation", castingTime: "1 standard action", range: "Touch", components: "V, S, DF", duration: "1 min/level", classes: ["cleric", "paladin", "wizard", "sorcerer"], description: "Grant enhancement to weapon." },
    { slug: "obscuring-mist", name: "Obscuring Mist", level: 1, school: "Conjuration", castingTime: "1 standard action", range: "20 feet", components: "V, S", duration: "1 minute", classes: ["cleric", "druid", "wizard", "sorcerer"], description: "Create fog concealment." },
    { slug: "aid-35", name: "Aid", level: 2, school: "Enchantment", castingTime: "1 standard action", range: "Touch", components: "V, S, DF", duration: "1 min/level", classes: ["cleric", "paladin"], description: "Morale bonus and temporary hit points." },
    { slug: "bears-endurance", name: "Bear's Endurance", level: 2, school: "Transmutation", castingTime: "1 standard action", range: "Touch", components: "V, S, M", duration: "1 min/level", classes: ["cleric", "druid", "wizard", "sorcerer"], description: "Enhancement bonus to Constitution." },
    { slug: "blur-35", name: "Blur", level: 2, school: "Illusion", castingTime: "1 standard action", range: "Touch", components: "V", duration: "1 min/level", classes: ["bard", "wizard", "sorcerer"], description: "Target appears blurred and harder to hit." },
    { slug: "calm-emotions", name: "Calm Emotions", level: 2, school: "Enchantment", castingTime: "1 standard action", range: "Medium", components: "V, S, DF", duration: "Concentration", classes: ["bard", "cleric"], description: "Suppress strong emotional effects." },
    { slug: "delay-poison", name: "Delay Poison", level: 2, school: "Conjuration", castingTime: "1 standard action", range: "Touch", components: "V, S, DF", duration: "1 hour/level", classes: ["bard", "cleric", "druid", "paladin", "ranger"], description: "Postpone poison effects." },
    { slug: "eagles-splendor", name: "Eagle's Splendor", level: 2, school: "Transmutation", castingTime: "1 standard action", range: "Touch", components: "V, S, M", duration: "1 min/level", classes: ["bard", "cleric", "paladin", "wizard", "sorcerer"], description: "Enhancement bonus to Charisma." },
    { slug: "glitterdust", name: "Glitterdust", level: 2, school: "Conjuration", castingTime: "1 standard action", range: "Medium", components: "V, S, M", duration: "1 round/level", classes: ["bard", "wizard", "sorcerer"], description: "Reveal invisibility and blind targets." },
    { slug: "resist-energy", name: "Resist Energy", level: 2, school: "Abjuration", castingTime: "1 standard action", range: "Touch", components: "V, S, DF", duration: "10 min/level", classes: ["cleric", "druid", "paladin", "ranger", "wizard", "sorcerer"], description: "Gain resistance to one energy type." },
    { slug: "shatter-35", name: "Shatter", level: 2, school: "Evocation", castingTime: "1 standard action", range: "Close", components: "V, S, M", duration: "Instantaneous", classes: ["bard", "cleric", "wizard", "sorcerer"], description: "Sonic burst damages objects and creatures." },
    { slug: "spider-climb-35", name: "Spider Climb", level: 2, school: "Transmutation", castingTime: "1 standard action", range: "Touch", components: "V, S, M", duration: "10 min/level", classes: ["wizard", "sorcerer"], description: "Move on walls and ceilings." },
    { slug: "stinking-cloud", name: "Stinking Cloud", level: 3, school: "Conjuration", castingTime: "1 standard action", range: "Medium", components: "V, S, M", duration: "1 round/level", classes: ["wizard", "sorcerer"], description: "Nauseating cloud controls area." },
    { slug: "gaseous-form-35", name: "Gaseous Form", level: 3, school: "Transmutation", castingTime: "1 standard action", range: "Touch", components: "S, M", duration: "2 min/level", classes: ["sorcerer", "wizard"], description: "Turn creature into mist form." },
    { slug: "magic-circle-against-evil", name: "Magic Circle against Evil", level: 3, school: "Abjuration", castingTime: "1 standard action", range: "Touch", components: "V, S, M, DF", duration: "10 min/level", classes: ["cleric", "paladin", "wizard", "sorcerer"], description: "Protective circle against evil entities." },
    { slug: "searing-light", name: "Searing Light", level: 3, school: "Evocation", castingTime: "1 standard action", range: "Medium", components: "V, S", duration: "Instantaneous", classes: ["cleric"], description: "Ray of intense light damages foes." },
    { slug: "summon-monster-iii", name: "Summon Monster III", level: 3, school: "Conjuration", castingTime: "1 round", range: "Close", components: "V, S, F", duration: "1 round/level", classes: ["wizard", "sorcerer", "cleric"], description: "Summon extraplanar ally for combat support." }
  ];
  var EXTRA_5E_FEATS_PASS3 = [
    { slug: "chef", name: "Chef", description: "Food-based support and short-rest recovery utility." },
    { slug: "crusher", name: "Crusher", description: "Manipulate enemy position with bludgeoning attacks." },
    { slug: "piercer", name: "Piercer", description: "Improve piercing weapon damage consistency." },
    { slug: "slasher", name: "Slasher", description: "Reduce enemy mobility with slashing attacks." },
    { slug: "fey-touched", name: "Fey Touched", description: "Teleport utility and extra enchantment/divination magic." },
    { slug: "shadow-touched", name: "Shadow Touched", description: "Stealth magic with illusion/necromancy access." },
    { slug: "gift-of-the-chromatic-dragon", name: "Gift of the Chromatic Dragon", description: "Elemental weapon infusion and resistance reaction." },
    { slug: "gift-of-the-gem-dragon", name: "Gift of the Gem Dragon", description: "Telekinetic defensive pulse and mental boost." },
    { slug: "gift-of-the-metallic-dragon", name: "Gift of the Metallic Dragon", description: "Protective wing reaction and healing boost." },
    { slug: "skill-expert", name: "Skill Expert", description: "Gain proficiency and expertise in one chosen skill." },
    { slug: "fighting-initiate", name: "Fighting Initiate", description: "Gain a fighter-style combat specialization." },
    { slug: "eldritch-adept", name: "Eldritch Adept", description: "Unlock one eldritch invocation option." }
  ];
  var EXTRA_35_FEATS_PASS3 = [
    { slug: "far-shot", name: "Far Shot", description: "Increase effective range increments for ranged attacks." },
    { slug: "great-weapon-focus", name: "Greater Weapon Focus", description: "Improved attack bonus with chosen weapon." },
    { slug: "great-weapon-specialization", name: "Greater Weapon Specialization", description: "Improved damage with selected weapon." },
    { slug: "greater-two-weapon-fighting", name: "Greater Two-Weapon Fighting", description: "Additional off-hand attack at high level." },
    { slug: "improved-critical", name: "Improved Critical", description: "Doubles threat range for chosen weapon." },
    { slug: "improved-precise-shot", name: "Improved Precise Shot", description: "Ignore most ranged cover and concealment penalties." },
    { slug: "mounted-combat", name: "Mounted Combat", description: "Better defense and control while mounted." },
    { slug: "ride-by-attack", name: "Ride-By Attack", description: "Move before and after mounted attack." },
    { slug: "spirited-charge", name: "Spirited Charge", description: "Large mounted charge damage bonus." },
    { slug: "trample", name: "Trample", description: "Ride over enemies during charge movement." },
    { slug: "snatch-arrows", name: "Snatch Arrows", description: "Catch and retain deflected ranged projectiles." },
    { slug: "two-weapon-defense", name: "Two-Weapon Defense", description: "Gain shield-like AC bonus when dual wielding." }
  ];
  var EXTRA_5E_ITEMS_PASS3 = [
    { slug: "abacus", name: "Abacus", category: "Adventuring Gear", cost: "2 gp", weight: 2, properties: "Arithmetic and accounting aid" },
    { slug: "blanket", name: "Blanket", category: "Adventuring Gear", cost: "5 sp", weight: 3, properties: "Basic warmth and camp comfort" },
    { slug: "book", name: "Book", category: "Adventuring Gear", cost: "25 gp", weight: 5, properties: "Reference text or journal" },
    { slug: "bottle-glass", name: "Bottle, Glass", category: "Adventuring Gear", cost: "2 gp", weight: 2, properties: "Container for liquids" },
    { slug: "chain-10ft", name: "Chain (10 ft)", category: "Adventuring Gear", cost: "5 gp", weight: 10, properties: "Secure objects or create restraints" },
    { slug: "chest", name: "Chest", category: "Adventuring Gear", cost: "5 gp", weight: 25, properties: "Secure storage container" },
    { slug: "flask-tankard", name: "Flask or Tankard", category: "Adventuring Gear", cost: "2 cp", weight: 1, properties: "Drink container" },
    { slug: "hammer", name: "Hammer", category: "Adventuring Gear", cost: "1 gp", weight: 3, properties: "General-purpose striking tool" },
    { slug: "ink-1oz", name: "Ink (1 ounce bottle)", category: "Adventuring Gear", cost: "10 gp", weight: 0, properties: "Writing or mapmaking" },
    { slug: "ink-pen", name: "Ink Pen", category: "Adventuring Gear", cost: "2 cp", weight: 0, properties: "Writing instrument" },
    { slug: "lamp", name: "Lamp", category: "Adventuring Gear", cost: "5 sp", weight: 1, properties: "Steady light source" },
    { slug: "lock", name: "Lock", category: "Adventuring Gear", cost: "10 gp", weight: 1, properties: "Secure storage with key" },
    { slug: "mess-kit", name: "Mess Kit", category: "Adventuring Gear", cost: "2 sp", weight: 1, properties: "Cooking and eating set" },
    { slug: "miners-pick", name: "Miner's Pick", category: "Adventuring Gear", cost: "2 gp", weight: 10, properties: "Digging and stonework" },
    { slug: "paper-sheet", name: "Paper (sheet)", category: "Adventuring Gear", cost: "2 sp", weight: 0, properties: "Writing and notes" },
    { slug: "parchment-sheet", name: "Parchment (sheet)", category: "Adventuring Gear", cost: "1 sp", weight: 0, properties: "Durable writing surface" },
    { slug: "rations-day", name: "Rations (1 day)", category: "Adventuring Gear", cost: "5 sp", weight: 2, properties: "Food for travel days" },
    { slug: "sack", name: "Sack", category: "Adventuring Gear", cost: "1 cp", weight: 0.5, properties: "Flexible carrying container" },
    { slug: "shovel", name: "Shovel", category: "Adventuring Gear", cost: "2 gp", weight: 5, properties: "Digging and excavation" },
    { slug: "signal-whistle", name: "Signal Whistle", category: "Adventuring Gear", cost: "5 cp", weight: 0, properties: "Audible coordination at distance" },
    { slug: "soap", name: "Soap", category: "Adventuring Gear", cost: "2 cp", weight: 0, properties: "Clean gear and reduce scent" },
    { slug: "tinderbox", name: "Tinderbox", category: "Adventuring Gear", cost: "5 sp", weight: 1, properties: "Fire starting kit" },
    { slug: "whetstone", name: "Whetstone", category: "Adventuring Gear", cost: "1 cp", weight: 1, properties: "Maintain blade edge" },
    { slug: "wooden-staff", name: "Wooden Staff", category: "Adventuring Gear", cost: "5 cp", weight: 4, properties: "Walking support and utility" }
  ];
  var EXTRA_35_ITEMS_PASS3 = [
    { slug: "abacus", name: "Abacus", category: "Adventuring Gear", cost: "2 gp", weight: 2, properties: "Arithmetic aid" },
    { slug: "barrel", name: "Barrel", category: "Adventuring Gear", cost: "2 gp", weight: 30, properties: "Bulk storage container" },
    { slug: "basket", name: "Basket", category: "Adventuring Gear", cost: "4 sp", weight: 2, properties: "Carry gathered goods" },
    { slug: "bell", name: "Bell", category: "Adventuring Gear", cost: "1 gp", weight: 0, properties: "Signal device" },
    { slug: "candle", name: "Candle", category: "Adventuring Gear", cost: "1 cp", weight: 0, properties: "Small light source" },
    { slug: "chain-10ft", name: "Chain (10 ft)", category: "Adventuring Gear", cost: "30 gp", weight: 10, properties: "Restraint and anchoring" },
    { slug: "chest", name: "Chest", category: "Adventuring Gear", cost: "2 gp", weight: 25, properties: "Lockable storage" },
    { slug: "flask", name: "Flask", category: "Adventuring Gear", cost: "3 cp", weight: 1.5, properties: "Liquid container" },
    { slug: "fishing-net", name: "Fishing Net", category: "Adventuring Gear", cost: "4 gp", weight: 5, properties: "Catch fish or entangle target" },
    { slug: "hammer", name: "Hammer", category: "Adventuring Gear", cost: "5 sp", weight: 2, properties: "Construction and pitons" },
    { slug: "holy-symbol-silver", name: "Holy Symbol (Silver)", category: "Focus", cost: "25 gp", weight: 1, properties: "Divine focus item" },
    { slug: "hourglass", name: "Hourglass", category: "Adventuring Gear", cost: "25 gp", weight: 1, properties: "Time tracking" },
    { slug: "ladder-10ft", name: "Ladder (10 ft)", category: "Adventuring Gear", cost: "5 cp", weight: 20, properties: "Vertical traversal" },
    { slug: "lock-good", name: "Good Lock", category: "Adventuring Gear", cost: "80 gp", weight: 1, properties: "Harder-to-pick locking mechanism" },
    { slug: "manacles", name: "Manacles", category: "Adventuring Gear", cost: "15 gp", weight: 2, properties: "Restrain captives" },
    { slug: "mirror-glass", name: "Mirror (Glass)", category: "Adventuring Gear", cost: "10 gp", weight: 0.5, properties: "Reflective scouting tool" },
    { slug: "paper-sheet", name: "Paper (sheet)", category: "Adventuring Gear", cost: "4 sp", weight: 0, properties: "Writing surface" },
    { slug: "parchment-sheet", name: "Parchment (sheet)", category: "Adventuring Gear", cost: "2 sp", weight: 0, properties: "Durable writing material" },
    { slug: "pick-miners", name: "Pick (Miner's)", category: "Adventuring Gear", cost: "3 gp", weight: 10, properties: "Mining and rock breaking" },
    { slug: "ram-portable", name: "Portable Ram", category: "Adventuring Gear", cost: "10 gp", weight: 20, properties: "Force open doors" },
    { slug: "sack", name: "Sack", category: "Adventuring Gear", cost: "1 sp", weight: 0.5, properties: "Soft carrying container" },
    { slug: "soap", name: "Soap", category: "Adventuring Gear", cost: "5 sp", weight: 1, properties: "Clean and maintain gear" },
    { slug: "trail-rations", name: "Trail Rations (1 day)", category: "Adventuring Gear", cost: "5 sp", weight: 1, properties: "Travel sustenance" },
    { slug: "vial", name: "Vial", category: "Adventuring Gear", cost: "1 gp", weight: 0, properties: "Small sample container" }
  ];
  var EXTRA_5E_SPELLS_PASS3 = [
    { slug: "banishment", name: "Banishment", level: 4, school: "Abjuration", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["cleric", "paladin", "sorcerer", "warlock", "wizard"], description: "Temporarily remove target from battlefield." },
    { slug: "blight", name: "Blight", level: 4, school: "Necromancy", castingTime: "1 action", range: "30 feet", components: "V, S", duration: "Instantaneous", classes: ["druid", "sorcerer", "warlock", "wizard"], description: "Necrotic damage with strong anti-plant effect." },
    { slug: "confusion", name: "Confusion", level: 4, school: "Enchantment", castingTime: "1 action", range: "90 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["bard", "cleric", "druid", "sorcerer", "wizard"], description: "Area control that disrupts enemy turns." },
    { slug: "dimension-door", name: "Dimension Door", level: 4, school: "Conjuration", castingTime: "1 action", range: "500 feet", components: "V", duration: "Instantaneous", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Teleport yourself and companion." },
    { slug: "freedom-of-movement", name: "Freedom of Movement", level: 4, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "1 hour", classes: ["bard", "cleric", "druid", "ranger"], description: "Ignore difficult restraints and movement penalties." },
    { slug: "greater-invisibility", name: "Greater Invisibility", level: 4, school: "Illusion", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Concentration, 1 minute", classes: ["bard", "sorcerer", "wizard"], description: "Remain invisible while acting." },
    { slug: "ice-storm", name: "Ice Storm", level: 4, school: "Evocation", castingTime: "1 action", range: "300 feet", components: "V, S, M", duration: "Instantaneous", classes: ["druid", "sorcerer", "wizard"], description: "Bludgeoning and cold damage in area." },
    { slug: "polymorph", name: "Polymorph", level: 4, school: "Transmutation", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, 1 hour", classes: ["bard", "druid", "sorcerer", "wizard"], description: "Transform creature into beast form." },
    { slug: "stone-skin", name: "Stoneskin", level: 4, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration, 1 hour", classes: ["druid", "ranger", "sorcerer", "wizard"], description: "Resistance to nonmagical physical damage." },
    { slug: "wall-of-fire", name: "Wall of Fire", level: 4, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["druid", "sorcerer", "wizard"], description: "Create damaging line or ring barrier." },
    { slug: "animate-objects", name: "Animate Objects", level: 5, school: "Transmutation", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Concentration, 1 minute", classes: ["bard", "sorcerer", "wizard"], description: "Bring objects to life as combat allies." },
    { slug: "cloudkill", name: "Cloudkill", level: 5, school: "Conjuration", castingTime: "1 action", range: "120 feet", components: "V, S", duration: "Concentration, 10 minutes", classes: ["sorcerer", "wizard"], description: "Moving poison cloud controls terrain." },
    { slug: "cone-of-cold", name: "Cone of Cold", level: 5, school: "Evocation", castingTime: "1 action", range: "Self (60-foot cone)", components: "V, S, M", duration: "Instantaneous", classes: ["sorcerer", "wizard"], description: "Large cone of cold damage." },
    { slug: "dominate-person", name: "Dominate Person", level: 5, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Concentration, 1 minute", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Control humanoid target actions." },
    { slug: "greater-restoration", name: "Greater Restoration", level: 5, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", duration: "Instantaneous", classes: ["bard", "cleric", "druid"], description: "Remove severe afflictions and penalties." },
    { slug: "hold-monster", name: "Hold Monster", level: 5, school: "Enchantment", castingTime: "1 action", range: "90 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["bard", "cleric", "sorcerer", "warlock", "wizard"], description: "Paralyze non-humanoid creature." },
    { slug: "legend-lore", name: "Legend Lore", level: 5, school: "Divination", castingTime: "10 minutes", range: "Self", components: "V, S, M", duration: "Instantaneous", classes: ["bard", "cleric", "wizard"], description: "Learn deep lore about person/place/object." },
    { slug: "mass-cure-wounds", name: "Mass Cure Wounds", level: 5, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous", classes: ["bard", "cleric", "druid"], description: "Heal many allies in area." },
    { slug: "scrying", name: "Scrying", level: 5, school: "Divination", castingTime: "10 minutes", range: "Self", components: "V, S, M", duration: "Concentration, 10 minutes", classes: ["bard", "cleric", "druid", "warlock", "wizard"], description: "Observe distant target via sensor." },
    { slug: "wall-of-stone", name: "Wall of Stone", level: 5, school: "Evocation", castingTime: "1 action", range: "120 feet", components: "V, S, M", duration: "Concentration, 10 minutes", classes: ["wizard", "druid", "sorcerer"], description: "Create stone barrier segments." },
    { slug: "chain-lightning", name: "Chain Lightning", level: 6, school: "Evocation", castingTime: "1 action", range: "150 feet", components: "V, S, M", duration: "Instantaneous", classes: ["sorcerer", "wizard"], description: "Lightning arcs to multiple targets." },
    { slug: "disintegrate", name: "Disintegrate", level: 6, school: "Transmutation", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Instantaneous", classes: ["sorcerer", "wizard"], description: "Massive force damage; can destroy objects." },
    { slug: "flesh-to-stone", name: "Flesh to Stone", level: 6, school: "Transmutation", castingTime: "1 action", range: "60 feet", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["druid", "sorcerer", "wizard", "warlock"], description: "Gradually petrify target." },
    { slug: "globe-of-invulnerability", name: "Globe of Invulnerability", level: 6, school: "Abjuration", castingTime: "1 action", range: "Self (10-foot radius)", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["wizard", "sorcerer"], description: "Block lower-level spells in area." },
    { slug: "heal", name: "Heal", level: 6, school: "Evocation", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous", classes: ["cleric", "druid"], description: "Large healing burst and condition recovery." },
    { slug: "mass-suggestion", name: "Mass Suggestion", level: 6, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V, M", duration: "24 hours", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Influence many creatures at once." },
    { slug: "sunbeam", name: "Sunbeam", level: 6, school: "Evocation", castingTime: "1 action", range: "Self (60-foot line)", components: "V, S, M", duration: "Concentration, 1 minute", classes: ["druid", "sorcerer", "wizard"], description: "Radiant beam each turn with blindness risk." },
    { slug: "teleport", name: "Teleport", level: 7, school: "Conjuration", castingTime: "1 action", range: "10 feet", components: "V", duration: "Instantaneous", classes: ["bard", "sorcerer", "wizard"], description: "Long-distance party teleportation." },
    { slug: "finger-of-death", name: "Finger of Death", level: 7, school: "Necromancy", castingTime: "1 action", range: "60 feet", components: "V, S", duration: "Instantaneous", classes: ["sorcerer", "warlock", "wizard"], description: "High necrotic damage single-target spell." },
    { slug: "power-word-stun", name: "Power Word Stun", level: 8, school: "Enchantment", castingTime: "1 action", range: "60 feet", components: "V", duration: "Instantaneous", classes: ["bard", "sorcerer", "warlock", "wizard"], description: "Stun creature with low enough HP." },
    { slug: "sunburst", name: "Sunburst", level: 8, school: "Evocation", castingTime: "1 action", range: "150 feet", components: "V, S, M", duration: "Instantaneous", classes: ["cleric", "druid", "sorcerer", "wizard"], description: "Large radiant blast with blindness." },
    { slug: "meteor-swarm", name: "Meteor Swarm", level: 9, school: "Evocation", castingTime: "1 action", range: "1 mile", components: "V, S", duration: "Instantaneous", classes: ["sorcerer", "wizard"], description: "Massive area devastation with fire and bludgeoning." },
    { slug: "wish", name: "Wish", level: 9, school: "Conjuration", castingTime: "1 action", range: "Self", components: "V", duration: "Instantaneous", classes: ["sorcerer", "wizard"], description: "Most versatile spell with broad reality-altering effects." }
  ];
  var EXTRA_35_SPELLS_PASS3 = [
    { slug: "stoneskin", name: "Stoneskin", level: 4, school: "Abjuration", castingTime: "1 standard action", range: "Touch", components: "V, S, M", duration: "10 min/level", classes: ["druid", "wizard", "sorcerer"], description: "Damage reduction against weapon attacks." },
    { slug: "dimension-door-35", name: "Dimension Door", level: 4, school: "Conjuration", castingTime: "1 standard action", range: "Long", components: "V", duration: "Instantaneous", classes: ["bard", "wizard", "sorcerer"], description: "Teleport short-to-mid range instantly." },
    { slug: "ice-storm-35", name: "Ice Storm", level: 4, school: "Evocation", castingTime: "1 standard action", range: "Long", components: "V, S, M", duration: "Instantaneous", classes: ["druid", "wizard", "sorcerer"], description: "Area bludgeoning and cold damage." },
    { slug: "minor-creation", name: "Minor Creation", level: 4, school: "Conjuration", castingTime: "1 minute", range: "0 feet", components: "V, S", duration: "1 hour/level", classes: ["wizard", "sorcerer"], description: "Create nonliving vegetable matter." },
    { slug: "phantasmal-killer", name: "Phantasmal Killer", level: 4, school: "Illusion", castingTime: "1 standard action", range: "Medium", components: "V, S", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Fear-based lethal illusion attack." },
    { slug: "solid-fog", name: "Solid Fog", level: 4, school: "Conjuration", castingTime: "1 standard action", range: "Medium", components: "V, S, M", duration: "1 min/level", classes: ["wizard", "sorcerer"], description: "Heavy movement suppression cloud." },
    { slug: "wall-of-fire-35", name: "Wall of Fire", level: 4, school: "Evocation", castingTime: "1 standard action", range: "Medium", components: "V, S, M", duration: "Concentration + 1 round/level", classes: ["wizard", "sorcerer", "druid"], description: "Persistent flaming barrier." },
    { slug: "baleful-polymorph", name: "Baleful Polymorph", level: 5, school: "Transmutation", castingTime: "1 standard action", range: "Close", components: "V, S", duration: "Permanent", classes: ["druid", "wizard", "sorcerer"], description: "Transform enemy into harmless creature." },
    { slug: "cloudkill-35", name: "Cloudkill", level: 5, school: "Conjuration", castingTime: "1 standard action", range: "Medium", components: "V, S", duration: "1 min/level", classes: ["wizard", "sorcerer"], description: "Moving poisonous cloud." },
    { slug: "cone-of-cold-35", name: "Cone of Cold", level: 5, school: "Evocation", castingTime: "1 standard action", range: "60-foot cone", components: "V, S, M", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "High cold damage cone." },
    { slug: "dominate-person-35", name: "Dominate Person", level: 5, school: "Enchantment", castingTime: "1 round", range: "Close", components: "V, S", duration: "1 day/level", classes: ["bard", "wizard", "sorcerer"], description: "Take direct control of humanoid." },
    { slug: "feeblemind", name: "Feeblemind", level: 5, school: "Enchantment", castingTime: "1 standard action", range: "Medium", components: "V, S, M", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Severely reduce target intellect and charisma." },
    { slug: "teleport-35", name: "Teleport", level: 5, school: "Conjuration", castingTime: "1 standard action", range: "Touch", components: "V", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Instant long-distance transportation." },
    { slug: "wall-of-force", name: "Wall of Force", level: 5, school: "Evocation", castingTime: "1 standard action", range: "Medium", components: "V, S, M", duration: "1 round/level", classes: ["wizard", "sorcerer"], description: "Invisible near-impenetrable barrier." },
    { slug: "chain-lightning-35", name: "Chain Lightning", level: 6, school: "Evocation", castingTime: "1 standard action", range: "Long", components: "V, S, F", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Lightning jumps between targets." },
    { slug: "circle-of-death", name: "Circle of Death", level: 6, school: "Necromancy", castingTime: "1 standard action", range: "Medium", components: "V, S, M", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Death effect in large radius." },
    { slug: "disintegrate-35", name: "Disintegrate", level: 6, school: "Transmutation", castingTime: "1 standard action", range: "Medium", components: "V, S, M", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Massive damage; can reduce to dust." },
    { slug: "greater-dispel-magic", name: "Greater Dispel Magic", level: 6, school: "Abjuration", castingTime: "1 standard action", range: "Medium", components: "V, S", duration: "Instantaneous", classes: ["bard", "cleric", "druid", "wizard", "sorcerer"], description: "Stronger dispel against high-level magic." },
    { slug: "heroes-feast", name: "Heroes' Feast", level: 6, school: "Conjuration", castingTime: "10 minutes", range: "Close", components: "V, S, DF", duration: "12 hours", classes: ["cleric", "druid"], description: "Party-wide defensive and morale buffs." },
    { slug: "mass-suggestion-35", name: "Mass Suggestion", level: 6, school: "Enchantment", castingTime: "1 standard action", range: "Medium", components: "V, M", duration: "1 hour/level", classes: ["bard", "wizard", "sorcerer"], description: "Influence many targets simultaneously." },
    { slug: "true-seeing", name: "True Seeing", level: 6, school: "Divination", castingTime: "1 standard action", range: "Touch", components: "V, S, M", duration: "1 min/level", classes: ["cleric", "wizard", "sorcerer"], description: "See through illusions and transmutations." },
    { slug: "finger-of-death-35", name: "Finger of Death", level: 7, school: "Necromancy", castingTime: "1 standard action", range: "Close", components: "V, S", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Powerful death spell ray." },
    { slug: "plane-shift", name: "Plane Shift", level: 7, school: "Conjuration", castingTime: "1 standard action", range: "Touch", components: "V, S, F", duration: "Instantaneous", classes: ["cleric", "druid", "wizard", "sorcerer"], description: "Travel or banish across planes." },
    { slug: "reverse-gravity", name: "Reverse Gravity", level: 7, school: "Transmutation", castingTime: "1 standard action", range: "Medium", components: "V, S, M", duration: "1 round/level", classes: ["wizard", "sorcerer"], description: "Invert gravity in selected area." },
    { slug: "sunbeam-35", name: "Sunbeam", level: 7, school: "Evocation", castingTime: "1 standard action", range: "60 feet", components: "V, S, M", duration: "1 round/level", classes: ["druid", "wizard", "sorcerer"], description: "Radiant beam each round." },
    { slug: "antipathy", name: "Antipathy", level: 8, school: "Enchantment", castingTime: "1 hour", range: "Close", components: "V, S, M", duration: "2 hours/level", classes: ["druid", "wizard", "sorcerer"], description: "Create repulsion effect against chosen creatures." },
    { slug: "horrid-wilting", name: "Horrid Wilting", level: 8, school: "Necromancy", castingTime: "1 standard action", range: "Long", components: "V, S, M", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Severe area dehydration damage." },
    { slug: "moment-of-prescience", name: "Moment of Prescience", level: 8, school: "Divination", castingTime: "1 standard action", range: "Personal", components: "V, S", duration: "1 hour/level", classes: ["wizard", "sorcerer"], description: "One massive insight bonus on key roll." },
    { slug: "polar-ray", name: "Polar Ray", level: 8, school: "Evocation", castingTime: "1 standard action", range: "Close", components: "V, S", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Heavy single-target cold damage ray." },
    { slug: "prismatic-wall", name: "Prismatic Wall", level: 8, school: "Abjuration", castingTime: "1 standard action", range: "10 feet", components: "V, S", duration: "10 min/level", classes: ["wizard", "sorcerer"], description: "Multi-layered defensive wall with varied effects." },
    { slug: "gate", name: "Gate", level: 9, school: "Conjuration", castingTime: "1 standard action", range: "Medium", components: "V, S, XP", duration: "Concentration", classes: ["cleric", "wizard", "sorcerer"], description: "Open portal across planes or summon entities." },
    { slug: "meteor-swarm-35", name: "Meteor Swarm", level: 9, school: "Evocation", castingTime: "1 standard action", range: "Long", components: "V, S", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Cataclysmic fire and bludgeoning area attack." },
    { slug: "time-stop", name: "Time Stop", level: 9, school: "Transmutation", castingTime: "1 standard action", range: "Personal", components: "V", duration: "1d4+1 rounds apparent", classes: ["wizard", "sorcerer"], description: "Act for several rounds while time is frozen." },
    { slug: "wail-of-the-banshee", name: "Wail of the Banshee", level: 9, school: "Necromancy", castingTime: "1 standard action", range: "Close", components: "V", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Potentially fatal death wail to many targets." },
    { slug: "wish-35", name: "Wish", level: 9, school: "Universal", castingTime: "1 standard action", range: "See text", components: "V", duration: "Instantaneous", classes: ["wizard", "sorcerer"], description: "Most powerful flexible spell effect." }
  ];

  // src/data/rulesets.js
  var ABILITY_NAMES = [
    { key: "str", short: "STR", label: "Strength", description: "Physical power and athletic force." },
    { key: "dex", short: "DEX", label: "Dexterity", description: "Agility, reflexes, and precision." },
    { key: "con", short: "CON", label: "Constitution", description: "Health, endurance, and vitality." },
    { key: "int", short: "INT", label: "Intelligence", description: "Reasoning, memory, and study." },
    { key: "wis", short: "WIS", label: "Wisdom", description: "Awareness, insight, and intuition." },
    { key: "cha", short: "CHA", label: "Charisma", description: "Presence, confidence, and force of personality." }
  ];
  var DEFAULT_ABILITY_SCORES = Object.freeze({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 });
  var ALIGNMENTS = [
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
  var ABILITY_METHODS_5E = [
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
  var ABILITY_METHODS_35 = [
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
  var SKILLS_5E = [
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
  var SKILLS_35 = [
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
  var SPECIES_5E_2014 = [
    { slug: "human", name: "Human", speed: 30, size: "Medium", abilityBonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 }, traits: ["Versatile"] },
    { slug: "dwarf", name: "Dwarf", speed: 25, size: "Medium", abilityBonuses: { con: 2 }, traits: ["Darkvision", "Dwarven Resilience"] },
    { slug: "elf", name: "Elf", speed: 30, size: "Medium", abilityBonuses: { dex: 2 }, traits: ["Darkvision", "Keen Senses", "Trance"] },
    { slug: "halfling", name: "Halfling", speed: 25, size: "Small", abilityBonuses: { dex: 2 }, traits: ["Lucky", "Brave"] },
    { slug: "dragonborn", name: "Dragonborn", speed: 30, size: "Medium", abilityBonuses: { str: 2, cha: 1 }, traits: ["Breath Weapon"] },
    { slug: "tiefling", name: "Tiefling", speed: 30, size: "Medium", abilityBonuses: { int: 1, cha: 2 }, traits: ["Darkvision", "Infernal Legacy"] }
  ];
  var SPECIES_5E_2024 = [
    { slug: "human", name: "Human", speed: 30, size: "Medium", abilityBonuses: {}, traits: ["Resourceful", "Skillful"] },
    { slug: "dwarf", name: "Dwarf", speed: 30, size: "Medium", abilityBonuses: {}, traits: ["Darkvision", "Dwarven Toughness"] },
    { slug: "elf", name: "Elf", speed: 30, size: "Medium", abilityBonuses: {}, traits: ["Darkvision", "Fey Ancestry"] },
    { slug: "halfling", name: "Halfling", speed: 30, size: "Small", abilityBonuses: {}, traits: ["Luck", "Brave"] },
    { slug: "gnome", name: "Gnome", speed: 30, size: "Small", abilityBonuses: {}, traits: ["Darkvision", "Gnomish Cunning"] },
    { slug: "orc", name: "Orc", speed: 30, size: "Medium", abilityBonuses: {}, traits: ["Adrenaline Rush", "Relentless Endurance"] },
    { slug: "dragonborn", name: "Dragonborn", speed: 30, size: "Medium", abilityBonuses: {}, traits: ["Breath Weapon", "Damage Resistance"] }
  ];
  var RACES_35 = [
    { slug: "human", name: "Human", speed: 30, size: "Medium", abilityBonuses: {}, traits: ["Bonus feat", "Extra skill points"] },
    { slug: "dwarf", name: "Dwarf", speed: 20, size: "Medium", abilityBonuses: { con: 2, cha: -2 }, traits: ["Darkvision", "Stonecunning"] },
    { slug: "elf", name: "Elf", speed: 30, size: "Medium", abilityBonuses: { dex: 2, con: -2 }, traits: ["Low-light vision", "Keen senses"] },
    { slug: "gnome", name: "Gnome", speed: 20, size: "Small", abilityBonuses: { con: 2, str: -2 }, traits: ["Low-light vision", "Illusion affinity"] },
    { slug: "half-elf", name: "Half-Elf", speed: 30, size: "Medium", abilityBonuses: {}, traits: ["Low-light vision", "Diplomacy bonus"] },
    { slug: "half-orc", name: "Half-Orc", speed: 30, size: "Medium", abilityBonuses: { str: 2, int: -2, cha: -2 }, traits: ["Darkvision"] },
    { slug: "halfling", name: "Halfling", speed: 20, size: "Small", abilityBonuses: { dex: 2, str: -2 }, traits: ["Fear resistance", "Thrown weapon bonus"] }
  ];
  var BACKGROUNDS_5E_2014 = [
    { slug: "acolyte", name: "Acolyte", skillProficiencies: ["Insight", "Religion"], toolProficiencies: [], languageProficiencies: 2, traits: ["Shelter of the Faithful"] },
    { slug: "criminal", name: "Criminal", skillProficiencies: ["Deception", "Stealth"], toolProficiencies: ["Thieves' Tools"], languageProficiencies: 0, traits: ["Criminal Contact"] },
    { slug: "folk-hero", name: "Folk Hero", skillProficiencies: ["Animal Handling", "Survival"], toolProficiencies: ["Artisan's Tools"], languageProficiencies: 0, traits: ["Rustic Hospitality"] },
    { slug: "sage", name: "Sage", skillProficiencies: ["Arcana", "History"], toolProficiencies: [], languageProficiencies: 2, traits: ["Researcher"] },
    { slug: "soldier", name: "Soldier", skillProficiencies: ["Athletics", "Intimidation"], toolProficiencies: ["Gaming Set"], languageProficiencies: 0, traits: ["Military Rank"] },
    { slug: "entertainer", name: "Entertainer", skillProficiencies: ["Acrobatics", "Performance"], toolProficiencies: ["Disguise Kit", "Musical Instrument"], languageProficiencies: 0, traits: ["By Popular Demand"] }
  ];
  var BACKGROUNDS_5E_2024 = [
    { slug: "acolyte", name: "Acolyte", skillProficiencies: ["Insight", "Religion"], toolProficiencies: ["Calligrapher's Supplies"], languageProficiencies: 2, defaultAbilityBonuses: { wis: 2, int: 1 }, traits: ["Temple service"], originFeat: "Magic Initiate" },
    { slug: "artisan", name: "Artisan", skillProficiencies: ["Investigation", "Persuasion"], toolProficiencies: ["Artisan's Tools"], languageProficiencies: 1, defaultAbilityBonuses: { int: 2, dex: 1 }, traits: ["Guild ties"], originFeat: "Crafter" },
    { slug: "guard", name: "Guard", skillProficiencies: ["Athletics", "Perception"], toolProficiencies: ["Gaming Set"], languageProficiencies: 0, defaultAbilityBonuses: { str: 2, wis: 1 }, traits: ["Watch duty"], originFeat: "Alert" },
    { slug: "sage", name: "Sage", skillProficiencies: ["Arcana", "History"], toolProficiencies: ["Calligrapher's Supplies"], languageProficiencies: 2, defaultAbilityBonuses: { int: 2, wis: 1 }, traits: ["Academic access"], originFeat: "Skilled" },
    { slug: "soldier", name: "Soldier", skillProficiencies: ["Athletics", "Intimidation"], toolProficiencies: ["Vehicles (Land)"], languageProficiencies: 0, defaultAbilityBonuses: { str: 2, con: 1 }, traits: ["Military discipline"], originFeat: "Savage Attacker" },
    { slug: "wayfarer", name: "Wayfarer", skillProficiencies: ["Stealth", "Survival"], toolProficiencies: ["Thieves' Tools"], languageProficiencies: 1, defaultAbilityBonuses: { dex: 2, wis: 1 }, traits: ["Travel routes"], originFeat: "Lucky" }
  ];
  var BACKGROUNDS_35 = [
    { slug: "apprentice", name: "Arcane Apprentice", skillProficiencies: ["Concentration", "Knowledge (Arcana)"], toolProficiencies: [], languageProficiencies: 1, traits: ["Mentor contact"] },
    { slug: "mercenary", name: "Mercenary", skillProficiencies: ["Intimidate", "Ride"], toolProficiencies: ["Gaming Set"], languageProficiencies: 0, traits: ["Camp routines"] },
    { slug: "scholar", name: "Scholar", skillProficiencies: ["Knowledge (History)", "Search"], toolProficiencies: [], languageProficiencies: 2, traits: ["Library access"] },
    { slug: "street-urchin", name: "Street Urchin", skillProficiencies: ["Hide", "Move Silently"], toolProficiencies: ["Thieves' Tools"], languageProficiencies: 0, traits: ["Urban contacts"] },
    { slug: "temple-servant", name: "Temple Servant", skillProficiencies: ["Heal", "Diplomacy"], toolProficiencies: [], languageProficiencies: 1, traits: ["Sanctuary access"] }
  ];
  var FIVE_E_CLASSES = [
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
  var THREE_FIVE_CLASSES = [
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
  var FEATS_5E = [
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
  var FEATS_35 = [
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
  var ITEMS_5E = [
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
  var ITEMS_35 = [
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
  var SPELLS_5E = [
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
  var SPELLS_35 = [
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
  var FIVE_E_FEATURES_PASS4 = {
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
  var THREE_FIVE_FEATURES_PASS4 = {
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
    const seen = /* @__PURE__ */ new Set();
    const merged = [];
    for (const feature of [...baseFeatures || [], ...extraFeatures || []]) {
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
  var FIVE_E_CLASSES_PASS4 = applyFeaturePass(FIVE_E_CLASSES, FIVE_E_FEATURES_PASS4);
  var THREE_FIVE_CLASSES_PASS4 = applyFeaturePass(THREE_FIVE_CLASSES, THREE_FIVE_FEATURES_PASS4);
  var FIVE_E_CLASSES_2024 = FIVE_E_CLASSES_PASS4.map((cls) => {
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
    const seen = /* @__PURE__ */ new Set();
    const output = [];
    for (const entry of [...baseCollection || [], ...extraCollection || []]) {
      if (!entry?.slug || seen.has(entry.slug)) {
        continue;
      }
      seen.add(entry.slug);
      output.push(entry);
    }
    return output;
  }
  var COVERAGE_TARGETS = {
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
  var FEATS_5E_ALL = mergeBySlug(FEATS_5E, [...EXTRA_5E_FEATS, ...EXTRA_5E_FEATS_PASS2, ...EXTRA_5E_FEATS_PASS3]);
  var FEATS_35_ALL = mergeBySlug(FEATS_35, [...EXTRA_35_FEATS, ...EXTRA_35_FEATS_PASS2, ...EXTRA_35_FEATS_PASS3]);
  var ITEMS_5E_ALL = mergeBySlug(ITEMS_5E, [...EXTRA_5E_ITEMS, ...EXTRA_5E_ITEMS_PASS2, ...EXTRA_5E_ITEMS_PASS3]);
  var ITEMS_35_ALL = mergeBySlug(ITEMS_35, [...EXTRA_35_ITEMS, ...EXTRA_35_ITEMS_PASS2, ...EXTRA_35_ITEMS_PASS3]);
  var SPELLS_5E_ALL = mergeBySlug(SPELLS_5E, [...EXTRA_5E_SPELLS, ...EXTRA_5E_SPELLS_PASS2, ...EXTRA_5E_SPELLS_PASS3]);
  var SPELLS_35_ALL = mergeBySlug(SPELLS_35, [...EXTRA_35_SPELLS, ...EXTRA_35_SPELLS_PASS2, ...EXTRA_35_SPELLS_PASS3]);
  var RULESETS = [
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
    return Math.max(0, Math.min(100, Math.round(part / whole * 100)));
  }
  function getCoverageReport(rulesetId) {
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
    const averageFeatureLevelCoverage = classesWithFeatures.length ? Math.round(
      classesWithFeatures.reduce((sum, entry) => sum + Math.min(20, entry.maxFeatureLevel), 0) / (classesWithFeatures.length * 20) * 100
    ) : 0;
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
  function getRulesetById(rulesetId) {
    return RULESETS.find((entry) => entry.id === rulesetId) || RULESETS[0];
  }
  function findById(collection, id) {
    return (collection || []).find((entry) => entry.id === id) || null;
  }
  function findClassById(ruleset, classId) {
    return findById(ruleset?.classes, classId);
  }

  // src/engine/rulesEngine.js
  var ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"];
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
  function toNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  function normalizeAbilityAssignments(assignedScores) {
    const normalized = { ...DEFAULT_ABILITY_SCORES };
    for (const key of ABILITY_KEYS) {
      const value = toNumber(assignedScores?.[key], DEFAULT_ABILITY_SCORES[key]);
      normalized[key] = clamp(Math.round(value), 1, 30);
    }
    return normalized;
  }
  function buildSaveLine(level, saveTags) {
    const good = 2 + Math.floor(level / 2);
    const poor = Math.floor(level / 3);
    return {
      fort: saveTags.includes("fort") ? good : poor,
      ref: saveTags.includes("ref") ? good : poor,
      will: saveTags.includes("will") ? good : poor
    };
  }
  function baseAttackBonus(level, progression) {
    if (progression === "good") {
      return level;
    }
    if (progression === "average") {
      return Math.floor(level * 0.75);
    }
    return Math.floor(level * 0.5);
  }
  function detectArmorItem(items) {
    return items.find((entry) => String(entry.category || "").toLowerCase().includes("armor"));
  }
  function detectShieldItem(items) {
    return items.find((entry) => String(entry.name || "").toLowerCase().includes("shield"));
  }
  function parseArmorBonus(propertyText) {
    if (!propertyText) {
      return null;
    }
    const text = String(propertyText);
    const fiveE = text.match(/AC\s*(\d+)(?:\s*\+\s*Dex(?:\s*\(max\s*(\d+)\))?)?/i);
    if (fiveE) {
      return {
        mode: "base",
        base: Number(fiveE[1]),
        dexCap: fiveE[2] ? Number(fiveE[2]) : null
      };
    }
    const threeFive = text.match(/AC\s*\+\s*(\d+)/i);
    if (threeFive) {
      return {
        mode: "bonus",
        bonus: Number(threeFive[1])
      };
    }
    return null;
  }
  function getSelectedCollection(collection, ids) {
    const idSet = new Set(ids || []);
    return (collection || []).filter((entry) => idSet.has(entry.id));
  }
  function getRuleset(rulesetId, rulesets) {
    return (rulesets || []).find((entry) => entry.id === rulesetId) || (rulesets || [])[0] || null;
  }
  function abilityModifier(score) {
    return Math.floor((toNumber(score, 10) - 10) / 2);
  }
  function calculatePointBuyTotal(assignedScores, method) {
    if (!method || method.id !== "point-buy") {
      return 0;
    }
    const scores = normalizeAbilityAssignments(assignedScores);
    return ABILITY_KEYS.reduce((total, key) => {
      const score = scores[key];
      const cost = method.costTable?.[score];
      return total + (Number.isFinite(cost) ? cost : 999);
    }, 0);
  }
  function computeAbilityScores(state2, ruleset) {
    const assigned = normalizeAbilityAssignments(state2?.assignedScores);
    const species = findById(ruleset?.species, state2?.speciesId);
    const background = findById(ruleset?.backgrounds, state2?.backgroundId);
    const speciesBonuses = species?.abilityBonuses || {};
    const backgroundBonuses = background?.defaultAbilityBonuses || {};
    const finalScores = { ...assigned };
    for (const key of ABILITY_KEYS) {
      finalScores[key] += toNumber(speciesBonuses[key], 0) + toNumber(backgroundBonuses[key], 0);
    }
    const modifiers = Object.fromEntries(ABILITY_KEYS.map((key) => [key, abilityModifier(finalScores[key])]));
    return {
      assigned,
      finalScores,
      modifiers,
      speciesBonuses,
      backgroundBonuses
    };
  }
  function calculateProficiencyBonus(level, ruleset) {
    if (!ruleset) {
      return 0;
    }
    if (ruleset.family === "5e") {
      return 2 + Math.floor((level - 1) / 4);
    }
    return 0;
  }
  function calculateHitPoints(state2, ruleset, computedScores) {
    const characterClass = findById(ruleset?.classes, state2?.classId);
    const level = clamp(toNumber(state2?.level, 1), 1, 20);
    if (!characterClass) {
      return 0;
    }
    const conMod = computedScores.modifiers.con;
    const hitDie = toNumber(characterClass.hitDie, 8);
    const averageRoll = Math.floor(hitDie / 2) + 1;
    let hp = hitDie + conMod + Math.max(0, level - 1) * (averageRoll + conMod);
    const feats = getSelectedCollection(ruleset?.feats, state2?.selectedFeatIds);
    if (feats.some((feat) => feat.slug === "tough")) {
      hp += level * 2;
    }
    return Math.max(level, hp);
  }
  function calculateArmorClass(state2, ruleset, computedScores) {
    const selectedItems = getSelectedCollection(ruleset?.items, state2?.selectedItemIds);
    const dexMod = computedScores.modifiers.dex;
    const armor = detectArmorItem(selectedItems);
    const shield = detectShieldItem(selectedItems);
    let armorClass = 10 + dexMod;
    if (armor) {
      const parsed = parseArmorBonus(armor.properties);
      if (parsed) {
        if (parsed.mode === "base") {
          const dexContribution = parsed.dexCap == null ? dexMod : Math.min(dexMod, parsed.dexCap);
          armorClass = parsed.base + dexContribution;
        }
        if (parsed.mode === "bonus") {
          armorClass = 10 + dexMod + parsed.bonus;
        }
      }
    }
    if (shield) {
      const shieldBonusMatch = String(shield.properties || "").match(/\+\s*(\d+)\s*AC|Shield\s*\+\s*(\d+)/i);
      const shieldBonus = shieldBonusMatch ? Number(shieldBonusMatch[1] || shieldBonusMatch[2]) : 2;
      armorClass += shieldBonus;
    }
    return Math.max(1, armorClass);
  }
  function calculateSpellcasting(state2, ruleset, computedScores) {
    const characterClass = findById(ruleset?.classes, state2?.classId);
    if (!characterClass?.spellcasting) {
      return null;
    }
    const level = clamp(toNumber(state2?.level, 1), 1, 20);
    const castingAbility = characterClass.spellcasting.ability || "int";
    const castingMod = computedScores.modifiers[castingAbility] || 0;
    const proficiency = calculateProficiencyBonus(level, ruleset);
    const cantrips = Math.max(0, toNumber(characterClass.spellcasting.cantripsAtLevel1, 0) + Math.floor((level - 1) / 4));
    const knownBase = toNumber(characterClass.spellcasting.spellsKnownAtLevel1, 0);
    const knownByLevel = Math.max(0, level - 1);
    const preparedCount = characterClass.spellcasting.preparedBy ? Math.max(1, level + castingMod) : Math.max(knownBase, knownBase + knownByLevel);
    const spellPickLimit = cantrips + preparedCount;
    const maxSpellLevel = ruleset.family === "5e" ? Math.min(9, Math.ceil(level / 2)) : Math.min(9, Math.floor((level + 1) / 2));
    if (ruleset.family === "5e") {
      return {
        castingAbility,
        castingModifier: castingMod,
        spellAttackBonus: castingMod + proficiency,
        saveDC: 8 + proficiency + castingMod,
        cantrips,
        preparedOrKnown: preparedCount,
        spellPickLimit,
        maxSpellLevel
      };
    }
    return {
      castingAbility,
      castingModifier: castingMod,
      spellAttackBonus: castingMod,
      saveDC: 10 + castingMod + Math.max(0, maxSpellLevel),
      cantrips,
      preparedOrKnown: preparedCount,
      spellPickLimit,
      maxSpellLevel
    };
  }
  function deriveCharacterSheet(state2, rulesets) {
    const ruleset = getRuleset(state2?.rulesetId, rulesets);
    if (!ruleset) {
      return null;
    }
    const level = clamp(toNumber(state2?.level, 1), 1, 20);
    const characterClass = findById(ruleset.classes, state2?.classId);
    const species = findById(ruleset.species, state2?.speciesId);
    const background = findById(ruleset.backgrounds, state2?.backgroundId);
    const subclass = characterClass ? findById(characterClass.subclasses, state2?.subclassId) : null;
    const abilityMethod = findById(ruleset.abilityMethods, state2?.abilityMethodId) || ruleset.abilityMethods[0];
    const abilityInfo = computeAbilityScores(state2, ruleset);
    const pointBuyTotal = calculatePointBuyTotal(abilityInfo.assigned, abilityMethod);
    const proficiencyBonus = calculateProficiencyBonus(level, ruleset);
    const hp = calculateHitPoints(state2, ruleset, abilityInfo);
    const ac = calculateArmorClass(state2, ruleset, abilityInfo);
    const spellcasting = calculateSpellcasting(state2, ruleset, abilityInfo);
    const selectedSkills = getSelectedCollection(ruleset.skills, state2?.selectedSkillIds);
    const selectedFeats = getSelectedCollection(ruleset.feats, state2?.selectedFeatIds);
    const selectedSpells = getSelectedCollection(ruleset.spells, state2?.selectedSpellIds);
    const selectedItems = getSelectedCollection(ruleset.items, state2?.selectedItemIds);
    const skillBonuses = (ruleset.skills || []).map((skill) => {
      const ability = skill.ability || "int";
      const mod = abilityInfo.modifiers[ability] || 0;
      const selected = selectedSkills.some((entry) => entry.id === skill.id);
      let bonus = mod;
      if (ruleset.family === "5e") {
        bonus += selected ? proficiencyBonus : 0;
      } else {
        bonus += selected ? 3 : 0;
      }
      return {
        ...skill,
        selected,
        bonus
      };
    });
    const classFeatures = (characterClass?.featuresByLevel || []).filter((feature) => feature.level <= level);
    const baseAttack = ruleset.family === "3.5e" && characterClass ? baseAttackBonus(level, characterClass.baseAttackProgression || "poor") : null;
    const saves = ruleset.family === "3.5e" && characterClass ? buildSaveLine(level, characterClass.savingThrowProficiencies || []) : null;
    return {
      ruleset,
      level,
      abilityMethod,
      characterClass,
      species,
      background,
      subclass,
      pointBuyTotal,
      abilityScores: abilityInfo.finalScores,
      abilityModifiers: abilityInfo.modifiers,
      speciesBonuses: abilityInfo.speciesBonuses,
      backgroundBonuses: abilityInfo.backgroundBonuses,
      proficiencyBonus,
      baseAttackBonus: baseAttack,
      saves,
      hitPoints: hp,
      armorClass: ac,
      initiative: abilityInfo.modifiers.dex,
      passivePerception: 10 + abilityInfo.modifiers.wis + (selectedSkills.some((skill) => skill.name === "Perception") ? proficiencyBonus : 0),
      speed: species?.speed || 30,
      carryingCapacity: Math.max(1, abilityInfo.finalScores.str) * (ruleset.family === "5e" ? 15 : 10),
      spellcasting,
      selectedSkills,
      selectedFeats,
      selectedSpells,
      selectedItems,
      classFeatures,
      skillBonuses
    };
  }

  // src/engine/validators.js
  function issue(code, severity, field, message) {
    return { code, severity, field, message };
  }
  function validateAbilityBounds(assignedScores, method) {
    const issues2 = [];
    const keys = ["str", "dex", "con", "int", "wis", "cha"];
    for (const key of keys) {
      const score = Number(assignedScores?.[key]);
      if (!Number.isFinite(score)) {
        issues2.push(issue("ability.not_number", "error", `assignedScores.${key}`, `${key.toUpperCase()} must be a number.`));
        continue;
      }
      if (method?.min != null && score < method.min) {
        issues2.push(issue("ability.too_low", "error", `assignedScores.${key}`, `${key.toUpperCase()} is below ${method.min}.`));
      }
      if (method?.max != null && score > method.max) {
        issues2.push(issue("ability.too_high", "error", `assignedScores.${key}`, `${key.toUpperCase()} is above ${method.max}.`));
      }
    }
    return issues2;
  }
  function validateStandardArray(assignedScores, method) {
    if (!method?.array?.length) {
      return [];
    }
    const values = Object.values(assignedScores || {}).map((value) => Number(value));
    if (values.some((value) => !Number.isFinite(value))) {
      return [issue("ability.array.invalid", "error", "assignedScores", "All ability scores must be numeric for Standard Array.")];
    }
    const left = [...values].sort((a, b) => a - b).join(",");
    const right = [...method.array].sort((a, b) => a - b).join(",");
    if (left !== right) {
      return [issue("ability.array.mismatch", "error", "assignedScores", `Standard Array must use exactly ${method.array.join(", ")}.`)];
    }
    return [];
  }
  function ensureIdsExist(ids, collection, fieldPrefix, codePrefix) {
    const set = new Set((collection || []).map((entry) => entry.id));
    const issues2 = [];
    for (const id of ids || []) {
      if (!set.has(id)) {
        issues2.push(issue(`${codePrefix}.not_found`, "error", fieldPrefix, `Unknown selection: ${id}.`));
      }
    }
    return issues2;
  }
  function validateCharacter(state2, rulesets) {
    const issues2 = [];
    const ruleset = getRuleset(state2?.rulesetId, rulesets);
    if (!ruleset) {
      return [issue("ruleset.missing", "error", "rulesetId", "No ruleset selected.")];
    }
    const level = Number(state2?.level ?? 1);
    const minLevel = ruleset.levelBounds?.min ?? 1;
    const maxLevel = ruleset.levelBounds?.max ?? 20;
    if (!state2?.name || !String(state2.name).trim()) {
      issues2.push(issue("character.name.required", "error", "name", "Character name is required."));
    }
    if (!Number.isFinite(level) || level < minLevel || level > maxLevel) {
      issues2.push(issue("character.level.invalid", "error", "level", `Level must be between ${minLevel} and ${maxLevel}.`));
    }
    const species = findById(ruleset.species, state2?.speciesId);
    const background = findById(ruleset.backgrounds, state2?.backgroundId);
    const characterClass = findById(ruleset.classes, state2?.classId);
    if (!species) {
      issues2.push(issue("character.species.required", "error", "speciesId", "Choose a species/race."));
    }
    if (!background) {
      issues2.push(issue("character.background.required", "error", "backgroundId", "Choose a background."));
    }
    if (!characterClass) {
      issues2.push(issue("character.class.required", "error", "classId", "Choose a class."));
    }
    const method = findById(ruleset.abilityMethods, state2?.abilityMethodId) || ruleset.abilityMethods[0];
    issues2.push(...validateAbilityBounds(state2?.assignedScores, method));
    if (method?.id === "point-buy") {
      const total = calculatePointBuyTotal(state2?.assignedScores, method);
      if (total > method.budget) {
        issues2.push(issue("ability.point_buy.over_budget", "error", "assignedScores", `Point-buy total ${total} exceeds budget ${method.budget}.`));
      }
    }
    if (method?.id === "standard-array") {
      issues2.push(...validateStandardArray(state2?.assignedScores, method));
    }
    if (state2?.subclassId && characterClass) {
      const subclassExists = (characterClass.subclasses || []).some((entry) => entry.id === state2.subclassId);
      if (!subclassExists) {
        issues2.push(issue("character.subclass.invalid", "error", "subclassId", "Selected subclass is invalid for current class."));
      }
    }
    issues2.push(...ensureIdsExist(state2?.selectedSkillIds, ruleset.skills, "selectedSkillIds", "skill"));
    issues2.push(...ensureIdsExist(state2?.selectedFeatIds, ruleset.feats, "selectedFeatIds", "feat"));
    issues2.push(...ensureIdsExist(state2?.selectedSpellIds, ruleset.spells, "selectedSpellIds", "spell"));
    issues2.push(...ensureIdsExist(state2?.selectedItemIds, ruleset.items, "selectedItemIds", "item"));
    if (characterClass) {
      const selectedSkillCount = (state2?.selectedSkillIds || []).length;
      if (selectedSkillCount > Number(characterClass.skillChoices || 0)) {
        issues2.push(
          issue(
            "skill.too_many",
            "error",
            "selectedSkillIds",
            `${characterClass.name} allows up to ${characterClass.skillChoices} class skill selections.`
          )
        );
      }
      if (selectedSkillCount === 0) {
        issues2.push(issue("skill.none_selected", "warning", "selectedSkillIds", "No skills selected yet."));
      }
    }
    const derived2 = deriveCharacterSheet(state2, rulesets);
    if (derived2?.spellcasting) {
      const max = derived2.spellcasting.spellPickLimit;
      const chosen = (state2?.selectedSpellIds || []).length;
      if (chosen > max) {
        issues2.push(issue("spell.too_many", "error", "selectedSpellIds", `Selected ${chosen} spells but limit is ${max} for current build.`));
      }
    } else if ((state2?.selectedSpellIds || []).length > 0) {
      issues2.push(issue("spell.not_caster", "warning", "selectedSpellIds", "This class is not a primary spellcaster in this ruleset."));
    }
    if ((state2?.selectedItemIds || []).length === 0) {
      issues2.push(issue("item.none_selected", "warning", "selectedItemIds", "Select starting gear to complete sheet output."));
    }
    if ((state2?.selectedFeatIds || []).length === 0) {
      issues2.push(issue("feat.none_selected", "info", "selectedFeatIds", "No feats selected yet."));
    }
    return issues2;
  }

  // src/ui/sheet.js
  function plus(value) {
    const numeric = Number(value || 0);
    return numeric >= 0 ? `+${numeric}` : `${numeric}`;
  }
  function tags(items) {
    if (!items || !items.length) {
      return '<span class="sheet-tag">None selected</span>';
    }
    return items.map((item) => `<span class="sheet-tag">${item.name}</span>`).join("");
  }
  function listLines(items, fallback) {
    if (!items || !items.length) {
      return `<p class="helper">${fallback}</p>`;
    }
    return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  }
  function renderSheet(container, state2, derived2, issues2) {
    if (!container) {
      return;
    }
    if (!derived2) {
      container.innerHTML = "<p class='helper'>Select a ruleset and start entering character details.</p>";
      return;
    }
    const ruleset = derived2.ruleset;
    const className = derived2.characterClass?.name || "Unassigned";
    const speciesName = derived2.species?.name || "Unassigned";
    const backgroundName = derived2.background?.name || "Unassigned";
    const subclassName = derived2.subclass?.name || "None";
    const blockingIssues = issues2.filter((item) => item.severity === "error").length;
    const warningIssues = issues2.filter((item) => item.severity === "warning").length;
    const abilityCards = Object.entries(derived2.abilityScores).map(([ability, score]) => {
      return `<div class="stat-card"><strong>${ability.toUpperCase()} ${score}</strong><span>${plus(derived2.abilityModifiers[ability])}</span></div>`;
    }).join("");
    const featureLines = derived2.classFeatures.map((feature) => `L${feature.level}: ${feature.name}`);
    const spellBlock = derived2.spellcasting ? `
      <div class="sheet-block">
        <h4>Spellcasting</h4>
        <p>Casting ability: <strong>${derived2.spellcasting.castingAbility.toUpperCase()}</strong></p>
        <p>Save DC: <strong>${derived2.spellcasting.saveDC}</strong> | Attack bonus: <strong>${plus(derived2.spellcasting.spellAttackBonus)}</strong></p>
        <p>Cantrips: <strong>${derived2.spellcasting.cantrips}</strong> | Prepared/Known estimate: <strong>${derived2.spellcasting.preparedOrKnown}</strong></p>
      </div>
    ` : "";
    const progressionBlock = ruleset.family === "3.5e" ? `
      <div class="sheet-block">
        <h4>3.5e Progression</h4>
        <p>Base Attack Bonus: <strong>${plus(derived2.baseAttackBonus || 0)}</strong></p>
        <p>Base Saves: Fort <strong>${plus(derived2.saves?.fort || 0)}</strong>, Ref <strong>${plus(derived2.saves?.ref || 0)}</strong>, Will <strong>${plus(derived2.saves?.will || 0)}</strong></p>
      </div>
    ` : "";
    container.innerHTML = `
    <div class="sheet-block">
      <h4>Identity</h4>
      <p><strong>${state2.name || "Unnamed Hero"}</strong> | ${ruleset.shortName} | Level ${derived2.level}</p>
      <p>${speciesName} ${className} (${subclassName})</p>
      <p>Background: ${backgroundName} | Alignment: ${state2.alignment || "Unassigned"}</p>
      <p>Player: ${state2.playerName || "Unassigned"}</p>
    </div>

    <div class="sheet-grid">
      ${abilityCards}
    </div>

    <div class="sheet-block">
      <h4>Core Combat</h4>
      <p>HP <strong>${derived2.hitPoints}</strong> | AC <strong>${derived2.armorClass}</strong> | Initiative <strong>${plus(derived2.initiative)}</strong></p>
      <p>Speed <strong>${derived2.speed} ft</strong> | Passive Perception <strong>${derived2.passivePerception}</strong></p>
      <p>${ruleset.family === "5e" ? `Proficiency Bonus <strong>${plus(derived2.proficiencyBonus)}</strong>` : "3.5e uses BAB and save progressions"}</p>
    </div>

    ${progressionBlock}
    ${spellBlock}

    <div class="sheet-block">
      <h4>Selected Skills</h4>
      <div class="sheet-tags">${tags(derived2.selectedSkills)}</div>
    </div>

    <div class="sheet-block">
      <h4>Selected Feats</h4>
      <div class="sheet-tags">${tags(derived2.selectedFeats)}</div>
    </div>

    <div class="sheet-block">
      <h4>Selected Spells</h4>
      <div class="sheet-tags">${tags(derived2.selectedSpells)}</div>
    </div>

    <div class="sheet-block">
      <h4>Selected Items</h4>
      <div class="sheet-tags">${tags(derived2.selectedItems)}</div>
    </div>

    <div class="sheet-block">
      <h4>Unlocked Class Features</h4>
      ${listLines(featureLines, "No unlocked class features yet.")}
    </div>

    <div class="sheet-block">
      <h4>Validation Summary</h4>
      <p>Blocking issues: <strong>${blockingIssues}</strong> | Warnings: <strong>${warningIssues}</strong></p>
      <p>${blockingIssues === 0 ? "Build is ready for completion and printing." : "Resolve blocking issues in the Review step."}</p>
    </div>
  `;
  }

  // src/utils/storage.js
  var STORAGE_KEY = "forge-character-drafts-v1";
  function safeParse(raw) {
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  function getSavedDrafts() {
    return safeParse(localStorage.getItem(STORAGE_KEY));
  }
  function saveDraft(draft) {
    const drafts = getSavedDrafts();
    const next = [draft, ...drafts.filter((entry) => entry.draftId !== draft.draftId)].slice(0, 40);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }
  function deleteDraftById(id) {
    const drafts = getSavedDrafts();
    const next = drafts.filter((entry) => entry.draftId !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }
  function exportDraftToFile(draft) {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(draft.name || "character")}-${draft.rulesetId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
  async function importDraftFromFile(file) {
    const text = await file.text();
    return JSON.parse(text);
  }
  function slugify(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "character";
  }

  // src/utils/pdfBuilder.js
  function escapePdfText(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/[^\x20-\x7E]/g, "?");
  }
  function wrapLine(text, maxLength) {
    const line = String(text || "").trim();
    if (!line) {
      return [""];
    }
    if (line.length <= maxLength) {
      return [line];
    }
    const words = line.split(/\s+/);
    const lines = [];
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length <= maxLength) {
        current = candidate;
        continue;
      }
      if (current) {
        lines.push(current);
        current = word;
      } else {
        for (let index = 0; index < word.length; index += maxLength) {
          lines.push(word.slice(index, index + maxLength));
        }
        current = "";
      }
    }
    if (current) {
      lines.push(current);
    }
    return lines;
  }
  function normalizeLines(lines, maxLength = 96) {
    const normalized = [];
    for (const line of lines || []) {
      const wrapped = wrapLine(String(line || ""), maxLength);
      normalized.push(...wrapped);
    }
    return normalized;
  }
  function buildSimplePdf(lines, options = {}) {
    const title = options.title || "Forge Character Export";
    const maxChars = options.maxCharsPerLine || 96;
    const linesPerPage = options.linesPerPage || 48;
    const lineHeight = options.lineHeight || 14;
    const startX = options.startX || 42;
    const startY = options.startY || 760;
    const fullLines = normalizeLines([title, "", ...lines || []], maxChars);
    const pageChunks = [];
    for (let index = 0; index < fullLines.length; index += linesPerPage) {
      pageChunks.push(fullLines.slice(index, index + linesPerPage));
    }
    if (pageChunks.length === 0) {
      pageChunks.push([title]);
    }
    const objectMap = /* @__PURE__ */ new Map();
    const pageCount = pageChunks.length;
    const fontObjNum = 3 + pageCount * 2;
    const infoObjNum = fontObjNum + 1;
    objectMap.set(1, "<< /Type /Catalog /Pages 2 0 R >>");
    const kidRefs = [];
    for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
      const pageObjNum = 3 + pageIndex * 2;
      const contentObjNum = 4 + pageIndex * 2;
      kidRefs.push(`${pageObjNum} 0 R`);
      const streamLines = [];
      streamLines.push("BT");
      streamLines.push("/F1 10 Tf");
      streamLines.push(`${startX} ${startY} Td`);
      const pageLines = pageChunks[pageIndex];
      pageLines.forEach((line, index) => {
        if (index > 0) {
          streamLines.push(`0 -${lineHeight} Td`);
        }
        streamLines.push(`(${escapePdfText(line)}) Tj`);
      });
      streamLines.push("ET");
      const streamText = `${streamLines.join("\n")}
`;
      const content = `<< /Length ${streamText.length} >>
stream
${streamText}endstream`;
      objectMap.set(contentObjNum, content);
      const page = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontObjNum} 0 R >> >> /Contents ${contentObjNum} 0 R >>`;
      objectMap.set(pageObjNum, page);
    }
    objectMap.set(2, `<< /Type /Pages /Kids [${kidRefs.join(" ")}] /Count ${pageCount} >>`);
    objectMap.set(fontObjNum, "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>");
    objectMap.set(
      infoObjNum,
      `<< /Title (${escapePdfText(title)}) /Producer (Forge Character) /Creator (Forge Character) /Subject (Parsable Character Sheet) >>`
    );
    const maxObj = infoObjNum;
    let pdf = "%PDF-1.4\n";
    const offsets = new Array(maxObj + 1).fill(0);
    for (let objNum = 1; objNum <= maxObj; objNum += 1) {
      const content = objectMap.get(objNum);
      if (!content) {
        continue;
      }
      offsets[objNum] = pdf.length;
      pdf += `${objNum} 0 obj
${content}
endobj
`;
    }
    const xrefStart = pdf.length;
    pdf += `xref
0 ${maxObj + 1}
`;
    pdf += "0000000000 65535 f \n";
    for (let objNum = 1; objNum <= maxObj; objNum += 1) {
      const offset = String(offsets[objNum] || 0).padStart(10, "0");
      pdf += `${offset} 00000 n 
`;
    }
    pdf += `trailer
<< /Size ${maxObj + 1} /Root 1 0 R /Info ${infoObjNum} 0 R >>
startxref
${xrefStart}
%%EOF`;
    return new TextEncoder().encode(pdf);
  }

  // src/utils/characterExport.js
  function safe(value, fallback = "") {
    if (value == null) {
      return fallback;
    }
    return String(value);
  }
  function pipeList(values) {
    if (!values || !values.length) {
      return "";
    }
    return values.join("|");
  }
  function chunkString(value, chunkSize) {
    const chunks = [];
    for (let index = 0; index < value.length; index += chunkSize) {
      chunks.push(value.slice(index, index + chunkSize));
    }
    return chunks;
  }
  function summarizeIssues(issues2) {
    const all = issues2 || [];
    return {
      total: all.length,
      errors: all.filter((item) => item.severity === "error").length,
      warnings: all.filter((item) => item.severity === "warning").length,
      info: all.filter((item) => item.severity === "info").length
    };
  }
  function compactSelection(items, extraMapper = null) {
    return (items || []).map((item) => {
      const base = {
        id: item.id,
        slug: item.slug,
        name: item.name
      };
      return extraMapper ? { ...base, ...extraMapper(item) } : base;
    });
  }
  function compactDerived(derived2) {
    if (!derived2) {
      return null;
    }
    return {
      ruleset: {
        id: derived2.ruleset?.id,
        name: derived2.ruleset?.name,
        shortName: derived2.ruleset?.shortName,
        editionYear: derived2.ruleset?.editionYear,
        family: derived2.ruleset?.family
      },
      className: derived2.characterClass?.name || null,
      subclassName: derived2.subclass?.name || null,
      speciesName: derived2.species?.name || null,
      backgroundName: derived2.background?.name || null,
      level: derived2.level,
      pointBuyTotal: derived2.pointBuyTotal,
      abilityScores: derived2.abilityScores,
      abilityModifiers: derived2.abilityModifiers,
      proficiencyBonus: derived2.proficiencyBonus,
      baseAttackBonus: derived2.baseAttackBonus,
      saves: derived2.saves,
      hitPoints: derived2.hitPoints,
      armorClass: derived2.armorClass,
      initiative: derived2.initiative,
      passivePerception: derived2.passivePerception,
      speed: derived2.speed,
      carryingCapacity: derived2.carryingCapacity,
      spellcasting: derived2.spellcasting,
      selectedSkills: compactSelection(derived2.selectedSkills, (item) => ({ ability: item.ability })),
      selectedFeats: compactSelection(derived2.selectedFeats),
      selectedItems: compactSelection(derived2.selectedItems, (item) => ({ category: item.category })),
      selectedSpells: compactSelection(derived2.selectedSpells, (item) => ({ level: item.level, school: item.school })),
      classFeatures: (derived2.classFeatures || []).map((feature) => ({
        level: feature.level,
        name: feature.name
      }))
    };
  }
  function buildParsableCharacterPayload(state2, derived2, issues2) {
    const issueSummary2 = summarizeIssues(issues2);
    return {
      exportVersion: "forge-character-v1",
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      state: state2,
      derived: compactDerived(derived2),
      issueSummary: issueSummary2,
      issues: issues2
    };
  }
  function buildParsableCharacterLines(state2, derived2, issues2) {
    const payload = buildParsableCharacterPayload(state2, derived2, issues2);
    const issueSummary2 = payload.issueSummary;
    const lines = [
      "@@FORGE_CHARACTER_EXPORT@@ version=1",
      `@@FIELD@@ exported_at=${payload.exportedAt}`,
      "@@SECTION@@ identity",
      `@@FIELD@@ ruleset_id=${safe(state2.rulesetId)}`,
      `@@FIELD@@ ruleset_name=${safe(derived2?.ruleset?.name)}`,
      `@@FIELD@@ character_name=${safe(state2.name)}`,
      `@@FIELD@@ player_name=${safe(state2.playerName)}`,
      `@@FIELD@@ level=${safe(derived2?.level ?? state2.level, "1")}`,
      `@@FIELD@@ alignment=${safe(state2.alignment)}`,
      `@@FIELD@@ species=${safe(derived2?.species?.name)}`,
      `@@FIELD@@ background=${safe(derived2?.background?.name)}`,
      `@@FIELD@@ class=${safe(derived2?.characterClass?.name)}`,
      `@@FIELD@@ subclass=${safe(derived2?.subclass?.name, "None")}`,
      `@@FIELD@@ experience_mode=${safe(state2.experienceMode)}`,
      "@@SECTION@@ abilities",
      `@@FIELD@@ str=${safe(derived2?.abilityScores?.str)}`,
      `@@FIELD@@ dex=${safe(derived2?.abilityScores?.dex)}`,
      `@@FIELD@@ con=${safe(derived2?.abilityScores?.con)}`,
      `@@FIELD@@ int=${safe(derived2?.abilityScores?.int)}`,
      `@@FIELD@@ wis=${safe(derived2?.abilityScores?.wis)}`,
      `@@FIELD@@ cha=${safe(derived2?.abilityScores?.cha)}`,
      `@@FIELD@@ str_mod=${safe(derived2?.abilityModifiers?.str)}`,
      `@@FIELD@@ dex_mod=${safe(derived2?.abilityModifiers?.dex)}`,
      `@@FIELD@@ con_mod=${safe(derived2?.abilityModifiers?.con)}`,
      `@@FIELD@@ int_mod=${safe(derived2?.abilityModifiers?.int)}`,
      `@@FIELD@@ wis_mod=${safe(derived2?.abilityModifiers?.wis)}`,
      `@@FIELD@@ cha_mod=${safe(derived2?.abilityModifiers?.cha)}`,
      "@@SECTION@@ combat",
      `@@FIELD@@ hit_points=${safe(derived2?.hitPoints)}`,
      `@@FIELD@@ armor_class=${safe(derived2?.armorClass)}`,
      `@@FIELD@@ initiative=${safe(derived2?.initiative)}`,
      `@@FIELD@@ speed=${safe(derived2?.speed)}`,
      `@@FIELD@@ passive_perception=${safe(derived2?.passivePerception)}`,
      `@@FIELD@@ proficiency_bonus=${safe(derived2?.proficiencyBonus)}`,
      `@@FIELD@@ base_attack_bonus=${safe(derived2?.baseAttackBonus)}`,
      "@@SECTION@@ selections",
      `@@LIST@@ skills=${pipeList((derived2?.selectedSkills || []).map((item) => item.name))}`,
      `@@LIST@@ feats=${pipeList((derived2?.selectedFeats || []).map((item) => item.name))}`,
      `@@LIST@@ spells=${pipeList((derived2?.selectedSpells || []).map((item) => item.name))}`,
      `@@LIST@@ items=${pipeList((derived2?.selectedItems || []).map((item) => item.name))}`,
      "@@SECTION@@ spellcasting",
      `@@FIELD@@ casting_ability=${safe(derived2?.spellcasting?.castingAbility)}`,
      `@@FIELD@@ spell_save_dc=${safe(derived2?.spellcasting?.saveDC)}`,
      `@@FIELD@@ spell_attack_bonus=${safe(derived2?.spellcasting?.spellAttackBonus)}`,
      `@@FIELD@@ spell_pick_limit=${safe(derived2?.spellcasting?.spellPickLimit)}`,
      "@@SECTION@@ validation",
      `@@FIELD@@ validation_total=${issueSummary2.total}`,
      `@@FIELD@@ validation_errors=${issueSummary2.errors}`,
      `@@FIELD@@ validation_warnings=${issueSummary2.warnings}`,
      `@@FIELD@@ validation_info=${issueSummary2.info}`,
      "@@SECTION@@ notes",
      `@@FIELD@@ character_notes=${safe(state2.notes)}`,
      "@@JSON_START@@"
    ];
    const jsonText = JSON.stringify(payload);
    const chunks = chunkString(jsonText, 96);
    for (const chunk of chunks) {
      lines.push(`@@JSON@@ ${chunk}`);
    }
    lines.push("@@JSON_END@@");
    return lines;
  }

  // src/chat/assistant.js
  var DEFAULT_REPLY = "I can help with class choice, ability scores, point-buy math, spell picks, and rule reminders for your selected edition.";
  function includesAny(text, phrases) {
    return phrases.some((phrase) => text.includes(phrase));
  }
  function topAbilitySuggestions(characterClass) {
    if (!characterClass) {
      return "Pick your class first so I can prioritize ability scores.";
    }
    const abilities = characterClass.primaryAbilities?.map((ability) => ability.toUpperCase()) || [];
    if (!abilities.length) {
      return "This class does not define primary abilities in the current data pack.";
    }
    return `Prioritize ${abilities.join(" and ")} for ${characterClass.name}. Keep Constitution solid for durability.`;
  }
  function beginnerClassSuggestion(ruleset) {
    const classPool = ruleset.classes || [];
    const picks = classPool.filter((entry) => ["fighter", "cleric", "wizard", "rogue", "ranger"].some((tag) => entry.slug.includes(tag)));
    const shortlist = picks.slice(0, 3).map((entry) => entry.name);
    if (shortlist.length === 0) {
      return "Try a class with simple combat loops and clear features in your chosen ruleset.";
    }
    return `Beginner-friendly picks for ${ruleset.name}: ${shortlist.join(", ")}.`;
  }
  function pointBuyAdvice(ruleset, total) {
    const method = ruleset.abilityMethods?.find((entry) => entry.id === "point-buy");
    if (!method) {
      return "This ruleset currently does not expose a point-buy profile.";
    }
    const remaining = method.budget - total;
    const status2 = remaining >= 0 ? `${remaining} points remaining.` : `${Math.abs(remaining)} points over budget.`;
    return `Point-buy budget is ${method.budget} (${method.min}-${method.max} per score). You are currently at ${total}. ${status2}`;
  }
  function spellAdvice(state2, ruleset, derived2) {
    const classData = ruleset.classes.find((entry) => entry.id === state2.classId);
    if (!classData) {
      return "Choose a class first so I can filter spell suggestions.";
    }
    if (!classData.spellcasting) {
      return `${classData.name} is not a primary spellcasting class in this ruleset. Focus on items, feats, and tactics.`;
    }
    const compatible = (ruleset.spells || []).filter((spell) => spell.classes.includes(classData.slug));
    const picks = compatible.filter((spell) => spell.level <= Math.max(1, state2.level - 1)).slice(0, 6).map((spell) => spell.name);
    if (!picks.length) {
      return `No matching spells were found for ${classData.name} at level ${state2.level} in the current content pack.`;
    }
    const dc = derived2.spellcasting?.saveDC ? ` Current save DC: ${derived2.spellcasting.saveDC}.` : "";
    return `Good options for ${classData.name}: ${picks.join(", ")}.${dc}`;
  }
  function issueSummary(issues2) {
    if (!issues2.length) {
      return "Build is currently valid. You can complete and print the character sheet.";
    }
    const blocking = issues2.filter((issue2) => issue2.severity === "error").length;
    const warnings = issues2.filter((issue2) => issue2.severity === "warning").length;
    return `You have ${blocking} blocking issue(s) and ${warnings} warning(s). Open the Review step for details.`;
  }
  function buildChatReply(message, context) {
    const text = message.trim().toLowerCase();
    if (!text) {
      return DEFAULT_REPLY;
    }
    const { state: state2, ruleset, derived: derived2, issues: issues2 } = context;
    const characterClass = ruleset.classes.find((entry) => entry.id === state2.classId);
    if (includesAny(text, ["hello", "hi", "hey", "help"])) {
      return `Working in ${ruleset.shortName}. Ask about class picks, point-buy, spell picks, or validation.`;
    }
    if (includesAny(text, ["beginner", "new player", "easy class"])) {
      return beginnerClassSuggestion(ruleset);
    }
    if (includesAny(text, ["ability", "stat", "score", "point buy", "point-buy"])) {
      return `${topAbilitySuggestions(characterClass)} ${pointBuyAdvice(ruleset, derived2.pointBuyTotal)}`;
    }
    if (includesAny(text, ["spell", "magic", "cantrip", "dc"])) {
      return spellAdvice(state2, ruleset, derived2);
    }
    if (includesAny(text, ["issue", "error", "valid", "validate", "wrong"])) {
      return issueSummary(issues2);
    }
    if (includesAny(text, ["item", "gear", "armor", "weapon"])) {
      const topItems = (ruleset.items || []).slice(0, 5).map((item) => item.name).join(", ");
      return `Starter gear ideas for ${ruleset.shortName}: ${topItems}. Match armor to your Dexterity and class proficiencies.`;
    }
    if (includesAny(text, ["feature", "class feature", "what do i get"])) {
      if (!characterClass) {
        return "Choose a class and level, then I can list unlocked class features.";
      }
      const features = characterClass.featuresByLevel.filter((feature) => feature.level <= state2.level).slice(0, 6).map((feature) => `${feature.name} (L${feature.level})`).join(", ");
      return features ? `Unlocked for ${characterClass.name} at level ${state2.level}: ${features}.` : `No features listed for ${characterClass.name} at level ${state2.level} in this pack.`;
    }
    return DEFAULT_REPLY;
  }

  // src/chat/aiAssistant.js
  var DEFAULT_API_BASE_URL = "http://localhost:8787";
  var MAX_HISTORY_MESSAGES = 10;
  function toArray(value) {
    return Array.isArray(value) ? [...value] : [];
  }
  function toRecord(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return {};
    }
    return { ...value };
  }
  function normalizeLevel(value) {
    const level = Number(value);
    if (!Number.isFinite(level)) {
      return 1;
    }
    return Math.min(20, Math.max(1, Math.round(level)));
  }
  function countIssues(issues2, severity) {
    return (issues2 || []).filter((issue2) => issue2.severity === severity).length;
  }
  async function parseJsonResponse(response) {
    const rawText = await response.text();
    if (!rawText) {
      return null;
    }
    try {
      return JSON.parse(rawText);
    } catch {
      throw new Error(`Expected JSON response from ${response.url || "AI endpoint"}.`);
    }
  }
  function createAssistDraft(state2, abilityDefaults) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    return {
      draftId: state2.draftId || void 0,
      rulesetId: String(state2.rulesetId || ""),
      experienceMode: state2.experienceMode === "experienced" ? "experienced" : "new",
      name: String(state2.name || ""),
      playerName: String(state2.playerName || ""),
      level: normalizeLevel(state2.level),
      alignment: String(state2.alignment || ""),
      backgroundId: String(state2.backgroundId || ""),
      speciesId: String(state2.speciesId || ""),
      classId: String(state2.classId || ""),
      subclassId: String(state2.subclassId || ""),
      notes: String(state2.notes || ""),
      abilityMethodId: String(state2.abilityMethodId || "point-buy"),
      assignedScores: {
        ...abilityDefaults,
        ...toRecord(state2.assignedScores)
      },
      selectedSkillIds: toArray(state2.selectedSkillIds),
      skillRanks: toRecord(state2.skillRanks),
      selectedFeatIds: toArray(state2.selectedFeatIds),
      selectedSpellIds: toArray(state2.selectedSpellIds),
      selectedItemIds: toArray(state2.selectedItemIds),
      createdAt: state2.createdAt || timestamp,
      updatedAt: state2.updatedAt || timestamp,
      savedAt: state2.savedAt || void 0
    };
  }
  function applyAssistPreviewToState(currentState, previewDraft, abilityDefaults) {
    return {
      ...currentState,
      ...previewDraft,
      experienceMode: previewDraft?.experienceMode === "experienced" ? "experienced" : "new",
      level: normalizeLevel(previewDraft?.level ?? currentState.level),
      assignedScores: {
        ...abilityDefaults,
        ...toRecord(previewDraft?.assignedScores ?? currentState.assignedScores)
      },
      selectedSkillIds: toArray(previewDraft?.selectedSkillIds ?? currentState.selectedSkillIds),
      skillRanks: toRecord(previewDraft?.skillRanks ?? currentState.skillRanks),
      selectedFeatIds: toArray(previewDraft?.selectedFeatIds ?? currentState.selectedFeatIds),
      selectedSpellIds: toArray(previewDraft?.selectedSpellIds ?? currentState.selectedSpellIds),
      selectedItemIds: toArray(previewDraft?.selectedItemIds ?? currentState.selectedItemIds)
    };
  }
  function normalizeChatHistory(chatMessages2) {
    return (chatMessages2 || []).filter((entry) => entry && (entry.role === "user" || entry.role === "assistant") && String(entry.text || "").trim()).slice(-MAX_HISTORY_MESSAGES).map((entry) => ({
      role: entry.role === "assistant" ? "assistant" : "user",
      content: String(entry.text).trim()
    }));
  }
  function mapLegacyStepToAiStep(activeStep2) {
    if (activeStep2 === "abilities") {
      return "abilities";
    }
    if (activeStep2 === "review") {
      return "review";
    }
    return void 0;
  }
  function buildAssistReplyEnvelope(response) {
    const appliedSummaries = (response?.appliedFields || []).map((field) => field.summary).filter(Boolean);
    const unresolvedPrompts = (response?.unresolvedQuestions || []).map((entry) => entry.prompt).filter(Boolean);
    const errors = countIssues(response?.issues, "error");
    const warnings = countIssues(response?.issues, "warning");
    const sections = [];
    if (response?.assistantMessage) {
      sections.push(String(response.assistantMessage).trim());
    }
    if (appliedSummaries.length) {
      sections.push(`Applied: ${appliedSummaries.join("; ")}.`);
    } else {
      sections.push("Applied: no builder fields changed on this turn.");
    }
    if (unresolvedPrompts.length) {
      sections.push(`Still needed: ${unresolvedPrompts.join(" ")}`);
    }
    sections.push(`Validation now shows ${errors} error(s) and ${warnings} warning(s).`);
    return sections.join("\n\n");
  }
  async function fetchAiModelCatalog(apiBaseUrl = DEFAULT_API_BASE_URL) {
    try {
      const response = await fetch(`${apiBaseUrl}/api/ai/models`, {
        headers: {
          Accept: "application/json"
        },
        cache: "no-store"
      });
      const payload = await parseJsonResponse(response);
      if (!response.ok) {
        throw new Error(payload?.message || `Model catalog request failed with ${response.status}.`);
      }
      return {
        available: Boolean(payload?.available),
        defaultModel: payload?.defaultModel || null,
        models: Array.isArray(payload?.models) ? payload.models : [],
        reason: payload?.reason || ""
      };
    } catch (error) {
      return {
        available: false,
        defaultModel: null,
        models: [],
        reason: error instanceof Error ? error.message : "Unable to reach the AI model catalog."
      };
    }
  }
  async function requestCharacterAssist({
    apiBaseUrl = DEFAULT_API_BASE_URL,
    messages,
    currentDraft,
    activeStep: activeStep2,
    model
  }) {
    const response = await fetch(`${apiBaseUrl}/api/ai/character-assist`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      cache: "no-store",
      body: JSON.stringify({
        messages,
        currentDraft,
        ...activeStep2 ? { activeStep: activeStep2 } : {},
        ...model ? { model } : {}
      })
    });
    const payload = await parseJsonResponse(response);
    if (!response.ok) {
      throw new Error(payload?.message || `Character assist request failed with ${response.status}.`);
    }
    return payload;
  }

  // src/main.js
  var dom = {
    rulesetSelect: document.querySelector("#rulesetSelect"),
    experienceMode: document.querySelector("#experienceMode"),
    characterName: document.querySelector("#characterName"),
    playerName: document.querySelector("#playerName"),
    characterLevel: document.querySelector("#characterLevel"),
    alignmentSelect: document.querySelector("#alignmentSelect"),
    backgroundSelect: document.querySelector("#backgroundSelect"),
    speciesSelect: document.querySelector("#speciesSelect"),
    classSelect: document.querySelector("#classSelect"),
    subclassSelect: document.querySelector("#subclassSelect"),
    characterNotes: document.querySelector("#characterNotes"),
    abilityMethodSelect: document.querySelector("#abilityMethodSelect"),
    abilityMethodSummary: document.querySelector("#abilityMethodSummary"),
    abilityTable: document.querySelector("#abilityTable"),
    pointBuyPill: document.querySelector("#pointBuyPill"),
    validationPill: document.querySelector("#validationPill"),
    applyStandardArrayBtn: document.querySelector("#applyStandardArrayBtn"),
    resetAbilitiesBtn: document.querySelector("#resetAbilitiesBtn"),
    skillsList: document.querySelector("#skillsList"),
    featsList: document.querySelector("#featsList"),
    spellsList: document.querySelector("#spellsList"),
    itemsList: document.querySelector("#itemsList"),
    skillsLimitLabel: document.querySelector("#skillsLimitLabel"),
    spellSearch: document.querySelector("#spellSearch"),
    itemSearch: document.querySelector("#itemSearch"),
    validateBtn: document.querySelector("#validateBtn"),
    saveDraftBtn: document.querySelector("#saveDraftBtn"),
    newCharacterBtn: document.querySelector("#newCharacterBtn"),
    exportJsonBtn: document.querySelector("#exportJsonBtn"),
    exportPdfBtn: document.querySelector("#exportPdfBtn"),
    importJsonInput: document.querySelector("#importJsonInput"),
    savedDraftsSelect: document.querySelector("#savedDraftsSelect"),
    loadDraftBtn: document.querySelector("#loadDraftBtn"),
    deleteDraftBtn: document.querySelector("#deleteDraftBtn"),
    useInGameBtn: document.querySelector("#useInGameBtn"),
    randomizeCharacterBtn: document.querySelector("#randomizeCharacterBtn"),
    completeBuildBtn: document.querySelector("#completeBuildBtn"),
    printSheetBtn: document.querySelector("#printSheetBtn"),
    statusMessage: document.querySelector("#statusMessage"),
    validationList: document.querySelector("#validationList"),
    coveragePanel: document.querySelector("#coveragePanel"),
    sheetContainer: document.querySelector("#sheetContainer"),
    stepButtons: Array.from(document.querySelectorAll(".step")),
    stepPanels: Array.from(document.querySelectorAll("[data-step-panel]")),
    rulesetTip: document.querySelector("#rulesetTip"),
    abilityTip: document.querySelector("#abilityTip"),
    setupExplainers: document.querySelector("#setupExplainers"),
    buildExplainers: document.querySelector("#buildExplainers"),
    licenseNotice: document.querySelector("#licenseNotice"),
    chatModePill: document.querySelector("#chatModePill"),
    chatModelSelect: document.querySelector("#chatModelSelect"),
    chatStatusNote: document.querySelector("#chatStatusNote"),
    chatLog: document.querySelector("#chatLog"),
    chatInput: document.querySelector("#chatInput"),
    chatSendBtn: document.querySelector("#chatSendBtn")
  };
  var ABILITY_KEYS2 = ABILITY_NAMES.map((ability) => ability.key);
  var state = createInitialState(RULESETS[0]);
  var derived = null;
  var issues = [];
  var activeStep = "setup";
  var chatMessages = [
    {
      role: "assistant",
      text: "Describe the character you want in plain English and I will fill the builder for you. If Ollama is offline, this panel falls back to guide answers."
    }
  ];
  var aiState = {
    initialized: false,
    loading: false,
    available: false,
    selectedModel: "",
    models: [],
    reason: "Checking local AI availability...",
    busy: false
  };
  var ALIGNMENT_GUIDE = {
    "Lawful Good": {
      meaning: "Honorable hero who follows codes and protects others.",
      impact: "Mostly roleplay tone; some tables and spells interact with moral alignment."
    },
    "Neutral Good": {
      meaning: "Kind and practical, helping people without strict ideology.",
      impact: "Great flexible roleplay baseline for cooperative parties."
    },
    "Chaotic Good": {
      meaning: "Compassionate rebel who distrusts rigid systems.",
      impact: "Roleplay freedom; can clash with highly lawful party members."
    },
    "Lawful Neutral": {
      meaning: "Values order, duty, and structure over personal feelings.",
      impact: "Strong for disciplined archetypes like judges, soldiers, and monks."
    },
    "True Neutral": {
      meaning: "Balanced worldview focused on pragmatism and survival.",
      impact: "Easiest alignment to roleplay in mixed-morality groups."
    },
    "Chaotic Neutral": {
      meaning: "Highly independent and anti-authority personality.",
      impact: "Can be fun, but needs party-aware roleplay to avoid disruption."
    },
    "Lawful Evil": {
      meaning: "Ambitious and ruthless within strict personal rules.",
      impact: "Works only if your table supports morally dark characters."
    },
    "Neutral Evil": {
      meaning: "Self-serving and opportunistic without loyalty to causes.",
      impact: "High conflict potential; coordinate with your DM and party."
    },
    "Chaotic Evil": {
      meaning: "Destructive, impulsive, and violently selfish.",
      impact: "Rarely party-friendly; often unsuitable for standard campaigns."
    }
  };
  var SKILL_GUIDE = {
    acrobatics: "Balance, tumbling, and escaping grapples.",
    "animal-handling": "Calm animals, mount control, and handling beasts.",
    arcana: "Magic knowledge, spell theory, and planar lore.",
    athletics: "Climb, swim, shove, and grapple strength tests.",
    deception: "Bluff, lies, and misleading others.",
    history: "Recall empires, wars, lineages, and events.",
    insight: "Read motives, emotions, and social tells.",
    intimidation: "Force outcomes through threat or presence.",
    investigation: "Deduce clues and inspect evidence.",
    medicine: "Stabilize allies and diagnose conditions.",
    nature: "Understand wilderness, creatures, and terrain.",
    perception: "Spot hidden threats and hear subtle clues.",
    performance: "Music, acting, speech, and stage presence.",
    persuasion: "Negotiate, influence, and build trust.",
    religion: "Know deities, rites, and divine traditions.",
    "sleight-of-hand": "Pickpocketing and precise hand tricks.",
    stealth: "Move quietly and stay unseen.",
    survival: "Track creatures and navigate wild areas.",
    appraise: "Estimate item value and authenticity.",
    bluff: "Convince with misinformation.",
    concentration: "Maintain focus while under pressure.",
    "disable-device": "Disarm traps and disable mechanisms.",
    "gather-information": "Collect rumors and local intel.",
    hide: "Remain unseen in cover and shadow.",
    "knowledge-arcana": "Arcane systems and magical creatures.",
    "knowledge-history": "Historical events and old conflicts.",
    "move-silently": "Avoid making noise while moving.",
    "open-lock": "Bypass locks and secured entries.",
    "sense-motive": "Detect lies and bad intent.",
    spellcraft: "Identify active spells and magical effects.",
    spot: "Visual awareness and threat detection.",
    tumble: "Move through danger without provoking attacks.",
    "use-magic-device": "Activate magic items outside your class."
  };
  var RANDOM_NAME_PREFIXES = ["Ael", "Bryn", "Cor", "Dra", "Eri", "Fen", "Garr", "Ily", "Kael", "Lys", "Mira", "Nyx", "Orin", "Pere", "Quin", "Ryn", "Syl", "Ther", "Vael", "Zor"];
  var RANDOM_NAME_SUFFIXES = ["ador", "bryn", "cinder", "dell", "en", "fira", "gorn", "hollow", "ian", "jara", "kas", "lor", "myr", "neth", "or", "pris", "quil", "rion", "sorin", "thas"];
  var RANDOM_PLAYER_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Riley", "Cameron", "Avery", "Logan", "Casey", "Rowan"];
  var RANDOM_NOTES_OPENERS = [
    "Hunts rumors of an ancient relic.",
    "Seeks redemption for a failed oath.",
    "Protects a secret tied to their bloodline.",
    "Owes a dangerous favor to a hidden patron.",
    "Believes fate marked them for this quest."
  ];
  var RANDOM_NOTES_TWISTS = [
    "Distrusts nobility but respects honest soldiers.",
    "Never refuses a fair duel.",
    "Collects strange maps and coded journals.",
    "Will always aid children and common folk first.",
    "Keeps a coded letter they refuse to burn."
  ];
  function createInitialState(ruleset) {
    return {
      draftId: "",
      rulesetId: ruleset.id,
      experienceMode: "new",
      name: "",
      playerName: "",
      level: 1,
      alignment: ruleset.alignments[0] || "",
      backgroundId: ruleset.backgrounds[0]?.id || "",
      speciesId: ruleset.species[0]?.id || "",
      classId: ruleset.classes[0]?.id || "",
      subclassId: ruleset.classes[0]?.subclasses?.[0]?.id || "",
      notes: "",
      abilityMethodId: ruleset.abilityMethods[0]?.id || "point-buy",
      assignedScores: { ...DEFAULT_ABILITY_SCORES },
      selectedSkillIds: [],
      skillRanks: {},
      selectedFeatIds: [],
      selectedSpellIds: [],
      selectedItemIds: [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  function status(message) {
    dom.statusMessage.textContent = message;
  }
  function currentRuleset() {
    return getRulesetById(state.rulesetId);
  }
  function escapeHtml(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function trimChatMessages() {
    if (chatMessages.length > 50) {
      chatMessages = chatMessages.slice(chatMessages.length - 50);
    }
  }
  function updateChatModePill(tone, text) {
    dom.chatModePill.className = `chat-status-pill chat-status-pill--${tone}`;
    dom.chatModePill.textContent = text;
  }
  function renderChatStatus() {
    if (aiState.loading) {
      updateChatModePill("checking", "Checking AI...");
      dom.chatStatusNote.textContent = "Probing the local API and Ollama model catalog.";
      dom.chatModelSelect.innerHTML = "<option value=''>Checking Ollama...</option>";
      dom.chatModelSelect.disabled = true;
      return;
    }
    if (aiState.available) {
      const modelOptions = aiState.models.map((model) => {
        const selected = model.name === aiState.selectedModel ? "selected" : "";
        return `<option value="${escapeHtml(model.name)}" ${selected}>${escapeHtml(model.name)}</option>`;
      }).join("");
      dom.chatModelSelect.innerHTML = modelOptions || "<option value=''>Default model</option>";
      dom.chatModelSelect.disabled = aiState.busy || aiState.models.length <= 1;
      updateChatModePill("ready", `AI Ready${aiState.selectedModel ? `: ${aiState.selectedModel}` : ""}`);
      dom.chatStatusNote.textContent = "Free text now auto-fills the builder through Ollama. Send a follow-up message any time to refine the current draft.";
      return;
    }
    dom.chatModelSelect.innerHTML = "<option value=''>Guide mode</option>";
    dom.chatModelSelect.disabled = true;
    updateChatModePill("offline", "Guide Mode");
    dom.chatStatusNote.textContent = aiState.reason ? `AI autofill is offline: ${aiState.reason}` : "AI autofill is offline. This panel still answers with deterministic guide help.";
  }
  function setChatBusy(isBusy) {
    aiState.busy = isBusy;
    dom.chatSendBtn.disabled = isBusy;
    dom.chatInput.disabled = isBusy;
    renderChatStatus();
  }
  async function ensureAiCatalog(force = false) {
    if (aiState.loading) {
      return;
    }
    if (aiState.initialized && !force) {
      return;
    }
    aiState.loading = true;
    renderChatStatus();
    const catalog = await fetchAiModelCatalog();
    aiState.loading = false;
    aiState.initialized = true;
    aiState.available = Boolean(catalog.available && catalog.models?.length);
    aiState.models = catalog.models || [];
    aiState.reason = catalog.reason || (aiState.available ? "" : "The local API or Ollama is unavailable.");
    if (!aiState.models.some((entry) => entry.name === aiState.selectedModel)) {
      aiState.selectedModel = catalog.defaultModel || aiState.models[0]?.name || "";
    }
    renderChatStatus();
  }
  function optionHtml(items, selectedId, includeEmpty = false, emptyLabel = "Select...") {
    const options = [];
    if (includeEmpty) {
      options.push(`<option value="">${emptyLabel}</option>`);
    }
    for (const item of items || []) {
      const selected = item.id === selectedId ? "selected" : "";
      options.push(`<option value="${item.id}" ${selected}>${item.name}</option>`);
    }
    return options.join("");
  }
  function textOptionHtml(items, selectedValue) {
    return (items || []).map((entry) => {
      const selected = entry === selectedValue ? "selected" : "";
      return `<option value="${entry}" ${selected}>${entry}</option>`;
    }).join("");
  }
  function toSentence(value, fallback = "Not specified") {
    const text = String(value || "").trim();
    return text ? text : fallback;
  }
  function listToText(values, fallback = "None") {
    if (!values || !values.length) {
      return fallback;
    }
    return values.join(", ");
  }
  function slugify2(value) {
    return String(value || "character").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "character";
  }
  function randomInt(min, max) {
    const start = Math.ceil(Math.min(min, max));
    const end = Math.floor(Math.max(min, max));
    return Math.floor(Math.random() * (end - start + 1)) + start;
  }
  function pickRandom(collection) {
    if (!collection?.length) {
      return null;
    }
    return collection[randomInt(0, collection.length - 1)];
  }
  function shuffleCopy(collection) {
    const copy = [...collection || []];
    for (let idx = copy.length - 1; idx > 0; idx -= 1) {
      const swapIdx = randomInt(0, idx);
      [copy[idx], copy[swapIdx]] = [copy[swapIdx], copy[idx]];
    }
    return copy;
  }
  function randomSubsetIds(collection, count) {
    if (!collection?.length || count <= 0) {
      return [];
    }
    return shuffleCopy(collection).slice(0, Math.min(count, collection.length)).map((entry) => entry.id);
  }
  function randomCharacterName() {
    const first = pickRandom(RANDOM_NAME_PREFIXES) || "Nyx";
    const second = pickRandom(RANDOM_NAME_SUFFIXES) || "en";
    return `${first}${second}`;
  }
  function randomPlayerName() {
    return pickRandom(RANDOM_PLAYER_NAMES) || "Player";
  }
  function randomCharacterNotes() {
    const opener = pickRandom(RANDOM_NOTES_OPENERS) || "";
    const twist = pickRandom(RANDOM_NOTES_TWISTS) || "";
    return `${opener} ${twist}`.trim();
  }
  function randomizeAbilityScores(method) {
    const safeMin = Number.isFinite(method?.min) ? Number(method.min) : 8;
    const safeMax = Number.isFinite(method?.max) ? Number(method.max) : 15;
    if (method?.id === "standard-array" && Array.isArray(method.array) && method.array.length >= ABILITY_KEYS2.length) {
      const randomArray = shuffleCopy(method.array).slice(0, ABILITY_KEYS2.length);
      return Object.fromEntries(ABILITY_KEYS2.map((key, idx) => [key, Number(randomArray[idx])]));
    }
    if (method?.id === "point-buy" && method?.costTable && Number.isFinite(method?.budget)) {
      const scores = Object.fromEntries(ABILITY_KEYS2.map((key) => [key, safeMin]));
      const costFor = (score) => Number(method.costTable?.[score]);
      let currentTotal = ABILITY_KEYS2.reduce((sum, key) => sum + costFor(scores[key]), 0);
      if (!Number.isFinite(currentTotal)) {
        return { ...DEFAULT_ABILITY_SCORES };
      }
      let remaining = Number(method.budget) - currentTotal;
      let guard = 0;
      while (remaining > 0 && guard < 256) {
        guard += 1;
        const candidates = ABILITY_KEYS2.filter((key) => {
          const current2 = scores[key];
          const next2 = current2 + 1;
          if (next2 > safeMax) {
            return false;
          }
          const delta2 = costFor(next2) - costFor(current2);
          return Number.isFinite(delta2) && delta2 > 0 && delta2 <= remaining;
        });
        if (!candidates.length) {
          break;
        }
        const abilityKey = pickRandom(candidates);
        const current = scores[abilityKey];
        const next = current + 1;
        const delta = costFor(next) - costFor(current);
        scores[abilityKey] = next;
        remaining -= delta;
      }
      return scores;
    }
    return Object.fromEntries(
      ABILITY_KEYS2.map((key) => [key, randomInt(safeMin, safeMax)])
    );
  }
  function randomizeCharacter() {
    const ruleset = currentRuleset();
    const levelMin = ruleset?.levelBounds?.min ?? 1;
    const levelMax = ruleset?.levelBounds?.max ?? 20;
    const randomClass = pickRandom(ruleset.classes) || ruleset.classes[0];
    const randomMethod = pickRandom(ruleset.abilityMethods) || ruleset.abilityMethods[0];
    state.name = randomCharacterName();
    state.playerName = randomPlayerName();
    state.level = randomInt(levelMin, levelMax);
    state.alignment = pickRandom(ruleset.alignments) || state.alignment;
    state.backgroundId = pickRandom(ruleset.backgrounds)?.id || "";
    state.speciesId = pickRandom(ruleset.species)?.id || "";
    state.classId = randomClass?.id || "";
    state.subclassId = pickRandom(randomClass?.subclasses || [])?.id || "";
    state.notes = randomCharacterNotes();
    state.abilityMethodId = randomMethod?.id || state.abilityMethodId;
    state.assignedScores = randomizeAbilityScores(randomMethod);
    const classSkillLimit = Math.max(0, Number(randomClass?.skillChoices || 0));
    state.selectedSkillIds = randomSubsetIds(ruleset.skills, classSkillLimit);
    state.skillRanks = {};
    const featMax = Math.min(3, ruleset.feats.length);
    const featCount = featMax > 0 ? randomInt(1, featMax) : 0;
    state.selectedFeatIds = randomSubsetIds(ruleset.feats, featCount);
    const itemMax = Math.min(6, ruleset.items.length);
    const itemMin = Math.min(2, itemMax);
    const itemCount = itemMax > 0 ? randomInt(itemMin, itemMax) : 0;
    state.selectedItemIds = randomSubsetIds(ruleset.items, itemCount);
    state.selectedSpellIds = [];
    const derivedCandidate = deriveCharacterSheet(state, RULESETS);
    if (derivedCandidate?.spellcasting?.spellPickLimit) {
      const spellLimit = Math.min(Number(derivedCandidate.spellcasting.spellPickLimit), ruleset.spells.length);
      const cappedMax = Math.min(12, spellLimit);
      const spellMin = Math.min(2, cappedMax);
      const spellCount = cappedMax > 0 ? randomInt(spellMin, cappedMax) : 0;
      state.selectedSpellIds = randomSubsetIds(ruleset.spells, spellCount);
    }
    syncFormToState();
    recompute();
    changeStep("setup");
    status("Randomized a full character build. Press Randomize Character again to reroll.");
  }
  function getSkillDescription(skill) {
    if (!skill) {
      return "Skill details unavailable.";
    }
    return SKILL_GUIDE[skill.slug] || `${skill.name} tests your ${String(skill.ability || "").toUpperCase()} ability in play.`;
  }
  function classImpactText(characterClass, ruleset) {
    if (!characterClass) {
      return "Choose a class to see your core gameplay loop.";
    }
    const primary = (characterClass.primaryAbilities || []).map((value) => value.toUpperCase()).join(", ");
    const hitDie = characterClass.hitDie ? `d${characterClass.hitDie}` : "variable";
    const spellFlag = characterClass.spellcasting ? "Includes spellcasting progression." : "Primarily non-spellcasting.";
    if (ruleset.family === "3.5e") {
      const bab = characterClass.baseAttackProgression || "mixed";
      return `Primary abilities: ${primary}. Hit Die: ${hitDie}. BAB progression: ${bab}. ${spellFlag}`;
    }
    return `Primary abilities: ${primary}. Hit Die: ${hitDie}. ${spellFlag}`;
  }
  function renderExplainerCards(container, cards) {
    if (!container) {
      return;
    }
    if (!cards.length) {
      container.innerHTML = "<p class='helper'>No explainer content available yet.</p>";
      return;
    }
    container.innerHTML = cards.map((card) => {
      return `
        <article class="explainer-card">
          <h4>${card.title}</h4>
          <p>${card.body}</p>
          <p class="impact"><strong>Impact:</strong> ${card.impact}</p>
        </article>
      `;
    }).join("");
  }
  function renderSetupExplainers() {
    const ruleset = currentRuleset();
    const alignment = state.alignment;
    const alignmentGuide = ALIGNMENT_GUIDE[alignment] || {
      meaning: "Represents your character's moral and ethical tendencies.",
      impact: "Usually roleplay-facing, with occasional mechanical hooks."
    };
    const background = findById(ruleset.backgrounds, state.backgroundId);
    const species = findById(ruleset.species, state.speciesId);
    const characterClass = findClassById(ruleset, state.classId);
    const subclass = findById(characterClass?.subclasses, state.subclassId);
    const backgroundBody = background ? `${background.name} describes where your character came from. It grants skills/tools/languages and thematic story hooks.` : "Background describes your prior life before adventuring.";
    const backgroundImpact = background ? `Skills: ${listToText(background.skillProficiencies)}. Tools: ${listToText(background.toolProficiencies)}.` : "Background selection shapes starting proficiencies.";
    const speciesBody = species ? `${species.name} defines innate traits like speed, senses, and ancestry features.` : "Species/race defines innate traits and movement profile.";
    const speciesImpact = species ? `Speed ${species.speed} ft. Traits: ${listToText(species.traits)}.` : "Species choice affects traits and stat tendencies.";
    const classBody = characterClass ? `${characterClass.name} is your core adventuring role and determines your level progression.` : "Class defines combat role, hit points, proficiencies, and core abilities.";
    const subclassBody = subclass ? `${subclass.name} is your specialization path inside ${characterClass?.name || "your class"}.` : "Subclass is a specialization chosen after early class levels.";
    const subclassImpact = subclass ? "Specialization changes features, tactics, and often spell or combat style." : "Subclass unlock level depends on class and ruleset.";
    renderExplainerCards(dom.setupExplainers, [
      {
        title: "Alignment",
        body: toSentence(alignmentGuide.meaning),
        impact: toSentence(alignmentGuide.impact)
      },
      {
        title: "Background",
        body: backgroundBody,
        impact: backgroundImpact
      },
      {
        title: "Species / Race",
        body: speciesBody,
        impact: speciesImpact
      },
      {
        title: "Class",
        body: classBody,
        impact: classImpactText(characterClass, ruleset)
      },
      {
        title: "Subclass",
        body: subclassBody,
        impact: subclassImpact
      }
    ]);
  }
  function renderBuildExplainers() {
    const ruleset = currentRuleset();
    const selectedSkills = (ruleset.skills || []).filter((skill) => (state.selectedSkillIds || []).includes(skill.id));
    const selectedSpells = (ruleset.spells || []).filter((spell) => (state.selectedSpellIds || []).includes(spell.id));
    const spellcasting = derived?.spellcasting;
    const cards = [
      {
        title: "What Skills Are",
        body: "Skills are non-combat capability checks: exploration, social play, and problem solving.",
        impact: ruleset.family === "5e" ? "Proficient skills add your proficiency bonus to the linked ability modifier." : "Marked skills represent trained focus areas and improve your reliability in those checks."
      },
      {
        title: "What Spells Are",
        body: "Spells are magical actions tied to class lists, spell level, and casting resources.",
        impact: spellcasting ? `Your current casting setup: ${spellcasting.castingAbility.toUpperCase()} casting, DC ${spellcasting.saveDC}, estimated picks ${spellcasting.spellPickLimit}.` : "If your class has no spellcasting, spells are optional flavor references and not core mechanics."
      }
    ];
    for (const skill of selectedSkills.slice(0, 3)) {
      cards.push({
        title: `Skill: ${skill.name}`,
        body: getSkillDescription(skill),
        impact: `Uses ${String(skill.ability || "").toUpperCase()} modifier when rolled.`
      });
    }
    for (const spell of selectedSpells.slice(0, 3)) {
      cards.push({
        title: `Spell: ${spell.name}`,
        body: `${spell.description} (${spell.school}, level ${spell.level})`,
        impact: `Casting time: ${spell.castingTime}. Range: ${spell.range}. Duration: ${spell.duration}.`
      });
    }
    renderExplainerCards(dom.buildExplainers, cards);
  }
  function renderRulesetSelect() {
    dom.rulesetSelect.innerHTML = RULESETS.map((ruleset) => {
      const selected = ruleset.id === state.rulesetId ? "selected" : "";
      return `<option value="${ruleset.id}" ${selected}>${ruleset.name}</option>`;
    }).join("");
  }
  function applyRulesetDefaults(ruleset) {
    state.rulesetId = ruleset.id;
    state.level = 1;
    state.alignment = ruleset.alignments[0] || "";
    state.backgroundId = ruleset.backgrounds[0]?.id || "";
    state.speciesId = ruleset.species[0]?.id || "";
    state.classId = ruleset.classes[0]?.id || "";
    state.subclassId = ruleset.classes[0]?.subclasses?.[0]?.id || "";
    state.abilityMethodId = ruleset.abilityMethods[0]?.id || "point-buy";
    state.assignedScores = { ...DEFAULT_ABILITY_SCORES };
    state.selectedSkillIds = [];
    state.skillRanks = {};
    state.selectedFeatIds = [];
    state.selectedSpellIds = [];
    state.selectedItemIds = [];
  }
  function syncFormToState() {
    const ruleset = currentRuleset();
    dom.experienceMode.value = state.experienceMode;
    dom.characterName.value = state.name;
    dom.playerName.value = state.playerName;
    dom.characterLevel.value = String(state.level);
    dom.alignmentSelect.innerHTML = textOptionHtml(ruleset.alignments, state.alignment);
    dom.backgroundSelect.innerHTML = optionHtml(ruleset.backgrounds, state.backgroundId);
    dom.speciesSelect.innerHTML = optionHtml(ruleset.species, state.speciesId);
    dom.classSelect.innerHTML = optionHtml(ruleset.classes, state.classId);
    const selectedClass = findClassById(ruleset, state.classId);
    const subclasses = selectedClass?.subclasses || [];
    if (!subclasses.some((entry) => entry.id === state.subclassId)) {
      state.subclassId = subclasses[0]?.id || "";
    }
    dom.subclassSelect.innerHTML = optionHtml(subclasses, state.subclassId, true, "None");
    dom.characterNotes.value = state.notes;
    dom.abilityMethodSelect.innerHTML = optionHtml(
      ruleset.abilityMethods.map((method) => ({ id: method.id, name: method.name })),
      state.abilityMethodId
    );
    renderAbilityTable();
    renderChoiceLists();
    renderRulesetHints();
    renderSetupExplainers();
    renderBuildExplainers();
    refreshSavedDraftOptions();
  }
  function renderRulesetHints() {
    const ruleset = currentRuleset();
    dom.rulesetTip.textContent = ruleset.beginnerTips[0] || "";
    dom.abilityTip.textContent = state.experienceMode === "new" ? ruleset.beginnerTips[1] || "Use the recommended method and class priorities." : "Expert mode enabled: condensed helpers and direct editing.";
    dom.licenseNotice.textContent = ruleset.licenseNotice;
    if (state.experienceMode === "experienced") {
      document.body.classList.add("experienced-mode");
    } else {
      document.body.classList.remove("experienced-mode");
    }
  }
  function renderAbilityTable() {
    const ruleset = currentRuleset();
    const method = findById(ruleset.abilityMethods, state.abilityMethodId) || ruleset.abilityMethods[0];
    dom.abilityTable.innerHTML = ABILITY_NAMES.map((ability) => {
      const value = Number(state.assignedScores[ability.key] ?? DEFAULT_ABILITY_SCORES[ability.key]);
      const min = method?.min ?? 1;
      const max = method?.max ?? 20;
      return `
      <div class="ability-row">
        <div>
          <strong>${ability.short}</strong>
          <div class="ability-meta">${ability.label}</div>
        </div>
        <input type="number" min="${min}" max="${max}" value="${value}" data-ability-key="${ability.key}" />
        <div>${value >= 10 ? "+" : ""}${Math.floor((value - 10) / 2)}</div>
        <div class="ability-meta">${ability.description}</div>
      </div>
    `;
    }).join("");
    if (method?.id === "point-buy") {
      dom.abilityMethodSummary.textContent = `${method.description} Budget: ${method.budget}, range ${method.min}-${method.max}.`;
    } else if (method?.id === "standard-array") {
      dom.abilityMethodSummary.textContent = `${method.description}`;
    } else {
      dom.abilityMethodSummary.textContent = method?.description || "";
    }
    const pointBuyTotal = calculatePointBuyTotal(state.assignedScores, method);
    if (method?.id === "point-buy") {
      const remaining = method.budget - pointBuyTotal;
      dom.pointBuyPill.textContent = `Point-buy: ${pointBuyTotal}/${method.budget} (${remaining} remaining)`;
    } else {
      dom.pointBuyPill.textContent = `Method: ${method?.name || "Manual"}`;
    }
  }
  function buildListMarkup(items, selectedIds, buildMeta) {
    const selected = new Set(selectedIds || []);
    if (!items.length) {
      return "<p class='helper'>No options available for this ruleset.</p>";
    }
    return items.map((item) => {
      const checked = selected.has(item.id) ? "checked" : "";
      const meta = buildMeta(item);
      return `
        <label class="list-item">
          <input type="checkbox" data-item-id="${item.id}" ${checked} />
          <span class="list-item-content">
            <span class="list-item-title">${item.name}</span>
            <span class="list-item-meta">${meta}</span>
          </span>
        </label>
      `;
    }).join("");
  }
  function renderChoiceLists() {
    const ruleset = currentRuleset();
    const characterClass = findClassById(ruleset, state.classId);
    const skillChoices = Number(characterClass?.skillChoices || 0);
    dom.skillsLimitLabel.textContent = String(skillChoices);
    dom.skillsList.innerHTML = buildListMarkup(ruleset.skills, state.selectedSkillIds, (skill) => {
      const ability = skill.ability ? skill.ability.toUpperCase() : "";
      return `${ability} skill | ${getSkillDescription(skill)}`;
    });
    dom.featsList.innerHTML = buildListMarkup(ruleset.feats, state.selectedFeatIds, (feat) => feat.description || "Feat");
    const spellQuery = dom.spellSearch.value.trim().toLowerCase();
    const filteredSpells = ruleset.spells.filter((spell) => {
      if (!spellQuery) {
        return true;
      }
      const haystack = `${spell.name} ${spell.school} ${spell.classes.join(" ")}`.toLowerCase();
      return haystack.includes(spellQuery);
    });
    dom.spellsList.innerHTML = buildListMarkup(filteredSpells, state.selectedSpellIds, (spell) => {
      return `Lvl ${spell.level} ${spell.school} | ${spell.castingTime} | ${spell.classes.join(", ")}`;
    });
    const itemQuery = dom.itemSearch.value.trim().toLowerCase();
    const filteredItems = ruleset.items.filter((item) => {
      if (!itemQuery) {
        return true;
      }
      const haystack = `${item.name} ${item.category} ${item.properties}`.toLowerCase();
      return haystack.includes(itemQuery);
    });
    dom.itemsList.innerHTML = buildListMarkup(filteredItems, state.selectedItemIds, (item) => {
      return `${item.category} | ${item.cost}`;
    });
  }
  function renderValidationList() {
    if (!issues.length) {
      dom.validationList.innerHTML = "<p class='helper'>No issues. Build is valid.</p>";
      return;
    }
    dom.validationList.innerHTML = issues.map((item) => {
      return `
        <div class="issue ${item.severity}">
          <div class="issue-title">${item.code}</div>
          <div class="issue-message">${item.message}</div>
        </div>
      `;
    }).join("");
  }
  function renderCoveragePanel() {
    if (!dom.coveragePanel) {
      return;
    }
    const report = getCoverageReport(state.rulesetId);
    const card = (label, count, target, pct) => `
    <div class="coverage-card">
      <strong>${label}</strong>
      <span>${count}${target ? ` / ${target}` : ""} (${pct}%)</span>
    </div>
  `;
    dom.coveragePanel.innerHTML = `
    <h4>Content Coverage Snapshot</h4>
      <p class="helper">Content coverage compares the current pack size against configured SRD-oriented targets.</p>
    <div class="coverage-grid">
      ${card("Spells", report.counts.spells, report.targets.spells, report.percentages.spells)}
      ${card("Items", report.counts.items, report.targets.items, report.percentages.items)}
      ${card("Feats", report.counts.feats, report.targets.feats, report.percentages.feats)}
      ${card("Classes", report.counts.classes, report.targets.classes, report.percentages.classes)}
      ${card("Species", report.counts.species, report.targets.species, report.percentages.species)}
      ${card("Backgrounds", report.counts.backgrounds, report.targets.backgrounds, report.percentages.backgrounds)}
    </div>
    <p class="helper">Class feature progression coverage: ${report.percentages.classFeatureProgression}% (based on max feature levels currently represented).</p>
  `;
  }
  function recompute() {
    state.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    derived = deriveCharacterSheet(state, RULESETS);
    issues = validateCharacter(state, RULESETS);
    const blocking = issues.filter((item) => item.severity === "error").length;
    const warnings = issues.filter((item) => item.severity === "warning").length;
    dom.validationPill.textContent = `Validation: ${blocking} errors, ${warnings} warnings`;
    renderSheet(dom.sheetContainer, state, derived, issues);
    renderValidationList();
    renderCoveragePanel();
    renderRulesetHints();
    renderSetupExplainers();
    renderBuildExplainers();
  }
  function changeStep(step) {
    activeStep = step;
    for (const button of dom.stepButtons) {
      button.classList.toggle("is-active", button.dataset.step === step);
    }
    for (const panel of dom.stepPanels) {
      panel.classList.toggle("hidden", panel.dataset.stepPanel !== step);
    }
  }
  function updateSelectionList(key, id, checked, limit = null) {
    const next = new Set(state[key] || []);
    if (checked) {
      if (limit != null && next.size >= limit) {
        status(`Selection limit reached (${limit}).`);
        return false;
      }
      next.add(id);
    } else {
      next.delete(id);
    }
    state[key] = Array.from(next);
    return true;
  }
  function handleCompleteBuild() {
    recompute();
    const blocking = issues.filter((item) => item.severity === "error").length;
    if (blocking > 0) {
      changeStep("review");
      status(`Cannot complete yet. Resolve ${blocking} blocking issue(s).`);
      return;
    }
    status(`Character completed at ${(/* @__PURE__ */ new Date()).toLocaleString()}. Print or export from Review.`);
    changeStep("review");
  }
  function sendCharacterToGameSession() {
    recompute();
    const blocking = issues.filter((item) => item.severity === "error").length;
    if (blocking > 0) {
      changeStep("review");
      status(`Resolve ${blocking} blocking issue(s) before using this character in-game.`);
      return;
    }
    if (!derived) {
      status("No derived character sheet is available yet.");
      return;
    }
    const payload = buildParsableCharacterPayload(state, derived, issues);
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "forge-character:use-in-dm",
          payload
        },
        "*"
      );
      status("Sent character to the session handoff. It will be imported into the game session automatically.");
      return;
    }
    status("Session handoff works when this creator is embedded in the DM desktop app.");
  }
  function registerGameSessionBridge() {
    window.addEventListener("message", (event) => {
      const data = event?.data;
      if (!data || typeof data !== "object") {
        return;
      }
      if (data.type !== "forge-character:use-result") {
        return;
      }
      const message = String(data.message || "DM app responded.");
      status(message);
    });
  }
  function snapshotDraft() {
    return {
      ...state,
      draftId: state.draftId || (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`),
      savedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  function refreshSavedDraftOptions() {
    const drafts = getSavedDrafts();
    if (!drafts.length) {
      dom.savedDraftsSelect.innerHTML = "<option value=''>No saved drafts</option>";
      return;
    }
    dom.savedDraftsSelect.innerHTML = drafts.map((draft) => {
      const name = draft.name || "Unnamed Character";
      const selected = draft.draftId === state.draftId ? "selected" : "";
      return `<option value="${draft.draftId}" ${selected}>${name} (${draft.rulesetId})</option>`;
    }).join("");
  }
  function loadStateFromDraft(draft) {
    const ruleset = getRulesetById(draft.rulesetId) || RULESETS[0];
    state = {
      ...createInitialState(ruleset),
      ...draft,
      assignedScores: { ...DEFAULT_ABILITY_SCORES, ...draft.assignedScores || {} },
      selectedSkillIds: [...draft.selectedSkillIds || []],
      skillRanks: { ...draft.skillRanks || {} },
      selectedFeatIds: [...draft.selectedFeatIds || []],
      selectedSpellIds: [...draft.selectedSpellIds || []],
      selectedItemIds: [...draft.selectedItemIds || []]
    };
    syncFormToState();
    recompute();
  }
  function renderChat() {
    dom.chatLog.innerHTML = chatMessages.map((entry) => {
      const roleClass = entry.role === "assistant" ? "bot" : entry.role === "system" ? "system" : "user";
      return `<div class="chat-bubble ${roleClass}">${escapeHtml(entry.text)}</div>`;
    }).join("");
    dom.chatLog.scrollTop = dom.chatLog.scrollHeight;
  }
  function appendGuideFallbackReply(message, prefix = "") {
    const ruleset = currentRuleset();
    const reply = buildChatReply(message, { state, ruleset, derived, issues });
    chatMessages.push({
      role: "assistant",
      text: prefix ? `${prefix}

${reply}` : reply
    });
    trimChatMessages();
    renderChat();
  }
  async function sendChatMessage() {
    const message = dom.chatInput.value.trim();
    if (!message) {
      return;
    }
    chatMessages.push({ role: "user", text: message });
    trimChatMessages();
    dom.chatInput.value = "";
    renderChat();
    setChatBusy(true);
    try {
      await ensureAiCatalog(!aiState.available);
      if (!aiState.available || !aiState.selectedModel) {
        appendGuideFallbackReply(
          message,
          aiState.reason ? `AI autofill is offline right now (${aiState.reason}). This turn used guide mode instead.` : "AI autofill is offline right now, so this turn used guide mode instead."
        );
        status("AI autofill is unavailable. Guide mode answered instead.");
        return;
      }
      const assistResponse = await requestCharacterAssist({
        messages: normalizeChatHistory(chatMessages),
        currentDraft: createAssistDraft(state, DEFAULT_ABILITY_SCORES),
        activeStep: mapLegacyStepToAiStep(activeStep),
        model: aiState.selectedModel
      });
      state = applyAssistPreviewToState(state, assistResponse.previewDraft, DEFAULT_ABILITY_SCORES);
      syncFormToState();
      recompute();
      chatMessages.push({
        role: "assistant",
        text: buildAssistReplyEnvelope(assistResponse)
      });
      trimChatMessages();
      renderChat();
      if (assistResponse.appliedFields?.length) {
        status(`AI updated ${assistResponse.appliedFields.length} field(s) using ${assistResponse.modelUsed}.`);
      } else {
        status(`AI reviewed the draft with ${assistResponse.modelUsed} and did not change any builder fields.`);
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unexpected AI error.";
      aiState.available = false;
      aiState.reason = reason;
      renderChatStatus();
      appendGuideFallbackReply(message, `AI autofill failed for this turn (${reason}). Guide mode reply:`);
      status("AI autofill failed. Guide mode answered instead.");
    } finally {
      setChatBusy(false);
    }
  }
  function bindEvents() {
    dom.stepButtons.forEach((button) => {
      button.addEventListener("click", () => changeStep(button.dataset.step));
    });
    dom.rulesetSelect.addEventListener("change", () => {
      const selected = getRulesetById(dom.rulesetSelect.value);
      applyRulesetDefaults(selected);
      syncFormToState();
      recompute();
      status(`Switched to ${selected.shortName}.`);
    });
    dom.experienceMode.addEventListener("change", () => {
      state.experienceMode = dom.experienceMode.value;
      recompute();
      status(`Mode set to ${state.experienceMode}.`);
    });
    dom.characterName.addEventListener("input", () => {
      state.name = dom.characterName.value;
      recompute();
    });
    dom.playerName.addEventListener("input", () => {
      state.playerName = dom.playerName.value;
    });
    dom.characterLevel.addEventListener("input", () => {
      state.level = Number(dom.characterLevel.value || 1);
      recompute();
    });
    dom.alignmentSelect.addEventListener("change", () => {
      state.alignment = dom.alignmentSelect.value;
      recompute();
    });
    dom.backgroundSelect.addEventListener("change", () => {
      state.backgroundId = dom.backgroundSelect.value;
      recompute();
    });
    dom.speciesSelect.addEventListener("change", () => {
      state.speciesId = dom.speciesSelect.value;
      recompute();
    });
    dom.classSelect.addEventListener("change", () => {
      state.classId = dom.classSelect.value;
      const cls = findClassById(currentRuleset(), state.classId);
      state.subclassId = cls?.subclasses?.[0]?.id || "";
      syncFormToState();
      recompute();
    });
    dom.subclassSelect.addEventListener("change", () => {
      state.subclassId = dom.subclassSelect.value;
      recompute();
    });
    dom.characterNotes.addEventListener("input", () => {
      state.notes = dom.characterNotes.value;
    });
    dom.abilityMethodSelect.addEventListener("change", () => {
      state.abilityMethodId = dom.abilityMethodSelect.value;
      renderAbilityTable();
      recompute();
    });
    dom.abilityTable.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      const key = target.dataset.abilityKey;
      if (!key) {
        return;
      }
      state.assignedScores[key] = Number(target.value || 0);
      renderAbilityTable();
      recompute();
    });
    dom.applyStandardArrayBtn.addEventListener("click", () => {
      const method = findById(currentRuleset().abilityMethods, "standard-array");
      if (!method?.array) {
        return;
      }
      ABILITY_KEYS2.forEach((key, index) => {
        state.assignedScores[key] = method.array[index] ?? DEFAULT_ABILITY_SCORES[key];
      });
      renderAbilityTable();
      recompute();
      status("Applied standard array in STR, DEX, CON, INT, WIS, CHA order.");
    });
    dom.resetAbilitiesBtn.addEventListener("click", () => {
      state.assignedScores = { ...DEFAULT_ABILITY_SCORES };
      renderAbilityTable();
      recompute();
      status("Ability scores reset.");
    });
    dom.skillsList.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      const id = target.dataset.itemId;
      if (!id) {
        return;
      }
      const cls = findClassById(currentRuleset(), state.classId);
      const limit = Number(cls?.skillChoices || 0);
      const changed = updateSelectionList("selectedSkillIds", id, target.checked, limit || 0);
      if (!changed) {
        target.checked = false;
      }
      recompute();
    });
    dom.featsList.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      const id = target.dataset.itemId;
      if (!id) {
        return;
      }
      updateSelectionList("selectedFeatIds", id, target.checked);
      recompute();
    });
    dom.spellsList.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      const id = target.dataset.itemId;
      if (!id) {
        return;
      }
      updateSelectionList("selectedSpellIds", id, target.checked);
      recompute();
    });
    dom.itemsList.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      const id = target.dataset.itemId;
      if (!id) {
        return;
      }
      updateSelectionList("selectedItemIds", id, target.checked);
      recompute();
    });
    dom.spellSearch.addEventListener("input", () => {
      renderChoiceLists();
    });
    dom.itemSearch.addEventListener("input", () => {
      renderChoiceLists();
    });
    dom.validateBtn.addEventListener("click", () => {
      recompute();
      status("Validation complete.");
    });
    dom.saveDraftBtn.addEventListener("click", () => {
      const draft = snapshotDraft();
      state.draftId = draft.draftId;
      saveDraft(draft);
      refreshSavedDraftOptions();
      status("Draft saved locally.");
    });
    dom.loadDraftBtn.addEventListener("click", () => {
      const id = dom.savedDraftsSelect.value;
      if (!id) {
        status("Select a saved draft first.");
        return;
      }
      const draft = getSavedDrafts().find((entry) => entry.draftId === id);
      if (!draft) {
        status("Draft not found.");
        return;
      }
      loadStateFromDraft(draft);
      status("Draft loaded.");
    });
    dom.deleteDraftBtn.addEventListener("click", () => {
      const id = dom.savedDraftsSelect.value;
      if (!id) {
        status("Select a saved draft first.");
        return;
      }
      deleteDraftById(id);
      if (state.draftId === id) {
        state.draftId = "";
      }
      refreshSavedDraftOptions();
      status("Draft deleted.");
    });
    dom.newCharacterBtn.addEventListener("click", () => {
      const ruleset = currentRuleset();
      const mode = state.experienceMode;
      state = createInitialState(ruleset);
      state.experienceMode = mode;
      syncFormToState();
      recompute();
      status("Started a new character in current ruleset.");
    });
    dom.exportJsonBtn.addEventListener("click", () => {
      const draft = snapshotDraft();
      exportDraftToFile(draft);
      status("Draft exported to JSON.");
    });
    dom.exportPdfBtn.addEventListener("click", () => {
      recompute();
      if (!derived) {
        status("No character data available for PDF export.");
        return;
      }
      const lines = buildParsableCharacterLines(state, derived, issues);
      const pdfBytes = buildSimplePdf(lines, {
        title: `Forge Character - ${state.name || "Unnamed"}`
      });
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${slugify2(state.name)}-${state.rulesetId}-parsable.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
      status("Parsable PDF exported with machine-readable markers and embedded JSON section.");
    });
    dom.importJsonInput.addEventListener("change", async () => {
      const file = dom.importJsonInput.files?.[0];
      if (!file) {
        return;
      }
      try {
        const imported = await importDraftFromFile(file);
        loadStateFromDraft(imported);
        status("Imported draft from JSON.");
      } catch {
        status("Import failed: invalid JSON format.");
      } finally {
        dom.importJsonInput.value = "";
      }
    });
    dom.completeBuildBtn.addEventListener("click", handleCompleteBuild);
    dom.useInGameBtn.addEventListener("click", sendCharacterToGameSession);
    dom.randomizeCharacterBtn.addEventListener("click", randomizeCharacter);
    dom.printSheetBtn.addEventListener("click", () => {
      window.print();
    });
    dom.chatModelSelect.addEventListener("change", () => {
      aiState.selectedModel = dom.chatModelSelect.value;
      renderChatStatus();
    });
    dom.chatSendBtn.addEventListener("click", () => {
      void sendChatMessage();
    });
    dom.chatInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void sendChatMessage();
      }
    });
  }
  function init() {
    renderRulesetSelect();
    syncFormToState();
    registerGameSessionBridge();
    bindEvents();
    recompute();
    renderChat();
    renderChatStatus();
    changeStep(activeStep);
    status("Ready. Configure your ruleset and start building.");
    void ensureAiCatalog();
  }
  init();
})();
