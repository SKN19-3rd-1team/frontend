// 罹먮┃???곗씠??
const characters = [
    {
        name: '?좊겮',
        image: '../assets/rabbit.png',
        description: '?쒕컻?섍퀬 ?멸린??留롮? ?깃꺽?쇰줈 ?덈줈??寃껋쓣 ?먰뿕?섎뒗 寃껋쓣 醫뗭븘?⑸땲??',
    },
    {
        name: '怨?,
        image: '../assets/bear.png',
        description: '?좊뱺?섍퀬 誘우쓬吏곹븳 ?깃꺽?쇰줈 移쒓뎄?ㅼ쓣 蹂댄샇?섍퀬 諛곕젮?⑸땲??',
    },
    {
        name: '?ъ슦',
        image: '../assets/fox.png',
        description: '?곷━?섍퀬 ?ъ튂?덈뒗 ?깃꺽?쇰줈 臾몄젣 ?닿껐 ?λ젰???곗뼱?⑸땲??',
    },
    {
        name: '怨좎뒾?꾩튂',
        image: '../assets/hedgehog_ver1.png',
        description: '議곗떖?ㅻ읇吏留??곕쑜??留덉쓬??媛吏??깃꺽?쇰줈 吏꾩젙??移쒓뎄瑜??뚯쨷???ш퉩?덈떎.',
    },
    {
        name: '肄붿븣??,
        image: '../assets/koala.png',
        description: '?먭툔?섍퀬 ?됲솕濡쒖슫 ?깃꺽?쇰줈 ?덉젙媛먯쓣 二쇰뒗 議댁옱?낅땲??',
    },
    {
        name: '?섎떖',
        image: '../assets/otter.png',
        description: '?λ궃湲?留롪퀬 ?ш탳?곸씤 ?깃꺽?쇰줈 二쇰???利먭쾪寃?留뚮벊?덈떎.',
    },
    {
        name: '??톬',
        image: '../assets/penguin.png',
        description: '異⑹꽦?ㅻ읇怨??깆떎???깃꺽?쇰줈 紐⑺몴瑜??ν빐 袁몄????섏븘媛묐땲??',
    },
    {
        name: '?덇뎄由?,
        image: '../assets/raccoon.png',
        description: '?멸린??留롪퀬 李쎌쓽?곸씤 ?깃꺽?쇰줈 ?낇듅???쒓컖??媛吏怨??덉뒿?덈떎.',
    },
    {
        name: '?섎Т?섎낫',
        image: '../assets/sloth.png',
        description: '?ъ쑀濡?퀬 ?щ젮 源딆? ?깃꺽?쇰줈 ?좎쨷?섍쾶 ?앷컖?섎ŉ ?됰룞?⑸땲??',
    },
    {
        name: '嫄곕턿??,
        image: '../assets/turtle.png',
        description: '?몃궡???덇퀬 吏?쒕줈???깃꺽?쇰줈 ?κ린?곸씤 紐⑺몴瑜?異붽뎄?⑸땲??',
    }
];

let currentIndex = 0;
const totalItems = characters.length;
const theta = 360 / totalItems; // 媛??꾩씠???ъ씠??媛곷룄
const radius = 400; // ?뚯쟾 諛섍꼍

// 珥덇린??
function init() {
    const carousel = document.getElementById('carousel3d');
    
    // 罹먮윭? ?꾩씠???앹꽦
    characters.forEach((character, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `
            <img src="${character.image}" alt="${character.name}" class="character-image">
        `;
        
        // 3D ?먰삎 諛곗튂
        const angle = theta * index;
        item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        
        // ?대┃ ?대깽??
        item.addEventListener('click', () => {
            const clickedIndex = index;
            const diff = clickedIndex - currentIndex;
            
            if (diff > totalItems / 2) {
                rotateCarousel(-(totalItems - diff));
            } else if (diff < -totalItems / 2) {
                rotateCarousel(totalItems + diff);
            } else {
                rotateCarousel(diff);
            }
        });
        
        carousel.appendChild(item);
    });
    
    // 踰꾪듉 ?대깽??
    document.getElementById('prevBtn').addEventListener('click', () => rotateCarousel(-1));
    document.getElementById('nextBtn').addEventListener('click', () => rotateCarousel(1));
    document.getElementById('selectBtn').addEventListener('click', selectCharacter);
    
    // ?ㅻ낫???대깽??
    document.addEventListener('keydown', handleKeyboard);
    
    // 留덉슦???쒕옒洹?
    setupDrag();
    
    // 珥덇린 ?뺣낫 ?낅뜲?댄듃
    updateCharacterInfo();
}

// 罹먮윭? ?뚯쟾
function rotateCarousel(direction) {
    currentIndex = (currentIndex + direction + totalItems) % totalItems;
    
    const carousel = document.getElementById('carousel3d');
    const angle = -theta * currentIndex;
    carousel.style.transform = `rotateY(${angle}deg)`;
    
    // ?쒖꽦 ?꾩씠???낅뜲?댄듃
    const items = document.querySelectorAll('.carousel-item');
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
    });
    
    updateCharacterInfo();
}

// 罹먮┃???뺣낫 ?낅뜲?댄듃
function updateCharacterInfo() {
    const character = characters[currentIndex];
    document.getElementById('characterName').textContent = character.name;
    document.getElementById('characterDesc').textContent = character.description;
}

// 罹먮┃???좏깮
function selectCharacter() {
    const character = characters[currentIndex];
    alert(`${character.name}??瑜? ?좏깮?섏뀲?듬땲??\n\n${character.description}`);
    // ?ш린???ㅼ쓬 ?섏씠吏濡??대룞?섍굅???곗씠?곕? ??ν븯??濡쒖쭅 異붽?
}

// ?ㅻ낫???ㅻ퉬寃뚯씠??
function handleKeyboard(e) {
    if (e.key === 'ArrowLeft') {
        rotateCarousel(-1);
    } else if (e.key === 'ArrowRight') {
        rotateCarousel(1);
    } else if (e.key === 'Enter') {
        selectCharacter();
    }
}

// ?쒕옒洹?湲곕뒫
function setupDrag() {
    const scene = document.querySelector('.carousel-scene');
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    
    scene.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        scene.style.cursor = 'grabbing';
    });
    
    scene.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
    });
    
    scene.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        const diff = startX - currentX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                rotateCarousel(1);
            } else {
                rotateCarousel(-1);
            }
        }
        
        isDragging = false;
        scene.style.cursor = 'grab';
    });
    
    scene.addEventListener('mouseleave', () => {
        isDragging = false;
        scene.style.cursor = 'grab';
    });
    
    // ?곗튂 ?대깽??
    scene.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
    });
    
    scene.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    });
    
    scene.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        const diff = startX - currentX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                rotateCarousel(1);
            } else {
                rotateCarousel(-1);
            }
        }
        
        isDragging = false;
    });
    
    scene.style.cursor = 'grab';
}

// ?먮룞 ?뚯쟾 (?좏깮?ы빆 - 二쇱꽍 ?댁젣?섎㈃ ?먮룞?쇰줈 ?뚯쟾)
// setInterval(() => {
//     rotateCarousel(1);
// }, 3000);

// ?섏씠吏 濡쒕뱶??珥덇린??
init();