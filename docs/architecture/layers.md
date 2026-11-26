# Layers

```mermaid
graph LR
  L0["."]
  L1["catalog"]
  L2["scripts"]
  L3["src"]
  L4["src/components"]
  L5["src/lib"]
  L1 -->|1| L0
  L1 -->|6| L4
  L1 -->|1| L5
  L2 -->|3| L5
  L3 -->|4| L4
  L3 -->|6| L5
  L4 -->|4| L5
  L5 -->|1| L0
  L5 -->|7| L2
```

## src/components

| Forbidden import                      | Message                                                                                                                                                                                                                                                                                   |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `^(\.\./)+(?:src/)?(layouts\|pages)/` | `src/components/** cannot import from src/layouts/ or src/pages/. Pass layout or page data and markup via props or <slot /> from src/layouts/ or src/pages/, and put shared helpers or types in src/lib/ or another component under src/components/. Do not silence with oxlint-disable.` |

## src/lib

| Forbidden import                                  | Message                                                                                                                                                                                                                                                                      |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `^(\.\./)+(?:src/)?(components\|layouts\|pages)/` | `src/lib/** cannot import from src/components/, src/layouts/, or src/pages/. Move shared logic or types into src/lib/ (library tests may import scripts/), or move UI-dependent code into src/components/, src/layouts/, or src/pages/. Do not silence with oxlint-disable.` |
