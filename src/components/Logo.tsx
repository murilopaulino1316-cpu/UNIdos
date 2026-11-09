import Svg, { Path, Rect, Circle, G, Text as SvgText, TSpan } from 'react-native-svg';
const NAVY = '#0b2a5b';
const BLUE = '#1f74d0';
const AMBER = '#f7b52c';

const MarkShapes = () => (
  <>
    <Path
      d="M7 62 C5 92 28 110 55 110 C82 110 101 92 101 62 C96 80 80 93 56 94 C32 95 14 84 7 62Z"
      fill={NAVY}
    />

    <Path
      d="M26.5 72 V42.5 L54 29.5 L81.5 42.5 V72"
      fill="none"
      stroke={NAVY}
      strokeWidth="13"
      strokeLinejoin="round"
    />

    <G>
      <Rect x="45" y="50" width="8.5" height="8.5" rx="1.8" fill={AMBER} />
      <Rect x="55.5" y="50" width="8.5" height="8.5" rx="1.8" fill={AMBER} />
      <Rect x="45" y="60.5" width="8.5" height="8.5" rx="1.8" fill={AMBER} />
      <Rect x="55.5" y="60.5" width="8.5" height="8.5" rx="1.8" fill={AMBER} />
    </G>

    <Path
      d="M11 57 C15 73 29 86 49 88.5 C61 90 72 87 81 82.5 C68 82.5 56 80 45 75.5 C31 70 19 64 11 57Z"
      fill={BLUE}
    />
    <Path d="M58 83 C73 75 88 68 100 59 C97 72 87 82.5 74 87 C67 87.5 62 85.5 58 83Z" fill={BLUE} />
    <Path d="M9 72 C22 92 50 99 78 92" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M45 75.5 C52 79 60 81.5 70 82" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />

    <Path
      d="M1.5 27.6 L52.6 1.4 Q55 0.2 57.4 1.4 L107 26.4 Q109.5 28 107 29.6 L104 31.2 L55 17 L4.2 32.2 L2 31 Q-0.5 29.3 1.5 27.6Z"
      fill={NAVY}
    />
    <Path d="M3.6 29 V39" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" />
    <Circle cx="3.6" cy="41" r="2.5" fill={NAVY} />
    <Path d="M1.6 43.2 H5.6 L7.6 57 Q3.6 59.6 -0.4 57Z" fill={NAVY} />

    <G>
      <Path d="M97 66 C101 58 106 51 113 46" fill="none" stroke={AMBER} strokeWidth="3" strokeLinecap="round" />
      <Path d="M110 48 C110 40 116 35 125 35 C124 43 118 49 110 48Z" fill={AMBER} />
      <Path d="M99.5 59 C92.5 57 89.5 50 92.5 44 C98.5 47 101.5 53 99.5 59Z" fill={AMBER} />
    </G>
  </>
);

interface LogoProps {
  height?: number;
}

const Logo = ({ height = 44 }: LogoProps) => (
  <Svg viewBox="0 0 336 112" height={height} width={height * 3} accessibilityLabel="UNIdus">
    <G transform="translate(2 0)">
      <MarkShapes />
    </G>
    <SvgText
      x="114"
      y="98"
      fill={NAVY}
      fontSize="56"
      letterSpacing="-0.5"
    >
      <TSpan fontWeight="800">UNI</TSpan>
      <TSpan fontWeight="300" dx="3">dus</TSpan>
    </SvgText>
  </Svg>
);

export default Logo;
