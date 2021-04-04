import * as core from '@actions/core';

import install from './install';

// note: debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
async function run(): Promise<void> {
  const version: string = core.getInput('version') || 'latest';

  return install({ version });
}

// eslint-disable-next-line github/no-then
run().catch(e => {
  core.debug(e);
  core.setFailed(e.message);
});
