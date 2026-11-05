const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function (id) {
  const mod = originalRequire.apply(this, arguments);
  if (id === 'enquirer' && mod && typeof mod.prompt === 'function' && !mod.__spartanMigrateMocked) {
    mod.prompt = async (questions) => {
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
    mod.__spartanMigrateMocked = true;
  }
  return mod;
};
