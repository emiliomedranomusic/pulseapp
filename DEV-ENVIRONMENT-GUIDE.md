# Starting Your Dev Environment — Deep Agents

A step-by-step guide to going from a fresh clone to a **running local agent with a web UI**. No prior LangGraph experience needed.

By the end you'll have a Deep Agent running on your machine that you can chat with in a browser, watch it think, and inspect the files it creates.

---

## What you're about to run

A Deep Agent runs as a small local web server called the **LangGraph dev server**. When you start it, it opens **LangGraph Studio** — a browser interface where you can:

- send your agent a prompt and watch its full reasoning step by step,
- see every tool call and sub-agent it spins up,
- inspect the files it reads and writes.

You start that server one of two ways:

- **Path A — Use an example agent** (fastest way to see something working). Good for "I just want it running."
- **Path B — Scaffold your own project** with the `deepagents` CLI. Good for "I'm building my own agent for the hackathon."

Do Path A first to confirm your setup works, then move to Path B.

---

## 1. Prerequisites (do this once)

### Install `uv`

`uv` is the tool that installs Python packages and runs the project. It replaces `pip`/`poetry`.

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

After it installs, close and reopen your terminal, then check it works:

```bash
uv --version
```

> `uv` will download the right version of Python for you automatically — you don't need to install Python separately.

### Get your API keys

Your agent calls an AI model and (sometimes) other services. You'll need keys for whichever ones your agent uses:


| Key                 | What it's for                                     | Where to get it                                                                     |
| ------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | Runs Claude (the default model)                   | [https://console.anthropic.com](https://console.anthropic.com)                      |
| `OPENAI_API_KEY`    | Runs GPT models                                   | [https://platform.openai.com](https://platform.openai.com)                          |
| `TAVILY_API_KEY`    | Web search (used by the research example)         | [https://www.tavily.com](https://www.tavily.com) (free tier)                        |
| `LANGSMITH_API_KEY` | **Required** to run the local dev server + Studio | [https://smith.langchain.com/settings](https://smith.langchain.com/settings) (free) |


> You only need the keys your chosen agent actually uses — but `LANGSMITH_API_KEY` is required for the local server in every case.

---

## Path A — Run an example agent

We'll use the **Deep Research** example since it ships with a ready-to-go dev server.

### A1. Go into the example folder

```bash
cd deepagents/examples/deep_research
```

### A2. Install its dependencies

```bash
uv sync
```

This reads the example's `pyproject.toml` and installs everything into a local virtual environment — it won't touch the rest of your system.

### A3. Add your API keys

Copy the example env file, then open `.env` and paste in your real keys:

```bash
cp .env.example .env
```

`.env` is just a list of `KEY=value` lines. Fill in the ones you have:

```
ANTHROPIC_API_KEY=sk-ant-...
TAVILY_API_KEY=tvly-...
LANGSMITH_API_KEY=lsv2_pt_...
```

> The `.env` file is read automatically when the server starts — you don't have to "load" it yourself. Never commit this file; it holds secrets.

### A4. Start the dev server

```bash
uv run langgraph dev
```

This launches the local server and opens **LangGraph Studio** in your browser. Type a prompt (e.g. *"Research the history of espresso machines"*) and watch the agent work.

To stop the server, press `Ctrl+C` in the terminal.

✅ **If you see the Studio interface open and the agent respond, your environment works.** Now you can build your own.

---

## Path B — Scaffold your own agent (the CLI way)

The `deepagents` CLI creates a fresh project for you and runs its dev server with one command each.

> **Want to write your own agent as Python code (your own graph) and view it in a browser UI?** See **[`SCAFFOLD-YOUR-OWN-AGENT.md`](./SCAFFOLD-YOUR-OWN-AGENT.md)** — it walks through hand-building an `agent.py` and opening it in LangGraph Studio on localhost.

### B1. Install the CLI

Install it as a standalone tool (available everywhere on your machine):

```bash
uv tool install deepagents-cli
```

Check it's there:

```bash
deepagents --help
```

### B2. Create a new project

```bash
deepagents init my-agent
```

This generates a `my-agent/` folder with a starter agent and a config file (`deepagents.toml`) where you set your agent's name and model.

### B3. Add your API keys

Inside the new folder, create a `.env` file with at least:

```
ANTHROPIC_API_KEY=sk-ant-...
LANGSMITH_API_KEY=lsv2_pt_...
```

### B4. Start your dev server

```bash
cd my-agent
deepagents dev
```

Under the hood this runs the same LangGraph dev server as Path A, but against *your* project. Studio opens in the browser, pointed at your agent.

Edit the agent code, save, and the server reloads automatically — no restart needed.

---

## Understanding the project pieces

When you look inside an agent project, these are the files that matter:


| File                    | What it does                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| `agent.py` (or similar) | Defines your agent — its model, tools, and instructions. **This is what you edit most.** |
| `langgraph.json`        | Tells the dev server where your agent lives (which file, which variable).                |
| `deepagents.toml`       | Project config for CLI-scaffolded agents (name, model, sandbox).                         |
| `.env`                  | Your secret API keys. Never commit this.                                                 |
| `pyproject.toml`        | The list of Python packages the project needs.                                           |


A minimal `langgraph.json` looks like this — it just points the server at the `agent` variable inside `agent.py`:

```json
{
  "dependencies": ["."],
  "graphs": { "research": "./agent.py:agent" },
  "env": ".env"
}
```

---

## Troubleshooting

`**command not found: uv**`
Restart your terminal after installing `uv`. If it still fails, your shell's `PATH` may need the install location added (the installer prints instructions).

`**command not found: langgraph**`
You're running it outside an installed project. In Path A, make sure you ran `uv sync` first and prefix the command with `uv run` (i.e. `uv run langgraph dev`). In Path B, use `deepagents dev` instead.

**Server starts but the agent errors immediately**
Almost always a missing or wrong API key. Double-check your `.env` has `LANGSMITH_API_KEY` plus the key for your model (e.g. `ANTHROPIC_API_KEY`), with no quotes or trailing spaces.

**Port already in use**
Another dev server is still running. Stop it with `Ctrl+C` in its terminal, or start this one on a different port:

```bash
uv run langgraph dev --port 2025
```

**"Blocking call" warning on startup**
Add the `--allow-blocking` flag while developing:

```bash
uv run langgraph dev --allow-blocking
```

---

## Quick reference

```bash
# One-time setup
curl -LsSf https://astral.sh/uv/install.sh | sh      # install uv
uv tool install deepagents-cli                        # install the CLI

# Path A — run an example
cd deepagents/examples/deep_research
uv sync
cp .env.example .env        # then edit .env with your keys
uv run langgraph dev

# Path B — your own agent
deepagents init my-agent
cd my-agent                 # add a .env with your keys
deepagents dev
```

---

*For deeper details, see the [Deep Agents docs](https://docs.langchain.com/oss/python/deepagents/overview) and the README in each `deepagents/examples/` folder.*