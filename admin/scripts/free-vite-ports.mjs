/**
 * 释放本机 admin Vite 常用端口（5180 固定 dev；历史版本曾落到 5181/5182）。
 * 在 `npm run dev` 前执行，避免 strictPort 因端口占用启动失败。
 */
import { execSync } from 'node:child_process'

const ports = [5180, 5181, 5182]

for (const port of ports) {
  let out = ''
  try {
    out = execSync(`lsof -tiTCP:${port} -sTCP:LISTEN`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    continue
  }
  const pids = [...new Set(out.split(/\s+/).filter(Boolean))]
  for (const pid of pids) {
    try {
      process.kill(Number(pid), 'SIGKILL')
    } catch {
      /* 进程已退出或无权限 */
    }
  }
}
