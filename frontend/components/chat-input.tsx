"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AudioLines, SendHorizontal, Loader2, Square } from "lucide-react"

interface ChatInputProps {
  input: string
  isStreaming: boolean
  onInputChange: (value: string) => void
  onSend: () => void
  onStop: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
  className?: string
}

export function ChatInput({
  input,
  isStreaming,
  onInputChange,
  onSend,
  onStop,
  onKeyPress,
  className,
}: ChatInputProps) {
  return (
    <div className={`w-full z-50 bg-transparent ${className || ""}`}>
      <div className="max-w-4xl mx-auto px-1 w-full relative">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={isStreaming ? "AI가 응답하고 있습니다..." : "뭐든지 물어보세요."}
          disabled={isStreaming}
          className="appearance-none
          focus:outline-none
          focus:ring-2 
          focus:ring-green-500 
          focus:ring-offset-0
          focus:border-green-500 
          w-full pl-5 pr-14 py-6 text-base rounded-3xl border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-gray-50"
        />

        {isStreaming ? (
          <Button
            onClick={onStop}
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-9 h-9 bg-[#FF6B6B] hover:bg-[#FF5252] text-white shadow-md transition-all duration-200 hover:scale-105"
          >
            <Loader2 className="w-6 h-6 animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            <Square className="w-2.5 h-2.5 fill-current absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </Button>
        ) : (
          <Button
            onClick={onSend}
            disabled={!input.trim()}
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-9 h-9 bg-green-400 hover:bg-green-500 text-white  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <SendHorizontal className="w-4 h-4" />
          </Button>
        )}
      </div>
      <p className="text-center text-green-300 text-sm pt-1">AI는 언제든 실수할 수 있습니다.</p>
    </div>
  )
}
