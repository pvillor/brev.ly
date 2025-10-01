import { db, pg } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { uploadFileToStorage } from "@/infra/storage/upload-file-to-storage"
import { stringify } from "csv-stringify"
import { PassThrough } from "node:stream"
import { pipeline } from "node:stream/promises"

export async function exportLinks() {
  const { sql, params } = db
    .select()
    .from(schema.links)
    .toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(50)

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'original_url', header: 'Original URL' },
      { key: 'short_url_suffix', header: 'Short URL' },
      { key: 'access_count', header: 'Access Count' },
      { key: 'created_at', header: 'Created at' },
    ]
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCSVPipeline =  pipeline(
    cursor,
    csv,
    uploadToStorageStream
  )

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: `${new Date().toISOString()}-uploads.csv`,
    contentStream: uploadToStorageStream
  })

  const [{ url }] = await Promise.all([
    uploadToStorage,
    convertToCSVPipeline,
  ])

  return { fileUrl: url }
}
