import { createClient } from '/home/aiciv/projects/daneauto-audit/node_modules/@supabase/supabase-js/dist/index.mjs'
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'

const SUPABASE_URL = 'https://suiabbcajimwpvwhxuqh.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aWFiYmNhamltd3B2d2h4dXFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTI2ODk4NiwiZXhwIjoyMDkwODQ0OTg2fQ.nttwq1FZFG748FbP5K9iuKxzW8XO6A0J7N9VrWouD-w'
const JSONL = '/home/aiciv/projects/autoparts-scraper/scrape-output/products.jsonl'
const BATCH = 500

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

let batch = [], inserted = 0, batchNum = 0, errors = 0
const start = Date.now()

const rl = createInterface({ input: createReadStream(JSONL) })

for await (const line of rl) {
  if (!line.trim()) continue
  let p
  try { p = JSON.parse(line) } catch { continue }

  batch.push({
    sku: p.sku, description: p.description ?? null,
    list_price: p.listPrice ?? null, net_price: p.netPrice ?? null,
    oem_number: p.oemNumber ?? null, partslink_number: p.partslinkNumber ?? null,
    image_url: p.imageUrl ?? null, certification: p.certification ?? null,
    year: p.year, make: p.make, model: p.model, product_line: p.productLine,
    scraped_at: p.scrapedAt ?? null,
  })

  if (batch.length >= BATCH) {
    batchNum++
    const { error } = await supabase.from('products').insert(batch)
    if (error) {
      process.stderr.write(`\nBatch ${batchNum} error: ${error.message}\n`)
      errors++
      if (errors > 5) { process.stderr.write('Too many errors\n'); break }
    } else {
      inserted += batch.length
      const s = ((Date.now() - start) / 1000).toFixed(0)
      const rate = Math.round(inserted / (parseFloat(s) || 1))
      process.stdout.write(`\r${inserted.toLocaleString()} / 319,910 inserted | ${rate}/s | ${s}s elapsed`)
    }
    batch = []
  }
}

if (batch.length > 0) {
  const { error } = await supabase.from('products').insert(batch)
  if (!error) inserted += batch.length
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1)
console.log(`\nDONE: ${inserted.toLocaleString()} products in ${elapsed}s | errors: ${errors}`)
