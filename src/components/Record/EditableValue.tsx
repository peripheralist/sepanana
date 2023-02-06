import { CSSProperties, useMemo } from "react";
import { colorForType } from "utils/colors";

export default function EditableValue({
  value,
  onChange,
  isEditing,
  style,
}: {
  value: string | number | object | null | undefined;
  onChange: (x: typeof value) => void;
  isEditing: boolean;
  style?: CSSProperties;
}) {
  const formattedValue = useMemo((): string => {
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    if (typeof value === "object") return JSON.stringify(value);
    return value.toString();
  }, [value]);

  const _style: CSSProperties = {
    border: "none",
    padding: 0,
    width: 400,
    color: colorForType(value),
    ...style,
  };

  const placeholder = formattedValue.length ? formattedValue : typeof value;

  if (isEditing) {
    return typeof value === "number" ? (
      <input
        type="number"
        style={style}
        placeholder={placeholder}
        value={
          typeof value === "object" ? JSON.stringify(value) : value?.toString()
        }
        disabled={!isEditing}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <textarea
        rows={1}
        style={style}
        placeholder={placeholder}
        value={
          typeof value === "object" ? JSON.stringify(value) : value?.toString()
        }
        disabled={!isEditing}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <div
      style={{
        ...style,
        color: colorForType(value),
        whiteSpace: "pre-wrap",
        opacity: formattedValue.length ? 1 : 0.4,
        userSelect: "all",
      }}
    >
      {formattedValue || '""'}
    </div>
  );
}
