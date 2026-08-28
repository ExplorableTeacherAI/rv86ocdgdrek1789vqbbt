import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { VisualOptionCards } from "@/components/organisms";

export const countingEveryOutcomeBlocks: ReactElement[] = [
    <StackLayout key="layout-counting-heading" maxWidth="xl">
        <Block id="counting-heading" padding="md">
            <EditableH2 id="h2-counting-heading" blockId="counting-heading">
                Counting Every Outcome
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-counting-setup" maxWidth="xl">
        <Block id="counting-setup" padding="sm">
            <EditableParagraph id="para-counting-setup" blockId="counting-setup">
                Before you can measure a chance, you have to know everything that
                could happen. On a prize wheel with 8 equal slices there are 8
                possible outcomes, and the spin has to land on one of them. So
                how many of those 8 are the ones you actually want?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-counting-visual" maxWidth="xl">
        <Block id="counting-visual" padding="sm">
            <VisualOptionCards
                blockId="counting-visual"
                intro="Pick how your students will meet the idea of counting outcomes."
                cards={[
                    {
                        id: "prize-wheel",
                        title: "A prize wheel where students choose how many slices win",
                        looks: "A wheel split into 8 equal slices, some marked as the prize students want, with the probability shown underneath as a fraction, a decimal and a percentage.",
                        manipulate: "Students tap slices to turn them into winning slices and press spin to try it out",
                        reveals: "The probability is simply the number of winning slices out of the total number of slices",
                        recommended: true,
                    },
                    {
                        id: "outcome-list",
                        title: "A list of every possible outcome that students tick off",
                        looks: "All the outcomes of one spin laid out as a row of labelled cards, with a running count of ticked cards and total cards.",
                        manipulate: "Students tick the outcomes that count as a win and watch the two counts change",
                        reveals: "Every probability comes from two counts: the outcomes you want and all the outcomes there are",
                    },
                    {
                        id: "token-bag",
                        title: "A bag of coloured tokens with one token drawn out",
                        looks: "A bag holding coloured tokens, with the number of each colour shown beside it and a bar showing the chance of drawing the chosen colour.",
                        manipulate: "Students add or remove tokens of each colour and draw one at random",
                        reveals: "Adding tokens changes both the wanted count and the total, so the chance moves in a way students can predict",
                    },
                ]}
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-counting-formula" maxWidth="xl">
        <Block id="counting-formula" padding="lg">
            <FormulaBlock latex="P(\text{event}) = \frac{\text{number of outcomes you want}}{\text{total number of outcomes}}" />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-counting-worked-example" maxWidth="xl">
        <Block id="counting-worked-example" padding="sm">
            <EditableParagraph id="para-counting-worked-example" blockId="counting-worked-example">
                Say 2 of the 8 slices give the rare skin. Step 1: count what you
                want, which is 2. Step 2: count everything that could happen,
                which is 8. Step 3: write one over the other, so the probability
                is 2 out of 8. That simplifies to one quarter, or 25%.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
