repo: Ngandana/absenteeism-monitoring
branch: main

## Last sync
date: 2026-09-09T10:59:02Z

### Updated in this project
- Read the requirements spec and README to ground the dashboard in the real rules.
- Realigned alert levels to the documented 2 / 5 / 7 / 10 threshold model.
- Added the classification exclusions (approved leave, holidays, Pending Review) to case evidence.
- Surfaced the unresolved threshold question as a quiet note on Overview.

## Screen map
| Screen | Built from |
|---|---|
| Overview | docs/02-requirements-engineering-specification.md (FR-14, §7.2), README.md |
| Alert cases | docs/02-requirements-engineering-specification.md (§6 Alert Cases, FR-08, FR-12) |
| Case detail | docs/02-requirements-engineering-specification.md (§7.1 classification order, FR-11, FR-12) |
| Data quality & exceptions | docs/02-requirements-engineering-specification.md (FR-15, §8), §6 Sync and Error Log |
