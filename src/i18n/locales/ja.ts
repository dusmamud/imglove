import type { Dict } from './en';

const dict: Dict = {
  meta: {
    siteName: 'ImgLove',
    homeTitle: 'ImgLove — 無料のオンライン画像ツール',
    homeDesc:
      '画像の圧縮・リサイズ・切り抜き・変換・編集をオンラインで無料で。高速、プライベート、簡単——ファイルがお使いのデバイスから出ることはありません。',
  },
  nav: {
    home: 'ホーム',
    tools: 'ツール',
    features: '特徴',
    faq: 'よくある質問',
    login: 'ログイン',
    signup: '新規登録',
    menu: 'メニュー',
    close: '閉じる',
  },
  account: {
    title: 'アカウント不要',
    desc: 'ImgLove のすべてのツールは無料で、ブラウザ上でそのまま動作します——登録もログインも不要です。',
    ok: '了解',
  },
  hero: {
    title: '画像作業に必要なすべてのツール',
    subtitle:
      '画像をオンラインで圧縮、リサイズ、切り抜き、変換、編集。無料、高速、安全——ブラウザ上でそのまま使えます。',
  },
  toolsSection: {
    title: 'すべての画像ツールがここに',
    subtitle: 'ツールを選んですぐに開始。登録不要です。',
  },
  filters: {
    all: 'すべて',
    optimize: '最適化',
    create: '作成',
    edit: '編集',
    convert: '変換',
    security: 'セキュリティ',
  },
  tools: {
    'compress-image': {
      name: '圧縮 IMAGE',
      desc: '画質を保ったまま画像のファイルサイズを小さくします。',
    },
    'resize-image': {
      name: 'リサイズ IMAGE',
      desc: 'ピクセルまたはパーセントで画像のサイズを変更します。',
    },
    'crop-image': {
      name: '切り抜き IMAGE',
      desc: '画像から完璧なフレームを切り抜きます。',
    },
    'convert-image': {
      name: '変換 IMAGE',
      desc: 'JPG、PNG、WEBPなど画像形式を変換します。',
    },
    'rotate-image': {
      name: '回転 IMAGE',
      desc: '画像を左右に回転、または反転します。',
    },
    'watermark-image': {
      name: '透かし IMAGE',
      desc: '画像を守るテキストの透かしを追加します。',
    },
    'meme-generator': {
      name: 'ミームジェネレーター',
      desc: '上下にキャプションを追加して数秒でミームを作成。',
    },
    'photo-editor': {
      name: '写真エディター',
      desc: 'フィルターを適用し、明るさやコントラストなどを調整。',
    },
  },
  features: {
    title: 'ImgLoveが愛される理由',
    items: [
      {
        title: '100%無料',
        desc: 'すべてのツールが無料。透かしなし、登録不要です。',
      },
      {
        title: 'プライバシー最優先',
        desc: '画像はブラウザ上で直接処理されます。サーバーにアップロードされることはありません。',
      },
      {
        title: 'どこでも使える',
        desc: 'ソフトのインストール不要。スマホ、タブレット、PCで使えます。',
      },
    ],
  },
  faq: {
    title: 'よくある質問',
    items: [
      {
        q: '画像ツールは本当に無料ですか？',
        a: 'はい。ImgLoveのすべてのツールは完全無料で、隠れた制限や画像への透かしはありません。',
      },
      {
        q: '画像はサーバーにアップロードされますか？',
        a: 'いいえ。すべてのツールは最新のウェブ技術でブラウザ上のみ動作します。ファイルがお使いのデバイスから出ることはありません。',
      },
      {
        q: '対応している画像形式は？',
        a: '入力はJPG、PNG、WEBP、GIF、AVIF、HEIC（iPhoneの写真）に対応。JPG、PNG、WEBPに書き出せます。',
      },
      {
        q: 'ファイルサイズの上限はありますか？',
        a: 'アップロードしないためサーバー側の上限はありません。非常に大きな画像は、性能の低いデバイスでは処理に時間がかかる場合があります。',
      },
    ],
  },
  work: {
    title: 'あなたのやり方で',
    cards: [
      {
        title: '一括処理',
        desc: '複数の画像をまとめて処理し、ZIP で一括ダウンロードできます。',
        link: 'convert-image',
      },
      {
        title: 'あらゆるデバイスで動作',
        desc: 'インストールも設定も不要。スマホ、タブレット、パソコンで ImgLove を開くだけ。',
        link: '',
      },
      {
        title: 'ずっと無料',
        desc: 'すべてのツールが無料。透かしなし、隠れた制限なし。',
        link: '',
      },
    ],
  },
  trust: {
    title: '信頼のオンライン画像エディター',
    desc: 'ImgLove はオンラインで画像を編集するためのシンプルなソリューションです。すべてのツールをウェブから直接利用でき、ファイルがデバイスの外に出ることはないため、プライバシーは万全です。',
    badge1: '100% ブラウザ処理',
    badge2: 'アップロード不要 · 登録不要',
  },
  footer: {
    colProduct: '製品',
    tagline: '画像の圧縮・リサイズ・切り抜き・変換・編集ができる無料オンラインツール。',
    colTools: '画像ツール',
    colCompany: '会社情報',
    colLegal: '法的事項',
    about: '私たちについて',
    contact: 'お問い合わせ',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
    language: '言語',
    rights: '無断複写・転載を禁じます。',
  },
  common: {
    selectImages: '画像を選択',
    dropTitle: '画像をここにドロップ',
    dropSub: 'または',
    supported: 'JPG、PNG、WEBP、GIF、AVIF、HEICに対応',
    processing: '処理中…',
    download: 'ダウンロード',
    downloadAll: 'すべてダウンロード',
    startOver: '最初から',
    addMore: '画像を追加',
    original: 'オリジナル',
    result: '結果',
    images: '枚の画像',
    image: '枚の画像',
    errorGeneric: 'エラーが発生しました。別の画像をお試しください。',
    errorType: '有効な画像ファイルを選択してください。',
    back: '戻る',
    apply: '適用',
    reset: 'リセット',
    quality: '画質',
    width: '幅',
    height: '高さ',
    pixels: 'px',
  },
  toolPage: {
    howItWorks: '使い方',
    steps: ['画像を選択', '設定を調整', '結果をダウンロード'],
  },
  compress: {
    title: '圧縮 IMAGE',
    desc: '目に見える画質を落とさず画像のファイルサイズを小さくします。',
    qualityLabel: '圧縮レベル',
    saved: '削減',
    compressMore: '圧縮',
  },
  resize: {
    title: 'リサイズ IMAGE',
    desc: 'ピクセルまたはパーセントで画像をリサイズします。',
    mode: 'リサイズ方法',
    byPixels: 'ピクセル',
    byPercent: 'パーセント',
    percent: 'パーセント',
    lockAspect: '縦横比を固定',
    resizeBtn: '画像をリサイズ',
  },
  crop: {
    title: '切り抜き IMAGE',
    desc: '画像上でドラッグして残す範囲を選択します。',
    aspect: 'アスペクト比',
    free: '自由',
    square: '正方形 1:1',
    wide: 'ワイド 16:9',
    classic: 'クラシック 4:3',
    portrait: 'ポートレート 3:4',
    cropBtn: '画像を切り抜く',
    hint: '画像上でドラッグして切り抜き範囲を描きます',
  },
  convert: {
    title: '変換 IMAGE',
    desc: '画像をJPG、PNG、WEBPに変換します。',
    format: '変換先',
    convertBtn: '画像を変換',
  },
  rotate: {
    title: '回転 IMAGE',
    desc: '画像を回転・反転します。',
    left: '左に回転',
    right: '右に回転',
    flipH: '左右反転',
    flipV: '上下反転',
    applyBtn: '適用',
  },
  watermark: {
    title: '透かし IMAGE',
    desc: '画像にオリジナルのテキスト透かしを追加します。',
    text: '透かしのテキスト',
    textPh: '© お名前',
    position: '位置',
    opacity: '不透明度',
    size: '文字サイズ',
    color: '色',
    white: '白',
    black: '黒',
    posTL: '左上',
    posTC: '上中央',
    posTR: '右上',
    posBL: '左下',
    posBC: '下中央',
    posBR: '右下',
    applyBtn: '透かしを追加',
  },
  meme: {
    title: 'ミームジェネレーター',
    desc: '画像にキャプションを追加してミームを作成。',
    top: '上のテキスト',
    bottom: '下のテキスト',
    topPh: '上のテキスト',
    bottomPh: '下のテキスト',
    applyBtn: 'ミームを作成',
  },
  editor: {
    title: '写真エディター',
    desc: 'フィルターを適用し、写真を微調整します。',
    filters: 'フィルター',
    none: 'なし',
    grayscale: 'モノクロ',
    sepia: 'セピア',
    invert: '反転',
    vintage: 'ビンテージ',
    cool: 'クール',
    warm: 'ウォーム',
    adjust: '調整',
    brightness: '明るさ',
    contrast: 'コントラスト',
    saturate: '彩度',
    blur: 'ぼかし',
    applyBtn: '編集を適用',
  },
  about: {
    title: '私たちについて',
    body1:
      'ImgLoveは無料のオンライン画像ツール集です。私たちのミッションはシンプルです。圧縮、リサイズ、切り抜き、変換、軽い編集といった日常の画像作業を、誰にとっても速く、手軽にすることです。',
    body2:
      '多くのオンラインツールとは違い、ImgLoveのすべてはブラウザ上で直接動作します。画像がサーバーにアップロードされることはないため、ファイルはプライベートに保たれ、ツールも高速に動作します。',
  },
  privacy: {
    title: 'プライバシーポリシー',
    body1:
      'ImgLoveは画像をすべてウェブブラウザ上で処理します。画像ファイルがサーバーにアップロード・保存・送信されることはありません。',
    body2:
      'サイト改善のため、匿名化された集計の利用統計を収集する場合があります。個人データを販売することはありません。メールでお問い合わせいただいた場合、メールアドレスは返信にのみ使用します。',
  },
  terms: {
    title: '利用規約',
    body1:
      'ImgLoveは無料のオンライン画像ツールを「現状のまま」提供し、いかなる保証も行いません。処理する画像についてはお客様ご自身が責任を負い、それらを使用する権利があることをご確認ください。',
    body2:
      'ImgLoveを違法な目的で使用しないでください。これらの規約はいつでも更新される場合があります。サイトの継続利用は、最新版への同意とみなされます。',
  },
  notFound: {
    title: 'ページが見つかりません',
    desc: 'お探しのページは存在しません。',
    backHome: 'ホームに戻る',
  },
};

export default dict;
