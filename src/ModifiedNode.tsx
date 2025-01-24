import { Node } from '@xyflow/react';
import { Menu } from './Menu';
import { TextProps } from './TextProps';

export interface ModifiedNode extends Node {
    data: {
        label: String;
        inputValue: string;
        responseValue: string;
        apiValue: string;
        fallBackMessage : string;
        menuList: Menu[];
        fieldForm: TextProps | any;
        enableInput: boolean;
        flow : string;
        dataArgsList : any[];
        responseArgsList : any[];
        
    };
    triggered: boolean;
    flow: string;
}
