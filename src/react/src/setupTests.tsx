const jsdom = require("jsdom");
const Enzyme = require("enzyme");
const ReactSixteenAdapter = require("enzyme-adapter-react-16");
import * as localStorage from "./__tests__/polyfill/localStorage";

Enzyme.configure({ adapter: new ReactSixteenAdapter() });

const doc = jsdom.jsdom("<!doctype html><html><body></body></html>");
const win = doc.defaultView;

(global as any).document = doc;
(global as any).window = win;

localStorage.polyfill();
