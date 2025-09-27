# 📤 Publishing Guide

## Prerequisites

1. **NPM Account**: Must be logged in as `carobbinschris`
   ```bash
   npm whoami  # Should return: carobbinschris
   npm login   # If not logged in
   ```

2. **Clean Git State**: All changes committed
   ```bash
   git status  # Should be clean
   ```

## Publishing Process

### Option 1: Automated Script (Recommended)

```bash
# Patch version (1.0.0 → 1.0.1)
npm run publish:patch

# Minor version (1.0.0 → 1.1.0)
npm run publish:minor

# Major version (1.0.0 → 2.0.0)
npm run publish:major
```

### Option 2: Manual Process

```bash
# 1. Bump version
npm version patch  # or minor/major

# 2. Dry run
npm publish --dry-run

# 3. Publish
npm publish

# 4. Push to git
git push && git push --tags
```

## What the Publishing Script Does

1. ✅ Verifies npm login (carobbinschris)
2. ✅ Checks git working directory is clean
3. ✅ Runs tests (if available)
4. ✅ Bumps package version
5. ✅ Creates git commit and tag
6. ✅ Performs dry-run publish
7. ✅ Prompts for confirmation
8. ✅ Publishes to npm registry
9. ✅ Provides next steps

## Post-Publishing Checklist

- [ ] Push to git: `git push && git push --tags`
- [ ] Create GitHub release
- [ ] Test installation: `npm install -g initrepo-claude-agent`
- [ ] Update documentation if needed
- [ ] Announce release

## Package Details

- **Package Name**: `initrepo-claude-agent`
- **Registry**: https://registry.npmjs.org/
- **Owner**: carobbinschris
- **License**: PROPRIETARY
- **Repository**: https://github.com/initrepo/claude-agent

## Installation Commands Users Will Use

```bash
# Global installation
npm install -g initrepo-claude-agent

# Quick script installation
curl -fsSL https://raw.githubusercontent.com/initrepo/claude-agent/master/install.sh | bash

# Usage after installation
initrepo-claude --help
```

## Troubleshooting

**"Not logged in to npm"**
```bash
npm login
# Use username: carobbinschris
```

**"Working directory not clean"**
```bash
git status
git add . && git commit -m "message"
```

**"Package already exists"**
- Version number needs to be bumped
- Check current published version: `npm view initrepo-claude-agent version`