import { existsSync, readFileSync, writeFileSync } from 'node:fs';

function readJson(path) {
  if (!existsSync(path)) {
    return null;
  }

  return JSON.parse(readFileSync(path, 'utf8'));
}

const coverage = readJson('coverage/coverage-summary.json');
const semgrep = readJson('semgrep.sarif');
const playwrightJunitExists = existsSync('test-results/playwright-junit.xml');

const coverageLine = coverage
  ? `Покрытие строк unit-тестами: ${coverage.total.lines.pct}%.`
  : 'Отчет покрытия unit-тестов не найден.';

const semgrepResults =
  semgrep?.runs?.flatMap((run) => run.results ?? []).length ?? 'не найден';

const summary = `# CI Summary

- ${coverageLine}
- JUnit-отчет Playwright: ${playwrightJunitExists ? 'найден' : 'не найден'}.
- Найдено результатов Semgrep: ${semgrepResults}.

Сводка сгенерирована на стадии report в GitLab CI.
`;

writeFileSync('ci-summary.md', summary);
console.log(summary);
