import * as core from '@actions/core';

import install from './install';

const OS_MAP = new Map([
  ['win32', 'windows'],
  ['darwin', 'macos'],
  ['linux', 'linux']
]);

const ARCH_MAP = new Map([['x64', 'amd64']]);

// note: debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
async function run(): Promise<void> {
  const version: string = core.getInput('version') || 'latest';

  const os = OS_MAP.get(process.platform);
  const arch = ARCH_MAP.get(process.arch);

  if (os === undefined) {
    core.setFailed(
      [
        `Unsupported operating system "${os}". We currently only support linux, macos and windows.`,
        'Open an issue if you want us to support this os:',
        '  https://github.com/minepkg/minepkg/issues/new?assignees=&labels=&template=feature_request.md'
      ].join('\n')
    );
    return;
  }

  if (arch !== 'amd64') {
    core.setFailed(
      [
        `Unsupported architecture "${arch}". We currently only support x64.`,
        'Open an issue if you want us to support this arch:',
        '  https://github.com/minepkg/minepkg/issues/new?assignees=&labels=&template=feature_request.md'
      ].join('\n')
    );
    return;
  }

  return install({ os, arch, version });
}

// eslint-disable-next-line github/no-then
run().catch(e => {
  core.debug(e);
  core.setFailed(e.message);
});
