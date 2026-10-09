import type { Dict } from './en';

const dict: Dict = {
  meta: {
    siteName: 'ImgLove',
    homeTitle: 'ImgLove — 무료 온라인 이미지 도구',
    homeDesc:
      '이미지를 온라인에서 무료로 압축, 크기 조정, 자르기, 변환, 편집하세요. 빠르고 안전하며 간편합니다 — 파일이 기기를 떠나지 않습니다.',
  },
  nav: {
    home: '홈',
    tools: '도구',
    features: '기능',
    faq: '자주 묻는 질문',
    login: '로그인',
    signup: '회원가입',
    menu: '메뉴',
    close: '닫기',
  },
  account: {
    title: '계정 필요 없음',
    desc: 'ImgLove의 모든 도구는 무료이며 브라우저에서 바로 작동합니다 — 가입도, 로그인도 필요 없습니다.',
    ok: '알겠습니다',
  },
  hero: {
    title: '이미지 작업에 필요한 모든 도구',
    subtitle:
      '이미지를 온라인에서 압축, 크기 조정, 자르기, 변환, 편집하세요. 무료이며 빠르고 안전합니다 — 브라우저에서 바로 작동합니다.',
  },
  toolsSection: {
    title: '모든 이미지 도구를 한곳에',
    subtitle: '도구를 선택해 시작하세요. 회원가입이 필요 없습니다.',
  },
  filters: {
    all: '전체',
    optimize: '최적화',
    create: '만들기',
    edit: '편집',
    convert: '변환',
    security: '보안',
  },
  tools: {
    'compress-image': {
      name: '압축 IMAGE',
      desc: '화질은 유지하면서 이미지 파일 크기를 줄이세요.',
    },
    'resize-image': {
      name: '크기 조정 IMAGE',
      desc: '픽셀 또는 비율(%) 단위로 이미지 크기를 변경하세요.',
    },
    'crop-image': {
      name: '자르기 IMAGE',
      desc: '이미지에서 원하는 부분을 잘라내세요.',
    },
    'convert-image': {
      name: '변환 IMAGE',
      desc: '이미지를 JPG, PNG, WEBP 등으로 변환하세요.',
    },
    'rotate-image': {
      name: '회전 IMAGE',
      desc: '이미지를 왼쪽/오른쪽으로 회전하거나 뒤집으세요.',
    },
    'watermark-image': {
      name: '워터마크 IMAGE',
      desc: '이미지를 보호하기 위해 텍스트 워터마크를 추가하세요.',
    },
    'meme-generator': {
      name: '밈 생성기',
      desc: '위아래에 자막을 넣어 몇 초 만에 밈을 만드세요.',
    },
    'photo-editor': {
      name: '사진 편집기',
      desc: '필터를 적용하고 밝기, 명암 등을 조정하세요.',
    },
  },
  features: {
    title: '사람들이 ImgLove를 사랑하는 이유',
    items: [
      {
        title: '100% 무료',
        desc: '모든 도구는 무료로 사용할 수 있으며, 워터마크도 없고 회원가입도 필요 없습니다.',
      },
      {
        title: '프라이버시 우선 설계',
        desc: '이미지는 브라우저에서 바로 처리됩니다. 서버에 업로드되는 것이 없습니다.',
      },
      {
        title: '어디서나 사용',
        desc: '설치할 프로그램이 없습니다. 스마트폰, 태블릿, 컴퓨터에서 모두 작동합니다.',
      },
    ],
  },
  faq: {
    title: '자주 묻는 질문',
    items: [
      {
        q: '이 이미지 도구들은 정말 무료인가요?',
        a: '네. ImgLove의 모든 도구는 숨겨진 제한 없이 완전히 무료이며, 이미지에 워터마크가 남지 않습니다.',
      },
      {
        q: '제 이미지가 서버에 업로드되나요?',
        a: '아니요. 모든 도구는 최신 웹 기술로 브라우저에서 완전히 동작합니다. 파일이 기기를 떠나지 않습니다.',
      },
      {
        q: '어떤 이미지 형식을 지원하나요?',
        a: '입력은 JPG, PNG, WEBP, GIF, AVIF, HEIC(아이폰 사진)를 지원합니다. JPG, PNG, WEBP로 저장할 수 있습니다.',
      },
      {
        q: '파일 크기 제한이 있나요?',
        a: '업로드가 없으므로 서버 측 제한이 없습니다. 매우 큰 이미지는 저사양 기기에서 처리가 오래 걸릴 수 있습니다.',
      },
    ],
  },
  work: {
    title: '원하는 방식으로 작업하세요',
    cards: [
      {
        title: '일괄 처리',
        desc: '여러 이미지를 한 번에 처리하고 ZIP 파일로 함께 다운로드하세요.',
        link: 'convert-image',
      },
      {
        title: '모든 기기에서 작동',
        desc: '설치도 설정도 필요 없습니다. 휴대폰, 태블릿, 컴퓨터에서 ImgLove를 여세요.',
        link: '',
      },
      {
        title: '영원히 무료',
        desc: '모든 도구는 무료이며 워터마크나 숨겨진 제한이 없습니다.',
        link: '',
      },
    ],
  },
  trust: {
    title: '신뢰할 수 있는 온라인 이미지 편집기',
    desc: 'ImgLove는 온라인에서 이미지를 편집하는 간단한 솔루션입니다. 모든 도구를 웹에서 바로 사용하세요 — 파일이 기기를 절대 떠나지 않으므로 개인정보가 보장됩니다.',
    badge1: '100% 브라우저 처리',
    badge2: '업로드 없음 · 가입 없음',
  },
  footer: {
    colProduct: '제품',
    tagline: '이미지 압축, 크기 조정, 자르기, 변환, 편집을 위한 무료 온라인 도구.',
    colTools: '이미지 도구',
    colCompany: '회사',
    colLegal: '법적 고지',
    about: '회사 소개',
    contact: '문의하기',
    privacy: '개인정보처리방침',
    terms: '이용약관',
    language: '언어',
    rights: '모든 권리 보유.',
  },
  common: {
    selectImages: '이미지 선택',
    dropTitle: '이미지를 여기에 드래그하세요',
    dropSub: '또는',
    supported: '지원 형식: JPG, PNG, WEBP, GIF, AVIF, HEIC',
    processing: '처리 중…',
    download: '다운로드',
    downloadAll: '모두 다운로드',
    startOver: '처음부터',
    addMore: '이미지 추가',
    original: '원본',
    result: '결과',
    images: '이미지들',
    image: '이미지',
    errorGeneric: '문제가 발생했습니다. 다른 이미지를 사용해 보세요.',
    errorType: '유효한 이미지 파일을 선택해 주세요.',
    back: '뒤로',
    apply: '적용',
    reset: '초기화',
    quality: '화질',
    width: '너비',
    height: '높이',
    pixels: 'px',
  },
  toolPage: {
    howItWorks: '사용 방법',
    steps: ['이미지 선택', '설정 조정', '결과 다운로드'],
  },
  compress: {
    title: '압축 IMAGE',
    desc: '눈에 보이는 화질 손실 없이 이미지 파일 크기를 줄이세요.',
    qualityLabel: '압축 수준',
    saved: '절약',
    compressMore: '압축',
  },
  resize: {
    title: '크기 조정 IMAGE',
    desc: '픽셀 또는 비율(%)로 이미지 크기를 조정하세요.',
    mode: '조정 기준',
    byPixels: '픽셀',
    byPercent: '비율',
    percent: '비율',
    lockAspect: '종횡비 고정',
    resizeBtn: '이미지 크기 조정',
  },
  crop: {
    title: '자르기 IMAGE',
    desc: '유지할 영역을 이미지 위에 드래그하여 선택하세요.',
    aspect: '종횡비',
    free: '자유',
    square: '정사각형 1:1',
    wide: '와이드 16:9',
    classic: '클래식 4:3',
    portrait: '세로 3:4',
    cropBtn: '이미지 자르기',
    hint: '자르기 영역을 그리기 위해 이미지 위를 드래그하세요',
  },
  convert: {
    title: '변환 IMAGE',
    desc: '이미지를 JPG, PNG, WEBP로 변환하세요.',
    format: '변환 형식',
    convertBtn: '이미지 변환',
  },
  rotate: {
    title: '회전 IMAGE',
    desc: '이미지를 회전하거나 뒤집으세요.',
    left: '왼쪽으로 회전',
    right: '오른쪽으로 회전',
    flipH: '좌우 뒤집기',
    flipV: '상하 뒤집기',
    applyBtn: '적용',
  },
  watermark: {
    title: '워터마크 IMAGE',
    desc: '이미지에 사용자 정의 텍스트 워터마크를 추가하세요.',
    text: '워터마크 텍스트',
    textPh: '© 이름',
    position: '위치',
    opacity: '투명도',
    size: '글자 크기',
    color: '색상',
    white: '흰색',
    black: '검은색',
    posTL: '왼쪽 위',
    posTC: '위쪽 가운데',
    posTR: '오른쪽 위',
    posBL: '왼쪽 아래',
    posBC: '아래쪽 가운데',
    posBR: '오른쪽 아래',
    applyBtn: '워터마크 추가',
  },
  meme: {
    title: '밈 생성기',
    desc: '이미지에 자막을 넣어 밈을 만드세요.',
    top: '위 텍스트',
    bottom: '아래 텍스트',
    topPh: '상단 텍스트',
    bottomPh: '하단 텍스트',
    applyBtn: '밈 만들기',
  },
  editor: {
    title: '사진 편집기',
    desc: '필터를 적용하고 사진을 세밀하게 조정하세요.',
    filters: '필터',
    none: '없음',
    grayscale: '흑백',
    sepia: '세피아',
    invert: '반전',
    vintage: '빈티지',
    cool: '차가운',
    warm: '따뜻한',
    adjust: '조정',
    brightness: '밝기',
    contrast: '명암',
    saturate: '채도',
    blur: '흐림',
    applyBtn: '편집 적용',
  },
  about: {
    title: '회사 소개',
    body1:
      'ImgLove는 무료 온라인 이미지 도구 모음입니다. 우리의 목표는 간단합니다. 압축, 크기 조정, 자르기, 변환, 간단한 편집 같은 일상적인 이미지 작업을 누구나 빠르고 쉽게 할 수 있게 하는 것입니다.',
    body2:
      '대부분의 온라인 도구와 달리, ImgLove의 모든 기능은 브라우저에서 직접 동작합니다. 이미지가 서버에 업로드되지 않으므로 파일이 안전하게 보호되고 도구도 더 빠르게 작동합니다.',
  },
  privacy: {
    title: '개인정보처리방침',
    body1:
      'ImgLove는 웹 브라우저에서 이미지를 완전히 처리합니다. 이미지 파일을 어떤 서버에도 업로드하거나 저장, 전송하지 않습니다.',
    body2:
      '웹사이트 개선을 위해 익명의 집계 사용 통계를 수집할 수 있습니다. 개인정보를 판매하지 않습니다. 이메일로 문의하시면 답변을 위해서만 주소를 사용합니다.',
  },
  terms: {
    title: '이용약관',
    body1:
      'ImgLove는 무료 온라인 이미지 도구를 "있는 그대로" 제공하며, 어떠한 보증도 하지 않습니다. 처리하는 이미지와 그 사용 권한에 대한 책임은 사용자에게 있습니다.',
    body2:
      '불법적인 목적으로 ImgLove를 사용하지 마세요. 본 약관은 언제든 변경될 수 있으며, 계속 사용하는 것은 현재 약관에 동의하는 것으로 간주됩니다.',
  },
  notFound: {
    title: '페이지를 찾을 수 없습니다',
    desc: '찾으시는 페이지가 존재하지 않습니다.',
    backHome: '홈으로 돌아가기',
  },
};

export default dict;
