import { ButtonHTMLAttributes, CSSProperties, DetailedHTMLProps } from "react";
import { COLORS } from "styles/colors";

export default function Button({
  children,
  size,
  kind,
  disabled,
  ...buttonProps
}: {
  size?: "normal" | "small";
  kind?: "primary" | "secondary" | "danger" | "secondaryDanger";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  const _kind = kind ?? "primary";
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

  const kindStyles: Record<typeof _kind, CSSProperties> = {
    primary: {
      background: "white",
      color: COLORS.dark,
    },
    secondary: {
      color: "white",
      border: "1px solid white",
    },
    danger: {
      background: "firebrick",
      color: "white",
    },
    secondaryDanger: {
      border: "1px solid firebrick",
      color: "white",
    },
  };

  return (
    <button
      {...buttonProps}
      style={{
        background: "transparent",
        ...style,
        ...sizeStyles[_size],
        ...kindStyles[_kind],
        ...buttonProps.style,
      }}
    >
      {children}
    </button>
  );
}
