"use client"
import { Codesandbox, Loader2, Table } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
  words?: string[]
  imageUrl?: string
  htmlContent?: string
  htmlId?: string
  tableId?: string
}

interface ChatMessageProps {
  message: Message
  isStreaming: boolean
  isLastMessage: boolean
  onHtmlClick?: (htmlId: string) => void
}

export function ChatMessage({ message, isStreaming, isLastMessage, onHtmlClick }: ChatMessageProps) {
  const isLoading =
    message.role === "assistant" &&
    isStreaming &&
    isLastMessage &&
    (!message.content || message.content.trim() === "") &&
    (!message.words || message.words.length === 0)

  return (
    <div
      className={`flex gap-3 mb-4 ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`rounded-3xl px-1 py-1 ${
          message.role === "user"
            ? "max-w-3xl bg-yellow-50 text-gray-800"
            : "w-full max-w-[1000px] bg-transparent text-gray-800"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-base">생각 중...</span>
          </div>
        ) : (
          <>
            {message.imageUrl && (
              <div className="mb-4">
                <img
                  src={message.imageUrl || "/placeholder.svg"}
                  alt="AI generated"
                  className="w-full max-w-[800px] rounded-2xl"
                />
              </div>
            )}

            {message.htmlId && (
              <div className="mb-4">
                <button
                  onClick={() => onHtmlClick?.(message.htmlId!)}
                  className="flex items-center gap-2 px-4 py-2 
                  bg-gradient-to-b from-green-50 to-green-200
                  hover:from-green-200 hover:to-green-200
                  border-2 border-green-300 rounded-3xl transition-colors cursor-pointer"
                >
                  <Codesandbox className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">HTML 아티팩트 생성됨</span>
                </button>
              </div>
            )}

            {message.tableId && (
              <div className="mb-4">
                <button
                  onClick={() => onHtmlClick?.(message.tableId!)}
                  className="flex items-center gap-2 px-4 py-2 
                  bg-gradient-to-b from-blue-50 to-blue-200
                  hover:from-blue-200 hover:to-blue-200
                  border-2 border-blue-300 rounded-3xl transition-colors cursor-pointer"
                >
                  <Table className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">테이블 아티팩트 생성됨</span>
                </button>
              </div>
            )}

            {message.role === "assistant" && message.words ? (
              <p className="text-base leading-relaxed whitespace-pre-wrap break-words text-gray-700">
                {message.words.map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    className="inline-block animate-word-fade-in"
                    style={{
                      animationDelay: `${wordIndex * 0.03}s`,
                      animationFillMode: "backwards",
                    }}
                  >
                    {word}
                  </span>
                ))}
                {isStreaming && isLastMessage && (
                  <span className="inline-block w-1 h-4 ml-1 bg-gray-400 animate-pulse" />
                )}
              </p>
            ) : (
              <p className="text-base leading-relaxed whitespace-pre-wrap break-words text-gray-700">
                {message.content}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
