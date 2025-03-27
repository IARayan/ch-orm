#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}   CH-ORM Test Suite Runner      ${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js to run the tests.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install npm to run the tests.${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing dependencies...${NC}"
    npm install
    echo ""
fi

# Display note about expected test failures
echo -e "${YELLOW}Note: Many tests are expected to fail until the implementation is complete.${NC}"
echo -e "${YELLOW}The tests serve as a specification for how the classes should behave when implemented.${NC}"
echo ""

# Run linter
echo -e "${BLUE}Running linter...${NC}"
npm run lint
LINT_EXIT_CODE=$?

if [ $LINT_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}Linting passed!${NC}"
else
    echo -e "${RED}Linting failed. Please fix the issues before running tests.${NC}"
    echo -e "${BLUE}You can continue with tests anyway...${NC}"
    
    read -p "Continue with tests? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""

# Parse command line arguments
COVERAGE=false
SPECIFIC_TEST=""
WATCH=false
IGNORE_FAILURES=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --coverage|-c) COVERAGE=true ;;
        --watch|-w) WATCH=true ;;
        --test|-t) SPECIFIC_TEST="$2"; shift ;;
        --ignore-failures|-i) IGNORE_FAILURES=true ;;
        --help|-h) 
            echo "Usage: ./run-tests.sh [options]"
            echo ""
            echo "Options:"
            echo "  -c, --coverage         Run tests with coverage reporting"
            echo "  -w, --watch            Run tests in watch mode"
            echo "  -t, --test <pattern>   Run specific test(s) matching pattern"
            echo "  -i, --ignore-failures  Exit with code 0 even if tests fail"
            echo "  -h, --help             Show this help message"
            exit 0
            ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Run tests
if [ "$WATCH" = true ]; then
    echo -e "${BLUE}Running tests in watch mode...${NC}"
    if [ -n "$SPECIFIC_TEST" ]; then
        npm run test:watch -- "$SPECIFIC_TEST"
    else
        npm run test:watch
    fi
elif [ "$COVERAGE" = true ]; then
    echo -e "${BLUE}Running tests with coverage...${NC}"
    if [ -n "$SPECIFIC_TEST" ]; then
        npm run test:coverage -- "$SPECIFIC_TEST"
    else
        npm run test:coverage
    fi
else
    echo -e "${BLUE}Running tests...${NC}"
    if [ -n "$SPECIFIC_TEST" ]; then
        npm test -- "$SPECIFIC_TEST"
    else
        npm test
    fi
fi

TEST_EXIT_CODE=$?

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
elif [ "$IGNORE_FAILURES" = true ]; then
    echo -e "${YELLOW}Some tests failed, but failures are being ignored.${NC}"
    echo -e "${YELLOW}This is expected until the implementation is complete.${NC}"
    TEST_EXIT_CODE=0
else
    echo -e "${RED}Some tests failed. Please check the output above for details.${NC}"
    echo -e "${YELLOW}Note: Failures are expected until the implementation is complete.${NC}"
    echo -e "${YELLOW}You can use the --ignore-failures flag to exit with success code anyway.${NC}"
fi

# Make the file executable after creating it
chmod +x run-tests.sh

exit $TEST_EXIT_CODE 