export default function Logo({ width = 140, variant = "light" }) {
  const wordColor = variant === "dark" ? "#FFFFFF" : "#1528A1";
  const taglineColor = variant === "dark" ? "#479BF7" : "#1528A1";
  return (
    <svg
      width={width}
      height={Math.round(width * 0.257)}
      viewBox="0 0 140 36"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0" y="26"
        fontFamily="Inter, -apple-system, sans-serif"
        fontSize="26"
        fontWeight="700"
        fill={wordColor}
        letterSpacing="-0.5"
      >
        WIVITEC
      </text>
      <text
        x="1" y="36"
        fontFamily="Inter, -apple-system, sans-serif"
        fontSize="7"
        fontWeight="500"
        fill={taglineColor}
        letterSpacing="3"
      >
        TECHNOLOGY. ELEVATED.
      </text>
    </svg>
  );
}
