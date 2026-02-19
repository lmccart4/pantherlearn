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
import HighlightableBlock from "./HighlightableBlock";
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
};

const HIGHLIGHTABLE = new Set(["text", "callout", "definition", "activity", "objectives", "vocab_list"]);

export default function BlockRenderer({ block, extraProps = {} }) {
  const Component = BLOCK_MAP[block.type];
  if (!Component) return null;

  if (block.type === "divider") {
    return <DividerBlock />;
  }

  // Extract highlight props before passing the rest to the component
  const { highlights, onHighlight, ...blockProps } = extraProps;

  const rendered = (
    <ErrorBoundary>
      <Component block={block} {...blockProps} />
    </ErrorBoundary>
  );

  // Wrap highlightable blocks when highlight props are provided
  if (HIGHLIGHTABLE.has(block.type) && onHighlight) {
    return (
      <HighlightableBlock
        blockId={block.id}
        highlights={highlights || []}
        onHighlight={onHighlight}
      >
        {rendered}
      </HighlightableBlock>
    );
  }

  return rendered;
}
