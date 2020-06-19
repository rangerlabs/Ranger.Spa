import * as React from 'react';
import RangerSvg from '../../assets/Ranger-Pin-Green-wName.svg';

interface LogoProps {
    width: number;
}

const Logo = (props: LogoProps) => <RangerSvg width={props.width} />;

export default Logo;
