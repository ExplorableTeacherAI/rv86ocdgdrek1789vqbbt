import { useMemo, useState, type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    Button,
    EditableH2,
    EditableParagraph,
    RadioGroup,
    RadioGroupItem,
    Slider,
} from "@/components/atoms";
import { useVar, useSetVar } from "@/stores";

const PRIZE_NAMES = ["Rare skin", "Coins", "Sticker", "Nothing"];
const PRIZE_COLORS = ["#7c3aed", "#0ea5e9", "#f59e0b", "#94a3b8"];

const polarPoint = (cx: number, cy: number, radius: number, turns: number) => {
    const angle = turns * 2 * Math.PI - Math.PI / 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
};

const sectorPath = (
    cx: number,
    cy: number,
    radius: number,
    startTurn: number,
    endTurn: number
) => {
    const [x1, y1] = polarPoint(cx, cy, radius, startTurn);
    const [x2, y2] = polarPoint(cx, cy, radius, endTurn);
    const largeArc = endTurn - startTurn > 0.5 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
};

/** A prize wheel whose rare slice can be resized, spun against the counted answer. */
const ResizablePrizeWheel = () => {
    const rareShare = useVar("rareSliceShare", 10) as number;
    const setVar = useSetVar();
    const [rotation, setRotation] = useState(0);
    const [spins, setSpins] = useState(0);
    const [rareHits, setRareHits] = useState(0);

    const shares = useMemo(() => {
        const rare = rareShare / 100;
        const other = (1 - rare) / 3;
        return [rare, other, other, other];
    }, [rareShare]);

    const sectors = useMemo(() => {
        let cursor = 0;
        return shares.map((share, index) => {
            const start = cursor;
            cursor += share;
            return {
                name: PRIZE_NAMES[index],
                color: PRIZE_COLORS[index],
                share,
                start,
                end: cursor,
            };
        });
    }, [shares]);

    const runSpins = (count: number) => {
        let hits = 0;
        let lastDraw = 0;
        for (let i = 0; i < count; i += 1) {
            lastDraw = Math.random();
            if (lastDraw < shares[0]) hits += 1;
        }
        setRareHits((value) => value + hits);
        setSpins((value) => value + count);
        // land the pointer on the sector the final draw selected
        const target = sectors.find((s) => lastDraw >= s.start && lastDraw < s.end) ?? sectors[0];
        const middle = (target.start + target.end) / 2;
        setRotation((value) => value + 720 + (360 - middle * 360) - (value % 360));
    };

    const reset = () => {
        setSpins(0);
        setRareHits(0);
    };

    const CENTER = 150;
    const RADIUS = 118;
    const observed = spins > 0 ? (rareHits / spins) * 100 : 0;

    return (
        <div className="flex w-full flex-col gap-6 md:flex-row md:items-center">
            <svg
                width="100%"
                viewBox="0 0 300 330"
                className="max-w-xs"
                role="img"
                aria-label="A prize wheel with four prizes and a resizable rare skin slice"
            >
                <g
                    transform={`rotate(${rotation} ${CENTER} ${CENTER})`}
                    style={{ transition: "transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)" }}
                >
                    {sectors.map((sector) => (
                        <path
                            key={sector.name}
                            d={sectorPath(CENTER, CENTER, RADIUS, sector.start, sector.end)}
                            fill={sector.color}
                            stroke="#ffffff"
                            strokeWidth={2}
                        />
                    ))}
                </g>
                <circle cx={CENTER} cy={CENTER} r={16} fill="#ffffff" stroke="#cbd5e1" />
                <polygon
                    points={`${CENTER - 10},18 ${CENTER + 10},18 ${CENTER},44`}
                    fill="#1e293b"
                />
                <text x={CENTER} y={300} textAnchor="middle" fontSize="13" fill="#475569">
                    4 prizes on the wheel
                </text>
            </svg>

            <div className="flex-1 space-y-4">
                <div>
                    <div className="mb-2 text-sm text-slate-600">
                        Rare skin slice size:{" "}
                        <span className="font-semibold text-violet-700">{rareShare}%</span> of the
                        wheel
                    </div>
                    <Slider
                        value={[rareShare]}
                        min={5}
                        max={55}
                        step={5}
                        onValueChange={(value) => setVar("rareSliceShare", value[0])}
                        aria-label="Rare skin slice size"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                        <div className="text-xs uppercase tracking-wide text-red-700">
                            Counting prizes
                        </div>
                        <div className="text-lg font-semibold text-red-800">1 of 4 = 25%</div>
                    </div>
                    <div className="rounded-lg border border-violet-200 bg-violet-50 p-3">
                        <div className="text-xs uppercase tracking-wide text-violet-700">
                            Space on the wheel
                        </div>
                        <div className="text-lg font-semibold text-violet-800">{rareShare}%</div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" onClick={() => runSpins(1)}>
                        Spin once
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => runSpins(100)}>
                        Spin 100 times
                    </Button>
                    <Button size="sm" variant="ghost" onClick={reset}>
                        Reset
                    </Button>
                </div>

                <div className="text-sm text-slate-700">
                    {spins === 0
                        ? "No spins yet."
                        : `Rare skin won ${rareHits} times out of ${spins} spins — that is ${observed.toFixed(1)}%.`}
                </div>
            </div>
        </div>
    );
};

/** Misconception-targeted question about equally likely outcomes. */
const UnequalWheelQuestion = () => {
    const [choice, setChoice] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [solved, setSolved] = useState(false);

    const check = () => {
        if (choice === "one-tenth") {
            setSolved(true);
            setFeedback(
                "Correct. The prize takes up a tenth of the wheel, so the chance is 1/10, or 10% — the number of prizes never came into it."
            );
            return;
        }
        const next = attempts + 1;
        setAttempts(next);
        if (choice === "one-third") {
            setFeedback(
                next === 1
                    ? "That counted the three prizes as if they were the same size. Set the slice above to 10% and spin 100 times to see how often the rare prize really comes up."
                    : "Three prizes does not mean a one in three chance. The prize fills a tenth of the wheel, so the answer is 1/10."
            );
        } else if (next === 1) {
            setFeedback("Not quite. Forget how many prizes there are and look at how much room this one takes up.");
        } else {
            setFeedback("The prize covers one tenth of the wheel, so the probability is 1/10.");
        }
    };

    return (
        <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 text-sm font-medium text-slate-800">
                A different wheel has just 3 prizes on it, but the rare prize only fills a tenth of
                the wheel. What is the chance of winning it in one spin?
            </div>
            <RadioGroup value={choice} onValueChange={setChoice} className="mb-3 space-y-2">
                {[
                    { id: "one-third", label: "1/3" },
                    { id: "one-tenth", label: "1/10" },
                    { id: "three-tenths", label: "3/10" },
                    { id: "cannot-tell", label: "It cannot be worked out" },
                ].map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                        <RadioGroupItem value={option.id} id={`unequal-choice-${option.id}`} />
                        <label
                            htmlFor={`unequal-choice-${option.id}`}
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
                <div className={`mt-3 text-sm ${solved ? "text-emerald-700" : "text-amber-700"}`}>
                    {feedback}
                </div>
            )}
        </div>
    );
};

/** Transfer question: when is counting outcomes allowed? */
const CountingAllowedQuestion = () => {
    const [choice, setChoice] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [solved, setSolved] = useState(false);

    const check = () => {
        if (choice === "tokens") {
            setSolved(true);
            setFeedback(
                "Correct. Every token has the same chance of being pulled out, so counting works: 5 out of 12."
            );
            return;
        }
        const next = attempts + 1;
        setAttempts(next);
        setFeedback(
            next === 1
                ? "Ask yourself one thing about each situation: does every outcome have the same chance? Counting is only allowed when the answer is yes."
                : "Only the bag of identical tokens gives outcomes of equal chance. Uneven sectors, weighted dice and weather do not."
        );
    };

    return (
        <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 text-sm font-medium text-slate-800">
                In which situation can you find the probability just by counting outcomes?
            </div>
            <RadioGroup value={choice} onValueChange={setChoice} className="mb-3 space-y-2">
                {[
                    { id: "tokens", label: "Pulling one token from a bag of 5 red and 7 blue identical tokens" },
                    { id: "sectors", label: "Spinning a wheel whose 6 sectors are all different sizes" },
                    { id: "weighted", label: "Rolling a dice that has been weighted to favour a six" },
                    { id: "rain", label: "Guessing whether it will rain tomorrow, since it either does or does not" },
                ].map((option) => (
                    <div key={option.id} className="flex items-start gap-2">
                        <RadioGroupItem
                            value={option.id}
                            id={`counting-allowed-${option.id}`}
                            className="mt-1"
                        />
                        <label
                            htmlFor={`counting-allowed-${option.id}`}
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
                <div className={`mt-3 text-sm ${solved ? "text-emerald-700" : "text-amber-700"}`}>
                    {feedback}
                </div>
            )}
        </div>
    );
};

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
                Counting outcomes only works if every outcome is the same size.
                Game designers know this, so the rare prize usually sits on a
                sliver. This wheel has 4 prizes, so counting says 25%. Shrink the
                rare slice and spin 100 times to see whether that holds up.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-unequal-visual" maxWidth="xl">
        <Block id="unequal-visual" padding="sm" hasVisualization>
            <ResizablePrizeWheel />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-unequal-rule" maxWidth="xl">
        <Block id="unequal-rule" padding="sm">
            <EditableParagraph id="para-unequal-rule" blockId="unequal-rule">
                The counted answer never moves off 25%, but the spins follow the
                space on the wheel every time. So counting is not a magic trick,
                it is a shortcut that works only when the outcomes are equally
                likely. Check that first, then count.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-unequal-practice-wheel" maxWidth="xl">
        <Block id="unequal-practice-wheel" padding="sm">
            <UnequalWheelQuestion />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-unequal-practice-counting" maxWidth="xl">
        <Block id="unequal-practice-counting" padding="sm">
            <CountingAllowedQuestion />
        </Block>
    </StackLayout>,
];
