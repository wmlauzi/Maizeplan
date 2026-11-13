import horizontalColor from "../assets/logo/horizontal-color-transparent.svg";
import horizontalReversed from "../assets/logo/horizontal-reversed-on-forest.svg";
import iconColor from "../assets/logo/icon-color-transparent.svg";
import stackedColor from "../assets/logo/stacked-color-transparent.svg";
import stackedReversed from "../assets/logo/stacked-reversed-on-forest.svg";

const logoVariants = {
  sidebar: { src: horizontalReversed, className: "brand-logo--sidebar" },
  "sidebar-collapsed": {
    src: iconColor,
    className: "brand-logo--sidebar-collapsed",
  },
  header: { src: horizontalColor, className: "brand-logo--header" },
  "stacked-dark": { src: stackedReversed, className: "brand-logo--stacked-dark" },
  "stacked-light": { src: stackedColor, className: "brand-logo--stacked-light" },
  footer: { src: horizontalColor, className: "brand-logo--footer" },
};

export default function BrandLogo({ variant }) {
  const logo = logoVariants[variant];

  return (
    <span className={`brand-logo ${logo.className}`}>
      <img src={logo.src} alt="iNest Agro" />
    </span>
  );
}
