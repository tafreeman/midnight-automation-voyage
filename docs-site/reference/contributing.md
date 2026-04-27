# Contributing

Thank you for your interest in contributing to Midnight Automation Voyage! This guide will help you get started.

## Ways to Contribute

### 1. Report Bugs or Issues

Found a problem? Please [open an issue](https://github.com/tafreeman/midnight-automation-voyage/issues) with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, Node version, browser)

### 2. Suggest Enhancements

Have an idea for improving the platform? Open an issue with the `enhancement` label:

- Describe the feature or improvement
- Explain the use case and benefits
- Provide examples if possible

### 3. Improve Documentation

Documentation improvements are always welcome:

- Fix typos or unclear instructions
- Add missing examples or explanations
- Improve course content or exercises
- Update README files

### 4. Contribute Code

#### Prerequisites

Before contributing code, ensure you have:

- Node.js 18+ installed
- pnpm 8+ (or npm as fallback)
- Git configured with your name and email
- A GitHub account

#### Development Setup

1. **Fork and clone the repository:**

```bash
git clone https://github.com/YOUR-USERNAME/midnight-automation-voyage.git
cd midnight-automation-voyage
```

2. **Install dependencies:**

```bash
# Install training-app dependencies
cd training-app && pnpm install

# Install practice-app dependencies
cd ../practice-app && pnpm install

# Install docs-site dependencies
cd ../docs-site && npm ci
```

3. **Start development servers:**

```bash
# Terminal 1 - Practice app
cd practice-app && pnpm dev     # http://localhost:5173

# Terminal 2 - Training app
cd training-app && pnpm dev     # http://localhost:5174

# Terminal 3 - Documentation site
cd docs-site && npm run dev     # http://localhost:5173 (different port)
```

#### Code Style

- **TypeScript:** Use strict mode, no `any` types
- **React:** Functional components with hooks
- **Formatting:** Run `pnpm lint` before committing
- **Naming:** Use descriptive variable and function names

#### Testing Your Changes

1. **Build all packages:**

```bash
pnpm -r build
```

2. **Run linters:**

```bash
pnpm lint
```

3. **Test manually:**
   - Verify your changes in both apps
   - Test on different browsers if UI-related
   - Check that all links work

#### Pull Request Process

1. **Create a feature branch:**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** with clear, focused commits

3. **Update documentation** if your changes affect user-facing behavior

4. **Push to your fork:**

```bash
git push origin feature/your-feature-name
```

5. **Open a Pull Request** with:
   - Clear title describing the change
   - Description explaining what and why
   - Reference to related issues
   - Screenshots for UI changes

## Content Contributions

### Adding a New Module

Modules are stored in `training-app/src/data/modules/`. To add a new module:

1. Create a new TypeScript file (e.g., `module-XX-topic-name.ts`)
2. Follow the existing module structure
3. Include all required fields:
   - `id`, `title`, `subtitle`, `icon`
   - `sections` with content
   - `quiz` with 3-5 questions
   - `exercise` with starter code and solution
   - `promptTemplates` for Copilot
4. Add the module to the appropriate course in `src/data/curriculum.ts`

### Adding Practice App Features

The practice app (`practice-app/`) is designed with intentional bugs for testing practice. When adding features:

- Add `data-testid` attributes for all interactive elements
- Include intentional bugs or edge cases (document them)
- Update `test-cases/examples/` with reference tests
- Document the feature in `docs-site/guide/practice-app.md`

### Writing Reference Tests

Reference tests in `test-cases/examples/` serve as quality benchmarks. Ensure:

- Tests are independent (no dependencies between specs)
- Use `data-testid` selectors (avoid CSS classes)
- Include real assertions validating behavior
- No `waitForTimeout` calls
- Descriptive test names

## Commit Message Guidelines

Use clear, descriptive commit messages:

```
type(scope): brief description

Longer explanation if needed
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(training-app): add module on accessibility testing
fix(practice-app): correct validation on checkout form
docs(getting-started): add Windows-specific instructions
```

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and different perspectives
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment, discrimination, or personal attacks
- Trolling or insulting comments
- Publishing private information without permission
- Any conduct that would be inappropriate in a professional setting

## Questions?

- **General questions:** [Open a discussion](https://github.com/tafreeman/midnight-automation-voyage/discussions)
- **Bug reports:** [Open an issue](https://github.com/tafreeman/midnight-automation-voyage/issues)
- **Security issues:** See [Security Policy](./security.md)

## License

By contributing to Midnight Automation Voyage, you agree that your contributions will be licensed under the MIT License.
