import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";
import { VisualOptionCards } from "@/components/organisms";

export const whenSlicesArentEqualBlocks: ReactElement[] = [
    <StackLayout key="layout-unequal-heading" maxWidth="xl">
        <Block id="unequal-heading" padding="md">
            <EditableH2 id="h2-unequal-heading" blockId="unequal-heading">
                When the Slices Aren't Equal
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-unequal-setup" maxWidth="xl">
        <Block id="unequal-setup" padding="sm">
            <EditableParagraph id="para-unequal-setup" blockId="unequal-setup">
                Counting slices only works if every slice is the same size. Game
                designers know this, so the rare prize usually sits on a sliver
                while the common one takes a huge wedge. There are still 8
                outcomes, but they are no longer worth the same. What happens to
                the fraction then?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-unequal-visual" maxWidth="xl">
        <Block id="unequal-visual" padding="sm">
            <VisualOptionCards
                blockId="unequal-visual"
                intro="Pick how your students will discover that outcomes are not always equally likely."
                cards={[
                    {
                        id: "resizable-wheel",
                        title: "A wheel whose slices students can make wider or narrower",
                        looks: "A prize wheel with slices of different sizes, showing the count based answer next to the answer based on the space each prize takes up.",
                        manipulate: "Students drag a slice wider or narrower and spin the wheel many times to see where it really lands",
                        reveals: "Counting outcomes gives the wrong answer as soon as the outcomes stop being the same size",
                        targetsMisconception: "Thinking every outcome is equally likely, even when it isn't",
                        recommended: true,
                    },
                    {
                        id: "two-wheels-compared",
                        title: "A fair wheel and a rigged wheel spun side by side",
                        looks: "Two wheels with the same prizes, one with equal slices and one with a tiny rare slice, each with its own running tally of results.",
                        manipulate: "Students spin both wheels many times and compare the two tallies",
                        reveals: "Equal counts do not mean equal chances; only the fair wheel matches the counted fraction",
                        targetsMisconception: "Thinking every outcome is equally likely, even when it isn't",
                    },
                    {
                        id: "unequal-token-bag",
                        title: "A bag where some prizes have far more tokens than others",
                        looks: "Three prizes listed with the number of tokens each one has in the bag, and the chance of each prize shown as a percentage.",
                        manipulate: "Students change how many tokens each prize gets and draw from the bag",
                        reveals: "Three prizes does not mean a one in three chance; what matters is how many tokens back each prize",
                    },
                ]}
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-unequal-rule" maxWidth="xl">
        <Block id="unequal-rule" padding="sm">
            <EditableParagraph id="para-unequal-rule" blockId="unequal-rule">
                So counting is not a magic trick, it is a shortcut, and it only
                works when the outcomes are equally likely. Three prizes on a
                wheel does not make each one a one in three chance. Check that
                the outcomes are evenly matched first, then count.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
