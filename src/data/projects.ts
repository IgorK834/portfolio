import type { Project } from './types';
import { projectMedia } from '../utils/project-media';

/**
 * Selected work, in display order. Everything the site shows about a project lives here.
 *
 * Adding a project: append an entry. The homepage, index, navigation targets, case-study page, sitemap,
 * llms.txt and structured data all update from this list.
 *
 * Projects are not deployed. Each one is shown through pinned screenshots and a link to its source
 * repository. Screenshots are not listed here: they live in src/assets/projects/<slug>/ next to a
 * screenshots.json manifest (see utils/project-media.ts and docs/agent-prompts/).
 *
 * Facts come from each repository's own README and docs. Missing facts are left undefined and hidden.
 */
const entries: Project[] = [
  // ---------------------------------------------------------------- 01 ResearchHub
  {
    slug: 'researchhub',
    number: '01',
    title: 'ResearchHub',
    shortTitle: 'ResearchHub',
    subtitle: 'Source-grounded collaborative AI workspace for students and researchers.',
    summary: 'Source-grounded collaborative AI workspace for students and researchers.',
    accent: 'blue',
    status: 'Active development',
    // GitHub lists one contributor for the repository.
    role: 'Sole contributor to the repository.',
    repository: { visibility: 'public', url: 'https://github.com/IgorK834/researchhub' },

    overview: {
      lead: 'A shared workspace where a group collects sources, writes a report and asks an AI that stays grounded in those sources. Charts, tables, calculations and generated claims keep provenance back to the source file, fragment, dataset or executed analysis.',
      extra: { heading: 'Works with', text: 'PDFs · DOCX files · Spreadsheets · Datasets' },
    },
    facts: [
      { label: 'Status', value: 'Active development' },
      { label: 'Runs', value: 'Locally, not deployed', desktopOnly: true },
    ],
    highlights: [
      {
        title: 'Cited answers, or an explicit “no evidence”',
        text: 'Questions are answered from the selected sources with traceable citations. When the sources do not support an answer, the result says so.',
      },
      {
        title: 'Immutable source versions',
        text: 'Replacing a file adds a new version. Older bytes stay downloadable and every analysis records the exact versions it used.',
      },
      {
        title: 'Computation in a Docker sandbox',
        text: 'Analysis code runs in a pinned, isolated Python image with filesystem, network and resource limits. Results keep their inputs and run history.',
      },
      {
        title: 'Realtime editing, enforced boundaries',
        text: 'Co-editing on Yjs and Hocuspocus, saved through authorized Spring persistence. Workspace authorization is enforced by the server, including internal service calls.',
      },
    ],
    stack: [
      { label: 'Backend & AI worker', items: ['Java 25', 'Spring Boot 4.1', 'Maven', 'Flyway', 'Python 3.13', 'FastAPI'] },
      {
        label: 'Frontend & realtime',
        items: ['React', 'TypeScript', 'Webpack', 'TanStack Query', 'Tiptap / ProseMirror', 'Yjs', 'Hocuspocus'],
      },
      {
        label: 'Data & infrastructure',
        items: ['PostgreSQL 17', 'pgvector', 'Azure Blob Storage / Azurite', 'Docker', 'Bicep (Azure IaC)'],
      },
    ],

    visualLabel: 'Source-grounded AI',
    wireframe: 'workspace',

    seo: {
      title: 'ResearchHub — source-grounded AI workspace · Igor Kadziela',
      description:
        'Case study: ResearchHub, a source-grounded collaborative AI workspace with citations and provenance. Spring Boot backend, Python FastAPI worker, React. Screenshots and source on GitHub.',
    },

    caseStudy: {
      problem:
        'Research material lives in many formats (PDFs, DOCX files, spreadsheets, datasets) while the report is written somewhere else. When an AI assistant answers without pointing back to that material, its claims cannot be checked, and a chart or table cannot be tied to the data that produced it. ResearchHub starts from the opposite premise: every generated claim and every computed result stays traceable to its source.',
      product: {
        audience: 'students and researchers working in teams',
        lead: 'What the workspace lets them do:',
        capabilities: [
          'Add PDFs, DOCX files, spreadsheets and datasets as versioned sources',
          'Ask questions answered only from the selected sources, with traceable citations',
          'Write a shared report together in realtime, with comments on selected text',
          'Inspect a dataset and run computations in an isolated sandbox',
          'Insert computed tables and charts into the report with provenance back to the exact inputs',
        ],
      },
      contribution: {
        summary:
          'GitHub lists a single contributor for this repository: me. The Spring Boot backend, the React frontend, the Python worker, the infrastructure code and the documentation are my own work.',
        areas: [
          {
            label: 'Backend',
            text: 'Spring Boot modular monolith: workspace authorization, durable PostgreSQL-backed job dispatch, a structured model gateway with audited calls.',
          },
          {
            label: 'Frontend',
            text: 'React and TypeScript: workspace, source pages, the collaborative report editor with comments, and analysis results.',
          },
          {
            label: 'AI / data worker',
            text: 'Internal Python FastAPI worker for source extraction, chunking and embeddings, plus the pinned scientific sandbox image.',
          },
          {
            label: 'Quality and delivery',
            text: 'Coverage gates, architecture decision records, Bicep infrastructure with offline validation, a one-command local demo.',
          },
        ],
      },
      architecture: {
        summary:
          'A Spring Boot modular monolith owns product logic, authorization and a durable job dispatcher backed by PostgreSQL. An internal Python worker extracts, chunks and embeds sources; Spring indexes the chunks in pgvector. Realtime editing runs in a separate Hocuspocus service that uses short-lived credentials issued by Spring.',
        nodes: [
          {
            id: 'browser',
            column: 0,
            row: 0,
            title: 'Browser',
            lines: ['React · TypeScript · TanStack Query', 'Tiptap / ProseMirror · Yjs'],
            shortLines: ['React · TypeScript', 'Tiptap · Yjs'],
          },
          {
            id: 'hocuspocus',
            column: 1,
            row: 0,
            title: 'Hocuspocus',
            lines: ['Realtime collaboration server', 'Credentials issued by Spring'],
            shortLines: ['Realtime sync', 'Yjs documents'],
          },
          {
            id: 'api',
            column: 0,
            row: 1,
            title: 'Spring Boot API',
            lines: ['Java 25 · Spring Boot 4.1', 'Authorization · job dispatcher · model gateway'],
            shortLines: ['Java 25 · Boot 4.1', 'Auth · dispatcher'],
          },
          {
            id: 'worker',
            column: 1,
            row: 1,
            title: 'FastAPI worker (internal)',
            shortTitle: 'FastAPI worker',
            lines: ['Python 3.13 · extraction', 'Chunking · embeddings'],
            shortLines: ['Python 3.13', 'Ingest · embeddings'],
          },
          {
            id: 'postgres',
            column: 0,
            row: 2,
            title: 'PostgreSQL + pgvector',
            shortTitle: 'PostgreSQL',
            lines: ['Sessions · quotas · job queue', 'Documents · vector search'],
            shortLines: ['+ pgvector', 'State · vectors'],
          },
          {
            id: 'blob',
            column: 1,
            row: 2,
            title: 'Azure Blob Storage / Azurite',
            shortTitle: 'Blob Storage',
            lines: ['Versioned source files', 'Azurite for local runs'],
            shortLines: ['Azure / Azurite', 'Source files'],
          },
        ],
        edges: [
          { from: 'browser', to: 'hocuspocus', both: true, label: 'sync' },
          { from: 'browser', to: 'api' },
          { from: 'api', to: 'worker', label: 'internal' },
          { from: 'api', to: 'postgres' },
        ],
        legend: {
          full: 'Arrows: documented calls between components. Schematic only; the blob store is used by the Spring backend, and generated analysis code runs in a separate Docker sandbox.',
          short: 'Arrows: documented calls. Schematic only.',
        },
        responsibilities:
          'Spring owns everything with product meaning: who may see a workspace, which job runs next, what a citation points at. Python owns the AI, data and scientific work and is only ever called by Spring, so the Java domain never depends on that ecosystem.',
      },
      challenges: [
        {
          title: 'Keeping claims traceable',
          text: 'Generated text must stay linked to the exact source chunks it relies on, across versioned sources, and a question with no supporting evidence must say so.',
        },
        {
          title: 'Running generated code safely',
          text: 'Analyses execute in a pinned Docker sandbox with limits, durable execution records and reruns that preserve earlier evidence.',
        },
        {
          title: 'Realtime collaborative editing',
          text: 'Shared documents on Yjs, Hocuspocus and Tiptap. Every accepted edit is committed before it is broadcast, and the state is stored atomically in PostgreSQL.',
        },
        {
          title: 'Authorization and workspace boundaries',
          text: 'Access to sources, documents and AI features is scoped by workspace and enforced by the server, including calls between internal services.',
        },
      ],
      decisions: [
        {
          decision: 'Spring modular monolith, with Python only for AI and data work',
          why: 'Product logic and authorization stay in one place, while extraction, embeddings and scientific computation use the Python ecosystem.',
          tradeoff: 'Two runtimes and an internal contract to maintain.',
        },
        {
          decision: 'Durable processing in PostgreSQL (ADR-011)',
          why: 'Sessions, quotas and job dispatch share one transactional store, with no extra infrastructure.',
          tradeoff: 'No Redis or Service Bus. Scaling evidence is limited to recorded local two-instance tests.',
        },
        {
          decision: 'Immutable source versions (ADR-005)',
          why: 'A citation or an analysis can always be traced to the exact bytes it used.',
          tradeoff: 'No complete retention or erasure workflow yet; it is proposed in ADR-014.',
        },
        {
          decision: 'Docker sandbox for generated analysis code (ADR-008)',
          why: 'Filesystem, network and resource limits around execution, with results that can be reproduced.',
          tradeoff: 'Local isolation does not prove isolation on Azure. A cloud runner is only proposed (ADR-015).',
        },
        {
          decision: 'Azure as Bicep infrastructure code, validated offline (ADR-017)',
          why: 'A reproducible definition of the infrastructure without paying for a standing cloud environment.',
          tradeoff: 'No subscription deployment is recorded, so there is no claim of cloud availability.',
        },
      ],
      quality: {
        summary:
          'Integration tests run against real PostgreSQL 17 and Azurite containers (Testcontainers), and line-coverage gates are enforced per module. The repository itself states that it is not production-ready.',
        facts: [
          {
            label: 'Coverage gates',
            value:
              'At least 80% line coverage, enforced separately for the source-processing, AI / retrieval and analysis modules (Maven) and for the Python worker (pytest).',
          },
          {
            label: 'Kinds of tests',
            value:
              'Java integration tests with Testcontainers, pytest for the worker, Jest for the frontend, browser end-to-end checks, and opt-in sandbox attack and cleanup tests.',
          },
          {
            label: 'Evidence limits',
            value: 'Local runs only. No hosted release, no live Azure validation and no production claim.',
          },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- 02 Parcel analysis
  {
    slug: 'parcel-analysis',
    number: '02',
    title: 'System Analizy Uwarunkowań Działki',
    shortTitle: 'Parcel analysis',
    subtitle: 'Spatial / Investment Parcel Analysis Platform',
    englishTitle: 'Spatial / Investment Parcel Analysis Platform',
    summary: 'Spatial / Investment Parcel Analysis Platform',
    accent: 'red',
    category: 'Spatial / GIS',
    role: 'Sole contributor to the repository.',
    repository: { visibility: 'public', url: 'https://github.com/IgorK834/system_analizy_uwarunkowan_dzialki' },

    overview: {
      lead: 'A web application that analyses the planning and investment context of a Polish land parcel. It combines GIS data and spatial-planning datasets, shows the result on a map and produces a PDF report with a verifiable audit package.',
      extra: {
        heading: 'Analysis areas',
        list: [
          'Local spatial plans (MPZP)',
          'General plans (POG)',
          'OUZ and related planning data',
          'Flood-risk data',
          'Protected areas',
          'Terrain / elevation',
          'Roads and neighbouring buildings',
          'Map layers',
        ],
      },
    },
    facts: [
      { label: 'Domain', value: 'GIS · Polish spatial-planning data', desktopOnly: true },
      { label: 'Runs', value: 'Locally, not deployed', desktopOnly: true },
    ],
    highlights: [
      {
        title: 'Missing data is not an all-clear',
        text: 'Every section has its own status, freshness and provenance. “Not checked” is never shown as “no restriction”, and the headline stays partial until everything in scope was checked.',
      },
      {
        title: 'Vector tiles straight from PostGIS',
        text: 'Mapbox Vector Tiles generated from PostGIS for the planning layer; WMS previews are proxied with tile caching; coordinate transformations are handled explicitly.',
      },
      {
        title: 'Reproducible reports, verifiable audit package',
        text: 'PDF reports built from immutable analysis snapshots, plus an audit ZIP whose SHA-256 manifest a stand-alone script verifies.',
      },
      {
        title: 'MPZP extraction research',
        tag: 'Experimental R&D',
        text: 'Deterministic parsing of local-plan documents, with an optional LLM path that is off by default. Model output is only a labelled candidate for manual verification.',
      },
    ],
    stack: [
      { label: 'Backend', items: ['Python', 'FastAPI', 'SQLAlchemy', 'GeoAlchemy', 'Alembic'] },
      { label: 'Frontend & maps', items: ['Next.js 16', 'React 19', 'TypeScript', 'MapLibre'] },
      {
        label: 'Spatial data & infrastructure',
        items: ['PostgreSQL 16', 'PostGIS 3.4', 'GIS / spatial data processing', 'Docker Compose'],
      },
    ],

    wireframe: 'map',

    seo: {
      title: 'Parcel Analysis Platform — System Analizy Uwarunkowań Działki · Igor Kadziela',
      description:
        'Case study: a web application that analyses the planning and investment context of a Polish land parcel with GIS data. Next.js, FastAPI, PostGIS. Screenshots and source on GitHub.',
    },

    caseStudy: {
      problem:
        'Assessing a plot of land in Poland means collecting scattered public data (local and general plans, flood risk, protected areas, terrain, roads and neighbouring buildings) from separate registers, each with its own coverage and freshness. The dangerous mistake is reading a missing answer as “no restriction”. The platform automates the collection and keeps explicit what was checked, what was not, and where each value came from.',
      product: {
        audience: 'anyone assessing the investment potential of a parcel in Poland',
        lead: 'What the application lets them do:',
        capabilities: [
          'Look up a parcel by its identifier or by address',
          'See planning zones (POG), local plans (MPZP) and other layers on a map',
          'Read a status for every section: checked, partial or no coverage',
          'Download a PDF report and an audit package with a SHA-256 manifest',
          'Verify the package independently with a short Python script',
        ],
      },
      contribution: {
        summary:
          'GitHub lists a single contributor for this repository: me. Backend, frontend, data imports, tests and documentation are my own work.',
        areas: [
          {
            label: 'Backend',
            text: 'FastAPI service split into domain modules for planning, imports, reports and audit export, with Alembic migrations.',
          },
          {
            label: 'Frontend and map',
            text: 'Next.js and React application with a MapLibre map, an object inspector and the analysis result panel.',
          },
          {
            label: 'Data and imports',
            text: 'PostGIS schema and importers for planning acts (POG) and BDOT10k releases, parallel, with progress and resume after interruption.',
          },
          {
            label: 'Quality and delivery',
            text: 'CI gates for backend and frontend, locked and hashed dependencies, and an evaluation against a reference corpus of 30 parcels.',
          },
        ],
      },
      architecture: {
        summary:
          'A FastAPI backend with domain modules reads planning data from PostGIS and calls live public services for the rest. A Next.js application renders the map and results. Importers load planning acts and BDOT10k releases into PostGIS ahead of time.',
        nodes: [
          {
            id: 'browser',
            column: 0,
            row: 0,
            title: 'Browser',
            lines: ['Next.js 16 · React 19', 'MapLibre map · result panel'],
            shortLines: ['Next.js 16', 'MapLibre map'],
          },
          {
            id: 'api',
            column: 0,
            row: 1,
            title: 'FastAPI backend',
            lines: ['Python · domain modules', 'Analysis · reports · audit export'],
            shortLines: ['Python · FastAPI', 'Analysis · reports'],
          },
          {
            id: 'services',
            column: 1,
            row: 1,
            title: 'Public services',
            lines: ['Live GIS and planning services', 'Parcel lookup · flood · terrain'],
            shortLines: ['Live GIS and', 'planning services'],
          },
          {
            id: 'postgis',
            column: 0,
            row: 2,
            title: 'PostgreSQL + PostGIS',
            shortTitle: 'PostGIS',
            lines: ['Planning zones · vector tiles', 'Analysis snapshots'],
            shortLines: ['PostgreSQL 16', 'Zones · snapshots'],
          },
          {
            id: 'importers',
            column: 1,
            row: 2,
            title: 'Importers',
            lines: ['POG acts · BDOT10k releases', 'Parallel · resumable'],
            shortLines: ['POG · BDOT10k', 'Resumable'],
          },
        ],
        edges: [
          { from: 'browser', to: 'api' },
          { from: 'api', to: 'services', label: 'live' },
          { from: 'api', to: 'postgis' },
          { from: 'importers', to: 'postgis' },
        ],
        legend: {
          full: 'Arrows: documented calls between components. Schematic only.',
          short: 'Arrows: documented calls. Schematic only.',
        },
        responsibilities:
          'Planning acts are read from local imports, so a municipality that was never imported shows as “no coverage” rather than as an empty answer. Live public services supply the rest, and their answers are cached for a short time when the result is only partial.',
      },
      challenges: [
        {
          title: 'Honest status when data is missing',
          text: 'Coverage differs by municipality and source. Sections report checked, partial or no coverage, and a completeness bar shows how much of the scope was actually verified.',
        },
        {
          title: 'Importing national planning data',
          text: 'Planning acts come from a public register. Imports run in parallel, report progress with an estimate and resume after an interruption.',
        },
        {
          title: 'Reading planning documents',
          text: 'Local-plan texts are unstructured. A deterministic engine with calibrated confidence extracts values; an optional LLM path only proposes candidates that need a verified quote.',
        },
        {
          title: 'Reproducible output',
          text: 'Reports come from immutable snapshots, and the audit ZIP carries a manifest with SHA-256 hashes that a script using only Python 3 can verify.',
        },
      ],
      decisions: [
        {
          decision: 'Missing data is never shown as the absence of a restriction',
          why: 'For an investor, an unchecked source and a confirmed lack of restrictions mean opposite things.',
          tradeoff: 'Most analyses report “partial” until the relevant data has been imported.',
        },
        {
          decision: 'Docker Compose as the default way to run',
          why: 'One command starts the backend, the frontend and PostGIS, with no local PostgreSQL to install.',
          tradeoff: 'It runs on a single machine. There is no hosted instance.',
        },
        {
          decision: 'LLM extraction off by default, output always labelled',
          why: 'A model reading is a candidate: it needs a verified quote and is marked as an automatic reading that requires confirmation.',
          tradeoff: 'Evaluation against live model calls is a manual step outside CI, because it costs money.',
        },
        {
          decision: 'Locked, hashed dependencies and pinned base images',
          why: 'The production image is reproducible and contains no test tooling.',
          tradeoff: 'Updates are done by hand, with audits catching vulnerable versions.',
        },
      ],
      quality: {
        summary:
          'Backend and frontend gates run in CI and in containers, so a clean machine needs only Docker. The analysis is informational and the README says it is not an official document.',
        facts: [
          {
            label: 'Coverage gates',
            value: 'Backend tests run with a minimum of 80% coverage (pytest), alongside ruff, mypy with a baseline and pip-audit.',
          },
          {
            label: 'Kinds of tests',
            value: 'pytest for the backend, Vitest and React Testing Library for the frontend, plus a weekly live smoke run against the real services.',
          },
          {
            label: 'Evidence limits',
            value: 'All 30 reference parcels return a partial status until planning data is imported. MPZP extraction with a language model is experimental.',
          },
        ],
      },
    },
  },

  // ---------------------------------------------------------------- 03 obiekt.io (in development)
  {
    slug: 'obiekt-io',
    number: '03',
    title: 'obiekt.io',
    shortTitle: 'obiekt.io',
    subtitle: 'A tool for building managers: from a report to a documented repair.',
    summary: 'In development. A SaaS tool that takes a building fault from report to accepted repair. Foundation done, product next.',
    accent: 'yellow',
    status: 'In development',
    inDevelopment: true,
    role: 'Sole contributor to the repository.',
    // The repository is private, so there is no link.
    repository: { visibility: 'private' },

    overview: {
      label: 'The product',
      tag: 'in development',
      lead: 'A planned SaaS tool for building managers: residents report faults by QR code, voice or e-mail, contractors work from a link, and every job ends with a PDF protocol and acceptance. Only the foundation exists so far.',
      extra: {
        heading: 'Planned flow',
        list: ['Report by QR, voice or e-mail', 'Send to a contractor', 'Work from a link, no account', 'Protocol and acceptance'],
      },
    },
    facts: [
      { label: 'Status', value: 'In development' },
      { label: 'Stage', value: 'Foundation done · product next', desktopOnly: true },
    ],
    highlights: [
      {
        title: 'Three ways in, one case',
        text: 'A QR form, a voice assistant and e-mail all open the same ticket. The reporter gets a case number only after it is saved.',
      },
      {
        title: 'Contractors without accounts',
        text: 'A work order is a link. Entry codes appear only after an SMS check on the contractor’s phone and stop working when the job is accepted.',
      },
      {
        title: 'AI proposes, people decide',
        text: 'AI sorts and translates reports in Polish, English and Ukrainian. Danger alerts never wait for it, and acceptance stays with the manager.',
      },
      {
        title: 'A record of every repair',
        text: 'A short completion form becomes a versioned PDF protocol. Costs stay outside the app; the manager gets a summary of work done.',
      },
    ],
    stack: [
      {
        label: 'Application skeletons (built)',
        items: ['Next.js 16', 'React 19', 'TypeScript', 'Java 25', 'Spring Boot 4.1', 'Spring Modulith', 'Python', 'FastAPI'],
      },
      {
        label: 'Platform (planned)',
        items: ['PostgreSQL + pgvector', 'Row-level security', 'S3-compatible storage', 'Keycloak (OIDC)', 'OpenAPI contracts', 'Docker Compose'],
      },
      {
        label: 'Integrations (planned)',
        items: ['ElevenLabs voice agents', 'E-mail in and out', 'SMS', 'LLM provider (to be chosen)', 'PDF generation'],
      },
    ],

    visualLabel: 'In development',
    wireframe: 'builder',

    seo: {
      title: 'obiekt.io — a tool for building managers (in development) · Igor Kadziela',
      description:
        'obiekt.io is a planned SaaS tool for building managers: QR, voice and e-mail reports, contractors working from links, PDF protocols and acceptance. In development: Next.js, Spring Boot and FastAPI foundation. Private repository.',
    },

    caseStudy: {
      problem:
        'A building manager receives a report, has to pass it to a contractor, follow the case and later show that the repair was done. Today that happens across phone calls, e-mails and spreadsheets. obiekt.io is meant to keep the whole path, from report to acceptance, in one place.',
      product: {
        audience: 'building managers, their contractors and the people who report faults',
        lead: 'The intended product (a goal, not a working feature):',
        capabilities: [
          'Report a fault by scanning a QR code, by voice or by e-mail, with no account and no app',
          'Send the job to a contractor as a link, with the exact location and entry route',
          'Follow the case through blocks, a completion form and a PDF protocol',
          'Accept the repair, or send it back, and keep the history of the building',
          'See a monthly report, shareable with a residents’ board by link',
        ],
      },
      roadmap: {
        summary:
          'The repository is at the end of its foundation stage. Most of the work is still ahead, and this is the order it is planned in. Nothing below the first line exists yet.',
        phases: [
          {
            label: 'Foundation',
            state: 'done',
            text: 'Three service skeletons (a web page in three languages, a Spring Modulith core with 15 modules, a FastAPI service), initial API contracts, a local Docker Compose environment and the engineering rules.',
          },
          {
            label: 'Core flow',
            state: 'next',
            text: 'Organizations and roles, buildings with exact locations and QR labels, tickets and work orders, assignment, and the contractor link with SMS verification.',
          },
          {
            label: 'Completion',
            state: 'next',
            text: 'The completion form, versioned PDF protocols, acceptance by the manager, notifications and the entry-code vault.',
          },
          {
            label: 'Channels and AI',
            state: 'later',
            text: 'The voice assistant, e-mail intake, AI classification with Polish, English and Ukrainian translation, and the danger-alert path.',
          },
          {
            label: 'First pilot',
            state: 'later',
            text: 'Monthly reports, monitoring, backup and restore drills, a security review and a first pilot with a residential property manager.',
          },
          {
            label: 'After the pilot',
            state: 'later',
            text: 'An office-building profile (zones, tenants, on-site teams), connectors to property-management software and a searchable knowledge base per building.',
          },
        ],
      },
      architecture: {
        summary:
          'A planned modular monolith: one Spring Boot core owns permissions, state changes and background jobs, a separate FastAPI service only returns AI proposals, and PostgreSQL keeps the facts with every row tied to an organization. Voice runs on ElevenLabs and calls back into the core through a few narrow tools.',
        nodes: [
          {
            id: 'web',
            column: 0,
            row: 0,
            title: 'Web app',
            lines: ['Next.js 16 · React 19', 'Public pages · panels · contractor link'],
            shortLines: ['Next.js 16', 'Pages · panels'],
          },
          {
            id: 'voice',
            column: 1,
            row: 0,
            title: 'Voice agent',
            lines: ['ElevenLabs', 'Intake by voice, tools back into the core'],
            shortLines: ['ElevenLabs', 'Voice intake'],
          },
          {
            id: 'core',
            column: 0,
            row: 1,
            title: 'Core service',
            lines: ['Spring Boot 4.1 · Modulith', '15 modules · permissions · jobs'],
            shortLines: ['Spring Boot 4.1', '15 modules'],
          },
          {
            id: 'ai',
            column: 1,
            row: 1,
            title: 'AI service',
            lines: ['FastAPI · Python', 'Classification · translation'],
            shortLines: ['FastAPI', 'AI proposals'],
          },
          {
            id: 'db',
            column: 0,
            row: 2,
            title: 'PostgreSQL + pgvector',
            shortTitle: 'PostgreSQL',
            lines: ['Facts, jobs and audit', 'Isolated per organization'],
            shortLines: ['+ pgvector', 'Per-org rows'],
          },
          {
            id: 'files',
            column: 1,
            row: 2,
            title: 'Object storage',
            lines: ['S3-compatible', 'Photos and PDF protocols'],
            shortLines: ['S3-compatible', 'Photos · PDFs'],
          },
        ],
        edges: [
          { from: 'web', to: 'voice', both: true, label: 'voice' },
          { from: 'web', to: 'core' },
          { from: 'core', to: 'ai', label: 'proposals' },
          { from: 'core', to: 'db' },
        ],
        legend: {
          full: 'Planned design. Arrows show the intended calls between components. Schematic only.',
          short: 'Planned design. Schematic only.',
        },
        responsibilities:
          'The core decides everything that has consequences: who may see what, which state a job may move to, what a contractor may read. The AI service never writes to the database, and the voice agent can only call a handful of core tools.',
      },
      challenges: [
        {
          title: 'Isolation between organizations',
          text: 'Every row belongs to one organization and the database enforces it with row-level security. Tests generated from the API check that one customer never reads another’s data.',
        },
        {
          title: 'Entry codes for contractors',
          text: 'Codes are encrypted, shown only to a verified phone on the right job, and never copied into logs, AI prompts, documents or the browser cache.',
        },
        {
          title: 'Voice intake that cannot lose a report',
          text: 'The draft is saved while the call is running, the case number is given only after saving, and a tool call and the final webhook must never create two tickets.',
        },
        {
          title: 'Jobs that survive restarts',
          text: 'State changes and events are saved together, background jobs retry safely, and reminders still fire once after a restart.',
        },
      ],
      decisions: [
        {
          decision: 'Contractors work through links, not accounts',
          why: 'No passwords or installs: a link opens one job, and the phone is verified by SMS before codes appear.',
          tradeoff: 'A link can be forwarded. The SMS check, a limit of three phone numbers and the end of access at acceptance contain that.',
        },
        {
          decision: 'Costs stay outside the app',
          why: 'Prices, quotes and invoices are agreed between manager and contractor. The app only records that consent was given and lists the work done.',
          tradeoff: 'No cost reporting at first. Invoice import is a later step.',
        },
        {
          decision: 'A modular monolith with module boundaries checked by a test',
          why: 'One deployable core is simpler to run, and an architecture test fails the build when a module reaches into another.',
          tradeoff: 'Most business modules are still empty and will be filled task by task.',
        },
        {
          decision: 'API contracts as the single source of truth',
          why: 'OpenAPI and JSON Schema generate the TypeScript and Python models, so web, core and AI service share one definition.',
          tradeoff: 'Only initial contracts exist so far; the internal definitions have no paths yet.',
        },
      ],
      quality: {
        summary: 'What is checked so far is recorded in dated local reports in the repository. No passing CI run is claimed yet.',
        facts: [
          {
            label: 'Checked so far',
            value:
              'The core architecture test over 15 modules, the web build with a Playwright smoke test and accessibility scan, and a health test for the AI service.',
          },
          {
            label: 'Planned checks',
            value:
              'Isolation tests for every endpoint, a canary test for entry codes, voice and AI evaluation sets, load tests and a restore drill before the pilot.',
          },
          {
            label: 'Evidence limits',
            value: 'Local runs on one machine. No CI result, no business endpoints or tables, no full login and no AI features yet.',
          },
        ],
      },
    },
  },
];

/** Attach each project's pinned screenshots (from its screenshots.json manifest). */
export const projects: Project[] = entries.map((project) => ({ ...project, ...projectMedia(project.slug) }));

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
