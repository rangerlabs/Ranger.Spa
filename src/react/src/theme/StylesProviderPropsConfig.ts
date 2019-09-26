import { jssPreset, createGenerateClassName } from "@material-ui/styles";
import { create } from "jss";

export const jss = create({
    plugins: [...jssPreset().plugins],
});
export const generateClassName = createGenerateClassName({
    disableGlobal: true,
});
