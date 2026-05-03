/**
 * 开发环境：将原型批注保存写入 src/prd-tips/overrides/prd-tip-overrides.json，便于提交入库。
 * 生产构建无此中间件，批注以打包时的 JSON 为准。
 */
import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage } from 'node:http'
import type { Plugin } from 'vite'

const JSON_FILE = 'src/prd-tips/overrides/prd-tip-overrides.json'

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(Buffer.from(c)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

export function prdTipSavePlugin(root: string): Plugin {
  return {
    name: 'prd-tip-save',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split('?')[0] !== '/__prd-tip/save' || req.method !== 'POST') {
          return next()
        }
        try {
          const raw = await readBody(req)
          const body = JSON.parse(raw) as {
            key: string
            moduleName: string
            md: string
          }
          if (!body.key || typeof body.md !== 'string') {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: 'invalid payload' }))
            return
          }
          const filePath = path.join(root, JSON_FILE)
          let existing: Record<string, { moduleName?: string; md: string; updatedAt?: string }> = {}
          try {
            existing = JSON.parse(fs.readFileSync(filePath, 'utf8'))
          } catch {
            existing = {}
          }
          existing[body.key] = {
            moduleName: body.moduleName,
            md: body.md,
            updatedAt: new Date().toISOString(),
          }
          fs.mkdirSync(path.dirname(filePath), { recursive: true })
          fs.writeFileSync(filePath, `${JSON.stringify(existing, null, 2)}\n`, 'utf8')
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true }))
        } catch (e) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: String(e) }))
        }
      })
    },
  }
}
