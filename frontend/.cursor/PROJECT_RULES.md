# PROJECT_RULES.md

# Frontend Development Guidelines

You are a Senior React + TypeScript Engineer.

Your goal is to build a production-ready frontend that is clean, maintainable, scalable, and follows modern React best practices.

---

## Tech Stack

Use only the following technologies:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

State Management:

- useState
- useEffect
- Custom Hooks when appropriate

Do NOT use:

- Redux
- Zustand
- MobX
- Recoil

Global state management is unnecessary for this project.

---

# React Best Practices

- Always use Functional Components.
- Keep components focused on a single responsibility.
- Prefer composition over large monolithic components.
- Avoid duplicated logic.
- Extract reusable logic into custom hooks.
- Keep JSX clean and readable.
- Prefer early returns over deeply nested conditions.

---

# State Management

This project uses **useState** as the primary state management solution.

Use local state for:

- Products
- Loading state
- Error state
- Pagination
- Filters
- Search

If logic becomes reusable, extract it into a custom hook.

Do not introduce global state unless absolutely necessary.

---

# TypeScript

Type safety is mandatory.

- Never use `any`.
- Prefer explicit interfaces or types.
- Type every API response.
- Type component props.
- Type hook return values.
- Enable strict TypeScript practices.

---

# Components

Components should be:

- Small
- Reusable
- Easy to test
- Easy to understand

A component should solve one problem only.

If a component becomes too large, split it into smaller components.

Avoid business logic inside JSX.

---

# Hooks

Use React Hooks correctly.

Prefer:

- useState
- useEffect

Create custom hooks whenever logic is reused.

Examples:

- useProducts()
- usePagination()
- useFilters()

---

# API

Use Axios for all HTTP requests.

- Keep API calls outside UI components.
- Separate data fetching from presentation.
- Handle loading and errors gracefully.
- Never expose raw server errors to users.

---

# Tailwind CSS

Tailwind CSS is the only styling solution.

Follow these principles:

- Mobile-first design
- Responsive layouts
- Consistent spacing
- Consistent typography
- Reusable utility patterns
- Clean and readable class ordering

Avoid:

- Inline styles
- Custom CSS unless absolutely necessary
- Repeated utility combinations (extract reusable UI components instead)

---

# UI / UX

The interface should look modern and polished.

Focus on:

- Excellent spacing
- Visual hierarchy
- Consistent colors
- Responsive layout
- Smooth interactions
- Hover states
- Focus states
- Disabled states
- Loading states
- Empty states
- Error states

The application should provide an excellent experience on both desktop and mobile devices.

---

# Accessibility

Always prefer semantic HTML.

Provide:

- Labels
- aria-label where appropriate
- Keyboard accessibility
- Visible focus states

---

# Performance

Avoid unnecessary re-renders.

Only use:

- useMemo
- useCallback

when there is a measurable benefit.

Do not optimize prematurely.

---

# Code Quality

Write code as if it will be maintained by another developer.

Prioritize:

- Readability
- Simplicity
- Maintainability
- Consistency

Avoid clever code.

Prefer clear code.

---

# Naming

Use meaningful names.

Components:

PascalCase

Hooks:

useSomething

Functions:

camelCase

Variables:

camelCase

Types:

PascalCase

---

# Final Goal

Deliver a frontend that demonstrates:

- Modern React practices
- Strong TypeScript usage
- Clean component design
- Responsive Tailwind CSS UI
- Excellent user experience
- Production-ready code quality