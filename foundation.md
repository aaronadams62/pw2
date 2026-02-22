# Foundation — AI Issue-Fixing Workflow

This file defines the repeatable process the AI must follow when working through issues in this project. Follow these steps **exactly and in order**.

---

## 🔐 Credentials & Environment

- Before starting any work, check `.env` for all passwords, tokens, and secrets.
- Default admin login (if not overridden in `.env`): see `improvements.md` Section 7.
- Never hardcode credentials in code. Always use environment variables.

---

## 📋 Priority Order

When selecting the next issue to work on, always respect this priority order:

1. 🔴 **Critical** — Security / data loss risks (fix these first, always)
2. 🟠 **High** — Significant functional or security issues
3. 🟡 **Medium** — Functional bugs, UX issues
4. 🔵 **Low** — Cosmetic, lint warnings, minor cleanup
5. ⏳ **TODO** — Feature additions and improvements

> The source of truth for **what to work on next** is **GitHub Issues**.
> `improvements.md` is supporting context and documentation — not the queue.

---

## 🔁 The Issue-Fixing Loop

Repeat this loop for each issue. After every **3 issues resolved**, push changes to GitHub (see Step 8).

---

### Step 1 — Read & Triage

1. Open `improvements.md` and review all sections for context.
2. Go to **GitHub Issues** and identify the highest-priority open issue.
3. Note the issue number, title, and description.

---

### Step 2 — Mark as In Progress

1. In `improvements.md`, update the relevant item's status to **🔄 IN PROGRESS**.
2. Add a comment on the GitHub Issue: `"🔄 Now actively working on this issue."`

---

### Step 3 — Solve the Issue

1. Identify all affected files from `improvements.md` or the GitHub Issue description.
2. Make the necessary code changes.
3. Keep changes focused — only touch what is needed for this specific issue.

---

### Step 4 — Test with Playwright MCP

1. Run an appropriate Playwright test that **directly verifies the issue is resolved**.
2. Examples:
   - For a UI bug: navigate to the affected page and confirm the correct element/text renders.
   - For an API bug: trigger the relevant action and assert the correct response.
   - For a security fix: attempt the previously vulnerable action and confirm it is now blocked.
3. The test must **pass** before proceeding. If it fails, go to the **🔴 Human-in-the-Loop Protocol** below.

---

### Step 5 — Confirm Resolution

Before moving on, verify:

- [ ] The Playwright test passes
- [ ] No regressions introduced in related areas
- [ ] No new console errors or warnings introduced

---

### Step 6 — Update `improvements.md`

1. Move the item from its current status to **✅ COMPLETED**.
2. Add a brief note with what was changed and which files were modified.

---

### Step 7 — Update & Close the GitHub Issue

1. Add a **verbose closing comment** to the GitHub Issue that includes:
   - What the root cause was
   - What files were changed and why
   - What the Playwright test confirmed
   - Any follow-up items or notes for future reference
2. Close the issue.

---

### Step 8 — Push to GitHub (Every 3 Issues)

After every **3 issues** have been resolved and closed:

1. Create a new branch using this naming convention:
   ```
   fix/issue-{numbers}-{short-description}
   ```
   Example: `fix/issue-1-2-3-jwt-cors-credentials`

2. Stage and commit all changes with a clear commit message:
   ```
   fix: resolve issues #1, #2, #3 - [short summary]
   ```

3. Push the branch to GitHub.
4. Open a Pull Request with a summary of all 3 fixes.

---

## 🔴 Human-in-the-Loop Protocol

If the AI encounters the **same issue repeatedly and cannot resolve it after 3 attempts**, it must **stop and escalate** rather than continuing to loop.

### Trigger Condition
> The same test failure or error occurs **3 times in a row** despite different fix attempts.

### What to Do

1. **Stop all fix attempts** on this issue immediately.
2. **Do not skip to another issue** without notifying the human first.
3. **Document the blocker** in `improvements.md` under the affected item:
   ```
   ⛔ BLOCKED — 3 fix attempts failed. Human review required.
   Attempts made: [brief description of each attempt]
   Error: [exact error message or test failure]
   ```
4. **Add a comment on the GitHub Issue**:
   ```
   ⛔ Blocked after 3 attempts. Escalating to human review.

   Attempts made:
   1. [What was tried]
   2. [What was tried]
   3. [What was tried]

   Current error: [exact error]

   Action required: Please review and provide guidance before continuing.
   ```
5. **Notify the human** by surfacing this information and asking:
   - What the specific error is
   - What approaches were tried
   - What input is needed to unblock

6. **Wait for human input** before resuming work on this issue.
7. Once unblocked, restart the loop from **Step 3** for this issue.

---

## 🗂 File Reference

| File | Purpose |
|------|---------|
| `improvements.md` | Full context: security findings, TODOs, architecture notes |
| `.env` | All credentials and environment variables |
| `foundation.md` | This file — the workflow |
| `server/index.js` | Express API entry point |
| `src/` | React frontend components |
| `docker-compose.yml` | Local infrastructure |

---

## ✅ Loop Checklist (Quick Reference)

```
[ ] 1. Read improvements.md + check GitHub Issues for next priority item
[ ] 2. Mark issue as IN PROGRESS in improvements.md + GitHub
[ ] 3. Fix the issue in code
[ ] 4. Test with Playwright — confirm fix works
[ ] 5. Confirm no regressions
[ ] 6. Update improvements.md — mark COMPLETED
[ ] 7. Close GitHub Issue with verbose comment
[ ] Repeat — after 3 issues: branch, commit, push, open PR
```
