import * as React from 'react';
import RangerSvg from '../../assets/Ranger-Pin-White.svg';

interface LogoProps {
    width: number;
}

const Logo = (props: LogoProps) => <RangerSvg width={props.width} />;

export default Logo;
