"use client"

import type React from "react"

type Message = {
  role: "user" | "assistant"
  content: string
  words?: string[]
  imageUrl?: string
  htmlContent?: string
}

interface ChatMessageProps {
  message: Message
  isStreaming: boolean
  isLastMessage: boolean
  onIframeLoad: (event: React.SyntheticEvent<HTMLIFrameElement>) => void
}

export function ChatMessage({ message, isStreaming, isLastMessage, onIframeLoad }: ChatMessageProps) {
  return (
    <div
      className={`flex gap-3 mb-6 ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`rounded-3xl px-2 py-2 ${
          message.role === "user"
            ? "max-w-3xl bg-yellow-50 text-gray-800 shadow-md"
            : "w-full max-w-[1000px] bg-white text-gray-800 shadow-lg"
        }`}
      >
        {message.imageUrl && (
          <div className="mb-4">
            <img
              src={message.imageUrl || "/placeholder.svg"}
              alt="AI generated"
              className="w-full max-w-[800px] rounded-2xl"
            />
          </div>
        )}

        {message.htmlContent && (
          <div className="mb-4 w-full">
            <iframe
              srcDoc={message.htmlContent}
              className="w-full rounded-2xl border-0"
              style={{ width: "100%", maxWidth: "800px", minHeight: "400px" }}
              sandbox="allow-scripts allow-same-origin"
              title="HTML Content"
              onLoad={onIframeLoad}
            />
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
            {isStreaming && isLastMessage && <span className="inline-block w-1 h-4 ml-1 bg-gray-400 animate-pulse" />}
          </p>
        ) : (
          <p className="text-base leading-relaxed whitespace-pre-wrap break-words text-gray-700">{message.content}</p>
        )}
      </div>
    </div>
  )
}
