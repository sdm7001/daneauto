#!/usr/bin/env node
/**
 * import-products.mjs
 *
 * Bulk-imports products.jsonl into the Supabase products table.
 *
 * Requirements:
 *   SUPABASE_SERVICE_ROLE_KEY — get from Supabase Dashboard → Settings → API
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... node scripts/import-products.mjs
 *
 * Options (env vars):
 *   PRODUCTS_JSONL  path to JSONL file   default: ../autoparts-scraper/scrape-output/products.jsonl
 *   BATCH_SIZE      rows per insert       default: 500
 *   START_LINE      skip N lines          default: 0  (for resuming)
 */

import { createClient } from '@supabase/supabase-js'
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = 'https://ujewsjvaofhfrfqdqphn.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_ROLE_KEY) {
  console.error('❌  SUPABASE_SERVICE_ROLE_KEY is required')
  console.error('   Get it from: Supabase Dashboard → Settings → API → service_role key')
  process.exit(1)
}

const JSONL_PATH = process.env.PRODUCTS_JSONL ??
  resolve(__dirname, '../../autoparts-scraper/scrape-output/products.jsonl')
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE ?? '500')
const START_LINE = parseInt(process.env.START_LINE ?? '0')

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

async function main() {
  console.log(`📦  Starting import from: ${JSONL_PATH}`)
  console.log(`    Batch size: ${BATCH_SIZE} | Skip first: ${START_LINE} lines\n`)

  let batch = []
  let lineNum = 0
  let inserted = 0
  let batchNum = 0
  let errors = 0
  const startTime = Date.now()

  const rl = createInterface({ input: createReadStream(JSONL_PATH) })

  for await (const line of rl) {
    lineNum++
    if (lineNum <= START_LINE) continue
    if (!line.trim()) continue

    let p
    try { p = JSON.parse(line) } catch { continue }

    batch.push({
      sku:              p.sku,
      description:      p.description ?? null,
      list_price:       p.listPrice ?? null,
      net_price:        p.netPrice ?? null,
      oem_number:       p.oemNumber ?? null,
      partslink_number: p.partslinkNumber ?? null,
      image_url:        p.imageUrl ?? null,
      certification:    p.certification ?? null,
      year:             p.year,
      make:             p.make,
      model:            p.model,
      product_line:     p.productLine,
      scraped_at:       p.scrapedAt ?? null,
    })

    if (batch.length >= BATCH_SIZE) {
      batchNum++
      const { error } = await supabase.from('products').insert(batch)
      if (error) {
        console.error(`❌  Batch ${batchNum} failed (line ${lineNum}):`, error.message)
        errors++
        if (errors > 5) { console.error('Too many errors — aborting'); break }
      } else {
        inserted += batch.length
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
        const rate = Math.round(inserted / (elapsed || 1))
        process.stdout.write(`\r✅  ${inserted.toLocaleString()} inserted | batch ${batchNum} | ${rate}/s | line ${lineNum.toLocaleString()}`)
      }
      batch = []
    }
  }

  // Final partial batch
  if (batch.length > 0) {
    const { error } = await supabase.from('products').insert(batch)
    if (error) {
      console.error('\n❌  Final batch failed:', error.message)
    } else {
      inserted += batch.length
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`\n\n🎉  Import complete: ${inserted.toLocaleString()} products in ${elapsed}s`)
  if (errors > 0) console.log(`⚠️   Errors: ${errors} batches failed`)
  console.log(`\n   Run this to verify:`)
  console.log(`   curl "${SUPABASE_URL}/rest/v1/products?select=count" -H "apikey: <anon-key>"`)
}

main().catch(err => { console.error(err); process.exit(1) })
