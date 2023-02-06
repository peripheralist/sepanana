import { ButtonHTMLAttributes, CSSProperties, DetailedHTMLProps } from "react";
import { COLORS } from "styles/colors";

export default function Button({
  children,
  size,
  kind,
  condition,
  disabled,
  ...buttonProps
}: {
  size?: "normal" | "small";
  kind?: "primary" | "secondary";
  condition?: "normal" | "danger";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  const _kind = kind ?? "primary";
  const _condition = condition ?? "normal";
  const _size = size ?? "normal";

  const style: CSSProperties = {
    outline: "none",
    border: "none",
    cursor: disabled ? "default" : "crosshair",
    fontWeight: 500,
  };

  const sizeStyles: Record<typeof _size, CSSProperties> = {
    normal: {
      padding: "6px 12px",
      fontSize: ".84rem",
    },
    small: {
      padding: "4px 6px",
      fontSize: ".72rem",
    },
  };

  const conditionStyles: Record<typeof _condition, CSSProperties> = {
    normal: {},
    danger: {
      borderColor: "firebrick",
      background: "transparent",
      color: "white",
    },
  };

  const kindStyles: Record<typeof _kind, CSSProperties> = {
    primary: {
      background: "white",
      color: COLORS.dark,
      borderWidth: 0,
    },
    secondary: {
      background: "transparent",
      color: "white",
      borderWidth: 1,
      borderStyle: "solid",
    },
  };

  return (
    <button
      {...buttonProps}
      style={{
        ...style,
        ...sizeStyles[_size],
        ...kindStyles[_kind],
        ...conditionStyles[_condition],
        ...buttonProps.style,
      }}
    >
      {children}
    </button>
  );
}
