"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

type Artifact = {
  id: string
  type: "html" | "table"
  content: string | any
}

type ArtifactPreviewProps = {
  artifacts: Artifact[]
}

function AutoResizeIframe({ html, id }: { html: string; id: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const updateHeight = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) return

        iframe.style.height = doc.body.scrollHeight + "px"
      } catch (e) {
        console.error("iframe resize error", e)
      }
    }

    iframe.onload = updateHeight
    setTimeout(updateHeight, 500)
  }, [html])

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      className="w-full rounded-lg border-0"
      style={{ height: "20px" }}
      sandbox="allow-scripts allow-same-origin"
      title={`HTML Preview ${id}`}
    />
  )
}

function TableDisplay({ data }: { data: any }) {
  // Handle different table formats
  if (!data) return <div className="p-4 text-gray-500">No table data</div>

  // If data has headers and rows
  if (data.headers && data.rows) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {data.headers.map((header: string, idx: number) => (
                <th key={idx} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row: any[], rowIdx: number) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {row.map((cell: any, cellIdx: number) => (
                  <td key={cellIdx} className="border border-gray-300 px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // If data is an array of objects
  if (Array.isArray(data) && data.length > 0) {
    const headers = Object.keys(data[0])
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, idx) => (
                <th key={idx} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, rowIdx: number) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {headers.map((header, cellIdx) => (
                  <td key={cellIdx} className="border border-gray-300 px-4 py-2">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return <div className="p-4 text-gray-500">Unsupported table format</div>
}

export function ArtifactPreview({ artifacts }: ArtifactPreviewProps) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set())

  const toggleCollapse = (id: string) => {
    setCollapsedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="flex-1 bg-green-100 rounded-3xl border-6 border-green-100 overflow-y-auto">
      {artifacts.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-green-300">생성된 아티팩트는 이곳에 표시됩니다.</p>
        </div>
      ) : (
        <div className="space-y-4 p-4">
          {artifacts.map((artifact) => (
            <div key={artifact.id} className="bg-white rounded-xl">
              <button
                onClick={() => toggleCollapse(artifact.id)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {artifact.id}. {artifact.type === "html" ? "HTML" : "테이블"} 
                </span>
                {collapsedIds.has(artifact.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {!collapsedIds.has(artifact.id) && (
                <div className="p-2">
                  {artifact.type === "html" ? (
                    <AutoResizeIframe html={artifact.content as string} id={artifact.id} />
                  ) : (
                    <TableDisplay data={artifact.content} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
