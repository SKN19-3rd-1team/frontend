"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { ChatEmptyState } from "@/components/chat-empty-state"

type Message = {
  role: "user" | "assistant"
  content: string
  words?: string[]
  imageUrl?: string
  htmlContent?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentAssistantMessageRef = useRef("")

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleIframeLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    const iframe = event.currentTarget
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (iframeDoc) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            try {
              const bodyHeight = iframeDoc.body?.scrollHeight || 0
              const docHeight = iframeDoc.documentElement?.scrollHeight || 0
              const height = Math.max(bodyHeight, docHeight)

              if (height > 0) {
                iframe.style.height = `${height + 20}px`
              } else {
                iframe.style.height = "400px"
              }
            } catch (error) {
              console.error("[v0] Failed to resize iframe:", error)
              iframe.style.height = "400px"
            }
          }, 100)
        })
      }
    } catch (error) {
      console.error("[v0] Failed to resize iframe:", error)
      iframe.style.height = "400px"
    }
  }

  const handleSend = () => {
    if (!input.trim() || isStreaming) return

    setError(null)
    const userMessage = input.trim()
    setInput("")

    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setMessages((prev) => [...prev, { role: "assistant", content: "", words: [] }])
    currentAssistantMessageRef.current = ""
    setIsStreaming(true)

    try {
      // const ws = new WebSocket("wss://192.168.219.44:8000/ws") // 집
      // const ws = new WebSocket("wss://192.168.0.113:8000/ws")
      // const ws = new WebSocket("wss://127.0.0.1:8000/ws")
      const ws = new WebSocket("ws://localhost:8000/ws")

      wsRef.current = ws

      ws.onopen = () => {
        console.log("Connected to backend")
        ws.send(userMessage)
      }

      ws.onmessage = (event) => {
        const data = event.data.trim()

        if (data === "[end of response]") {
          setIsStreaming(false)
          ws.close()
          return
        }

        try {
          const json = JSON.parse(data)

          if ("type" in json && json["type"] === "html") {
            const htmlContent = json["content"] || json["html"]
            setMessages((prev) => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]
              if (lastMessage.role === "assistant") {
                lastMessage.htmlContent = htmlContent
              }
              return newMessages
            })
            return
          }

          if ("type" in json && json["type"] === "image") {
            const imageUrl = json["url"]
            setMessages((prev) => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]
              if (lastMessage.role === "assistant") {
                lastMessage.imageUrl = imageUrl
              }
              return newMessages
            })
            return
          }

          let content = ""
          if (json.message?.content) {
            content = json.message.content
          } else if (json.response) {
            content = json.response
          } else if (json.done) {
            setIsStreaming(false)
            ws.close()
            return
          }

          if (content) {
            currentAssistantMessageRef.current += content
            setMessages((prev) => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]
              if (lastMessage.role === "assistant") {
                lastMessage.content = currentAssistantMessageRef.current
                lastMessage.words = currentAssistantMessageRef.current.split(/(\s+)/)
              }
              return newMessages
            })
          }
        } catch {
          currentAssistantMessageRef.current += data
          setMessages((prev) => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            if (lastMessage.role === "assistant") {
              lastMessage.content = currentAssistantMessageRef.current
              lastMessage.words = currentAssistantMessageRef.current.split(/(\s+)/)
            }
            return newMessages
          })
        }
      }

      ws.onerror = (err) => {
        console.error("WebSocket error:", err)
        setError("연결 오류가 발생했습니다. 서버가 SSL(wss://)을 지원하는지 확인하세요.")
        setIsStreaming(false)
      }

      ws.onclose = () => {
        console.log("[v0] Disconnected from server")
        setIsStreaming(false)
      }
    } catch (err) {
      console.error("[v0] Failed to connect:", err)
      setError("서버에 연결할 수 없습니다. HTTPS 페이지에서는 wss:// 연결이 필요합니다.")
      setIsStreaming(false)
    }
  }

  const handleStop = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsStreaming(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-8 pb-32 max-w-4xl mx-auto w-full pt-8 pl-2 pr-2">
        {messages.length === 0 && <ChatEmptyState />}

        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isStreaming={isStreaming}
            isLastMessage={index === messages.length - 1}
            onIframeLoad={handleIframeLoad}
          />
        ))}

        {error && (
          <div className="flex justify-center animate-in fade-in duration-300">
            <div className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl shadow-md border border-red-200">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        input={input}
        isStreaming={isStreaming}
        onInputChange={setInput}
        onSend={handleSend}
        onStop={handleStop}
        onKeyPress={handleKeyPress}
      />
    </div>
  )
}
