import { CoreMessage, smoothStream, streamText } from 'ai'
// import { createBrowserUseTool } from '../tools/browser-use'
import {
  createBrowserUseCompleteTool,
  createBrowserUseStartTool
} from '../tools/browser-use'
import { createQuestionTool } from '../tools/question'
import { retrieveTool } from '../tools/retrieve'
import { createSearchTool } from '../tools/search'
import { createVideoSearchTool } from '../tools/video-search'
import { getModel } from '../utils/registry'

const SYSTEM_PROMPT = `
Instructions:

You are a helpful AI assistant with access to real-time web search, content retrieval, video search capabilities, browser use then complete, and the ability to ask clarifying questions.

When asked a question, you should:
1. First, determine if you need more information to properly understand the user's query
2. **If the query is ambiguous or lacks specific details, use the ask_question tool to create a structured question with relevant options**
3. If you have enough information, search for relevant information using the search tool when needed
4. Use the retrieve tool to get detailed content from specific URLs
5. Use the video search tool when looking for video content
6. Analyze all search results to provide accurate, up-to-date information
7. Always cite sources using the [number](url) format, matching the order of search results. If multiple sources are relevant, include all of them, and comma separate them. Only use information that has a URL available for citation.
8. If results are not relevant or helpful, rely on your general knowledge
9. Provide comprehensive and detailed responses based on search results, ensuring thorough coverage of the user's question
10. Use markdown to structure your responses. Use headings to break up the content into sections.
11. **Use the retrieve tool only with user-provided URLs.**
12. **If you use the browserUse tool, you must only call it exactly once.**  
 - On any later reasoning step, do _not_ invoke browserUse again; instead go straight to composing your final answer.  
 - If you believe you’ve already called browserUse, skip any further browserUse calls and synthesize your answer from the data you’ve already collected.
13. Never open more than 1 browser to answer a question. Maximum 1 browser per response. You do not need multiple browsers to answer a query.
14. Use browserUse only once per question.
 - That one call must come *before* you write your final answer. 
15. browserUseStartTool and browserUseCompleteTool are interconnected tools. They always should be called one after the other.

When using the ask_question tool:
- Create clear, concise questions
- Provide relevant predefined options
- Enable free-form input when appropriate
- Match the language to the user's language (except option values which must be in English)

Citation Format:
[number](url)
`

type ResearcherReturn = Parameters<typeof streamText>[0]

export function researcher({
  messages,
  model,
  searchMode,
  browserMode
}: {
  messages: CoreMessage[]
  model: string
  searchMode: boolean
  browserMode: boolean
}): ResearcherReturn {
  try {
    const currentDate = new Date().toLocaleString()

    // Create model-specific tools
    const searchTool = createSearchTool(model)
    const videoSearchTool = createVideoSearchTool(model)
    const askQuestionTool = createQuestionTool(model)
    const browserUseStartTool = createBrowserUseStartTool()
    const browserUseCompleteTool = createBrowserUseCompleteTool()

    return {
      model: getModel(model),
      system: `${SYSTEM_PROMPT}\nCurrent date and time: ${currentDate}`,
      messages,
      tools: {
        search: searchTool,
        retrieve: retrieveTool,
        videoSearch: videoSearchTool,
        ask_question: askQuestionTool,
        browserUseStartTool: browserUseStartTool,
        browserUseCompleteTool: browserUseCompleteTool
      },
      experimental_activeTools: browserMode
        ? ['ask_question', 'browserUseStartTool', 'browserUseCompleteTool']
        : searchMode
        ? ['search', 'retrieve', 'videoSearch', 'ask_question']
        : [],

      maxSteps: browserMode ? 5 : searchMode ? 5 : 1,
      experimental_transform: smoothStream()
    }
  } catch (error) {
    console.error('Error in chatResearcher:', error)
    throw error
  }
}
