export type Component = (props?: Record<string, unknown>) => Mapping;
export type InitMapping = Record<string, HTMLElement | (HTMLElement | InitComponentMapping)[] | string> | HTMLElement | Mapping;
export type InitComponentMapping = Record<string, Mapping | string> | HTMLElement | Mapping;
export type MergedMapping = InitMapping | InitComponentMapping;
export type Mapping = MergedMapping[];
