# CLAUDE.md — AI Assistant Guide for daily_stock_analysis

This file provides a comprehensive reference for AI assistants (Claude Code and others) working on this repository.

---

## Project Overview

**daily_stock_analysis** is a production-grade AI-powered stock analysis system supporting A-shares (China), Hong Kong, and US markets. It fetches market data from multiple sources, calculates technical indicators, searches financial news, and generates natural-language analysis reports via LLM APIs. Reports are delivered through configurable notification channels (WeChat, Feishu, Telegram, Email, etc.).

**Key capabilities:**
- Automated daily stock analysis with AI commentary
- Market review (indices, sectors) for CN/US/both
- Interactive agent strategy chat (ReAct loop with 11 built-in trading strategies)
- Backtesting engine to validate historical analysis accuracy
- Web UI dashboard (Vue 3 SPA + FastAPI backend)
- Multi-platform bot integration (DingTalk, Discord, Feishu)
- Image recognition for extracting stock codes from screenshots

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Python 3.10+ |
| Web framework | FastAPI + Uvicorn |
| Database | SQLite via SQLAlchemy ORM |
| Frontend | Vue 3 + TypeScript + Vite + Tailwind CSS (in `apps/dsa-web/`) |
| AI/LLM | Google Gemini (primary), Anthropic Claude, OpenAI-compatible |
| Data sources | efinance, akshare, tushare, pytdx, baostock, yfinance |
| Search | Tavily, SerpAPI, Brave Search |
| Testing | pytest, flake8, black, isort |
| Deployment | Docker, GitHub Actions, local Python |

---

## Repository Layout

```
daily_stock_analysis/
├── main.py                    # Primary CLI entry point
├── server.py                  # Standalone FastAPI server entry
├── webui.py                   # Web UI launcher (alias for --webui-only)
├── analyzer_service.py        # Shared service façade (CLI, Web, Bot)
├── test.sh                    # Integration test runner (market, stocks, etc.)
├── test_env.py                # Environment/dependency checker
├── requirements.txt           # Python dependencies
├── pyproject.toml             # black, isort, bandit config
├── setup.cfg                  # flake8, pytest config
├── .env.example               # All 150+ config options with comments
├── AGENTS.md                  # Chinese-language dev conventions for AI agents
│
├── src/                       # Core application modules
│   ├── config.py              # Config dataclass (singleton), env loading
│   ├── analyzer.py            # LLM abstraction (GeminiAnalyzer)
│   ├── stock_analyzer.py      # Technical analysis: MA, MACD, RSI, BB, etc.
│   ├── market_analyzer.py     # Market overview, sector rankings
│   ├── search_service.py      # Multi-provider news search
│   ├── storage.py             # SQLite schema + ORM helpers
│   ├── notification.py        # 9+ notification channels (WeChat, TG, email…)
│   ├── scheduler.py           # APScheduler cron wrapper
│   ├── auth.py                # Web UI password/session management
│   ├── enums.py               # Shared enumerations (ReportType, etc.)
│   ├── formatters.py          # Markdown report templates
│   ├── md2img.py              # Markdown → image (via wkhtmltopdf)
│   ├── logging_config.py      # Log file rotation setup
│   ├── core/
│   │   ├── pipeline.py        # StockAnalysisPipeline — main orchestrator
│   │   ├── market_review.py   # Market review orchestration
│   │   ├── backtest_engine.py # Backtesting logic and scoring
│   │   ├── config_manager.py  # Runtime config read/write for web API
│   │   └── config_registry.py # Strategy/skill registry
│   ├── agent/
│   │   ├── executor.py        # ReAct agent loop (tool calling + LLM)
│   │   ├── llm_adapter.py     # Unified LLM interface
│   │   ├── conversation.py    # Conversation history management
│   │   ├── factory.py         # Agent builder/DI
│   │   ├── skills/            # Strategy skill loader (YAML → Skill objects)
│   │   └── tools/             # Tool implementations (data, analysis, search)
│   ├── services/              # Business logic layer
│   │   ├── analysis_service.py
│   │   ├── backtest_service.py
│   │   ├── history_service.py
│   │   ├── stock_service.py
│   │   ├── system_config_service.py
│   │   ├── task_service.py
│   │   └── task_queue.py
│   └── repositories/          # Data access layer (SQLAlchemy repos)
│       ├── analysis_repo.py
│       ├── backtest_repo.py
│       └── stock_repo.py
│
├── api/                       # FastAPI application
│   ├── app.py                 # App factory, CORS, middleware, static files
│   ├── deps.py                # FastAPI dependency injection helpers
│   ├── middlewares/           # Auth middleware, error handlers
│   └── v1/
│       ├── router.py          # Aggregated v1 router
│       ├── endpoints/         # Route handlers (analysis, stocks, history,
│       │                      #   backtest, auth, system_config, agent)
│       └── schemas/           # Pydantic request/response models
│
├── bot/                       # Bot platform adapters
│   ├── dispatcher.py          # Message routing
│   ├── handler.py             # Common command handler
│   ├── models.py              # BotMessage, BotUser data classes
│   ├── commands/              # /analyze, /ask, /batch, /chat, /market, /status
│   └── platforms/             # DingTalk, Discord, Feishu stream adapters
│
├── data_provider/             # Market data fetchers (priority-ordered fallback)
│   ├── base.py                # DataFetcherManager, canonical_stock_code()
│   ├── efinance_fetcher.py    # East Money (priority 0, China)
│   ├── akshare_fetcher.py     # AkShare (priority 1, China)
│   ├── tushare_fetcher.py     # Tushare Pro (priority 2, China)
│   ├── pytdx_fetcher.py       # Tongdaxin (priority 2, China)
│   ├── baostock_fetcher.py    # Baostock (priority 3, China)
│   ├── yfinance_fetcher.py    # Yahoo Finance (priority 4, global)
│   └── realtime_types.py      # ChipDistribution and other data models
│
├── strategies/                # 11 YAML strategy definitions (no Python needed)
│   ├── README.md              # Format specification for custom strategies
│   ├── bull_trend.yaml
│   ├── ma_golden_cross.yaml
│   ├── volume_breakout.yaml
│   ├── shrink_pullback.yaml
│   ├── bottom_volume.yaml
│   ├── dragon_head.yaml
│   ├── one_yang_three_yin.yaml
│   ├── box_oscillation.yaml
│   ├── chan_theory.yaml
│   ├── wave_theory.yaml
│   └── emotion_cycle.yaml
│
├── tests/                     # 18 pytest test files
├── docs/                      # Full documentation (CHANGELOG, DEPLOY, FAQ, etc.)
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── apps/
│   ├── dsa-web/               # Vue 3 frontend SPA
│   └── dsa-desktop/           # Electron desktop wrapper
├── scripts/                   # Build scripts, ci_gate.sh
├── patch/
│   └── eastmoney_patch.py     # Optional EastMoney API patch
└── .github/workflows/         # CI/CD: ci.yml, daily_analysis.yml, auto-tag.yml
```

---

## Entry Points

| Script | Purpose |
|--------|---------|
| `python main.py` | Run analysis once (reads `STOCK_LIST` from `.env`) |
| `python main.py --debug` | Verbose logging |
| `python main.py --dry-run` | Fetch data only, skip AI analysis |
| `python main.py --stocks 600519,AAPL` | Override stock list |
| `python main.py --no-notify` | Suppress all notifications |
| `python main.py --schedule` | Start daemon mode (cron via `SCHEDULE_TIME`) |
| `python main.py --market-review` | Market review only |
| `python main.py --webui` | Start analysis + Web UI |
| `python main.py --serve-only` | Web UI / API only, no analysis |
| `python webui.py` | Alias for `--serve-only` |
| `python server.py` | Bare FastAPI server startup |

---

## Configuration

All configuration is done via environment variables loaded from `.env` (see `.env.example`).

**Critical required variables:**
```bash
STOCK_LIST=600519,300750        # Comma-separated stock codes
GEMINI_API_KEY=...              # At least one LLM key is required
# or ANTHROPIC_API_KEY=...
# or OPENAI_API_KEY=...
```

**Important optional variables:**
```bash
SCHEDULE_ENABLED=true           # Enable cron mode
SCHEDULE_TIME=18:00             # Daily run time (HH:MM, 24h)
RUN_IMMEDIATELY=true            # Run once on startup
MARKET_REVIEW_ENABLED=true      # Include market overview
MARKET_REVIEW_REGION=cn         # cn | us | both
AGENT_MODE=true                 # Enable strategy chat agent
AGENT_SKILLS=bull_trend,...     # Comma-separated strategy names
WEBUI_ENABLED=true              # Start web server
WEBUI_HOST=127.0.0.1
WEBUI_PORT=8000
ADMIN_AUTH_ENABLED=false        # Web UI password protection
REPORT_TYPE=simple              # simple | full
REPORT_SUMMARY_ONLY=false       # Aggregate only, no per-stock detail
MAX_WORKERS=3                   # Concurrent stock analysis threads
DEBUG=false
LOG_LEVEL=INFO
DATABASE_PATH=./data/stock_analysis.db
```

**Data source priority** (configurable, lower = higher priority):
```bash
EFINANCE_PRIORITY=0
AKSHARE_PRIORITY=1
TUSHARE_PRIORITY=2
PYTDX_PRIORITY=2
BAOSTOCK_PRIORITY=3
YFINANCE_PRIORITY=4
```

Custom `.env` path: set `ENV_FILE=/path/to/.env` before importing `src.config`.

---

## Development Setup

```bash
# 1. Clone and enter directory
git clone <repo> && cd daily_stock_analysis

# 2. Create virtual environment
python -m venv .venv && source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy and fill in configuration
cp .env.example .env
# Edit .env with your API keys

# 5. Run syntax check
python -m py_compile main.py src/*.py data_provider/*.py

# 6. Run tests
pytest tests/ -v --tb=short -m "unit"
```

---

## Testing

### Test file locations
- Unit/integration tests: `tests/test_*.py`
- Shell integration tests: `test.sh`
- Environment check: `test_env.py`

### Pytest markers
| Marker | Meaning |
|--------|---------|
| `unit` | Fast, offline, no external dependencies |
| `integration` | Service-level, no network required |
| `network` | Requires external APIs or network access |

### Running tests
```bash
# All unit tests
pytest tests/ -m unit -v

# Specific test file
pytest tests/test_backtest_engine.py -v

# Integration test shell script
./test.sh quick           # Single stock quick test
./test.sh market          # Market review only
./test.sh us-stock        # US stocks (AAPL, TSLA)
./test.sh a-stock         # A-shares (Moutai, Ping'an Bank)
./test.sh all             # Full suite

# Syntax check
python -m py_compile main.py src/*.py data_provider/*.py

# CI gate (syntax + flake8 + unit tests)
./scripts/ci_gate.sh
```

---

## Code Style

| Tool | Standard |
|------|---------|
| `black` | Line width 120, targets py310/py311/py312 |
| `isort` | `profile = "black"`, line length 120 |
| `flake8` | Max line length 120, ignores E501/W503/E203/E402 |

```bash
# Format code
black --line-length 120 main.py src/ api/ bot/ data_provider/
isort --profile black --line-length 120 main.py src/ api/ bot/ data_provider/

# Lint
flake8 main.py src/ api/ bot/ data_provider/ --max-line-length=120
```

**Comments and code:** New or modified code comments must use **English**. The codebase has legacy Chinese docstrings — do not add more Chinese comments, only English.

---

## Architecture: Analysis Pipeline

The core data flow for stock analysis is:

```
main.py (CLI) ──► StockAnalysisPipeline (src/core/pipeline.py)
                        │
                        ├── DataFetcherManager (data_provider/)
                        │     └── Fallback chain: efinance → akshare → tushare → baostock → yfinance
                        │
                        ├── StockTrendAnalyzer (src/stock_analyzer.py)
                        │     └── MA, MACD, RSI, Bollinger Bands, volume analysis
                        │
                        ├── SearchService (src/search_service.py)
                        │     └── Tavily / SerpAPI / Brave (multi-key rotation)
                        │
                        ├── GeminiAnalyzer (src/analyzer.py)
                        │     └── Gemini → Claude → OpenAI (fallback chain)
                        │
                        ├── Storage (src/storage.py)
                        │     └── SQLite: analysis_history, backtest_results
                        │
                        └── NotificationService (src/notification.py)
                              └── WeChat / Feishu / Telegram / Email / DingTalk / …
```

### Agent mode (strategy chat)

When `AGENT_MODE=true`, the agent endpoint (`api/v1/agent/`) runs a ReAct loop:

```
User query ──► AgentExecutor (src/agent/executor.py)
                    │
                    ├── LLMToolAdapter (llm_adapter.py)  ← Gemini/Claude/OpenAI
                    ├── ToolRegistry (tools/registry.py) ← data, analysis, search, market tools
                    └── SkillManager (skills/base.py)    ← YAML strategy injected into system prompt
```

---

## Key Modules Reference

### `src/config.py`
- `Config` dataclass — all settings as typed attributes with defaults
- `get_config()` — returns the singleton instance
- `setup_env()` — loads `.env` file (call once at program start)

### `data_provider/base.py`
- `DataFetcherManager` — orchestrates fallback across all fetchers
- `canonical_stock_code(code)` — normalizes stock codes (adds market suffix, handles ETFs)

### `src/analyzer.py`
- `GeminiAnalyzer` — unified LLM interface; tries Gemini, then Claude, then OpenAI
- `AnalysisResult` — structured analysis output with recommendation, reasoning, key levels

### `src/core/pipeline.py`
- `StockAnalysisPipeline` — main orchestrator; accepts `config`, `max_workers`, `source_message`
- `process_single_stock(code, ...)` — full pipeline for one stock
- `run(stock_codes, ...)` — concurrent batch processing

### `src/notification.py`
- `NotificationService` — routes to all configured channels
- `NotificationChannel` — enum of all supported channels

### `strategies/*.yaml`
Custom strategies follow the schema in `strategies/README.md`. No Python required.
Place custom YAML files in the directory set by `AGENT_STRATEGY_DIR`.

---

## Git Conventions

### Branch naming
Feature branches follow `claude/<description>-<session-id>` format.

### Commit messages
- Must be in **English**
- Use semantic prefix: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`
- Append version tag on the same line: `#patch`, `#minor`, `#major`, `#skip`
- Do **not** add `Co-Authored-By` lines
- Examples:
  ```
  fix: handle missing volume data in AkShare fetcher #patch
  feat: add Brave Search provider with key rotation #minor
  chore: update dependencies to latest patch versions #skip
  ```

### PR requirements
Every PR must include:
1. A linked issue (`Fixes #xxx` or `Refs #xxx`) **or** a full motivation description
2. PR type label: `fix / feat / refactor / docs / chore / test`
3. Change scope (which modules are affected)
4. Verification steps and output
5. Rollback plan
6. Compatibility/breaking change notes (if any)

### Version tagging (auto-tag.yml)
| Tag in commit | Release type |
|---------------|-------------|
| `#patch` | Bug fixes, small changes |
| `#minor` | New backward-compatible features |
| `#major` | Breaking changes, major restructuring |
| `#skip` / `#none` | No release triggered |

---

## CI/CD Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | push/PR | Lint (flake8) + unit tests |
| `daily_analysis.yml` | schedule (cron) | Run analysis via GitHub Actions |
| `auto-tag.yml` | push to master | Auto-version based on commit tags |
| `docker-publish.yml` | tag push | Build and push Docker image |
| `pr-review.yml` | PR opened | Automated PR checklist review |
| `network-smoke.yml` | schedule | Smoke test external API connectivity |

---

## Deployment

### Docker (recommended for production)
```bash
cp .env.example .env  # fill in your keys
docker-compose -f docker/docker-compose.yml up -d analyzer  # scheduled mode
docker-compose -f docker/docker-compose.yml up -d server    # API/web mode
```

### GitHub Actions (serverless, zero-cost)
1. Fork the repository
2. Add secrets in repo Settings → Secrets
3. The `daily_analysis.yml` workflow runs on schedule

### Local development
```bash
python main.py --debug --stocks 600519
```

---

## Common Patterns & Gotchas

1. **Stock code normalization**: Always use `canonical_stock_code()` from `data_provider/base.py`. Codes are case-insensitive; US stocks use bare tickers (e.g. `AAPL`), A-shares use 6-digit codes (`600519`).

2. **Config singleton**: `get_config()` caches the singleton. Use `setup_env(override=True)` + recreate config if you need to reload `.env` at runtime (e.g., after web settings update).

3. **Concurrency**: `MAX_WORKERS` defaults to 3. Keep it low to avoid rate limits from data providers. The pipeline uses `ThreadPoolExecutor` — all fetchers must be thread-safe.

4. **LLM fallback chain**: `GeminiAnalyzer` tries providers in order: Gemini → Claude → OpenAI. If a key is absent or a call fails, it falls back silently. Always configure at least one key.

5. **Notifications and batching**: By default all stocks are analyzed first, then a single notification is sent. Set `SINGLE_STOCK_NOTIFY=true` to push after each stock. Set `MERGE_EMAIL_NOTIFICATION=true` to combine individual + market reports into one email.

6. **Proxy**: `USE_PROXY=true` only applies in non-GitHub-Actions environments. Set `PROXY_HOST` and `PROXY_PORT` as needed for local development behind a proxy.

7. **Database**: SQLite file at `DATABASE_PATH` (default `./data/stock_analysis.db`). The ORM auto-creates tables on first run. Do not delete this file unless resetting backtest history.

8. **EastMoney patch**: If efinance/akshare requests fail due to API changes, enable `ENABLE_EASTMONEY_PATCH=true`. The patch is in `patch/eastmoney_patch.py`.

9. **Custom strategies**: Add a YAML file to `strategies/` (or the path in `AGENT_STRATEGY_DIR`) following the schema in `strategies/README.md`. The strategy is available immediately — no code changes needed.

10. **Image recognition**: Requires at least one vision-capable API key (`GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, or an `OPENAI_VISION_MODEL`-capable key). Max image size is 5 MB per request.

---

## Documentation

| File | Content |
|------|---------|
| `README.md` | User-facing setup guide (Chinese) |
| `docs/README_EN.md` | English setup guide |
| `docs/DEPLOY.md` | Deployment reference (Chinese) |
| `docs/DEPLOY_EN.md` | Deployment reference (English) |
| `docs/FAQ.md` | Frequently asked questions (Chinese) |
| `docs/CHANGELOG.md` | Version history |
| `docs/CONTRIBUTING.md` | Contribution guidelines |
| `AGENTS.md` | AI agent collaboration conventions (Chinese) |
| `strategies/README.md` | Custom strategy YAML format spec |

---

## When Making Changes

1. **Read before editing**: Always read the target file before modifying it.
2. **Run syntax check**: `python -m py_compile <changed_files>` before committing.
3. **Run affected tests**: `pytest tests/ -m unit -v`
4. **Update docs**: If changing user-visible behavior, update `README.md` and `docs/CHANGELOG.md`.
5. **English code comments**: All new/modified inline comments must be in English.
6. **Line width**: Stay within 120 characters.
7. **No unnecessary abstractions**: Prefer the simplest correct solution.
