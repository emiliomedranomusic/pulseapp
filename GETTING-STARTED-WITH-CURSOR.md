# Getting Started with Cursor — A Beginner's Checklist

> **New here?** Cursor is a code editor with an AI assistant baked in. It's built on top of
> VS Code, so if you've ever used VS Code it'll feel familiar — except now there's an AI that
> can autocomplete your code, edit files for you, and answer questions about your project.
> Work through the checklist below top to bottom. Each `[ ]` is one small thing to do.

---

## 1. Before You Start

- [ ] Have a computer (Mac, Windows, or Linux) and an internet connection.
- [ ] Set aside ~10 minutes for setup.
- [ ] (Optional) If you already use VS Code, know that Cursor can import your themes,
      extensions, and keyboard shortcuts — you won't lose your setup.

> **Why VS Code matters.** Cursor is a *fork* of VS Code (a copy that adds AI features). That
> means almost every VS Code extension, shortcut, and setting works in Cursor too.

---

## 2. Install Cursor

- [ ] Go to **[cursor.com](https://cursor.com)** and click **Download**.
- [ ] Install it like any other app:
  - **Mac** — open the `.dmg` and drag Cursor into your Applications folder.
  - **Windows** — run the `.exe` installer and follow the prompts.
  - **Linux** — make the downloaded `.AppImage` executable, then run it.
- [ ] Open Cursor for the first time.
- [ ] When asked, choose whether to **import your VS Code settings and extensions**. If you're
      brand new, just skip this — you can do it later.

---

## 3. Sign In & Pick a Plan

- [ ] Click **Sign In** (top-right or on the welcome screen) and create a free account.
- [ ] Pick a plan:
  - **Free (Hobby)** — enough to learn the ropes. You get a limited number of AI requests.
  - **Pro** — more (and faster) AI requests, access to the strongest models. Upgrade later
    if you hit the limits.
- [ ] Confirm you're signed in — your account shows up in the bottom-left or in Settings.

> **Just exploring?** Start on the free plan. You don't need to pay anything to learn how
> Cursor works.

---

## 4. Open Your First Project

- [ ] Click **File → Open Folder** (or **Open** on the welcome screen) and pick a project
      folder — any folder with code, or even an empty one.
- [ ] If Cursor asks **"Do you trust the authors of this folder?"**, click **Yes** for folders
      you created yourself.
- [ ] Look at the **left sidebar** — that's your file tree. Click a file to open it.

> **What's a "workspace"?** It's just the folder you opened. Cursor's AI uses everything in
> that folder as context, so open the actual project you want help with.

---

## 5. Learn the Three AI Surfaces

This is the most important section — these are the three ways you'll talk to the AI. Try each
one once.

- [ ] **Tab (autocomplete)** — start typing code. Cursor suggests the rest in gray text.
      Press **`Tab`** to accept it. This is your everyday, in-the-flow helper.
- [ ] **Inline edit — `Cmd/Ctrl+K`** — select some code (or click an empty line), press
      `Cmd/Ctrl+K`, and type what you want in plain English (e.g. *"add error handling"*).
      The AI rewrites that spot in place. You then **accept** or **reject** the change.
- [ ] **Chat / Agent — `Cmd/Ctrl+L`** — opens a chat panel on the side. Ask questions
      (*"what does this file do?"*) or give tasks (*"add a login button"*). In Agent mode it
      can read and edit multiple files across your project for you.

> **The mental model.** Tab = finish my line. `Cmd/Ctrl+K` = change this selection.
> `Cmd/Ctrl+L` = have a conversation that can touch many files. When in doubt, use Chat.

---

## 6. Give the AI Good Context with `@`

The AI gives better answers when it knows what you're pointing at. In Chat or inline edit,
type **`@`** to attach context.

- [ ] In a chat, type `@` and try attaching:
  - `@` a **file** — point at one specific file.
  - `@` a **folder** — point at a whole directory.
  - `@Docs` — reference official library/framework documentation.
  - `@Web` — let the AI search the internet for up-to-date info.
- [ ] Let Cursor **index your codebase** when it offers (it builds a searchable map of your
      project so the AI can find relevant code on its own).

> **Garbage in, garbage out.** Vague prompts with no context get vague answers. Attaching the
> right file or folder with `@` is the single biggest quality boost for beginners.

---

## 7. Choose a Model

- [ ] Find the **model picker** (a dropdown in the Chat box).
- [ ] For quick, simple stuff, a fast model is fine. For tricky bugs or bigger tasks, pick a
      **stronger / more capable model**.
- [ ] If an answer feels weak, switch to a stronger model and ask again.

> **Plain version.** "Smarter" models think harder and cost more per request. Use a fast one
> for easy edits, a strong one when you're stuck.

---

## 8. Set Up a Few Things on Day One

- [ ] Open settings with **`Cmd/Ctrl+,`** and set a **theme** and **font size** you like.
- [ ] Turn on **Auto Save** (File → Auto Save) so you stop losing work.
- [ ] Turn on **Format on Save** so your code stays tidy automatically.
- [ ] Find Cursor's own AI settings under **Cursor → Settings** (or the gear icon) — this is
      where models, rules, and privacy live.

---

## 9. Set Up Project Rules

Rules are short instructions the AI follows automatically for your project — like coding
conventions or "always write tests."

- [ ] In your project root, create a rules file. Modern Cursor uses a `.cursor/rules/` folder;
      older setups use a single `.cursorrules` file. Either works.
- [ ] Add a few plain-English rules, for example:

```text
- Use TypeScript, not plain JavaScript.
- Keep functions small and add comments for tricky logic.
- Always handle errors instead of ignoring them.
```

- [ ] Save it. Now the AI will keep these in mind on every request in this project.

> **Why bother?** Without rules you repeat yourself ("use tabs, not spaces…") in every prompt.
> With rules, you say it once and Cursor remembers.

---

## 10. Protect Your Secrets & Review Every Edit

This one matters — read it carefully.

- [ ] **Never commit API keys or passwords.** Keep them in a `.env` file and add `.env` to
      your **`.gitignore`** so it's never pushed to GitHub.
- [ ] If a key has *already* been shared or committed, **rotate it** (generate a new one and
      revoke the old) — assume the old one is compromised.
- [ ] Consider turning on **Privacy Mode** in Cursor's settings if you don't want your code
      stored.
- [ ] **Always read the AI's changes before accepting them.** Cursor shows a diff (green =
      added, red = removed). Don't blindly click Accept.

> **Real-world reminder.** Secrets leak most often by being committed to git by accident.
> One line in `.gitignore` (`/.env`) prevents it.

---

## 11. Build Good Beginner Habits

- [ ] Keep prompts **small and specific** — one clear task beats one giant vague request.
- [ ] **Read the diff** before accepting any edit (see above).
- [ ] **Commit to git often** — small commits make it easy to undo if the AI goes sideways.
- [ ] Remember **`Cmd/Ctrl+Z`** (undo) is always there if a change goes wrong.
- [ ] If the AI misunderstands, **add context with `@`** and try again rather than fighting it.

---

## 12. Keyboard Shortcuts Quick Reference

| Action | Mac | Windows / Linux |
|---|---|---|
| Accept autocomplete | `Tab` | `Tab` |
| Inline edit (change selection) | `Cmd+K` | `Ctrl+K` |
| Open Chat / Agent | `Cmd+L` | `Ctrl+L` |
| Command palette (search all commands) | `Cmd+Shift+P` | `Ctrl+Shift+P` |
| Open settings | `Cmd+,` | `Ctrl+,` |
| Quick-open a file | `Cmd+P` | `Ctrl+P` |
| Undo | `Cmd+Z` | `Ctrl+Z` |

> **Stuck on a shortcut?** Press the command palette (`Cmd/Ctrl+Shift+P`) and type what you
> want — it shows the matching command *and* its shortcut.

---

## 13. Troubleshooting

| Problem | Try this |
|---|---|
| AI doesn't respond in Chat | Check you're signed in and online; you may have hit your free-plan request limit. |
| No gray autocomplete appears | Make sure Cursor Tab is enabled in settings; reopen the file. |
| Sign-in keeps looping | Sign out, restart Cursor, and sign in again through your browser. |
| My VS Code extensions are missing | Re-run the import (Settings → import from VS Code), or install them from the Extensions panel. |
| AI ignores my conventions | Add them to your rules file (Section 9). |

---

## 14. Next Steps

- [ ] Try building something tiny end-to-end using Chat — a script, a small page, anything.
- [ ] Read the official docs at **[cursor.com/docs](https://cursor.com/docs)** when you want
      to go deeper.
- [ ] Revisit Section 9 (Rules) once you know your own preferences — it pays off fast.

That's it — you're set up and ready to build with Cursor. 🎉
