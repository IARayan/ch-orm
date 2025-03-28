#!/bin/bash

# Exit on error
set -e

# Configuration
WIKI_DIR="ch-orm.wiki"
DOCS_DIR="docs"
REPO_URL="https://github.com/iarayan/ch-orm.wiki.git"

# Clone or update wiki repository
if [ ! -d "$WIKI_DIR" ]; then
    git clone $REPO_URL $WIKI_DIR
else
    cd $WIKI_DIR
    git pull
    cd ..
fi

# Generate documentation
npm run docs

# Copy documentation to wiki
cp -r $DOCS_DIR/* $WIKI_DIR/

# Create or update Home.md
cat > $WIKI_DIR/Home.md << EOL
# CH-ORM Documentation

Welcome to the CH-ORM documentation! This documentation is automatically generated from the source code.

## Table of Contents

- [Getting Started](modules.md)
- [API Reference](classes.md)
- [Examples](examples.md)

## Quick Links

- [GitHub Repository](https://github.com/iarayan/ch-orm)
- [NPM Package](https://www.npmjs.com/package/@iarayan/ch-orm)
- [Report Issues](https://github.com/iarayan/ch-orm/issues)
EOL

# Commit and push changes
cd $WIKI_DIR
git add .
git commit -m "Update documentation from TypeDoc"
git push
cd ..

echo "Documentation has been synced with the GitHub Wiki!" 