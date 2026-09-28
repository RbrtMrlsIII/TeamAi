// Guard: GitHub Actions workflow files must be parseable and internally consistent
// before they can reach main.
//
// Why this exists: commit c885f26c (#407) put the body of a bash heredoc at column 0
// inside a `run: |` block in ai-advisory-review-runner.yml. That is not valid YAML, so
// GitHub could not parse the workflow and created a failed, job-less run of it on
// every push to every branch containing the file (100+ runs on #404 alone). Nothing
// in CI parsed workflow files, so it merged.
//
// Scope: syntax, top-level shape, `needs` targets, and local reusable-workflow calls
// (callee exists, declared inputs, required inputs, declared secrets). This is not a
// replacement for actionlint: there is no expression or type checking here.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const workflowDir = path.join(repoRoot, '.github', 'workflows');

const isMap = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function parseWorkflow(text) {
  const doc = parseDocument(text, { uniqueKeys: true });
  const problems = doc.errors.map((error) => {
    const at = error.linePos?.[0];
    const where = at ? `line ${at.line}, col ${at.col}` : 'unknown position';
    return `${where}: ${error.code} - ${error.message.split('\n')[0]}`;
  });
  return { data: problems.length === 0 ? doc.toJS() : null, problems };
}

function workflowCallSpec(on) {
  if (on === 'workflow_call') return {};
  if (Array.isArray(on)) return on.includes('workflow_call') ? {} : null;
  if (isMap(on) && 'workflow_call' in on) return isMap(on.workflow_call) ? on.workflow_call : {};
  return null;
}

function reusableCallProblems(id, job, workflows) {
  const calleeName = path.basename(job.uses);
  if (!workflows.has(calleeName)) return [`job \`${id}\` calls ${job.uses}, which does not exist`];
  const callee = workflows.get(calleeName);
  if (callee === null) return []; // callee failed to parse; reported by the YAML test
  const spec = workflowCallSpec(callee.on);
  if (!spec) return [`job \`${id}\` calls ${calleeName}, which has no \`workflow_call\` trigger`];

  const problems = [];
  const declaredInputs = isMap(spec.inputs) ? spec.inputs : {};
  const passedInputs = isMap(job.with) ? job.with : {};
  for (const name of Object.keys(passedInputs)) {
    if (!(name in declaredInputs)) {
      problems.push(`job \`${id}\` passes input \`${name}\`, which ${calleeName} does not declare`);
    }
  }
  for (const [name, definition] of Object.entries(declaredInputs)) {
    if (isMap(definition) && definition.required === true && !('default' in definition) && !(name in passedInputs)) {
      problems.push(`job \`${id}\` does not pass required input \`${name}\` to ${calleeName}`);
    }
  }

  if (job.secrets !== 'inherit') {
    const declaredSecrets = isMap(spec.secrets) ? spec.secrets : {};
    const passedSecrets = isMap(job.secrets) ? job.secrets : {};
    for (const name of Object.keys(passedSecrets)) {
      if (!(name in declaredSecrets)) {
        problems.push(`job \`${id}\` passes secret \`${name}\`, which ${calleeName} does not declare`);
      }
    }
    for (const [name, definition] of Object.entries(declaredSecrets)) {
      if (isMap(definition) && definition.required === true && !(name in passedSecrets)) {
        problems.push(`job \`${id}\` does not pass required secret \`${name}\` to ${calleeName}`);
      }
    }
  }
  return problems;
}

function structuralProblems(data, workflows) {
  if (!isMap(data)) return ['top level must be a mapping'];
  const problems = [];
  if (!('on' in data)) problems.push('missing top-level `on`');
  if (!isMap(data.jobs) || Object.keys(data.jobs).length === 0) {
    problems.push('missing or empty `jobs` mapping');
    return problems;
  }
  for (const [id, job] of Object.entries(data.jobs)) {
    if (!isMap(job)) {
      problems.push(`job \`${id}\` must be a mapping`);
      continue;
    }
    if (('runs-on' in job) === ('uses' in job)) {
      problems.push(`job \`${id}\` must define exactly one of \`runs-on\` or \`uses\``);
    }
    for (const dependency of [].concat(job.needs ?? [])) {
      if (!(dependency in data.jobs)) problems.push(`job \`${id}\` needs unknown job \`${dependency}\``);
    }
    if (typeof job.uses === 'string' && job.uses.startsWith('./')) {
      problems.push(...reusableCallProblems(id, job, workflows));
    }
  }
  return problems;
}

const files = existsSync(workflowDir)
  ? readdirSync(workflowDir).filter((file) => /\.ya?ml$/.test(file)).sort()
  : [];
const parsed = new Map(files.map((file) => [file, parseWorkflow(readFileSync(path.join(workflowDir, file), 'utf8'))]));
const workflows = new Map([...parsed].map(([file, { data }]) => [file, data]));

test('workflow files are discovered', () => {
  assert.ok(files.length > 0, `no workflow files found in ${workflowDir}`);
});

test('every workflow file is valid YAML that GitHub can parse', () => {
  const failures = [...parsed].flatMap(([file, { problems }]) => problems.map((problem) => `${file}: ${problem}`));
  assert.equal(failures.length, 0, `\n${failures.join('\n')}`);
});

test('every workflow has a valid top-level shape, job wiring, and local reusable-workflow calls', () => {
  const failures = [...workflows].flatMap(([file, data]) =>
    data === null ? [] : structuralProblems(data, workflows).map((problem) => `${file}: ${problem}`));
  assert.equal(failures.length, 0, `\n${failures.join('\n')}`);
});

const incident = [
  'name: incident',
  'on: workflow_call',
  'jobs:',
  '  gate:',
  '    runs-on: ubuntu-latest',
  '    steps:',
  '      - run: |',
  "          cat > /tmp/context.txt <<'EOF'",
  '=== GOVERNING ISSUE ===',
  'No governing issue declared.',
  'EOF',
].join('\n');

test('control: rejects the #407 incident (heredoc body at column 0 inside run: |)', () => {
  const { data, problems } = parseWorkflow(incident);
  assert.equal(data, null);
  assert.ok(problems.length > 0, 'the broken workflow must produce at least one parse problem');
});

test('control: accepts the same script once the heredoc body is indented into the block', () => {
  const fixed = incident.split('\n').map((line, index) => (index >= 8 ? `          ${line}` : line)).join('\n');
  const { data, problems } = parseWorkflow(fixed);
  assert.deepEqual(problems, []);
  assert.match(data.jobs.gate.steps[0].run, /=== GOVERNING ISSUE ===/);
});

test('control: flags unknown needs targets and mismatched reusable-workflow calls', () => {
  const callee = {
    on: { workflow_call: { inputs: { reviewer: { required: true, type: 'string' } }, secrets: { KEY: { required: true } } } },
    jobs: { a: { 'runs-on': 'ubuntu-latest' } },
  };
  const caller = {
    on: 'push',
    jobs: {
      a: { 'runs-on': 'ubuntu-latest', needs: ['ghost'] },
      b: { uses: './.github/workflows/callee.yml', with: { extra: 1 }, secrets: {} },
      c: { uses: './.github/workflows/missing.yml' },
      d: { steps: [] },
    },
  };
  const problems = structuralProblems(caller, new Map([['callee.yml', callee]])).join('\n');
  assert.match(problems, /needs unknown job `ghost`/);
  assert.match(problems, /passes input `extra`/);
  assert.match(problems, /does not pass required input `reviewer`/);
  assert.match(problems, /does not pass required secret `KEY`/);
  assert.match(problems, /missing\.yml, which does not exist/);
  assert.match(problems, /exactly one of `runs-on` or `uses`/);
});
