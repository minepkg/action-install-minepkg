"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const io_1 = require("@actions/io");
const os_1 = require("os");
const fs = __importStar(require("fs"));
const path_1 = require("path");
const tool_cache_1 = require("@actions/tool-cache");
// TODO: replace with minepkg CDN url
const DOWNLOAD_BASE = 'https://get.minepkg.io';
const OS_MAP = new Map([
    ['win32', 'windows'],
    ['darwin', 'darwin'],
    ['linux', 'linux']
]);
const ARCH_MAP = new Map([
    ['x64', 'amd64'],
    ['x86_64', 'amd64'],
    ['aarch64', 'arm64']
]);
const install = ({ platform = process.platform, arch = process.arch, version = 'latest' }) => __awaiter(void 0, void 0, void 0, function* () {
    const mappedOS = OS_MAP.get(platform);
    const mappedArch = ARCH_MAP.get(process.arch);
    if (mappedOS === undefined) {
        core.setFailed([
            `Unsupported operating system "${platform}". We currently only support linux, macos and windows.`,
            'Open an issue if you want us to support this os:',
            '  https://github.com/minepkg/minepkg/issues/new?assignees=&labels=&template=feature_request.md'
        ].join('\n'));
        return;
    }
    if (mappedArch !== 'amd64' && mappedArch !== 'arm64') {
        core.setFailed([
            `Unsupported architecture "${arch}". We currently only support x64 and arm64.`,
            'Open an issue if you want us to support this arch:',
            '  https://github.com/minepkg/minepkg/issues/new?assignees=&labels=&template=feature_request.md'
        ].join('\n'));
        return;
    }
    const ext = mappedOS === 'windows' ? '.exe' : '';
    const downloadUrl = `${DOWNLOAD_BASE}/download?os=${mappedOS}&arch=${mappedArch}`;
    core.info(`Installing minepkg "${version}" on ${mappedOS}`);
    core.info(`Downloading ${downloadUrl}`);
    const destinationDir = (0, path_1.join)((0, os_1.homedir)(), '.minepkg-bin');
    const dlPath = yield (0, tool_cache_1.downloadTool)(downloadUrl);
    const binPath = (0, path_1.join)(destinationDir, `minepkg${ext}`);
    yield (0, io_1.mv)(dlPath, (0, path_1.join)(destinationDir, `minepkg${ext}`));
    fs.chmodSync(binPath, 755);
    core.addPath(destinationDir);
    core.info('✅ minepkg cli has been installed');
});
exports.default = install;
