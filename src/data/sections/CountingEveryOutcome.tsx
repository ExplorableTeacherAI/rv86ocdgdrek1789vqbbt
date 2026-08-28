import { useState, type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    Button,
    EditableH2,
    EditableParagraph,
    Input,
    RadioGroup,
    RadioGroupItem,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";

/** One spin of an eight-slice wheel: 1 rare skin, 2 coins, 5 nothing. */
const EVENT_CARDS = [
    {
        id: "rare-skin",
        label: "Win the rare skin",
        wanted: 1,
        total: 8,
        detail: "1 slice out of 8",
    },
    {
        id: "coins",
        label: "Win coins",
        wanted: 2,
        total: 8,
        detail: "2 slices out of 8",
    },
    {
        id: "any-prize",
        label: "Win any prize at all",
        wanted: 3,
        total: 8,
        detail: "1 rare slice and 2 coin slices, so 3 out of 8",
    },
    {
        id: "lands-somewhere",
        label: "Land on one of the slices",
        wanted: 8,
        total: 8,
        detail: "every slice counts, so 8 out of 8",
    },
    {
        id: "wins-a-car",
        label: "Win a car",
        wanted: 0,
        total: 8,
        detail: "no slice gives a car, so 0 out of 8",
    },
];

const VIEW_WIDTH = 720;
const VIEW_HEIGHT = 190;
const LEFT = 70;
const RIGHT = 70;
const LINE_Y = 110;
const LINE_WIDTH = VIEW_WIDTH - LEFT - RIGHT;
const toX = (value: number) => LEFT + value * LINE_WIDTH;

/** Students place event cards on a line from impossible to certain. */
const ImpossibleToCertainLine = () => {
    const [selected, setSelected] = useState<string | null>(EVENT_CARDS[0].id);
    const [placements, setPlacements] = useState<Record<string, number>>({});
    const [checked, setChecked] = useState(false);

    const placeOnLine = (event: React.MouseEvent<SVGRectElement>) => {
        if (!selected) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const ratio = (event.clientX - rect.left) / rect.width;
        const value = Math.min(1, Math.max(0, (ratio * VIEW_WIDTH - LEFT) / LINE_WIDTH));
        setPlacements((current) => ({ ...current, [selected]: value }));
        setChecked(false);
        const next = EVENT_CARDS.find((card) => card.id !== selected && placements[card.id] === undefined);
        setSelected(next ? next.id : null);
    };

    const reset = () => {
        setPlacements({});
        setChecked(false);
        setSelected(EVENT_CARDS[0].id);
    };

    const allPlaced = EVENT_CARDS.every((card) => placements[card.id] !== undefined);

    return (
        <div className="w-full">
            <svg
                width="100%"
                viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
                role="img"
                aria-label="A line running from impossible to certain"
            >
                <rect
                    x={0}
                    y={0}
                    width={VIEW_WIDTH}
                    height={VIEW_HEIGHT}
                    fill="transparent"
                    onClick={placeOnLine}
                    style={{ cursor: selected ? "crosshair" : "default" }}
                />
                <line
                    x1={LEFT}
                    y1={LINE_Y}
                    x2={LEFT + LINE_WIDTH}
                    y2={LINE_Y}
                    stroke="#334155"
                    strokeWidth={3}
                    pointerEvents="none"
                />
                {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
                    <g key={tick} pointerEvents="none">
                        <line
                            x1={toX(tick)}
                            y1={LINE_Y - 8}
                            x2={toX(tick)}
                            y2={LINE_Y + 8}
                            stroke="#334155"
                            strokeWidth={2}
                        />
                        <text
                            x={toX(tick)}
                            y={LINE_Y + 28}
                            textAnchor="middle"
                            fontSize="13"
                            fill="#475569"
                        >
                            {tick}
                        </text>
                    </g>
                ))}
                <text x={LEFT} y={LINE_Y + 52} textAnchor="start" fontSize="13" fill="#64748b" pointerEvents="none">
                    impossible
                </text>
                <text
                    x={LEFT + LINE_WIDTH / 2}
                    y={LINE_Y + 52}
                    textAnchor="middle"
                    fontSize="13"
                    fill="#64748b"
                    pointerEvents="none"
                >
                    even chance
                </text>
                <text
                    x={LEFT + LINE_WIDTH}
                    y={LINE_Y + 52}
                    textAnchor="end"
                    fontSize="13"
                    fill="#64748b"
                    pointerEvents="none"
                >
                    certain
                </text>

                {EVENT_CARDS.map((card, index) => {
                    const placed = placements[card.id];
                    const trueValue = card.wanted / card.total;
                    return (
                        <g key={card.id} pointerEvents="none">
                            {placed !== undefined && (
                                <>
                                    <line
                                        x1={toX(placed)}
                                        y1={LINE_Y}
                                        x2={toX(placed)}
                                        y2={LINE_Y - 26 - index * 12}
                                        stroke="#0ea5e9"
                                        strokeWidth={2}
                                    />
                                    <circle cx={toX(placed)} cy={LINE_Y} r={6} fill="#0ea5e9" />
                                    <text
                                        x={toX(placed)}
                                        y={LINE_Y - 32 - index * 12}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="#0369a1"
                                    >
                                        {index + 1}
                                    </text>
                                </>
                            )}
                            {checked && (
                                <>
                                    <circle cx={toX(trueValue)} cy={LINE_Y} r={6} fill="#16a34a" />
                                    <text
                                        x={toX(trueValue)}
                                        y={LINE_Y + 74 + index * 14}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="#15803d"
                                    >
                                        {`${index + 1}: ${card.wanted}/${card.total}`}
                                    </text>
                                </>
                            )}
                        </g>
                    );
                })}
            </svg>

            <div className="mt-4 flex flex-wrap gap-2">
                {EVENT_CARDS.map((card, index) => {
                    const placed = placements[card.id];
                    const isSelected = selected === card.id;
                    return (
                        <button
                            key={card.id}
                            type="button"
                            onClick={() => setSelected(card.id)}
                            className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                                isSelected
                                    ? "border-sky-500 bg-sky-50 text-sky-900"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }`}
                        >
                            <span className="mr-2 font-semibold">{index + 1}.</span>
                            {card.label}
                            {placed !== undefined && (
                                <span className="ml-2 text-xs text-slate-500">
                                    placed at {placed.toFixed(2)}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="mt-3 text-sm text-slate-600">
                {selected
                    ? "Pick a card, then click the line where you think it belongs."
                    : "All cards placed — check your answers."}
            </div>

            <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => setChecked(true)} disabled={!allPlaced}>
                    Show the counted answers
                </Button>
                <Button size="sm" variant="ghost" onClick={reset}>
                    Reset
                </Button>
            </div>

            {checked && (
                <ul className="mt-3 space-y-1 text-sm text-slate-700">
                    {EVENT_CARDS.map((card, index) => {
                        const placed = placements[card.id] ?? 0;
                        const trueValue = card.wanted / card.total;
                        const close = Math.abs(placed - trueValue) < 0.07;
                        return (
                            <li key={card.id} className={close ? "text-emerald-700" : "text-amber-700"}>
                                <span className="font-semibold">{index + 1}. {card.label}:</span>{" "}
                                {card.detail} = {`${Math.round(trueValue * 1000) / 10}%`}
                                {close ? " — your placement was spot on." : " — nudge your marker to here."}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

/** Counting practice on a wheel students have not seen. */
const TwelveSliceQuestion = () => {
    const [choice, setChoice] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [solved, setSolved] = useState(false);

    const check = () => {
        if (choice === "three-twelfths") {
            setSolved(true);
            setFeedback("Correct. 3 coin slices out of 12 slices altogether is 3/12, which simplifies to 1/4.");
            return;
        }
        const next = attempts + 1;
        setAttempts(next);
        if (next === 1) {
            setFeedback("Not quite. Count the coin slices first, then count every slice on the wheel, and write them in that order.");
        } else if (next === 2) {
            setFeedback("There are 3 slices you want and 12 slices in total. Which fraction is that?");
        } else {
            setFeedback("The answer is 3/12, the same as 1/4.");
        }
    };

    return (
        <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 text-sm font-medium text-slate-800">
                A different wheel has 12 equal slices: 3 give coins and 9 give nothing. What is the
                probability of winning coins on one spin?
            </div>
            <RadioGroup value={choice} onValueChange={setChoice} className="mb-3 space-y-2">
                {[
                    { id: "three-ninths", label: "3/9" },
                    { id: "three-twelfths", label: "3/12" },
                    { id: "nine-twelfths", label: "9/12" },
                    { id: "twelve-thirds", label: "12/3" },
                ].map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                        <RadioGroupItem value={option.id} id={`twelve-slice-${option.id}`} />
                        <label htmlFor={`twelve-slice-${option.id}`} className="text-sm text-slate-700">
                            {option.label}
                        </label>
                    </div>
                ))}
            </RadioGroup>
            <Button onClick={check} disabled={!choice || solved} size="sm">
                Check
            </Button>
            {feedback && (
                <div className={`mt-3 text-sm ${solved ? "text-emerald-700" : "text-amber-700"}`}>
                    {feedback}
                </div>
            )}
        </div>
    );
};

/** Typed answer: probability of the outcomes you do not want. */
const NoCoinsQuestion = () => {
    const [answer, setAnswer] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [solved, setSolved] = useState(false);

    const check = () => {
        const value = Number(answer.replace("%", "").trim());
        const asDecimal = value > 1 ? value / 100 : value;
        if (Math.abs(asDecimal - 0.75) < 0.02) {
            setSolved(true);
            setFeedback("Correct. 9 of the 12 slices give nothing, and 9/12 is 0.75, or 75%.");
            return;
        }
        const next = attempts + 1;
        setAttempts(next);
        if (Math.abs(asDecimal - 0.25) < 0.02) {
            setFeedback("That is the chance of winning coins. This question asks about the slices that give nothing — count those instead.");
        } else if (next === 1) {
            setFeedback("How many of the 12 slices give nothing? Put that count over the total, then divide.");
        } else if (next === 2) {
            setFeedback("The fraction is 9/12. Divide 9 by 12 to get the decimal.");
        } else {
            setFeedback("9/12 is 0.75, so the answer is 0.75 or 75%.");
        }
    };

    return (
        <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 text-sm font-medium text-slate-800">
                On that same 12-slice wheel, what is the probability of winning nothing? Give your
                answer as a decimal or a percentage.
            </div>
            <div className="flex items-center gap-2">
                <Input
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder="e.g. 0.4 or 40%"
                    className="w-36"
                />
                <Button onClick={check} disabled={!answer || solved} size="sm">
                    Check
                </Button>
            </div>
            {feedback && (
                <div className={`mt-3 text-sm ${solved ? "text-emerald-700" : "text-amber-700"}`}>
                    {feedback}
                </div>
            )}
        </div>
    );
};

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
                could happen. This wheel has 8 equal slices: 1 gives the rare
                skin, 2 give coins and 5 give nothing. Place each card below
                where you think it belongs on the line.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-counting-visual" maxWidth="xl">
        <Block id="counting-visual" padding="sm" hasVisualization>
            <ImpossibleToCertainLine />
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
                Take the coins card. Step 1: count what you want, which is 2
                slices. Step 2: count everything that could happen, which is 8.
                Step 3: write one over the other, giving 2 out of 8. That
                simplifies to one quarter, or 25%, which is why it sits a quarter
                of the way along the line.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-counting-practice-twelve" maxWidth="xl">
        <Block id="counting-practice-twelve" padding="sm">
            <TwelveSliceQuestion />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-counting-practice-nothing" maxWidth="xl">
        <Block id="counting-practice-nothing" padding="sm">
            <NoCoinsQuestion />
        </Block>
    </StackLayout>,
];
