// Checks the spec by hand (`npm run check`): every example is a valid beacon, and openapi.yaml
// reads and describes the same beacon as the schema. Run it before every commit.

import { readdirSync, readFileSync } from 'node:fs'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import { parse } from 'yaml'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const schema = JSON.parse(read('./schema/beacon.schema.json'))
const ajv = new Ajv2020({ allErrors: true })
ajv.addKeyword('example')
addFormats(ajv)
const valid = ajv.compile(schema)

let failed = 0
const fail = (what, detail) => {
  failed++
  console.log(`FAIL ${what}: ${detail}`)
}

const examples = readdirSync(new URL('./examples/', import.meta.url)).filter((f) => f.endsWith('.json'))
for (const file of examples) {
  const beacon = JSON.parse(read(`./examples/${file}`))
  if (!valid(beacon)) fail(file, ajv.errorsText(valid.errors))
  else if ([...beacon.beacon.text].length > 600) fail(file, 'text is over 600 characters')
  else console.log(`ok   ${file}`)
}

const openapi = parse(read('./openapi.yaml'))
const component = openapi.components?.schemas?.Beacon
if (!component) fail('openapi.yaml', 'no Beacon schema')
else {
  const plain = (s) => JSON.stringify(s).replaceAll('#/components/schemas/', '#/$defs/')
  const { $schema, title, description, $defs, ...beacon } = schema
  if (plain(component) !== plain(beacon)) fail('openapi.yaml', 'its Beacon differs from schema/beacon.schema.json')
  for (const [name, def] of Object.entries($defs))
    if (plain(openapi.components.schemas[name]) !== plain(def))
      fail('openapi.yaml', `its ${name} differs from schema/beacon.schema.json`)
  if (failed === 0) console.log(`ok   openapi.yaml (${Object.keys(openapi.paths).length} paths)`)
}

if (failed) {
  console.log(`${failed} failed`)
  process.exit(1)
}
