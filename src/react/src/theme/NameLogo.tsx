import * as React from 'react';
import RangerImg from '../../assets/Ranger-Pin-Green-wName@3x.png';

interface NameLogoProps {
    width: number;
}

const NameLogo = (props: NameLogoProps) => <img src={RangerImg} width={props.width} />;

export default NameLogo;
