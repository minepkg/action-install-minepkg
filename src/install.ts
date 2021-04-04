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

interface installArgs {
  platform?: string;
  arch?: string;
  version?: string;
}

const install = async ({
  platform = process.platform,
  arch = process.arch,
  version = 'latest'
}: installArgs): Promise<void> => {
  const mappedOS = OS_MAP.get(platform);
  const mappedArch = ARCH_MAP.get(process.arch);

  if (mappedOS === undefined) {
    core.setFailed(
      [
        `Unsupported operating system "${platform}". We currently only support linux, macos and windows.`,
        'Open an issue if you want us to support this os:',
        '  https://github.com/minepkg/minepkg/issues/new?assignees=&labels=&template=feature_request.md'
      ].join('\n')
    );
    return;
  }

  if (mappedArch !== 'amd64') {
    core.setFailed(
      [
        `Unsupported architecture "${arch}". We currently only support x64.`,
        'Open an issue if you want us to support this arch:',
        '  https://github.com/minepkg/minepkg/issues/new?assignees=&labels=&template=feature_request.md'
      ].join('\n')
    );
    return;
  }

  const ext = mappedOS === 'windows' ? '.exe' : '';
  const downloadUrl = `${DOWNLOAD_BASE}/${version}/minepkg-${mappedOS}-${mappedArch}${ext}`;

  core.info(`Installing minepkg "${version}" on ${mappedOS}`);
  core.info(`Downloading ${downloadUrl}`);

  const destinationDir = join(homedir(), '.minepkg-bin');
  const dlPath = await downloadTool(downloadUrl);
  const binPath = join(destinationDir, `minepkg${ext}`);

  await mv(dlPath, join(destinationDir, `minepkg${ext}`));
  fs.chmodSync(binPath, 755);
  core.addPath(destinationDir);

  core.info('✅ minepkg cli has been installed');
};

export default install;
