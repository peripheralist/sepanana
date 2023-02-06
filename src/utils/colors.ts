import { CSSProperties } from "react";

export const colorForType = (value: unknown): CSSProperties["color"] => {
  switch (typeof value) {
    case "number":
      return "mediumseagreen";
    case "boolean":
      return "orchid";
    case "object":
      return "dodgerblue";
    default:
      return "white";
  }
};
