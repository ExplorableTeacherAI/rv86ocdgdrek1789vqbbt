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
    Slider,
} from "@/components/atoms";
import { useVar, useSetVar } from "@/stores";

const TOTAL_SLICES = 8;

/** A 0-to-2 probability line comparing wanted/total with wanted/unwanted. */
const ProbabilityNumberLine = () => {
    const winning = useVar("winningOutcomes", 2) as number;
    const setVar = useSetVar();

    const losing = TOTAL_SLICES - winning;
    const correct = winning / TOTAL_SLICES;
    const wrong = winning / losing;

    // ---- SVG geometry (generous gutters so no label is ever clipped) ----
    const VIEW_WIDTH = 720;
    const VIEW_HEIGHT = 300;
    const LEFT = 90;
    const RIGHT = 90;
    const LINE_Y = 170;
    const lineWidth = VIEW_WIDTH - LEFT - RIGHT;
    const MAX_VALUE = 2;
    const toX = (value: number) =>
        LEFT + (Math.min(value, MAX_VALUE) / MAX_VALUE) * lineWidth;

    const ticks = [0, 0.5, 1, 1.5, 2];
    const format = (value: number) => value.toFixed(2);
    const wrongLabel =
        wrong > MAX_VALUE
            ? `${winning}/${losing} = ${format(wrong)} (off the scale)`
            : `${winning}/${losing} = ${format(wrong)}`;

    return (
        <div className="w-full">
            <svg
                width="100%"
                viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
                role="img"
                aria-label="A probability line from 0 to 2 comparing two candidate answers"
            >
                {/* impossible region beyond 1 */}
                <rect
                    x={toX(1)}
                    y={LINE_Y - 46}
                    width={toX(2) - toX(1)}
                    height={92}
                    fill="#fee2e2"
                    rx={6}
                />
                <text
                    x={(toX(1) + toX(2)) / 2}
                    y={LINE_Y - 56}
                    textAnchor="middle"
                    fontSize="13"
                    fill="#b91c1c"
                >
                    no probability can live here
                </text>

                {/* the line itself */}
                <line
                    x1={LEFT}
                    y1={LINE_Y}
                    x2={LEFT + lineWidth}
                    y2={LINE_Y}
                    stroke="#334155"
                    strokeWidth={2}
                />
                {ticks.map((tick) => (
                    <g key={tick}>
                        <line
                            x1={toX(tick)}
                            y1={LINE_Y - 7}
                            x2={toX(tick)}
                            y2={LINE_Y + 7}
                            stroke="#334155"
                            strokeWidth={2}
                        />
                        <text
                            x={toX(tick)}
                            y={LINE_Y + 26}
                            textAnchor="middle"
                            fontSize="13"
                            fill="#475569"
                        >
                            {tick}
                        </text>
                    </g>
                ))}
                <text x={LEFT} y={LINE_Y + 48} textAnchor="start" fontSize="12" fill="#94a3b8">
                    impossible
                </text>
                <text x={toX(1)} y={LINE_Y + 48} textAnchor="middle" fontSize="12" fill="#94a3b8">
                    certain
                </text>

                {/* correct marker, above the line */}
                <circle cx={toX(correct)} cy={LINE_Y} r={8} fill="#16a34a" />
                <line
                    x1={toX(correct)}
                    y1={LINE_Y - 10}
                    x2={toX(correct)}
                    y2={LINE_Y - 30}
                    stroke="#16a34a"
                    strokeWidth={2}
                />
                <text
                    x={Math.min(Math.max(toX(correct), LEFT), VIEW_WIDTH - RIGHT)}
                    y={LINE_Y - 38}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="600"
                    fill="#15803d"
                >
                    {`${winning}/${TOTAL_SLICES} = ${format(correct)}`}
                </text>

                {/* wrong marker, below the line */}
                <circle cx={toX(wrong)} cy={LINE_Y} r={8} fill="#dc2626" />
                <line
                    x1={toX(wrong)}
                    y1={LINE_Y + 10}
                    x2={toX(wrong)}
                    y2={LINE_Y + 62}
                    stroke="#dc2626"
                    strokeWidth={2}
                />
                <text
                    x={Math.min(Math.max(toX(wrong), LEFT), VIEW_WIDTH - RIGHT)}
                    y={LINE_Y + 80}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="600"
                    fill="#b91c1c"
                >
                    {wrongLabel}
                </text>

                {/* key */}
                <circle cx={LEFT} cy={34} r={6} fill="#16a34a" />
                <text x={LEFT + 14} y={39} fontSize="13" fill="#15803d">
                    winning slices out of all 8 slices
                </text>
                <circle cx={LEFT} cy={60} r={6} fill="#dc2626" />
                <text x={LEFT + 14} y={65} fontSize="13" fill="#b91c1c">
                    winning slices out of the losing slices
                </text>
            </svg>

            <div className="mt-4 px-2">
                <div className="mb-2 text-sm text-slate-600">
                    Winning slices: <span className="font-semibold">{winning}</span> — losing
                    slices: <span className="font-semibold">{losing}</span>
                </div>
                <Slider
                    value={[winning]}
                    min={1}
                    max={7}
                    step={1}
                    onValueChange={(value) => setVar("winningOutcomes", value[0])}
                    aria-label="Number of winning slices"
                />
            </div>
        </div>
    );
};

/** Multiple-choice question with progressive feedback. */
const SpinnerChoiceQuestion = () => {
    const [choice, setChoice] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [solved, setSolved] = useState(false);

    const check = () => {
        if (choice === "four-tenths") {
            setSolved(true);
            setFeedback(
                "Correct. All 10 sections could come up, so 10 goes on the bottom: 4/10, which is 0.4 or 40%."
            );
            return;
        }
        const next = attempts + 1;
        setAttempts(next);
        if (choice === "four-sixths") {
            setFeedback(
                next === 1
                    ? "That compares the coin sections with the empty ones, which is the trap from this section. Slide the winning slices above to 4 and look at the red marker."
                    : "The 6 is only the sections you do not want. The spinner can still land on a coin section too, so the bottom number is every section: 4/10."
            );
        } else if (next === 1) {
            setFeedback(
                "Not quite. Count the coin sections, then count every section there is, and put them in that order."
            );
        } else {
            setFeedback("The wanted count is 4 and the total count is 10, so the answer is 4/10.");
        }
    };

    return (
        <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 text-sm font-medium text-slate-800">
                A spinner has 10 equal sections. 4 of them give coins and 6 are empty. What is
                the probability of landing on coins?
            </div>
            <RadioGroup value={choice} onValueChange={setChoice} className="mb-3 space-y-2">
                {[
                    { id: "four-sixths", label: "4/6" },
                    { id: "four-tenths", label: "4/10" },
                    { id: "six-tenths", label: "6/10" },
                    { id: "ten-fourths", label: "10/4" },
                ].map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                        <RadioGroupItem value={option.id} id={`spinner-choice-${option.id}`} />
                        <label
                            htmlFor={`spinner-choice-${option.id}`}
                            className="text-sm text-slate-700"
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
            </RadioGroup>
            <Button onClick={check} disabled={!choice || solved} size="sm">
                Check
            </Button>
            {feedback && (
                <div
                    className={`mt-3 text-sm ${solved ? "text-emerald-700" : "text-amber-700"}`}
                >
                    {feedback}
                </div>
            )}
        </div>
    );
};

/** Typed-answer question with progressive feedback. */
const RareSkinPercentQuestion = () => {
    const [answer, setAnswer] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [solved, setSolved] = useState(false);

    const check = () => {
        const value = Number(answer.replace("%", "").trim());
        if (Math.abs(value - 15) < 0.5) {
            setSolved(true);
            setFeedback(
                "Correct. 3 wanted out of 20 total is 3/20, and 3 divided by 20 is 0.15, which is 15%."
            );
            return;
        }
        const next = attempts + 1;
        setAttempts(next);
        if (Math.abs(value - 17.6) < 1.5) {
            setFeedback(
                "That used the 17 outcomes you do not want as the bottom number. Set the winning slices above to 3 and check which marker stays on the line."
            );
        } else if (next === 1) {
            setFeedback("Start with the fraction. How many outcomes do you want, and how many are there altogether?");
        } else if (next === 2) {
            setFeedback("The fraction is 3/20. Now divide 3 by 20 and turn that decimal into a percentage.");
        } else {
            setFeedback("3/20 is 0.15, so the answer is 15%.");
        }
    };

    return (
        <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 text-sm font-medium text-slate-800">
                A drop table has 20 equally likely outcomes and 3 of them give the rare skin.
                Write that probability as a percentage.
            </div>
            <div className="flex items-center gap-2">
                <Input
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder="e.g. 40%"
                    className="w-32"
                />
                <Button onClick={check} disabled={!answer || solved} size="sm">
                    Check
                </Button>
            </div>
            {feedback && (
                <div
                    className={`mt-3 text-sm ${solved ? "text-emerald-700" : "text-amber-700"}`}
                >
                    {feedback}
                </div>
            )}
        </div>
    );
};

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
                losing ones. Drag the slider below and watch where each answer
                lands.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wanted-visual" maxWidth="xl">
        <Block id="wanted-visual" padding="sm" hasVisualization>
            <ProbabilityNumberLine />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wanted-rule" maxWidth="xl">
        <Block id="wanted-rule" padding="sm">
            <EditableParagraph id="para-wanted-rule" blockId="wanted-rule">
                Push the winning slices past 4 and the red answer leaves the line
                completely, because wins compared with losses answers a different
                question, the one gamblers call odds. The green answer never
                escapes: what you want is part of the total, so a probability
                always stays between 0 and 1.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wanted-practice-choice" maxWidth="xl">
        <Block id="wanted-practice-choice" padding="sm">
            <SpinnerChoiceQuestion />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wanted-practice-percent" maxWidth="xl">
        <Block id="wanted-practice-percent" padding="sm">
            <RareSkinPercentQuestion />
        </Block>
    </StackLayout>,
];
