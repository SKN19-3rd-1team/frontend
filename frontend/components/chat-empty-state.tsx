import { Send } from "lucide-react"

export function ChatEmptyState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="translate-y-[30%]">
        <div className="text-center space-y-3">
          <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-300 text-transparent bg-clip-text">안녕하세요, Hawon님</p>

          <p className="text-green-400 text-sm">더 밝은 당신의 미래를 위한 채팅을 시작하세요.</p>

          <div className="space-y-2 space-x-2">
            <button className="
              px-4 py-1 rounded-full 
              bg-gradient-to-r from-green-400 to-green-300
              hover:from-green-400 hover:to-green-400
              hover:scale-105
              active:scale-90
              text-white text-sm font-semibold 
              transition-all duration-100
            ">
              서울대 컴공에 가고싶어
            </button>


            <button className="
              px-4 py-1 rounded-full 
              bg-gradient-to-r from-green-400 to-green-300 
              hover:from-green-400 hover:to-green-400
              hover:scale-105
              active:scale-90
              text-white text-sm font-semibold 
              transition-all duration-100
            ">
              고려대 컴공 1학년은 뭐 배워?
            </button>


            <button className="
              px-4 py-1 rounded-full 
              bg-gradient-to-r from-green-400 to-green-300 
              hover:from-green-400 hover:to-green-400
              hover:scale-105
              active:scale-90
              text-white text-sm font-semibold 
              transition-all duration-100
            ">
              좋은 샤프 추천해줘
            </button>

            <button className="
              px-4 py-1 rounded-full 
              bg-gradient-to-r from-green-400 to-green-300 
              hover:from-green-400 hover:to-green-400
              hover:scale-105
              active:scale-90
              text-white text-sm font-semibold 
              transition-all duration-100
            ">
              전문 상담사와 통화하고 싶어
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
