// src/pages/SavannaShowcase.jsx — Visual QA surface for every savanna primitive
import { useState } from "react";
import {
  Kicker, SectionHead, Button, ButtonRow, Chip, Card, Ticket,
  Scoreboard, Mana, ProgressBar, ProgressDots, Trail, Medal, Stamp,
  AvatarFrame, Callout, HazardBand, Toast, QuizCard, Choice,
  Topnav, TopnavBrand, Field, Input, Select, Textarea, RadioRow,
  ImagePlaceholder, Leaderboard, BarSeries, Sparkline, DotMatrix, StackedBar,
  Shell, Stack, Row, Tape,
} from "../components/savanna";
import { setTheme, getTheme, setRole, getRole } from "../lib/theme";

export default function SavannaShowcase() {
  const [choice, setChoice] = useState(null);
  const [radio, setRadio] = useState("proficient");
  const [theme, setT] = useState(getTheme);
  const [role, setR] = useState(getRole);
  const [showToast, setShowToast] = useState(false);

  const flipTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next); setT(next);
  };
  const flipRole = () => {
    const next = role === "teacher" ? "student" : role === "student" ? "guardian" : "teacher";
    setRole(next); setR(next);
  };

  const choiceState = (i) => {
    if (choice == null) return undefined;
    if (i === 1) return "correct";
    if (i === choice) return "wrong";
    return undefined;
  };

  return (
    <Shell>
      <Stack gap="lg">
        <Kicker>◆ Design system · Savanna Signal v1.2</Kicker>
        <h1 className="t-display-1">
          Editorial <em>arcade</em><br />
          <u>classroom</u> stack.
        </h1>
        <p className="t-body-lg">
          Every primitive rendering at once. Toggle theme + role to verify dark/light and hero swaps.
        </p>
        <Row>
          <Button onClick={flipTheme}>Theme: {theme}</Button>
          <Button variant="hero" onClick={flipRole}>Role: {role}</Button>
        </Row>

        <SectionHead num="01" title="Buttons" meta="7 variants × 3 sizes" />
        <ButtonRow>
          <Button>Default</Button>
          <Button variant="hero">Hero CTA</Button>
          <Button variant="coral">Destructive</Button>
          <Button variant="cobalt">Cobalt</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="pixel">Pixel</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </ButtonRow>
        <ButtonRow>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg" variant="hero">Large</Button>
        </ButtonRow>

        <SectionHead num="02" title="Chips" />
        <Row>
          <Chip dot>Default</Chip>
          <Chip tone="lime" dot>Lime</Chip>
          <Chip tone="coral" dot>Coral</Chip>
          <Chip tone="cobalt" dot>Cobalt</Chip>
          <Chip tone="hazard" dot>Hazard</Chip>
          <Chip tone="ghost">Ghost</Chip>
          <Chip tone="ink">Ink</Chip>
        </Row>

        <SectionHead num="03" title="Cards" />
        <div className="sv-grid-4">
          <Card title="Standard" subtitle="Default paper card" />
          <Card variant="raised" title="Raised" subtitle="5px offset shadow" />
          <Card variant="dark" title="Dark" subtitle="Ink surface" />
          <Card variant="signal-lime" title="Signal" subtitle="Hero event card" />
        </div>

        <SectionHead num="04" title="Ticket" meta="Signature lesson component" />
        <div className="sv-grid-3">
          <Ticket
            stubLabel="Unit 03"
            stubNum="07"
            stubFoot="24 min"
            eyebrow={<><Chip tone="lime" dot>Due Today</Chip><Chip>Lab</Chip></>}
            title="Static electricity — rubbing balloons"
            desc="Six-station investigation to ladder observations into a general rule."
            foot={<><span>P1 · 8:00 AM</span><span>+50 XP</span></>}
          />
          <Ticket
            variant="coral"
            stubLabel="Unit 02"
            stubNum="04"
            stubFoot="Overdue"
            eyebrow={<Chip tone="coral" dot>Overdue</Chip>}
            title="Momentum evidence log"
            desc="Submit your evidence with reasoning for weeks 5–6."
            foot={<><span>Was due 4/18</span><span>+30 XP</span></>}
          />
          <Ticket
            variant="dark"
            stubLabel="Field"
            stubNum="F"
            stubFoot="Optional"
            eyebrow={<Chip tone="hazard" dot>Quick Read</Chip>}
            title="Why electrons (not protons) move"
            desc="5-minute read. Your field-book fodder before Thursday."
            foot={<><span>+10 XP</span><span>·</span></>}
          />
        </div>

        <SectionHead num="05" title="Scoreboard + Mana" />
        <div className="sv-grid-2">
          <Scoreboard
            big="1,240"
            label="Total XP"
            delta="+85 this week"
            ticks={Array.from({ length: 14 }, (_, i) => i < 10 ? 'on' : i === 11 ? 'warm' : 'off')}
          />
          <Card variant="raised">
            <Stack>
              <Mana count={250} tone="cobalt" />
              <Mana count={50} tone="hazard" />
              <Mana count={12} tone="coral" />
            </Stack>
          </Card>
        </div>

        <SectionHead num="06" title="Progress primitives" />
        <Stack>
          <ProgressBar value={0.6} max={1} label="Lesson progress" />
          <ProgressBar value={0.3} max={1} variant="coral" />
          <ProgressBar value={0.85} max={1} variant="cobalt" />
          <ProgressBar value={0.4} max={1} variant="striped" />
          <ProgressDots total={7} done={4} activeIndex={4} />
          <Trail
            nodes={[
              { label: '1', state: 'done' },
              { label: '2', state: 'done' },
              { label: '3', state: 'done' },
              { label: '4', state: 'now' },
              { label: '5', state: 'pending' },
              { label: 'B', state: 'boss' },
            ]}
          />
        </Stack>

        <SectionHead num="07" title="Medals + Stamps" />
        <Row>
          <Medal value="A" label="Gold" />
          <Medal value="B" color="lime" label="Lime" />
          <Medal value="C" color="coral" label="Coral" />
          <Medal value="★" size="sm" />
        </Row>
        <Row>
          <Stamp text="◆ Verified" tone="verified" />
          <Stamp text="⚠ Late" tone="late" />
          <Stamp text="⚔ Boss" tone="boss" />
        </Row>

        <SectionHead num="08" title="Avatars" meta="Wrap your pixel art" />
        <Row>
          <AvatarFrame>LM</AvatarFrame>
          <AvatarFrame tone="coral" shape="rnd">JS</AvatarFrame>
          <AvatarFrame tone="cobalt">AR</AvatarFrame>
          <AvatarFrame tone="hazard" size="sm">KP</AvatarFrame>
          <AvatarFrame tone="ink" size="lg">◆</AvatarFrame>
        </Row>

        <SectionHead num="09" title="Callouts" />
        <Stack>
          <Callout tone="info" title="Class tip">Use the rotating stand before anything else.</Callout>
          <Callout tone="warn" title="Heads up">Van de Graaff needs a 15-minute warm-up.</Callout>
          <Callout tone="danger" title="Stop">This tape was flagged by legal — rebuild without personal data.</Callout>
          <Callout tone="success" title="Nice">Your streak is safe. We don't punish weekends.</Callout>
        </Stack>

        <SectionHead num="10" title="Hazard band + Toast" />
        <Stack>
          <HazardBand inner="Boss">Boss battle in 12:04</HazardBand>
          <HazardBand variant="coral" inner="Late">Your evidence log is 2 days overdue</HazardBand>
          <Button onClick={() => setShowToast(true)}>Fire a toast</Button>
          {showToast && (
            <div className="sv-toast-stack">
              <Toast duration={3000} onDismiss={() => setShowToast(false)}>
                Saved · +25 XP
              </Toast>
            </div>
          )}
        </Stack>

        <SectionHead num="11" title="Quiz + Choice" />
        <QuizCard qNo={3} total={7} prompt="Which statement best explains why a balloon picks up paper after being rubbed on hair?">
          {["The balloon gains protons", "The balloon gains electrons", "The paper gains mass", "The balloon emits photons"].map((text, i) => (
            <Choice
              key={i}
              letter={String.fromCharCode(65 + i)}
              state={choiceState(i)}
              reveal={choiceState(i) === 'correct' ? '◆ Correct' : choiceState(i) === 'wrong' ? '◆ Not quite' : null}
              onClick={() => setChoice(i)}
            >{text}</Choice>
          ))}
        </QuizCard>

        <SectionHead num="12" title="Topnav" />
        <Topnav
          brand={<TopnavBrand glyph="P">PantherLearn</TopnavBrand>}
          links={
            <>
              <a href="#" className="active">Dashboard</a>
              <a href="#">Character</a>
              <a href="#">Grades</a>
              <a href="#">Mana</a>
            </>
          }
          rightSlot={<Mana count={250} />}
        />
        <Topnav
          dark
          brand={<TopnavBrand glyph="T">PantherLearn</TopnavBrand>}
          links={
            <>
              <a href="#" className="active">Grading</a>
              <a href="#">Progress</a>
              <a href="#">Rosters</a>
            </>
          }
          rightSlot={<Chip tone="lime" dot>3 pending</Chip>}
        />

        <SectionHead num="13" title="Forms" />
        <div className="sv-grid-2">
          <Field label="Full name" htmlFor="sv-name">
            <Input id="sv-name" placeholder="Jamie Student" />
          </Field>
          <Field label="Period" htmlFor="sv-period">
            <Select id="sv-period" defaultValue="1">
              <option value="1">Period 1 · Physics</option>
              <option value="3">Period 3 · DigLit</option>
              <option value="4">Period 4 · AI Lit</option>
            </Select>
          </Field>
          <Field label="Evidence note" htmlFor="sv-note" className="sv-grid-2-span">
            <Textarea id="sv-note" placeholder="What did you observe?" />
          </Field>
          <Field label="Effort" htmlFor="sv-effort">
            <RadioRow
              name="effort"
              value={radio}
              onChange={setRadio}
              options={[
                { value: 'satisfactory', label: 'Satisfactory' },
                { value: 'proficient', label: 'Proficient' },
                { value: 'exemplary', label: 'Exemplary' },
              ]}
            />
          </Field>
        </div>

        <SectionHead num="14" title="Leaderboard" />
        <Leaderboard
          meIndex={2}
          rows={[
            { rank: 1, avatar: <AvatarFrame tone="coral" size="sm">AS</AvatarFrame>, name: 'Aiyana S.', meta: 'P4', xp: '1,420 XP', dots: [true,true,true,true,true,true,true] },
            { rank: 2, avatar: <AvatarFrame tone="cobalt" size="sm">MR</AvatarFrame>, name: 'Marcus R.', meta: 'P4', xp: '1,385 XP', dots: [true,true,true,true,true,true,false] },
            { rank: 3, avatar: <AvatarFrame tone="hazard" size="sm">LM</AvatarFrame>, name: 'You', meta: 'P4', xp: '1,240 XP', dots: [true,true,true,true,true,false,false] },
            { rank: 4, avatar: <AvatarFrame size="sm">JK</AvatarFrame>, name: 'Jordan K.', meta: 'P4', xp: '1,180 XP', dots: [true,true,true,true,false,false,false] },
            { rank: 5, avatar: <AvatarFrame tone="ink" size="sm">PS</AvatarFrame>, name: 'Priya S.', meta: 'P4', xp: '1,105 XP', dots: [true,true,true,false,false,false,false] },
          ]}
        />

        <SectionHead num="15" title="Viz primitives" />
        <div className="sv-grid-2">
          <Card title="Weekly accuracy"><BarSeries data={[42,58,65,71,68,79,82,88,94]} ariaLabel="9 weeks" /></Card>
          <Card title="Error rate trend"><Sparkline data={[0.22, 0.18, 0.24, 0.17, 0.12, 0.14, 0.09, 0.07]} /></Card>
          <Card title="Streak 4 weeks">
            <DotMatrix data={Array.from({ length: 28 }, (_, i) => i % 3 !== 2 && i < 23)} />
          </Card>
          <Card title="Class answer split">
            <StackedBar segments={[
              { value: 72, label: 'Correct', tone: '' },
              { value: 18, label: 'Unsure', tone: 'warn' },
              { value: 10, label: 'Wrong', tone: 'danger' },
            ]} />
          </Card>
        </div>

        <SectionHead num="16" title="Imagery placeholder" />
        <div className="sv-grid-3">
          <ImagePlaceholder label="4:3" />
          <ImagePlaceholder label="Video 16:9" ratio="16/9" />
          <ImagePlaceholder label="Square" ratio="1/1" />
        </div>

        <SectionHead num="17" title="Tape ribbon" />
        <Tape items={["Classroom synced", "AI-ready", "Perth Amboy HS", "v2026"]} />

      </Stack>
    </Shell>
  );
}
