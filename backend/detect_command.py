def detect_command(input: str):
    tool = ""
    prompt = ""
    fixed = ""

    if all(li in input for li in ["키야", "게임"]) or all(li in input for li in ["콜라", "게임"]):
        tool = "kia"
        prompt = "유저가 시원한 콜라잡기 게임을 하려고 합니다. 콜라가 빠르게 움직이니 집중하라고 응원해줘."
        fixed = "이 게임에서 당신은 최대한 많은 양의 콜라를 잡아야 합니다. 당신의 최고점을 항상 갱신하도록 노력해보세요. "

    elif all(li in input for li in ["반도체", "게임"]) or all(li in input for li in ["탑", "게임"]):
        tool = "tower"
        prompt = "유저는 움직이는 블록을 높게쌓기 게임을 하고 있습니다. 서두루지 말고 천천히 하라고 응원해줘."
        fixed = "이 게임은 반도체를 최대한 높게 적층하는게 목적인 게임으로 기존의 탑 쌓기 게임을 반도체라는 테마에 적용한 참신한 게임입니다. "
    elif any(li in input for li in ["정보", "뉴스", "도움이 필요"]):
        tool = "info"
        prompt = "유저는 정보를 읽고 있습니다. 혹시 도움이 더 필요한지 물어보세요. "
        fixed = " "

    elif any (li in input for li in ["팝업", "스토어", "코카콜라", "가는 길", "성수", "콜라보"]):
        tool = "nothing_related"
        prompt = "지금 내가 코카콜라 팝업스토어나 코카콜라 게임 관련된 얘기를 하고 있나 파악하고 대답해. "
        fixed = "생각 중...."
    else:
        tool = "nothing_related"
        prompt = "유저에게 관련있는 메시지를 주거나 좀 더 간결하게 설명해달라고 부탁하세요."
        fixed = "제가 잘 이해하지 못 했군요. 문맥 정확도를 높일 수 있게 노력하세요. "

    return tool, "게임설명: " + prompt, fixed