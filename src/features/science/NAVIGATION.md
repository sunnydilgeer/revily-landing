# Unified Science preview — 14 September 2026

## Design

Single course entry `/preview/science`: three ordered, numbered lesson cards with a short description and Start/Resume/Review. Minimal learning-path inspiration from Duolingo's course home, not copied branding, artwork or reward system: https://blog.duolingo.com/new-duolingo-home-screen-design/.

Cards open the same page using `?lesson=1`, `2` or `3`, so reload, browser history and sharing work naturally. Invalid or repeated lesson parameters show the course picker. All lessons stay unlocked in this preview. Existing microscopy/practical/revision routes redirect to the appropriate lesson. Existing record IDs/versions/storage keys unchanged.

All lessons link back to the picker in the header. Existing section menu remains, with a compact three-lesson switcher before the section list. Summary next-lesson actions use canonical links. Hub reads validated existing records only; completion counts do not claim mastery. No new progress system, account writes or deployment.

## QA results

Verified root picker → all three lessons → picker; direct menu switches, Lesson 3 query reload, browser back/forward, all three old aliases and invalid-query fallback. Lesson 1's open hint survived switches, then was closed again; no answers submitted or records reset/deleted. Catalogue/restore tests verify isolation, stored-record integrity and unchanged keys. Hub reads rather than rewrites records.

Resume was also checked in the browser: selecting B2-02 showed `0 / 34 activities completed` and Resume on the course card; opening it restored B2-02. Original B2-01 selection was restored afterwards without resetting its record.

Actual 320px viewport: picker and all three lesson switcher/section menus fit without horizontal overflow; current lesson correctly highlighted. Viewport override reset, temporary redirect-check tab closed, root picker kept as deliverable. Fresh redirect/invalid-query testing returned no console errors. Repository typecheck and all 48 grouped Science regression/navigation/typography checks passed. Existing lesson-content QA remains in each lesson folder; this change does not claim a new full accessibility or learner review.
