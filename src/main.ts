import * as core from '@actions/core';
import { mv } from '@actions/io';
import { homedir } from 'os';
import * as fs from 'fs';
import { join } from 'path';
import { downloadTool } from '@actions/tool-cache';

// TODO: replace with minepkg CDN url
const DOWNLOAD_BASE = 'https://storage.googleapis.com/minepkg-client';

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
  const ext = os === 'windows' ? '.exe' : '';

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
  core.info(`Installing minepkg "${version}" on ${os}`);

  const downloadUrl = `${DOWNLOAD_BASE}/${version}/minepkg-${os}-${arch}${ext}`;
  core.info(`Downloading ${downloadUrl}`);

  const destinationDir = join(homedir(), '.minepkg-bin');
  const dlPath = await downloadTool(downloadUrl);
  const binPath = join(destinationDir, `minepkg${ext}`);

  await mv(dlPath, join(destinationDir, `minepkg${ext}`));
  fs.chmodSync(binPath, 755);
  core.addPath(destinationDir);

  core.info('✅ minepkg cli has been installed');
}

// eslint-disable-next-line github/no-then
run().catch(e => {
  core.debug(e);
  core.setFailed(e.message);
});
