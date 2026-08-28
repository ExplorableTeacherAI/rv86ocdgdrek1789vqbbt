import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH1, EditableParagraph } from "@/components/atoms";

export const chanceOfOneThingBlocks: ReactElement[] = [
    <StackLayout key="layout-chance-title" maxWidth="xl">
        <Block id="chance-title" padding="md">
            <EditableH1 id="h1-chance-title" blockId="chance-title">
                By chance? or....?
            </EditableH1>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-chance-opening" maxWidth="xl">
        <Block id="chance-opening" padding="sm">
            <EditableParagraph id="para-chance-opening" blockId="chance-opening">
                A game gives you one free spin of its prize wheel. You want the
                rare skin. Your friend says the chance is "pretty low", someone
                else says "about half". Neither of them actually knows, because
                nobody has counted anything.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-chance-promise" maxWidth="xl">
        <Block id="chance-promise" padding="sm">
            <EditableParagraph id="para-chance-promise" blockId="chance-promise">
                Probability replaces those guesses with a number. By the end of
                this lesson you will be able to work out the exact chance of one
                thing happening and write it as a fraction, a decimal or a
                percentage. You already know how to simplify a fraction and
                switch it into a percentage, and you already use words like
                likely and impossible. This lesson turns those words into
                numbers.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
