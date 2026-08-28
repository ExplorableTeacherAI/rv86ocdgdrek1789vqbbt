import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";
import { VisualOptionCards } from "@/components/organisms";

export const wantedOverTotalBlocks: ReactElement[] = [
    <StackLayout key="layout-wanted-heading" maxWidth="xl">
        <Block id="wanted-heading" padding="md">
            <EditableH2 id="h2-wanted-heading" blockId="wanted-heading">
                Wanted Over Total
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wanted-setup" maxWidth="xl">
        <Block id="wanted-setup" padding="sm">
            <EditableParagraph id="para-wanted-setup" blockId="wanted-setup">
                Here is the slip almost everyone makes first. With 2 winning
                slices and 6 losing ones, it feels natural to write 2 out of 6.
                But the wheel can land on any of the 8 slices, not only the
                losing ones. Which number really belongs on the bottom?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wanted-visual" maxWidth="xl">
        <Block id="wanted-visual" padding="sm">
            <VisualOptionCards
                blockId="wanted-visual"
                intro="Pick how your students will see why the total goes on the bottom."
                cards={[
                    {
                        id: "two-fractions-tested",
                        title: "Two rival fractions tested against real spins",
                        looks: "The same set of outcomes with two candidate answers shown side by side, wanted over unwanted and wanted over total, plus a tally of how spins actually turn out.",
                        manipulate: "Students change how many outcomes win, then run a batch of spins and compare both predictions with the tally",
                        reveals: "Only wanted over total matches what actually happens",
                        targetsMisconception: "Writing wanted outcomes over unwanted ones instead of over the total",
                        recommended: true,
                    },
                    {
                        id: "split-bar",
                        title: "A single bar of all outcomes split into wanted and unwanted",
                        looks: "One bar representing every possible outcome, shaded into a wanted part and an unwanted part, with the shaded share written as a fraction.",
                        manipulate: "Students drag the split to change how many outcomes are wanted",
                        reveals: "The chance is the share of the whole bar, so the whole bar is what goes on the bottom",
                    },
                    {
                        id: "probability-number-line",
                        title: "Both answers placed on a 0 to 1 probability line",
                        looks: "A line from 0 to 1 with markers for wanted over total and wanted over unwanted, and a shaded region beyond 1 marked impossible.",
                        manipulate: "Students increase the number of winning outcomes and watch both markers move",
                        reveals: "Wanted over unwanted can shoot past 1, which no probability is ever allowed to do",
                        targetsMisconception: "Giving probability answers bigger than 1",
                    },
                ]}
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wanted-rule" maxWidth="xl">
        <Block id="wanted-rule" padding="sm">
            <EditableParagraph id="para-wanted-rule" blockId="wanted-rule">
                Wins compared with losses answers a different question, the one
                gamblers call odds. A probability always compares the wanted
                outcomes with every outcome. That is also why a probability can
                never be more than 1: what you want is part of the total, so it
                can never be bigger than it.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
