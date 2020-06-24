import { KionaRegular } from '../../assets/fonts/Kiona-Regular.ttf';
import { KionaItallic } from '../../assets/fonts/Kiona-Itallic.ttf';
import { KionaLight } from '../../assets/fonts/Kiona-Light.ttf';
import { KionaLightItallic } from '../../assets/fonts/Kiona-LightItallic.ttf';
import { KionaBold } from '../../assets/fonts/Kiona-Bold.ttf';
import { KionaBoldItallic } from '../../assets/fonts/Kiona-BoldItallic.ttf';
import { KionaSemiBold } from '../../assets/fonts/Kiona-SemiBold.ttf';
import { KionaSemiBoldItallic } from '../../assets/fonts/Kiona-SemiBoldItallic.ttf';

const KionaRegularFont = new FontFace('Kiona-Regular, Kiona', `url(${KionaRegular})`, {
    style: 'normal',
});
document.fonts.add(KionaRegularFont);

const KionaItallicFont = new FontFace('Kiona-Itallic, Kiona', `url(${KionaItallic})`, {
    style: 'normal',
});
document.fonts.add(KionaItallicFont);

const KionaLightFont = new FontFace('Kiona-Light, Kiona', `url(${KionaLight})`, {
    style: 'normal',
});
document.fonts.add(KionaLightFont);
const KionaLightItallicFont = new FontFace('Kiona-LightItallic, Kiona', `url(${KionaLightItallic})`, {
    style: 'normal',
});
document.fonts.add(KionaLightItallicFont);
const KionaBoldFont = new FontFace('Kiona-Bold, Kiona', `url(${KionaBold})`, {
    style: 'normal',
});
document.fonts.add(KionaBoldFont);
const KionaBoldItallicFont = new FontFace('Kiona-BoldItallic, Kiona', `url(${KionaBoldItallic})`, {
    style: 'normal',
});
document.fonts.add(KionaBoldItallicFont);
const KionaSemiBoldFont = new FontFace('Kiona-SemiBold, Kiona', `url(${KionaSemiBold})`, {
    style: 'normal',
});
document.fonts.add(KionaSemiBoldFont);
const KionaSemiBoldItallicFont = new FontFace('Kiona-SemiBold, Kiona', `url(${KionaSemiBoldItallic})`, {
    style: 'normal',
});
document.fonts.add(KionaSemiBoldItallicFont);

export { KionaRegularFont };
export { KionaItallicFont };
export { KionaLightFont };
export { KionaLightItallicFont };
export { KionaBoldFont };
export { KionaBoldItallicFont };
export { KionaSemiBoldFont };
export { KionaSemiBoldItallicFont };
