import { readFileSync } from "node:fs"
import { join } from "node:path"
import { inflateSync } from "node:zlib"
import { Font } from "@react-pdf/renderer"

const referencePdf = join(process.cwd(), "docs/resume-pdf/MinimalistaNeutro.pdf")
const pdfBuffer = readFileSync(referencePdf)
const pdfText = pdfBuffer.toString("latin1")
const objects = new Map<string, string>()

for (const match of pdfText.matchAll(/(\d+) 0 obj([\s\S]*?)endobj/g)) {
  objects.set(match[1], match[2])
}

const getFontSource = (baseFont: string) => {
  const fontObject = [...objects.entries()].find(([, value]) => value.includes(`/BaseFont /${baseFont}`))
  const descendantId = fontObject?.[1].match(/\/DescendantFonts\s+\[(\d+)\s+0\s+R\]/)?.[1]
  const descendant = descendantId ? objects.get(descendantId) : undefined
  const descriptorId = descendant?.match(/\/FontDescriptor\s+(\d+)\s+0\s+R/)?.[1]
  const fontFileId = descriptorId ? objects.get(descriptorId)?.match(/\/FontFile2\s+(\d+)\s+0\s+R/)?.[1] : undefined

  if (!fontFileId) {
    throw new Error(`Embedded font ${baseFont} was not found in the resume reference`)
  }

  const objectStart = pdfText.indexOf(`${fontFileId} 0 obj`)
  const streamStart = pdfBuffer.indexOf(10, pdfText.indexOf("stream", objectStart)) + 1
  const streamEnd = pdfBuffer.indexOf(Buffer.from("endstream"), streamStart)
  const compressed = pdfBuffer.subarray(streamStart, streamEnd)
  const fontData = inflateSync(compressed[compressed.length - 1] === 10 ? compressed.subarray(0, -1) : compressed)

  return `data:font/ttf;base64,${fontData.toString("base64")}`
}

Font.register({
  family: "ResumePoppins",
  fonts: [
    { src: getFontSource("AAAAAA+Poppins-Bold"), fontWeight: 700 },
    { src: getFontSource("BAAAAA+Poppins-Regular"), fontWeight: 400 },
    { src: getFontSource("DAAAAA+Poppins-SemiBold"), fontWeight: 600 },
  ],
})

Font.register({
  family: "ResumeTimes",
  fonts: [
    { src: getFontSource("CAAAAA+TimesNRMTPro"), fontWeight: 400 },
    { src: getFontSource("EAAAAA+TimesNRMTPro-Bold"), fontWeight: 700 },
  ],
})
