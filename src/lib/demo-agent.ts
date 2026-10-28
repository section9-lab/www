import type { DemoPlan, DemoWorkspace } from '../types/terminal'

function unquote(value: string) {
  const text = value.trim()
  return /^("[\s\S]*"|'[\s\S]*')$/.test(text) ? text.slice(1, -1) : text
}

// A deterministic preview planner. No prompts or file contents leave the browser.
export function planDemoTask(input: string, workspace: DemoWorkspace): DemoPlan {
  const text = input.trim()
    .replace(/^(?:(?:please\s+|can you\s+|could you\s+|帮我|请)\s*)+/i, '')
    .replace(/^(write|create)\s+(?:a\s+|the\s+)?(?:file\s+)?/i, '$1 ')
    .replace(/^(read|show|open)\s+(?:the\s+)?file\s+/i, '$1 ')
    .replace(/^(创建|新建|写入)(?:一个|个)?\s*/, '$1 ')
  const filePattern = '("[^"\\n]+"|\'[^\'\\n]+\'|[^\\s:：，,]+)'
  const write = text.match(new RegExp(`^(?:write|create|写入|创建|新建)\\s*${filePattern}(?:\\s*(?:[,，]?\\s*内容(?:为|是|：|:)?|with(?:\\s+(?:the\\s+)?content)?|containing|写入|:|：|,|，)\\s*)([\\s\\S]+)$`, 'i'))
  if (write) {
    const path = unquote(write[1]).replace(/(\.[a-z0-9]+)文件$/i, '$1')
    const content = unquote(write[2]).replaceAll('\\n', '\n') + '\n'
    return { introduction: `I’ll write ${path}, then read it back.`, actions: [{ kind: 'write', path, content }, { kind: 'read', path }], answer: `Wrote ${path} and verified its contents. You can inspect it with !cat ${path}.` }
  }
  const edit = text.match(new RegExp(`^(?:edit|修改)\\s+${filePattern}\\s+(?:replace|把|将)\\s+["']([^"']+)["']\\s+(?:with|替换为|改为)\\s+["']([^"']*)["']`, 'i'))
  if (edit) return { introduction: `I’ll update ${unquote(edit[1])}.`, actions: [{ kind: 'edit', path: unquote(edit[1]), before: edit[2], after: edit[3] }], answer: `Updated ${unquote(edit[1])}. Run !git diff to review the change.` }
  const read = text.replace(/\s*(?:文件)?的内容[。]?$/, '').match(new RegExp(`^(?:read|show|open|读取|查看|打开)\\s*${filePattern}\\s*$`, 'i'))
  if (read) return { introduction: `I’ll read ${unquote(read[1])}.`, actions: [{ kind: 'read', path: unquote(read[1]) }], answer: `Here are the contents of ${unquote(read[1])}.` }
  if (/^(?:run\s+)?(?:the\s+)?tests?$|^(?:运行|执行|跑一下)(?:所有)?测试[。！!]?$/i.test(text)) return { introduction: 'I’ll check the test file and run the suite.', actions: [{ kind: 'read', path: 'tests/greeting.test.ts' }, { kind: 'bash', command: 'npm test' }], answer: 'The demo test suite passed. The greeting tests are ready for review.' }
  const command = text.startsWith('!') ? text.slice(1).trim() : text.replace(/^(?:run|execute|bash)\s+|^(?:运行|执行)(?:命令)?\s*/i, '')
  if (text.startsWith('!') || command !== text || /^(?:pwd|ls|cat|head|tail|wc|find|grep|rg|echo|printf|mkdir|touch|cp|mv|rm|tee|sed|git|npm|pnpm|bun|cd)\b/.test(text)) {
    return { introduction: 'I’ll run the command in the preview workspace.', actions: [{ kind: 'bash', command }], answer: 'Done. The command output is shown above.' }
  }
  if (/列出|有哪些文件|list.*files|show.*files/i.test(text)) return { introduction: 'I’ll list the project files.', actions: [{ kind: 'bash', command: 'ls' }], answer: 'These files are available in the preview workspace.' }
  if (/项目|project|了解|介绍|explain|review/i.test(text)) return { introduction: 'I’ll read the project overview and package scripts.', actions: [{ kind: 'read', path: 'README.md' }, { kind: 'read', path: 'package.json' }], answer: `This workspace contains a small greeting module and tests, plus a sample vibe hud conversation parser. There are ${Object.keys(workspace.files).length} files. Try “Write notes.txt: Hello”, “Read notes.txt”, or “Run npm test”.` }
  if (/^(?:hi|hello|hey|你好|您好)[!！。.]?$/i.test(text)) return { introduction: '', actions: [], answer: '你好！可以让我读取项目文件、创建或修改文件、运行预览 Bash 命令。试试：创建 hello.txt 内容为 你好世界，或输入 /help 查看示例。' }
  return { introduction: '', actions: [], answer: 'This interactive preview supports file reads, writes, edits, and common shell commands. Try “Read README.md”, “Write notes.txt: Hello”, “Edit notes.txt replace "Hello" with "Hi"”, or “!ls”. Type /help for more examples.' }
}
