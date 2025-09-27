#!/bin/bash

# NPM Publishing Script for InitRepo Claude Agent
# Usage: ./scripts/publish.sh [patch|minor|major]

set -e

echo "🚀 InitRepo Claude Agent - NPM Publishing"
echo "========================================"

# Check if logged in to npm
if ! npm whoami &> /dev/null; then
    echo "❌ Not logged in to npm. Please run: npm login"
    echo "   Use username: carobbinschris"
    exit 1
fi

NPM_USER=$(npm whoami)
if [ "$NPM_USER" != "carobbinschris" ]; then
    echo "❌ Wrong npm user. Expected: carobbinschris, Got: $NPM_USER"
    echo "   Please run: npm logout && npm login"
    exit 1
fi

echo "✅ Logged in as: $NPM_USER"

# Check git status
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Working directory not clean. Please commit all changes first."
    exit 1
fi

echo "✅ Working directory is clean"

# Version bump type
VERSION_TYPE=${1:-patch}

if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo "❌ Invalid version type. Use: patch, minor, or major"
    exit 1
fi

echo "📦 Version bump type: $VERSION_TYPE"

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📋 Current version: $CURRENT_VERSION"

# Run tests if available
if [ -f "package.json" ] && npm run test --silent 2>/dev/null; then
    echo "🧪 Running tests..."
    npm test
    echo "✅ Tests passed"
else
    echo "⚠️  No tests found, skipping test phase"
fi

# Bump version
echo "⬆️  Bumping version..."
npm version $VERSION_TYPE --no-git-tag-version

NEW_VERSION=$(node -p "require('./package.json').version")
echo "📋 New version: $NEW_VERSION"

# Commit version bump
git add package.json
git commit -m "chore: bump version to $NEW_VERSION"

# Create git tag
git tag "v$NEW_VERSION"

echo "🏷️  Created tag: v$NEW_VERSION"

# Dry run publish
echo "🔍 Performing dry run..."
npm publish --dry-run

# Confirm publish
echo ""
read -p "🚀 Ready to publish version $NEW_VERSION to npm. Continue? [y/N]: " confirm

if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo "❌ Publish cancelled"
    # Revert changes
    git reset --hard HEAD~1
    git tag -d "v$NEW_VERSION"
    npm version $CURRENT_VERSION --no-git-tag-version
    exit 1
fi

# Publish to npm
echo "📤 Publishing to npm..."
npm publish

echo ""
echo "🎉 Successfully published initrepo-claude-agent@$NEW_VERSION!"
echo ""
echo "📋 Next steps:"
echo "   • Push to git: git push && git push --tags"
echo "   • Create GitHub release"
echo "   • Update documentation if needed"
echo ""
echo "🔗 Package URL: https://www.npmjs.com/package/initrepo-claude-agent"