// Check and normalize KAIF skills for Kimi Code's project-level skill loader.
// [TESTED: 2026-11-21 · red on 37 broken inputs, green after normalization, Kimi live catalog · reports/2026-11-21_kimi_consultation_from_kaif.md]
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const args = process.argv.slice(2);
const fix = args.includes('--fix');
const root = args.find((arg) => !arg.startsWith('--')) || '.agents/skills';

function skillNames(base) {
  return readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function normalize(text, names) {
  let out = text.replace(/^description:[ \t]*(.+)$/m, (line, value) => {
    if (value === '>-' || value === '>') return line;
    return `description: >-\n  ${value.trim()}`;
  });
  for (const name of names) {
    const command = new RegExp(`(?<![\\w:./-])/${name}(?![\\w-])`, 'g');
    out = out.replace(command, `/skill:${name}`);
  }
  return out
    .replace(/^trigger:[^\r\n]*\r?\n/m, '')
    .replace(/^Co-Authored-By: Claude[^\r\n]*\r?\n?/m, '')
    .replaceAll('.claude/skills/', '.agents/skills/')
    .replaceAll('CLAUDE.md', 'AGENTS.md')
    .replaceAll('Claude Code', 'Kimi Code');
}

function inspect(file, text, names) {
  const issues = [];
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return ['missing or malformed YAML frontmatter'];
  const frontmatter = match[1];
  const name = frontmatter.match(/^name:[ \t]*(\S+)[ \t]*$/m)?.[1];
  if (!name) issues.push('missing name');
  else if (name !== basename(join(file, '..'))) issues.push(`name "${name}" does not match directory`);
  const description = frontmatter.match(/^description:[ \t]*(.*)$/m);
  if (!description) issues.push('missing description');
  else if (description[1] !== '>-' && description[1] !== '>') {
    issues.push('description must be a folded YAML block (description: >-)');
  } else if (!frontmatter.slice(frontmatter.indexOf(description[0])).match(/\r?\n[ \t]+\S/)) {
    issues.push('description body is empty');
  }
  if (/^trigger:/m.test(frontmatter)) issues.push('legacy trigger field; use name/description/whenToUse');
  if (/CLAUDE\.md|\.claude\/skills\/|Claude Code|Co-Authored-By: Claude/.test(text)) {
    issues.push('Claude-specific reference remains');
  }
  for (const skill of names) {
    const bare = new RegExp(`(?<![\\w:./-])/${skill}(?![\\w-])`);
    if (bare.test(text)) issues.push(`use the explicit Kimi command /skill:${skill}`);
  }
  return issues;
}

let names;
try {
  names = skillNames(root);
} catch (error) {
  console.error(`Cannot read ${root}: ${error.message}`);
  process.exit(2);
}
if (!names.length) {
  console.error(`Kimi skills: no skill directories found in ${root}`);
  process.exit(1);
}

let errors = 0;
let changed = 0;
for (const name of names) {
  const file = join(root, name, 'SKILL.md');
  const original = readFileSync(file, 'utf8');
  const text = fix ? normalize(original, names) : original;
  if (fix && text !== original) {
    writeFileSync(file, text);
    changed++;
  }
  for (const issue of inspect(file, text, names)) {
    console.error(`${file}: ${issue}`);
    errors++;
  }
}

if (fix) console.log(`Normalized ${changed} skill files in ${root}`);
console.log(errors ? `Kimi skills: ${errors} issue(s)` : `Kimi skills: ${names.length} valid skill files in ${root}`);
process.exit(errors ? 1 : 0);
