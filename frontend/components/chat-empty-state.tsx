import { Send } from "lucide-react"

export function ChatEmptyState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-[#FF6B6B] rounded-full flex items-center justify-center">
          <Send className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-400 text-lg">메시지를 입력하여 대화를 시작하세요</p>
      </div>
    </div>
  )
}
