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
                        id: "impossible-to-certain-line",
                        title: "Event cards dragged onto a line from impossible to certain",
                        looks: "A line labelled impossible at one end and certain at the other, with cards for different results of one spin waiting underneath, such as winning the rare skin or winning any prize at all.",
                        manipulate: "Students drag each card to where they think it belongs, then the counted outcomes and the matching fraction appear on the line",
                        reveals: "The words students already use turn into exact numbers, and every number lands between 0 and 1",
                        recommended: true,
                    },
                    {
                        id: "hundred-square-grid",
                        title: "A hundred square where students shade the winning outcomes",
                        looks: "A ten by ten grid of a hundred squares, with the shaded squares counted and shown as a fraction, a decimal and a percentage at the same time.",
                        manipulate: "Students shade squares to match how much of the wheel each prize takes, and the three forms of the answer update together",
                        reveals: "A probability is just the share of the whole, so a fraction, a decimal and a percentage are three ways of saying it",
                    },
                    {
                        id: "drop-table-tally",
                        title: "A game drop table with results piling up in a bar chart",
                        looks: "A table listing each prize and how many outcomes give it, beside a bar chart that grows as prizes are won.",
                        manipulate: "Students press a button to claim ten, fifty or five hundred prizes and watch the bars build",
                        reveals: "The bars settle into the same shares as the counted fractions, so counting really does predict what happens",
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
