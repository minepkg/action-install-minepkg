## minepkg install GitHub action

This action installs the minepkg CLI tool.

## Usage

### Latest Version

```yaml
- name: Install minepkg CLI
  uses: minepkg/action-install-minepkg@main

```

### Custom Version

```yaml
- name: Install minepkg CLI
  uses: minepkg/action-install-minepkg@main
  with:
    version: 0.0.58 # supply wanted minepkg version here
```