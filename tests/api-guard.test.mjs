import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

function loadGuard() {
  const code = ts.transpileModule(fs.readFileSync('lib/api-guard.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  new Function('exports', code)(exports);
  return exports.guardRequest;
}

function request(body = '{}', headers = {}) {
  return new Request('https://example.com/api/contact', {
    method: 'POST',
    headers: { origin: 'https://example.com', 'x-real-ip': '192.0.2.1', ...headers },
    body,
  });
}

test('both form buckets allow five requests, then reject with Retry-After', async () => {
  const guard = loadGuard();
  for (const bucket of ['contact', 'chat']) {
    for (let i = 0; i < 5; i++) assert.deepEqual(await guard(request(), bucket), { body: {} });
    const result = await guard(request(), bucket);
    assert.equal(result.error.status, 429);
    assert.ok(Number(result.error.headers.get('Retry-After')) > 0);
  }
  assert.deepEqual(await guard(request('{}', { 'x-real-ip': '192.0.2.2' }), 'contact'), { body: {} });
});

test('rejected requests do not extend the cooldown; requests recover after expiry', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: 1000000 });
  const guard = loadGuard();
  for (let i = 0; i < 5; i++) await guard(request(), 'contact');
  t.mock.timers.tick(300000);
  for (let i = 0; i < 20; i++) {
    const result = await guard(request(), 'contact');
    assert.equal(result.error.headers.get('Retry-After'), '300');
  }
  t.mock.timers.tick(300000);
  assert.deepEqual(await guard(request(), 'contact'), { body: {} });
});

test('rejects missing, foreign and downgraded origins', async () => {
  const guard = loadGuard();
  for (const origin of ['null', 'https://other.example', 'http://example.com']) {
    assert.equal((await guard(request('{}', { origin }), 'contact')).error.status, 403);
  }
  const noOrigin = request();
  noOrigin.headers.delete('origin');
  assert.equal((await guard(noOrigin, 'contact')).error.status, 403);
});

test('enforces byte size with and without Content-Length, and rejects malformed JSON', async () => {
  const guard = loadGuard();
  assert.equal((await guard(request('invalid'), 'contact')).error.status, 400);
  assert.equal((await guard(request('{}', { 'content-length': '20000' }), 'contact')).error.status, 413);
  assert.equal((await guard(request(JSON.stringify('é'.repeat(9000))), 'contact')).error.status, 413);
  assert.deepEqual(await guard(request('{"name":"David"}'), 'contact'), { body: { name: 'David' } });
});
