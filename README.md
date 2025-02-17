# automation-in-testing
UI tests for https://automationintesting.online

### System requirements
- Latest version of Node.js 18, 20 or 22.
- Windows 10+, Windows Server 2016+ or Windows Subsystem for Linux (WSL).
- macOS 13 Ventura, or later.
- Debian 12, Ubuntu 22.04, Ubuntu 24.04, on x86-64 and arm64 architecture.

### Install Playwright
```npm init playwright@latest```

### Updating Playwright
```npm install -D @playwright/test@latest```
### To download new browser binaries and their dependencies:
```npx playwright install --with-deps```

### Running tests
```npx playwright test```

### Show test report
```npx playwright show-report```

To view a video replay of the tests navigate to /test-results/ in the main directory.