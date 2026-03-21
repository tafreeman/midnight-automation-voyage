# Layout System Reference

## Table of Contents
- [Registry Architecture](#registry-architecture)
- [Layout Families](#layout-families)
- [Screen-to-Layout Mapping](#screen-to-layout-mapping)
- [Engineering Layouts](#engineering-layouts)
- [Engineering Scenario Presets](#engineering-scenario-presets)

---

## Registry Architecture

The system uses a **registry that maps layout IDs to components**, not switch statements. This enables:
- O(1) layout lookup
- Independent family registration
- Third-party or future family extension
- Safe isolation of deck-specific families
- Simpler renderer logic

When recommending layouts, always use registry-safe layout IDs. Prefer reusable registered layouts over bespoke one-off compositions.

---

## Layout Families

The system includes **26 registered layouts across 6 families**.

### Base Family
General-purpose layouts used across all content types.

| Layout ID | Purpose | Best For |
|-----------|---------|----------|
| `cover` | Full-bleed opening or title card | Module openers, deck covers |
| `nav-hub` | Navigation index with multiple targets | Module overview, resource index |
| `two-col` | Two-column split for content + support | Lesson detail, comparison views |
| `stat-cards` | Grid of metric/statistic cards | Progress dashboards, recap stats |
| `before-after` | Side-by-side comparison | Manual vs. automated, refactoring demos |
| `process-cycle` | Circular or iterative process diagram | Test lifecycle, CI/CD loop |
| `process-lanes` | Parallel horizontal swim lanes | Multi-team workflows, pipeline stages |
| `checklist` | Structured checklist with completion state | Governance, QA readiness, setup steps |
| `workflow` | Sequential process with stages | Deployment flow, learning paths |
| `pillars` | Vertical columns representing pillars/principles | Core concepts, strategy themes |

### Handbook Family
Editorial-style layouts for training and documentation content.

| Layout ID | Purpose | Best For |
|-----------|---------|----------|
| `hb-chapter` | Chapter divider with bold visual treatment | Module transitions, section breaks |
| `hb-practices` | Best practices list with supporting details | Training content, process guides |
| `hb-process` | Step-by-step process explanation | How-to content, workflow training |
| `hb-manifesto` | Bold statement or principle declaration | Core values, design principles |
| `hb-index` | Structured table of contents or index | Resource pages, glossary |

### Engineering Family
Purpose-built layouts for technical architecture and engineering content.

| Layout ID | Purpose | Best For |
|-----------|---------|----------|
| `eng-architecture` | Layered system tiers | System architecture, service topology |
| `eng-code-flow` | Horizontal pipeline with SVG arrow connectors | CI/CD pipeline, data flow, test execution |
| `eng-tech-stack` | Alternating vertical timeline | Technology evolution, stack comparison |
| `eng-roadmap` | Milestone track with progress visualization | Release plan, feature roadmap |

### Sprint Family
Sprint/agile-focused layouts for project tracking.

### Onboarding Family
Onboarding-specific layouts for new user experiences.

### Verge Pop Family
Bold, expressive layouts for high-energy visual moments (the "5-10% infographic" treatment).

---

## Screen-to-Layout Mapping

### Training Screens

| Screen Type | Recommended Layouts |
|-------------|-------------------|
| Module overview | `nav-hub`, `stat-cards`, `two-col` |
| Lesson detail | `two-col`, `hb-practices`, editorial lesson shell |
| Practice/exercise | `workflow`, `process-lanes`, `two-col` |
| Quiz/checkpoint | Card grid or custom assessment block |
| Summary/recap | `stat-cards`, Verge Pop layouts, `hb-chapter` |
| Resource/reference | `hb-index`, `nav-hub` |
| Governance/compliance | `checklist`, `pillars`, `workflow` |
| Progress dashboard | `stat-cards`, `process-lanes` |

### Engineering Deck Mapping

| Content Type | Primary Layout | Alternates |
|-------------|---------------|------------|
| Architecture / system tiers | `eng-architecture` | `process-lanes`, `workflow` |
| Pipeline / stages | `eng-code-flow` | `process-cycle`, `workflow` |
| Technology evolution | `eng-tech-stack` | `two-col` |
| Milestone plan | `eng-roadmap` | `workflow`, `checklist` |

---

## Engineering Layouts (Detail)

### eng-architecture
**Layered system tiers.** Shows hierarchical relationships between system components, services, or infrastructure layers. Best for microservices topology, dependency hierarchy, and service architecture diagrams.

Visual: Stacked horizontal bands with interconnecting lines. Each tier has a label, description, and component cards.

### eng-code-flow
**Horizontal pipeline with SVG arrow connectors.** Shows sequential stages in a pipeline or workflow. Best for CI/CD pipelines, data processing flows, and test execution chains.

Visual: Left-to-right flow with stage boxes connected by directional arrows. Each stage has an icon, label, and optional status indicator.

### eng-tech-stack
**Alternating vertical timeline.** Shows technology evolution or multi-technology comparison over time. Best for technology adoption timelines, stack migration plans, and version evolution.

Visual: Central vertical line with alternating left/right entries. Each entry has a date/phase label, technology name, and detail text.

### eng-roadmap
**Milestone track with progress visualization.** Shows planned milestones with completion state and timeline. Best for release planning, feature rollout, and phased implementation.

Visual: Horizontal track with milestone markers. Each milestone has a date, label, description, and progress indicator (complete/in-progress/planned).

---

## Engineering Scenario Presets

Use these narrative structures when asked for engineering-focused decks or screens.

### Microservices Architecture Presentation
1. Opening vision / context → `two-col` or `cover`
2. Architecture topology → `eng-architecture`
3. Dependency or service hierarchy → `eng-architecture`, `pillars`
4. Flow between services → `eng-code-flow`
5. Deployment or roadmap close → `eng-roadmap`

### Development Workflow and Governance
1. Engineering disciplines / roles → `pillars`
2. Delivery process → `workflow`, `eng-code-flow`
3. System layers → `eng-architecture`
4. Evolution or roadmap → `eng-tech-stack`
5. Compliance / checklist close → `checklist`

### Technical Roadmap
1. Vision → `two-col`, `cover`
2. Multi-year timeline → `eng-tech-stack`
3. Phased execution → `eng-code-flow`
4. Milestones → `eng-roadmap`
5. Risk/governance or success metrics → `checklist`, `stat-cards`

### AI/ML Platform Engineering
1. Data-to-value framing → `two-col`
2. Training/inference pipeline → `eng-code-flow`
3. Service/system architecture → `eng-architecture`
4. Model/version evolution → `eng-tech-stack`
5. Governance + reliability close → `checklist`
