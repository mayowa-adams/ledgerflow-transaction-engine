# Architecture decisions

## ADR-001: Local persistence first
Use SQLite and a standard-library runtime to make the core correctness and performance tests reproducible without cloud accounts. This trades distributed scalability for simpler local evaluation.

## ADR-002: Synthetic data only
Use generated or sample values to avoid licensing and privacy issues. These results are not evidence of production customer workloads.

## ADR-003: Measure before scaling
Keep the benchmark scope explicit; introduce external infrastructure only after profiling and testing the operational trade-offs. See README for the project-specific design and limitations.
