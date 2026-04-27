# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please email security concerns to: **[Create a private security advisory on GitHub](https://github.com/tafreeman/midnight-automation-voyage/security/advisories/new)**

Or contact the maintainer directly at: `tafreeman [at] github`

### What to Include

When reporting a vulnerability, please provide:

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** and severity assessment
4. **Suggested fix** if you have one
5. **Your contact information** for follow-up

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Depends on severity
  - Critical: 24-72 hours
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next release cycle

## Security Considerations

### Practice App Security

The practice app (`practice-app/`) is **intentionally vulnerable** for educational purposes:

- Contains known bugs and edge cases for testing practice
- Should **never** be deployed to production
- Should **only** run locally or in isolated development environments
- No real user data should ever be used with the practice app

### Training App Security

The training app (`training-app/`) is a static React application with:

- No backend or database
- No user authentication
- Progress stored in browser localStorage only
- No external API calls
- No collection of personal information

### Dependencies

We regularly:

- Update dependencies to patch known vulnerabilities
- Monitor security advisories via GitHub Dependabot
- Run security audits with `pnpm audit` and `npm audit`

## Known Non-Issues

The following are **not** security issues:

### Intentional Practice App Bugs

The practice app contains intentional bugs for learning purposes:

- Form validation issues
- Race conditions in toast notifications
- Stale state in admin panel
- Missing accessibility attributes
- These are documented features for testing practice

### LocalStorage Usage

The training app stores progress in browser localStorage:

- No sensitive data is stored
- Data never leaves the user's browser
- Users can clear it anytime via browser settings

### Development Server Exposure

Development servers (`pnpm dev`) are meant for local use only:

- Default ports (5173, 5174) are not exposed publicly
- No production deployment instructions for dev mode

## Security Best Practices

If you're using this platform for training:

1. **Run locally only** — don't expose dev servers to the internet
2. **Don't use real credentials** — the practice app uses test accounts only
3. **Keep dependencies updated** — run `pnpm update` regularly
4. **Review code changes** — inspect PRs before deploying

## Third-Party Integrations

This platform integrates with:

| Service | Purpose | Data Shared |
|---------|---------|-------------|
| GitHub (optional) | Repository cloning | None |
| GitHub Copilot (optional) | AI code generation | Code context only |
| Playwright | Test automation | None (runs locally) |

**No data is sent to external servers** — all processing happens locally.

## Responsible Disclosure

We follow coordinated vulnerability disclosure:

1. Reporter notifies us privately
2. We confirm and develop a fix
3. We release the fix
4. Public disclosure after users have time to update

We appreciate responsible disclosure and may publicly acknowledge reporters (with permission) in our security advisories.

## Questions?

For security-related questions that aren't vulnerabilities, you can:

- [Open a discussion](https://github.com/tafreeman/midnight-automation-voyage/discussions)
- Email general questions to the maintainer

Thank you for helping keep Midnight Automation Voyage secure!
