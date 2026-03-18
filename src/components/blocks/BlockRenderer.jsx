// src/components/blocks/BlockRenderer.jsx
import { lazy, Suspense } from "react";
import TextBlock from "./TextBlock";
import DefinitionBlock from "./DefinitionBlock";
import CalloutBlock from "./CalloutBlock";
import ObjectivesBlock from "./ObjectivesBlock";
import SectionHeader from "./SectionHeader";
import DividerBlock from "./DividerBlock";
import ErrorBoundary from "./ErrorBoundary";

// Moderately common blocks — lazy-loaded to reduce initial parse cost
const VideoBlock = lazy(() => import("./VideoBlock"));
const QuestionBlock = lazy(() => import("./QuestionBlock"));
const ChatbotBlock = lazy(() => import("./ChatbotBlock"));
const ActivityBlock = lazy(() => import("./ActivityBlock"));
const VocabListBlock = lazy(() => import("./VocabListBlock"));
const ImageBlock = lazy(() => import("./ImageBlock"));
const ChecklistBlock = lazy(() => import("./ChecklistBlock"));
const EmbedBlock = lazy(() => import("./EmbedBlock"));
const ExternalLinkBlock = lazy(() => import("./ExternalLinkBlock"));
const CalculatorBlock = lazy(() => import("./CalculatorBlock"));
const DataTableBlock = lazy(() => import("./DataTableBlock"));
const EvidenceUploadBlock = lazy(() => import("./EvidenceUploadBlock"));
const ExternalActivityBlock = lazy(() => import("./ExternalActivityBlock"));
const ScoreTallyBlock = lazy(() => import("./ScoreTallyBlock"));

// Heavy / specialized blocks — lazy-loaded so they don't bloat the initial bundle
const SortingBlock = lazy(() => import("./SortingBlock"));
const SimulationBlock = lazy(() => import("./SimulationBlock"));
const BarChartBlock = lazy(() => import("./BarChartBlock"));
const SketchBlock = lazy(() => import("./SketchBlock"));
const GuessWhoBlock = lazy(() => import("./GuessWhoBlock"));
const ChatbotWorkshopBlock = lazy(() => import("./ChatbotWorkshopBlock"));
const BiasDetectiveBlock = lazy(() => import("./BiasDetectiveBlock"));
const EmbeddingExplorerBlock = lazy(() => import("./EmbeddingExplorerBlock"));
const SpaceRescueBlock = lazy(() => import("./SpaceRescueBlock"));
const RocketStagingBlock = lazy(() => import("./RocketStagingBlock"));
const ConceptBuilderBlock = lazy(() => import("./ConceptBuilderBlock"));
const MomentumMysteryLabBlock = lazy(() => import("./MomentumMysteryLabBlock"));

const BLOCK_MAP = {
  section_header: SectionHeader,
  text: TextBlock,
  video: VideoBlock,
  image: ImageBlock,
  definition: DefinitionBlock,
  callout: CalloutBlock,
  objectives: ObjectivesBlock,
  activity: ActivityBlock,
  vocab_list: VocabListBlock,
  checklist: ChecklistBlock,
  embed: EmbedBlock,
  divider: DividerBlock,
  sorting: SortingBlock,
  external_link: ExternalLinkBlock,
  calculator: CalculatorBlock,
  data_table: DataTableBlock,
  chatbot: ChatbotBlock,
  question: QuestionBlock,
  simulation: SimulationBlock,
  evidence_upload: EvidenceUploadBlock,
  bar_chart: BarChartBlock,
  sketch: SketchBlock,
  guess_who: GuessWhoBlock,
  chatbot_workshop: ChatbotWorkshopBlock,
  bias_detective: BiasDetectiveBlock,
  embedding_explorer: EmbeddingExplorerBlock,
  space_rescue: SpaceRescueBlock,
  prompt_duel: ExternalActivityBlock,
  recipe_bot: ExternalActivityBlock,
  ai_training_sim: ExternalActivityBlock,
  data_labeling_lab: ExternalActivityBlock,
  ai_ethics_courtroom: ExternalActivityBlock,
  rocket_staging: RocketStagingBlock,
  concept_builder: ConceptBuilderBlock,
  media_upload: EvidenceUploadBlock,  // alias — media_upload blocks use the same upload UI
  momentum_mystery_lab: MomentumMysteryLabBlock,
  score_tally: ScoreTallyBlock,
};

export default function BlockRenderer({ block, extraProps = {} }) {
  const Component = BLOCK_MAP[block.type];
  if (!Component) return null;

  if (block.type === "divider") {
    return <DividerBlock />;
  }

  return (
    <Suspense fallback={null}>
      <ErrorBoundary>
        <Component block={block} {...extraProps} />
      </ErrorBoundary>
    </Suspense>
  );
}
