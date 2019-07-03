import * as React from "react";
import { useState } from "react";

export interface DialogComponentProps {
    onClose: () => void;
}

export type DialogComponent = (props: DialogComponentProps) => JSX.Element;
