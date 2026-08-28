import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";

export const wrappingUpBlocks: ReactElement[] = [
    <StackLayout key="layout-wrapping-heading" maxWidth="xl">
        <Block id="wrapping-heading" padding="md">
            <EditableH2 id="h2-wrapping-heading" blockId="wrapping-heading">
                Wrapping Up
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wrapping-summary" maxWidth="xl">
        <Block id="wrapping-summary" padding="sm">
            <EditableParagraph id="para-wrapping-summary" blockId="wrapping-summary">
                You can now answer the question your friends were only guessing
                at. Count the outcomes you want, count all the outcomes, and
                write the first over the second. The bottom number is always
                everything that could happen, never just the outcomes you did
                not want, and that is why the answer always sits between 0 and 1.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wrapping-next" maxWidth="xl">
        <Block id="wrapping-next" padding="sm">
            <EditableParagraph id="para-wrapping-next" blockId="wrapping-next">
                The one thing to stay careful about is the size of the slices.
                Counting is a shortcut that only works when the outcomes are
                equally likely, which is exactly what a rigged wheel is designed
                to hide. Next you will spin twice instead of once, and start
                working out the chance of two things happening together.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
