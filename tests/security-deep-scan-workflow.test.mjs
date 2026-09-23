import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const workflow = fs.readFileSync('.github/workflows/security-deep-scan.yml', 'utf8');

test('deep scanner workflow has safe triggers and least privilege', () => {
  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /security-events: write/);
  assert.doesNotMatch(workflow, /pull_request_target/);
});

test('Semgrep uses the native CLI and exact version pin', () => {
  assert.match(workflow, /semgrep==1\.177\.0/);
  assert.match(workflow, /semgrep scan --config auto --sarif/);
  assert.doesNotMatch(workflow, /semgrep\/semgrep-action/);
});

test('Bandit is pinned and emits SARIF', () => {
  assert.match(workflow, /bandit\[sarif\]==1\.9\.4/);
  assert.match(workflow, /-f sarif -o bandit\.sarif/);
});

test('SonarQube is credential and project gated', () => {
  assert.match(workflow, /SonarSource\/sonarqube-scan-action@22918119ff8e1ca75a623e15c8296b6ea4fbe28f/);
  assert.match(workflow, /SONAR_PROJECT_KEY/);
  assert.match(workflow, /SONAR_TOKEN/);
  assert.match(workflow, /project\/token configuration is not connected/);
});

test('gosec is conditional on a Go surface', () => {
  assert.match(workflow, /securego\/gosec\/v2\/cmd\/gosec@v2\.28\.0/);
  assert.match(workflow, /gosec -no-fail -fmt sarif -out gosec\.sarif/);
  assert.match(workflow, /name: Detect Go surface/);
});

test('Brakeman is conditional on a Rails surface', () => {
  assert.match(workflow, /gem install brakeman --version 8\.0\.6/);
  assert.match(workflow, /brakeman -f sarif -o brakeman\.sarif/);
  assert.match(workflow, /name: Detect Rails surface/);
});

test('MobSF is conditional on a mobile source surface', () => {
  assert.match(workflow, /mobsfscan==1\.0\.0/);
  assert.match(workflow, /mobsfscan \. --sarif --output mobsfscan\.sarif --no-fail/);
  assert.match(workflow, /name: Detect mobile source surface/);
});

test('every SARIF upload uses the pinned CodeQL upload action', () => {
  const uploads = workflow.match(/github\/codeql-action\/upload-sarif@1c5b675653bb5c22dbe9b12b556ec555138e09fd/g) ?? [];
  assert.equal(uploads.length, 5);
});

test('bootstrap actions are pinned to immutable commits', () => {
  assert.match(workflow, /actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1/);
  assert.match(workflow, /actions\/setup-python@5fda3b95a4ea91299a34e894583c3862153e4b97/);
  assert.match(workflow, /actions\/setup-go@b7ad1dad31e06c5925ef5d2fc7ad053ef454303e/);
});
