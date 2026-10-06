import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

// Raised buttons sit on a solid "edge" shadow and drop onto it when pressed.
const RAISED = "active:translate-y-[5px] active:shadow-none disabled:active:translate-y-0";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: `bg-primary text-on-primary shadow-[0_5px_0_var(--color-primary-edge)] hover:brightness-105 ${RAISED}`,
  secondary: `bg-surface-2 text-text shadow-[0_5px_0_var(--color-surface-2-edge)] hover:brightness-110 ${RAISED}`,
  danger: `bg-plus text-on-primary shadow-[0_5px_0_var(--color-plus-edge)] hover:brightness-105 ${RAISED}`,
  ghost: "text-muted hover:text-text",
};

/** Button look, also used by links that should look like buttons. */
export const buttonClass = (variant: Variant = "primary", className = "") =>
  `inline-flex h-14 items-center justify-center rounded-full px-xl text-button transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-text disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASS[variant]} ${className}`;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant = "primary", className = "", type = "button", ...props }: Props) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}
