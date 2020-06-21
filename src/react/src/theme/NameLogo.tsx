import * as React from 'react';
import RangerSvg from '../../assets/Ranger-Pin-Green-wName.svg';

interface NameLogoProps {
    width: number;
}

const NameLogo = (props: NameLogoProps) => <RangerSvg width={props.width} />;

export default NameLogo;
