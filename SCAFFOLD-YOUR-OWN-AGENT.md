# Scaffold Your Own Agent — with a Browser UI on localhost

Build **your own** Deep Agent (your own Python code, your own graph) and talk to it in a browser — no terminal chat, no separate frontend project to install.

By the end you'll have a folder with four small files. You run two commands and **LangGraph Studio** opens at `http://localhost:2024`, where you type a prompt, watch your agent think step by step, and see every tool call and file it creates.

> **Why this approach?** You write the agent as plain Python (`agent.py`), so you have full control to design its graph, tools, and sub-agents — exactly what you want for the hackathon. LangGraph Studio is the UI that comes built in with the dev server, so there's nothing extra to install (no Node, no yarn, no second repo).

---

## Prerequisites

You need two things. If you haven't set these up yet, see **§1 of [`DEV-ENVIRONMENT-GUIDE.md`](./DEV-ENVIRONMENT-GUIDE.md)** for full install steps.

1. **`uv`** installed (`uv --version` should print a version).
2. **Two API keys:**
   - `ANTHROPIC_API_KEY` — runs the model (https://console.anthropic.com)
   - `LANGSMITH_API_KEY` — **required** to run the local dev server + Studio (https://smith.langchain.com/settings, free)

---

## Step 1 — Create the project folder

```bash
mkdir my-agent
cd my-agent
```

Everything below goes inside `my-agent/`. You'll create exactly four files.

---

## Step 2 — Create the four files

### `agent.py` — your agent

This is the file you'll spend most of your time in. It defines your agent and exports it as a variable called `agent`. The example below includes one tiny custom tool so you can see the pattern.

```python
"""My Deep Agent — entrypoint that LangGraph Studio loads."""

from deepagents import create_deep_agent


# --- A custom tool is just a plain Python function with a docstring. ---
# The docstring tells the model what the tool does and when to use it.
def get_word_count(text: str) -> int:
    """Count the number of words in a piece of text.

    Args:
        text: The text to count words in.

    Returns:
        The number of words.
    """
    return len(text.split())


# --- The agent itself. The variable MUST be named `agent` (see langgraph.json). ---
agent = create_deep_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[get_word_count],
    system_prompt=(
        "You are a helpful assistant. "
        "Use your tools when they're relevant, and explain your reasoning."
    ),
)
```

### `langgraph.json` — tells Studio where your agent is

```json
{
  "dependencies": ["."],
  "graphs": { "agent": "./agent.py:agent" },
  "env": ".env"
}
```

`"./agent.py:agent"` means "the variable named `agent`, inside the file `agent.py`." The name on the left (`"agent"`) is what shows up in Studio's graph dropdown — rename it if you like.

### `pyproject.toml` — the packages your project needs

```toml
[project]
name = "my-agent"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "deepagents>=0.2.6",
    "langchain-anthropic>=1.0.3",
    "langgraph-cli[inmem]>=0.1.55",
    "python-dotenv>=1.2.2",
]

[build-system]
requires = ["setuptools>=73.0.0", "wheel"]
build-backend = "setuptools.build_meta"

[tool.setuptools]
py-modules = ["agent"]
```

> `langgraph-cli[inmem]` is the package that gives you the `langgraph dev` command. `py-modules = ["agent"]` lets the dev server import your flat `agent.py` file as the local `.` dependency.

### `.env` — your secret keys

```
ANTHROPIC_API_KEY=sk-ant-...
LANGSMITH_API_KEY=lsv2_pt_...
```

Paste in your real keys (no quotes, no trailing spaces). This file is read automatically when the server starts. **Never commit it** — it holds secrets.

Your folder should now look like:

```
my-agent/
├── agent.py
├── langgraph.json
├── pyproject.toml
└── .env
```

---

## Step 3 — Install dependencies

```bash
uv sync
```

This creates a local virtual environment and installs everything from `pyproject.toml`. It won't touch the rest of your system.

---

## Step 4 — Start the dev server (and the UI)

```bash
uv run langgraph dev
```

This starts the local server and **opens LangGraph Studio in your browser**, pointed at `http://localhost:2024`. If the browser doesn't open on its own, look at the terminal — it prints the Studio URL; copy it into your browser.

To stop the server, press `Ctrl+C`.

---

## Step 5 — Interact with your agent

In the Studio browser tab:

1. Pick your graph (**`agent`**) from the dropdown, if it isn't already selected.
2. Find the **`messages`** input, type a prompt (e.g. *"How many words are in this sentence?"*), and submit.
3. Watch the run unfold — you'll see the agent's reasoning, any tool calls (like `get_word_count`), sub-agents, and files it reads or writes.

That's your agent, running locally, driven entirely from a browser UI. 🎉

Edit `agent.py`, save, and the server reloads automatically — just refresh Studio.

---

## Customize your graph

Everything happens in `agent.py`. A few common moves:

**Change the model** — swap the string:
```python
agent = create_deep_agent(model="openai:gpt-5.5", ...)   # needs OPENAI_API_KEY in .env
```

**Add a tool** — write a function and drop it in the `tools` list:
```python
def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b

agent = create_deep_agent(model="anthropic:claude-sonnet-4-6", tools=[get_word_count, add], ...)
```

**Add a sub-agent** — delegate part of the work to an agent with its own focus. A sub-agent is just a dict:
```python
research_sub_agent = {
    "name": "research-agent",
    "description": "Delegate one research topic at a time to this researcher.",
    "system_prompt": "You research a single topic thoroughly and report back.",
    "tools": [get_word_count],
}

agent = create_deep_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[get_word_count],
    system_prompt="You are an orchestrator. Delegate research to your sub-agent.",
    subagents=[research_sub_agent],
)
```

**Edit the behavior** — change the `system_prompt` text. This is the biggest lever on how your agent acts.

> For a fuller, real-world reference, read `deepagents/examples/deep_research/agent.py` — it shows custom tools, sub-agents, and detailed instructions wired together.

---

## Troubleshooting

**`langgraph: command not found`**
Run it with the `uv run` prefix (`uv run langgraph dev`) so it uses your project's environment. If it still fails, confirm `langgraph-cli[inmem]` is in `pyproject.toml` and re-run `uv sync`.

**Agent errors the moment you send a message**
Almost always a missing or wrong key. Check `.env` has both `LANGSMITH_API_KEY` and the key for your model (e.g. `ANTHROPIC_API_KEY`), with no quotes or trailing spaces.

**`Port 2024 is already in use`**
Another dev server is still running. Stop it with `Ctrl+C`, or use a different port:
```bash
uv run langgraph dev --port 2025
```

**A "blocking call" warning on startup**
Add the dev flag:
```bash
uv run langgraph dev --allow-blocking
```

---

## Quick reference

```bash
mkdir my-agent && cd my-agent
# create agent.py, langgraph.json, pyproject.toml, .env (contents above)
uv sync
uv run langgraph dev        # opens LangGraph Studio at http://localhost:2024
```

---

*Next step: once you're happy with your agent locally, `deepagents deploy` can ship it to LangGraph Platform. See [`DEV-ENVIRONMENT-GUIDE.md`](./DEV-ENVIRONMENT-GUIDE.md) and the [Deep Agents docs](https://docs.langchain.com/oss/python/deepagents/overview).*
