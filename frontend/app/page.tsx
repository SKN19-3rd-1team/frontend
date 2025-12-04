"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { ChatEmptyState } from "@/components/chat-empty-state"
import { MessageSquarePlus, Folder, Info, Bug, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { ArtifactPreview } from "@/components/artifact-preview"

type Message = {
  role: "user" | "assistant"
  content: string
  words?: string[]
  imageUrl?: string
  htmlContent?: string
  htmlId?: string
  tableId?: string
}

type Artifact = {
  id: string
  type: "html" | "table"
  content: string | any // for table, content will be JSON
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentAssistantMessageRef = useRef("")
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [selectedHtmlId, setSelectedHtmlId] = useState<string | null>(null)
  const artifactCounterRef = useRef(0)

  const [leftWidth, setLeftWidth] = useState(33.33) // percentage
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100

      // Constrain between 20% and 80%
      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftWidth(newLeftWidth)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

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
      // const ws = new WebSocket("wss://192.168.0.27:8000/ws") // SKN 뭐때문인지 안됨
      const ws = new WebSocket("ws://localhost:8000/ws") // 로컬
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
            const artifactId = `${++artifactCounterRef.current}`
            setArtifacts((prev) => [...prev, { id: artifactId, type: "html", content: htmlContent }])
            setSelectedHtmlId(artifactId)

            setMessages((prev) => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]
              if (lastMessage.role === "assistant") {
                lastMessage.htmlId = artifactId
              }
              return newMessages
            })
            return
          }

          if ("type" in json && json["type"] === "table") {
            const tableContent = json["table"]
            const artifactId = `${++artifactCounterRef.current}`
            setArtifacts((prev) => [...prev, { id: artifactId, type: "table", content: tableContent }])

            setMessages((prev) => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]
              if (lastMessage.role === "assistant") {
                lastMessage.tableId = artifactId
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
        console.log("Disconnected from server")
        setIsStreaming(false)
      }
    } catch (err) {
      console.error("Failed to connect:", err)
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
    <div className="flex flex-col h-screen bg-green-50 p-4 gap-4">
      <Navbar />

      <main ref={containerRef} className="flex flex-1 gap-2 overflow-hidden relative">
        <div className="flex mr-2 flex-col bg-green-100 rounded-full p-2 gap-0.5 shrink-0 self-start">
          <Button
            size="icon"
            className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-300 group"
            onClick={() => console.log("Folder clicked")}
          >
            <MessageSquarePlus className="w-5 h-5 text-green-500 group-hover:text-green-700" strokeWidth={3} />
          </Button>
          <Button
            size="icon"
            className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-300 group"
            onClick={() => console.log("Folder clicked")}
          >
            <Folder className="w-5 h-5 text-green-500 group-hover:text-green-700" strokeWidth={3} />
          </Button>

          <Button
            size="icon"
            className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-300 group"
            onClick={() => console.log("Folder clicked")}
          >
            <Info className="w-5 h-5 text-green-500 group-hover:text-green-700" strokeWidth={3} />
          </Button>

          <Button
            size="icon"
            className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-300 group"
            onClick={() => console.log("Settings clicked")}
          >
            <Bug className="w-5 h-5 text-green-500 group-hover:text-green-700" strokeWidth={3} />
          </Button>

          <Button
            size="icon"
            className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-300 group"
            onClick={() => console.log("Settings clicked")}
          >
            <SlidersHorizontal className="w-5 h-5 text-green-500 group-hover:text-green-700" strokeWidth={3} />
          </Button>
        </div>

        <div
          className="bg-green-100 rounded-3xl flex flex-col overflow-hidden border-6 border-green-100 relative"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="flex-1 overflow-y-auto py-4 pb-32">
            {messages.length === 0 && <ChatEmptyState />}

            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                isStreaming={isStreaming}
                isLastMessage={index === messages.length - 1}
                onHtmlClick={(htmlId) => setSelectedHtmlId(htmlId)}
              />
            ))}

            {error && (
              <div className="flex justify-center animate-in fade-in duration-300 my-4">
                <div className="bg-red-100 text-red-600 px-5 py-3 rounded-2xl border border-red-200">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            input={input}
            isStreaming={isStreaming}
            onInputChange={setInput}
            onSend={handleSend}
            onStop={handleStop}
            onKeyPress={handleKeyPress}
            className="absolute bottom-0 left-0 right-0"
          />
        </div>

        <div
          className="w-1 rounded-full hover:bg-green-200 cursor-col-resize transition-colors relative shrink-0"
          onMouseDown={() => setIsDragging(true)}
        >
          <div className="absolute inset-0 w-4 -left-1.5" />
        </div>

        <ArtifactPreview artifacts={artifacts} />
      </main>
    </div>
  )
}
