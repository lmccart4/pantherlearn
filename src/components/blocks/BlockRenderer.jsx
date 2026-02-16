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
  chatbot: ChatbotBlock,
  question: QuestionBlock,
};

export default function BlockRenderer({ block, extraProps = {} }) {
  const Component = BLOCK_MAP[block.type];
  if (!Component) return null;

  if (block.type === "divider") {
    return <DividerBlock />;
  }

  return <Component block={block} {...extraProps} />;
}