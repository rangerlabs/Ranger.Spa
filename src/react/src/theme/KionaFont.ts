import { KionaRegular } from '../../assets/fonts/Kiona-Regular.ttf';
import { KionaItallic } from '../../assets/fonts/Kiona-Itallic.ttf';
import { KionaLight } from '../../assets/fonts/Kiona-Light.ttf';
import { KionaLightItallic } from '../../assets/fonts/Kiona-LightItallic.ttf';
import { KionaBold } from '../../assets/fonts/Kiona-Bold.ttf';
import { KionaBoldItallic } from '../../assets/fonts/Kiona-BoldItallic.ttf';
import { KionaSemiBold } from '../../assets/fonts/Kiona-SemiBold.ttf';
import { KionaSemiBoldItallic } from '../../assets/fonts/Kiona-SemiBoldItallic.ttf';

const KionaRegularFont = new FontFace('Kiona-Regular, Kiona', KionaRegular, {
    style: 'normal',
});
const KionaItallicFont = new FontFace('Kiona-Itallic, Kiona', `url(${KionaItallic})`, {});
const KionaLightFont = new FontFace('Kiona-Light, Kiona', `url(${KionaLight})`, {});
const KionaLightItallicFont = new FontFace('Kiona-LightItallic, Kiona', KionaLightItallic, {});
const KionaBoldFont = new FontFace('Kiona-Bold, Kiona', `url(${KionaBold})`, {});
const KionaBoldItallicFont = new FontFace('Kiona-BoldItallic, Kiona', `url(${KionaBoldItallic})`, {});
const KionaSemiBoldFont = new FontFace('Kiona-SemiBold, Kiona', `url(${KionaSemiBold})`, {});
const KionaSemiBoldItallicFont = new FontFace('Kiona-SemiBold, Kiona', `url(${KionaSemiBoldItallic})`, {});

export default KionaRegularFont;
