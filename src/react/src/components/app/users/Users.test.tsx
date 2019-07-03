import { mount, shallow } from "enzyme";
import * as React from "react";
import Users from "../users/Users";

describe("<Users/> component", function() {
    it("renders a h1", () => {
        const emptyArgs: any = {};
        const wrapper = shallow(<Users {...emptyArgs} />, {
            disableLifecycleMethods: true,
        });
        expect(wrapper.find("h1")).toHaveLength(1);
    });
});
