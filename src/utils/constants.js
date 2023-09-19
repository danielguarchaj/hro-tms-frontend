export const fetchingResourceStatuses = "loading" | "failed" | "succeeded";
export const HTTP_STATUS_CODE_CONTENT_TOO_LARGE = 413;
export const HTTP_STATUS_CODE_NOT_FOUND = 404;
export const MAX_PATIENTS_SEARCH_RESULTS_ALLOWED = 1000;
export const TURN_STATUS = {
  onQueue: "EN COLA",
  attended: "ATENDIDO",
  absent: "AUSENTE",
  cancelled: "ANULADO",
};
export const TURN_LABEL_MAP = {
  0: "EN COLA",
  1: "ATENDIDO",
  2: "AUSENTE",
  3: "ANULADO",
};
export const BADGE_TURN_COLORS_MAP = {
  ATENDIDO: "success",
  AUSENTE: "warning",
  ANULADO: "error",
};
export const MAX_TURNS_TO_SHOW_PUBLIC = 10;
