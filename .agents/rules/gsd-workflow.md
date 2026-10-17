# Rule: GSD (Get Stuff Done) Execution Protocol

This rule defines how AI agents and developers execute tasks within Udyam Manch using the **GSD (Get Stuff Done)** discipline.

---

## 1. Core Operating Cycle

Every development interaction MUST follow this 4-step sequence:

```text
[1. Read State] ---> [2. Verify Requirements] ---> [3. Implement & Test] ---> [4. Update State]
```

### Step 1: Read State
- Inspect [.planning/STATE.md](file:///c:/Users/lenovo/Downloads/UdyamManch/.planning/STATE.md) to identify the currently active phase and pending blockers.
- Check [.planning/ROADMAP.md](file:///c:/Users/lenovo/Downloads/UdyamManch/.planning/ROADMAP.md) and the corresponding phase plan in `.planning/phases/` to understand current deliverables.

### Step 2: Verify Requirements
- Look up the specific requirement IDs in [.planning/REQUIREMENTS.md](file:///c:/Users/lenovo/Downloads/UdyamManch/.planning/REQUIREMENTS.md).
- Ensure your implementation plan does not violate any constraint in [.agents/rules/constraints.md](file:///c:/Users/lenovo/Downloads/UdyamManch/.agents/rules/constraints.md).

### Step 3: Implement & Test
- Implement clean, production-grade code adhering to the project's styling and architectural rules.
- Test against the acceptance criteria outlined in the phase plan (including mobile responsiveness, social previews, and WCAG AA accessibility).

### Step 4: Update State
- Record completed milestones, newly made technical decisions, and any newly identified risks in [.planning/STATE.md](file:///c:/Users/lenovo/Downloads/UdyamManch/.planning/STATE.md).
- Mark off completed requirements in the checklist.

---

## 2. Phase Boundary Discipline

- **Never jump ahead across phases**: Phase 2 (Reading Templates) cannot be deemed complete until Phase 1 (Foundation/Data Model) is operational. Phase 4 (Home & My Board) depends on Phase 3 and Phase 2.
- **Strict Exit Criteria**: A phase cannot be marked "Complete" in `STATE.md` unless all items in its Exit Criteria checklist are verified and passing.

---

## 3. Decision Recording Rule
Whenever an architectural choice or trade-off is made (e.g., choice between Sanity vs Payload CMS, image storage provider, or state management library), append an entry to the **Key Decisions Log** in [.planning/STATE.md](file:///c:/Users/lenovo/Downloads/UdyamManch/.planning/STATE.md) formatted as:

`| DEC-*** | YYYY-MM-DD | Subject | Decision & Rationale |`
