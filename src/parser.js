import { markdownToBlocks } from '@tryfabric/martian';
import TurndownService from 'turndown';

function htmlToMarkdownJSON(htmlContent) {
  try {
    const turndownService = new TurndownService();
    return turndownService.turndown(htmlContent);
  } catch (error) {
    console.error(error);
    return {};
  }
}

function jsonToNotionBlocks(markdownContent) {
  return markdownToBlocks(markdownContent);
}

export default function htmlToNotionBlocks(htmlContent) {
  const imageUrlRegex = /(http(s?):).*\.(?:jpg|jpeg|webp|gif|png)/gi;

  const markdownContent = htmlToMarkdownJSON(htmlContent);
  const notionBlocks = jsonToNotionBlocks(markdownContent);
  const notionBlocksWithImages = notionBlocks.map((block) => {
    if (block.type === 'paragraph') {
      if (imageUrlRegex.test(block.paragraph.text[0].text.content)) {
        return {
          type: 'image',
          image: {
            type: 'external',
            external: {
              url: block.paragraph.text[0].text.content,
            },
          },
        };
      }
    }
    return block;
  });
  return notionBlocksWithImages;
}
