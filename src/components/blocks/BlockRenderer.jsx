// src/components/blocks/BlockRenderer.jsx
import TextBlock from "./TextBlock";
import VideoBlock from "./VideoBlock";
import QuestionBlock from "./QuestionBlock";
import ChatbotBlock from "./ChatbotBlock";
import DefinitionBlock from "./DefinitionBlock";
import CalloutBlock from "./CalloutBlock";
import ObjectivesBlock from "./ObjectivesBlock";
import ActivityBlock from "./ActivityBlock";
import VocabListBlock from "./VocabListBlock";
import SectionHeader from "./SectionHeader";
import ImageBlock from "./ImageBlock";
import ChecklistBlock from "./ChecklistBlock";
import EmbedBlock from "./EmbedBlock";
import DividerBlock from "./DividerBlock";
import SortingBlock from "./SortingBlock";
import ExternalLinkBlock from "./ExternalLinkBlock";
import CalculatorBlock from "./CalculatorBlock";
import DataTableBlock from "./DataTableBlock";
import SimulationBlock from "./SimulationBlock";
import EvidenceUploadBlock from "./EvidenceUploadBlock";
import BarChartBlock from "./BarChartBlock";
import SketchBlock from "./SketchBlock";
import GuessWhoBlock from "./GuessWhoBlock";
import ChatbotWorkshopBlock from "./ChatbotWorkshopBlock";
import BiasDetectiveBlock from "./BiasDetectiveBlock";
import EmbeddingExplorerBlock from "./EmbeddingExplorerBlock";
import SpaceRescueBlock from "./SpaceRescueBlock";
import ExternalActivityBlock from "./ExternalActivityBlock";
import RocketStagingBlock from "./RocketStagingBlock";
import ConceptBuilderBlock from "./ConceptBuilderBlock";
import MomentumMysteryLabBlock from "./MomentumMysteryLabBlock";
import ErrorBoundary from "./ErrorBoundary";

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
};

export default function BlockRenderer({ block, extraProps = {} }) {
  const Component = BLOCK_MAP[block.type];
  if (!Component) return null;

  if (block.type === "divider") {
    return <DividerBlock />;
  }

  return (
    <ErrorBoundary>
      <Component block={block} {...extraProps} />
    </ErrorBoundary>
  );
}
