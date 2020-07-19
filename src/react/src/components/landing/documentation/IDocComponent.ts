import { OutlineElement } from './docComponents/OutlineElement';

export default interface IDocComponent {
    name: string;
    path: string;
    component: any;
    outline: OutlineElement[];
}
