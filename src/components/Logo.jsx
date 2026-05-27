export default function Logo({ width = 140 }) {
  return (
    <svg
      width={width}
      height={Math.round(width * 0.285)}
      viewBox="0 0 140 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0" y="26"
        fontFamily="Inter, -apple-system, sans-serif"
        fontSize="26"
        fontWeight="700"
        fill="#1528A1"
        letterSpacing="-0.5"
      >
        WIVITEC
      </text>
      <text
        x="1" y="38"
        fontFamily="Inter, -apple-system, sans-serif"
        fontSize="7.5"
        fontWeight="400"
        fill="#1528A1"
        letterSpacing="2.5"
      >
        TECHNOLOGY. ELEVATED.
      </text>
    </svg>
  );
}