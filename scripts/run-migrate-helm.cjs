/**
 * Non-interactive migrate-helm-libraries (all libs, confirmed).
 * Usage: node scripts/run-migrate-helm.cjs
 */
const Module = require('module');
const path = require('path');
const { SchematicEngine, NodeModulesEngineHost } = require('@angular-devkit/schematics/tools');

const root = path.join(__dirname, '..');
process.chdir(root);

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  const exported = originalLoad.apply(this, arguments);
  if (request === 'enquirer' && exported?.prompt && !exported.__spartanMigrateMocked) {
    exported.prompt = async (questions) => {
      const items = Array.isArray(questions) ? questions : [questions];
      const answers = {};
      for (const item of items) {
        if (item.name === 'libraries') {
          answers.libraries = ['all'];
        }
        if (item.name === 'confirm') {
          answers.confirm = true;
        }
      }
      return answers;
    };
    exported.__spartanMigrateMocked = true;
  }
  return exported;
};

async function main() {
  const host = new NodeModulesEngineHost(root);
  const engine = new SchematicEngine(host, root);
  const collection = engine.createCollection('@spartan-ng/cli');
  const schematic = collection.createSchematic('migrate-helm-libraries', true);

  console.log('Running migrate-helm-libraries (style from components.json)...');
  const result = await schematic({}).toPromise();

  if (result.success) {
    console.log('Done.');
    return;
  }

  console.error('Migrate failed:', result.error);
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
