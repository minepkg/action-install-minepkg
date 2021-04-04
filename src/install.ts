import * as core from '@actions/core';
import { mv } from '@actions/io';
import { homedir } from 'os';
import * as fs from 'fs';
import { join } from 'path';
import { downloadTool } from '@actions/tool-cache';

// TODO: replace with minepkg CDN url
const DOWNLOAD_BASE = 'https://storage.googleapis.com/minepkg-client';

interface installArgs {
  os: String;
  arch: String;
  version: String;
}

const install = async ({ os, arch, version }: installArgs): Promise<void> => {
  const ext = os === 'windows' ? '.exe' : '';
  const downloadUrl = `${DOWNLOAD_BASE}/${version}/minepkg-${os}-${arch}${ext}`;

  core.info(`Installing minepkg "${version}" on ${os}`);
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
