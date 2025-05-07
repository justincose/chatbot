// lib/tools/browser-use.ts
import browserUseClient from '@/lib/browser/browserUseClient'
import { tool } from 'ai'
import { z } from 'zod'

/**
 * Step 1: start the BrowserUse job and return taskId + liveUrl immediately.
 */
export function createBrowserUseStartTool() {
  return tool({
    description: `
        Kick off a headless BrowserUse task.
        Polls until a liveUrl is available, then returns { taskId, liveUrl, status }.
      `,
    parameters: z.object({
      prompt: z
        .string()
        .describe('What you want the browser to navigate and extract')
    }),
    async execute({ prompt }) {
      // 1) launch
      const { data: start } = await browserUseClient.post('/run-task', {
        task: prompt
      })
      const taskId = start.id

      // 2) poll every 2s until live_url is non‐empty (or timeout after ~30s)
      let info: { live_url: string | null; status: string }
      const startMs = Date.now()
      do {
        await new Promise(r => setTimeout(r, 2000))
        const resp = await browserUseClient.get(`/task/${taskId}`)
        info = resp.data
        if (Date.now() - startMs > 30_000) {
          // give up after 30s
          break
        }
      } while (!info.live_url)

      return {
        taskId,
        liveUrl: info.live_url ?? '',
        status: info.status,
        result:
          'Browser Use is in action! Now call browserUseCompleteTool to receive your requested data.'
      }
    }
  })
}

/**
 * Step 2: given a taskId, poll its status until complete, then return the final output.
 */
export function createBrowserUseCompleteTool() {
  return tool({
    description: `
      Given a taskId from browserUseStart, poll until the BrowserUse job finishes,
      then return { taskId, status, result }.
    `,
    parameters: z.object({
      taskId: z.string().describe('The taskId returned by browserUseStart')
    }),
    async execute({ taskId }) {
      // poll every 2s until no longer "created" or "running"
      let status: string = 'created'
      while (status === 'created' || status === 'running') {
        await new Promise(r => setTimeout(r, 2000))
        const { data: s } = await browserUseClient.get(`/task/${taskId}/status`)
        status = s as string
      }

      // fetch final details
      const { data: info } = await browserUseClient.get(`/task/${taskId}`)
      const resultText =
        info.output?.trim().length > 0 ? info.output : 'No content extracted.'

      return {
        taskId,
        status,
        result: resultText
      }
    }
  })
}
