"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2, Square } from "lucide-react"

interface ChatInputProps {
  input: string
  isStreaming: boolean
  onInputChange: (value: string) => void
  onSend: () => void
  onStop: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
}

export function ChatInput({ input, isStreaming, onInputChange, onSend, onStop, onKeyPress }: ChatInputProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-6">
      <div className="max-w-4xl mx-auto w-full flex gap-3 items-center">
        <div className="flex-1">
          <Input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder={isStreaming ? "AI가 응답하고 있습니다..." : "뭐든지 물어보세요."}
            disabled={isStreaming}
            className="w-full px-5 py-6 text-base rounded-full border-gray-300 focus:border-[#FF6B6B] focus:ring-[#FF6B6B]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-gray-50"
          />
        </div>

        {isStreaming ? (
          <Button
            onClick={onStop}
            size="icon"
            className="rounded-full w-12 h-12 bg-[#FF6B6B] hover:bg-[#FF5252] text-white shadow-lg transition-all duration-200 hover:scale-105 relative flex-shrink-0"
          >
            <Loader2 className="w-8 h-8 animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            <Square className="w-3 h-3 fill-current absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </Button>
        ) : (
          <Button
            onClick={onSend}
            disabled={!input.trim()}
            size="icon"
            className="rounded-full w-12 h-12 bg-[#FF6B6B] hover:bg-[#FF5252] text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
