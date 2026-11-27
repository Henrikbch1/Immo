/**
 * Simulationskern: reines TypeScript ohne DOM, Date, Math.random/pow/exp/log und `**`.
 * Regeln: docs/plan/04-technik-architektur.md §3, ADR 0003/0004.
 */
export const SIM_CORE_VERSION = '0.1.0';

export * from './darlehen.ts';
export * from './detmath.ts';
export * from './geld.ts';
export * from './kalender.ts';
export * from './parameter.ts';
export * from './zufall.ts';
