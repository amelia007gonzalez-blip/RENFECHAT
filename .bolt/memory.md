# Project memory

## Product intent & audience

- Travel-oriented web app (“viajeros”) with Spanish-language UI.
- Hosted on Vercel; source on GitHub; Bolt performs commit/push.
- Audience values fast, frictionless access; registration must be automatic and direct.

## Brand personality & voice

- Spanish-first interface; tone is friendly and accessible.
- Error messaging should be concrete and actionable, never generic.

## Visual design & UX direction

- Auth screen supports multiple modes: login, register, recovery, new-password.
- Password fields use a visibility-toggle button (eye icon) via `PasswordInput` component.
- Form fields carry browser autocomplete attributes (`username`, `new-password`, `current-password`) to trigger mobile password-manager save prompts.
- Forgot-password flow links to Supabase email recovery; landing screen for entering a new password.
- Prefer clear, specific error display over opaque “try again” messages.

## Decisions, constraints & rationale

- Auth backed by Supabase Auth; alias is sent as `user_metadata`.
- Registration failure was not caused by missing alias metadata; root cause still unconfirmed — surface exact error to diagnose.
- Supabase Redirect URLs must be configured manually in the dashboard (Authentication → URL Configuration) for recovery links to work.
- Key files: `src/lib/auth.js`, `src/components/AuthScreen.jsx`, `src/App.jsx`, `src/components/PasswordInput.jsx`.

## Open questions & assumptions

- Exact production registration error unknown; awaiting real Vercel error message.
- Mobile credential-save behavior assumed to work but not guaranteed across all browsers.
- Supabase redirect URL configuration status unverified.