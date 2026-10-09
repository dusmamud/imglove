#!/usr/bin/env python3
"""Add 11 new tool translations to all 19 non-English locales."""
import re, sys

# Structure: tool_key -> { section_key -> { locale -> text } }
# Locales: hi bn as es pt fr ar ur zh ja ko ru id de tr it vi th ta

T = {}

def add(tool, key, **kwargs):
    T.setdefault(tool, {})[key] = kwargs

# ============ TOOL NAMES / DESCS ============
# upscale-image
add('upscale-image', 'name', hi='अपस्केल IMAGE', bn='আপস্কেল IMAGE', asm='আপস্কেল IMAGE',
    es='Ampliar IMAGE', pt='Ampliar IMAGE', fr='Agrandir IMAGE', ar='تكبير IMAGE',
    ur='اپ اسکیل IMAGE', zh='放大 IMAGE', ja='拡大 IMAGE', ko='확대 IMAGE',
    ru='Увеличить IMAGE', id='Perbesar IMAGE', de='Vergrößern IMAGE', tr='Büyüt IMAGE',
    it='Ingrandisci IMAGE', vi='Phóng to IMAGE', th='ขยาย IMAGE', ta='பெரிதாக்கு IMAGE')
add('upscale-image', 'desc', hi='अपनी इमेज को क्वालिटी खोए बिना 4x तक बड़ा करें।',
    bn='মান না হারিয়ে আপনার ছবি ৪x পর্যন্ত বড় করুন।', asm='মান নেহেৰুৱাকৈ আপোনাৰ ছবি ৪x লৈকে ডাঙৰ কৰক।',
    es='Amplía tus imágenes hasta 4x sin perder calidad.', pt='Amplie suas imagens até 4x sem perder qualidade.',
    fr='Agrandissez vos images jusqu’à 4x sans perdre en qualité.', ar='كبّر صورك حتى ٤ أضعاف دون فقدان الجودة.',
    ur='کوالٹی کھوئے بغیر اپنی تصاویر کو 4x تک بڑا کریں۔', zh='将图片放大至 4 倍而不损失画质。',
    ja='画質を落とさずに画像を最大4倍まで拡大。', ko='화질 손실 없이 이미지를 최대 4배까지 확대.',
    ru='Увеличивайте изображения до 4x без потери качества.', id='Perbesar gambar hingga 4x tanpa kehilangan kualitas.',
    de='Vergrößern Sie Bilder bis zu 4x ohne Qualitätsverlust.', tr='Görsellerinizi kalite kaybetmeden 4 kata kadar büyütün.',
    it='Ingrandisci le immagini fino a 4x senza perdere qualità.', vi='Phóng to ảnh lên đến 4x mà không mất chất lượng.',
    th='ขยายรูปภาพได้สูงสุด 4 เท่าโดยไม่สูญเสียคุณภาพ', ta='தரம் இழக்காமல் படங்களை 4x வரை பெரிதாக்குங்கள்.')

# blur-image
add('blur-image', 'name', hi='ब्लर IMAGE', bn='ব্লার IMAGE', asm='ব্লাৰ IMAGE',
    es='Desenfocar IMAGE', pt='Desfocar IMAGE', fr='Flouter IMAGE', ar='تغبيش IMAGE',
    ur='بلر IMAGE', zh='模糊 IMAGE', ja='ぼかし IMAGE', ko='블러 IMAGE',
    ru='Размыть IMAGE', id='Blur IMAGE', de='Weichzeichnen IMAGE', tr='Bulanıklaştır IMAGE',
    it='Sfoca IMAGE', vi='Làm mờ IMAGE', th='เบลอ IMAGE', ta='மங்கல் IMAGE')
add('blur-image', 'desc', hi='संवेदनशील हिस्से छिपाने या इफेक्ट के लिए इमेज ब्लर करें।',
    bn='সংবেদনশীল অংশ লুকাতে বা ইফেক্টের জন্য ছবি ব্লার করুন।', asm='সংবেদনশীল অংশ লুকুৱাবলৈ বা ইফেক্টৰ বাবে ছবি ব্লাৰ কৰক।',
    es='Desenfoca imágenes para ocultar partes sensibles o crear efectos.', pt='Desfoque imagens para ocultar partes sensíveis ou criar efeitos.',
    fr='Floutez les images pour masquer des zones sensibles ou créer des effets.', ar='قم بتغبيش الصور لإخفاء الأجزاء الحساسة أو إنشاء تأثيرات.',
    ur='حساس حصے چھپانے یا ایفیکٹ کے لیے تصاویر کو بلر کریں۔', zh='模糊图片以隐藏敏感部分或创建特效。',
    ja='センシティブな部分を隠したりエフェクト用に画像をぼかします。', ko='민감한 부분을 숨기거나 효과를 위해 이미지를 블러 처리.',
    ru='Размывайте изображения, чтобы скрыть чувствительные части или создать эффекты.', id='Blurkan gambar untuk menyembunyikan bagian sensitif atau membuat efek.',
    de='Bilder weichzeichnen, um sensible Bereiche zu verbergen oder Effekte zu erzeugen.', tr='Hassas kısımları gizlemek veya efekt için görselleri bulanıklaştırın.',
    it='Sfoca le immagini per nascondere parti sensibili o creare effetti.', vi='Làm mờ ảnh để che phần nhạy cảm hoặc tạo hiệu ứng.',
    th='เบลอภาพเพื่อซ่อนส่วนที่ละเอียดอ่อนหรือสร้างเอฟเฟกต์', ta='உணர்திறன் பகுதிகளை மறைக்க அல்லது விளைவுகளுக்காக படங்களை மங்கலாக்குங்கள்.')

# round-corners
add('round-corners', 'name', hi='गोल कोने', bn='গোল কোণ', asm='ঘূৰণীয়া কোণ',
    es='Esquinas redondeadas', pt='Cantos arredondados', fr='Coins arrondis', ar='زوايا دائرية',
    ur='گول کونے', zh='圆角', ja='角丸', ko='둥근 모서리',
    ru='Скруглить углы', id='Sudut membulat', de='Abgerundete Ecken', tr='Yuvarlak Köşeler',
    it='Angoli arrotondati', vi='Bo góc', th='มุมโค้ง', ta='வளைந்த மூலைகள்')
add('round-corners', 'desc', hi='अपनी इमेज को स्मूद गोल कोने दें।',
    bn='আপনার ছবিতে মসৃণ গোল কোণ দিন।', asm='আপোনাৰ ছবিত মসৃণ ঘূৰণীয়া কোণ দিয়ক।',
    es='Dale a tus imágenes esquinas redondeadas suaves.', pt='Dê cantos arredondados suaves às suas imagens.',
    fr='Donnez à vos images des coins arrondis et doux.', ar='امنح صورك زوايا دائرية ناعمة.',
    ur='اپنی تصاویر کو ہموار گول کونے دیں۔', zh='为图片添加平滑圆角。',
    ja='画像に滑らかな角丸を付けます。', ko='이미지에 부드러운 둥근 모서리를 적용.',
    ru='Сделайте углы изображений плавно скруглёнными.', id='Beri gambar sudut membulat yang halus.',
    de='Verleihen Sie Bildern sanft abgerundete Ecken.', tr='Görsellerinize pürüzsüz yuvarlak köşeler verin.',
    it='Dai alle immagini angoli arrotondati e morbidi.', vi='Bo góc mềm mại cho ảnh của bạn.',
    th='ทำให้มุมของรูปภาพโค้งมนอย่างนุ่มนวล', ta='உங்கள் படங்களுக்கு மென்மையான வளைந்த மூலைகளைக் கொடுங்கள்.')

# add-border
add('add-border', 'name', hi='बॉर्डर जोड़ें', bn='বর্ডার যোগ করুন', asm='বৰ্ডাৰ যোগ কৰক',
    es='Añadir borde', pt='Adicionar borda', fr='Ajouter une bordure', ar='إضافة إطار',
    ur='بارڈر شامل کریں', zh='添加边框', ja='枠線を追加', ko='테두리 추가',
    ru='Добавить рамку', id='Tambah bingkai', de='Rahmen hinzufügen', tr='Kenarlık Ekle',
    it='Aggiungi bordo', vi='Thêm viền', th='เพิ่มขอบ', ta='பார்டர் சேர்')
add('add-border', 'desc', hi='अपनी इमेज के चारों ओर रंगीन बॉर्डर या फ्रेम लगाएँ।',
    bn='আপনার ছবির চারপাশে রঙিন বর্ডার বা ফ্রেম লাগান।', asm='আপোনাৰ ছবিৰ চাৰিওফালে ৰঙীন বৰ্ডাৰ বা ফ্ৰেম লগাওক।',
    es='Añade un borde o marco de color alrededor de tus imágenes.', pt='Adicione uma borda ou moldura colorida às suas imagens.',
    fr='Ajoutez une bordure ou un cadre coloré autour de vos images.', ar='أضف إطارًا ملونًا حول صورك.',
    ur='اپنی تصاویر کے گرد رنگین بارڈر یا فریم لگائیں۔', zh='在图片周围添加彩色边框。',
    ja='画像の周りにカラフルな枠線やフレームを追加。', ko='이미지 주위에 컬러 테두리나 프레임을 추가.',
    ru='Добавьте цветную рамку вокруг изображений.', id='Tambahkan bingkai berwarna di sekitar gambar.',
    de='Fügen Sie einen farbigen Rahmen um Ihre Bilder hinzu.', tr='Görsellerinizin etrafına renkli kenarlık ekleyin.',
    it='Aggiungi un bordo colorato intorno alle immagini.', vi='Thêm viền màu xung quanh ảnh.',
    th='เพิ่มขอบหรือกรอบสีรอบรูปภาพของคุณ', ta='உங்கள் படங்களைச் சுற்றி வண்ண பார்டரைச் சேர்க்கவும்.')

# split-image
add('split-image', 'name', hi='स्प्लिट IMAGE', bn='স্প্লিট IMAGE', asm='স্প্লিট IMAGE',
    es='Dividir IMAGE', pt='Dividir IMAGE', fr='Découper IMAGE', ar='تقسيم IMAGE',
    ur='اسپلٹ IMAGE', zh='分割 IMAGE', ja='分割 IMAGE', ko='분할 IMAGE',
    ru='Разделить IMAGE', id='Pisah IMAGE', de='Teilen IMAGE', tr='Böl IMAGE',
    it='Dividi IMAGE', vi='Cắt IMAGE', th='แยก IMAGE', ta='பிரி IMAGE')
add('split-image', 'desc', hi='अपनी इमेज को छोटी टाइलों के ग्रिड में काटें।',
    bn='আপনার ছবিকে ছোট টাইলের গ্রিডে কাটুন।', asm='আপোনাৰ ছবিক সৰু টাইলৰ গ্ৰিডত কাটক।',
    es='Corta tu imagen en una cuadrícula de mosaicos.', pt='Corte sua imagem em uma grade de blocos.',
    fr='Découpez votre image en une grille de tuiles.', ar='قسّم صورتك إلى شبكة من البلاطات.',
    ur='اپنی تصویر کو چھوٹی ٹائلوں کے گرڈ میں کاٹیں۔', zh='将图片切割成小图块网格。',
    ja='画像をタイル状のグリッドに分割。', ko='이미지를 타일 그리드로 자르기.',
    ru='Разрежьте изображение на сетку плиток.', id='Potong gambar menjadi kisi ubin.',
    de='Schneiden Sie Ihr Bild in ein Kachelraster.', tr='Görselinizi karo ızgarasına bölün.',
    it='Taglia l’immagine in una griglia di riquadri.', vi='Cắt ảnh thành lưới các ô nhỏ.',
    th='ตัดรูปภาพเป็นตารางช่องเล็กๆ', ta='உங்கள் படத்தை சிறு ஓடுகளின் கட்டமாக வெட்டுங்கள்.')

# background-remover
add('background-remover', 'name', hi='बैकग्राउंड रिमूवर', bn='ব্যাকগ্রাউন্ড রিমুভার', asm='বেকগ্ৰাউণ্ড ৰিমুভাৰ',
    es='Quitar fondo', pt='Remover fundo', fr='Supprimer le fond', ar='إزالة الخلفية',
    ur='بیک گراؤنڈ ریموور', zh='抠图去背景', ja='背景除去', ko='배경 제거',
    ru='Удалить фон', id='Hapus latar', de='Hintergrund entfernen', tr='Arka Plan Sil',
    it='Rimuovi sfondo', vi='Xóa nền', th='ลบพื้นหลัง', ta='பின்னணி நீக்கி')
add('background-remover', 'desc', hi='एक क्लिक में फोटो से बैकग्राउंड हटाएँ।',
    bn='এক ক্লিকে ফটো থেকে ব্যাকগ্রাউন্ড সরান।', asm='এটা ক্লিকতে ফটোৰ পৰা বেকগ্ৰাউণ্ড আঁতৰাওক।',
    es='Elimina el fondo de tus fotos con un clic.', pt='Remova o fundo das fotos com um clique.',
    fr='Supprimez l’arrière-plan de vos photos en un clic.', ar='أزل خلفية صورك بنقرة واحدة.',
    ur='ایک کلک میں تصاویر سے پس منظر ہٹائیں۔', zh='一键去除照片背景。',
    ja='ワンクリックで写真の背景を除去。', ko='클릭 한 번으로 사진 배경 제거.',
    ru='Удаляйте фон с фото одним кликом.', id='Hapus latar foto dengan satu klik.',
    de='Entfernen Sie Hintergründe mit einem Klick.', tr='Tek tıkla fotoğraflardan arka planı silin.',
    it='Rimuovi lo sfondo dalle foto con un clic.', vi='Xóa nền ảnh chỉ với một cú nhấp.',
    th='ลบพื้นหลังออกจากรูปภาพในคลิกเดียว', ta='ஒரே கிளிக்கில் புகைப்பட பின்னணியை நீக்குங்கள்.')

# image-to-pdf
add('image-to-pdf', 'name', hi='इमेज से PDF', bn='ইমেজ থেকে PDF', asm='ইমেজৰ পৰা PDF',
    es='Imagen a PDF', pt='Imagem para PDF', fr='Image vers PDF', ar='صورة إلى PDF',
    ur='تصویر سے PDF', zh='图片转 PDF', ja='画像からPDF', ko='이미지 PDF 변환',
    ru='Изображение в PDF', id='Gambar ke PDF', de='Bild zu PDF', tr='Görselden PDF',
    it='Immagine in PDF', vi='Ảnh sang PDF', th='รูปเป็น PDF', ta='படம் PDF ஆக')
add('image-to-pdf', 'desc', hi='अपनी इमेज को एक PDF डॉक्यूमेंट में मिलाएँ।',
    bn='আপনার ছবিগুলোকে একটি PDF ডকুমেন্টে একত্র করুন।', asm='আপোনাৰ ছবিবোৰক এটা PDF ডকুমেণ্টত মিলাওক।',
    es='Combina tus imágenes en un solo documento PDF.', pt='Combine suas imagens em um único PDF.',
    fr='Combinez vos images en un seul document PDF.', ar='ادمج صورك في مستند PDF واحد.',
    ur='اپنی تصاویر کو ایک PDF دستاویز میں جوڑیں۔', zh='将多张图片合并为一个 PDF 文档。',
    ja='画像を1つのPDFドキュメントにまとめます。', ko='이미지를 하나의 PDF 문서로 합치기.',
    ru='Объедините изображения в один PDF-документ.', id='Gabungkan gambar menjadi satu dokumen PDF.',
    de='Kombinieren Sie Bilder zu einem PDF-Dokument.', tr='Görsellerinizi tek bir PDF belgesinde birleştirin.',
    it='Unisci le immagini in un unico documento PDF.', vi='Gộp ảnh thành một tài liệu PDF.',
    th='รวมรูปภาพเป็นเอกสาร PDF เดียว', ta='உங்கள் படங்களை ஒரே PDF ஆவணமாக இணைக்கவும்.')

# favicon-generator
add('favicon-generator', 'name', hi='फेविकॉन जनरेटर', bn='ফেভিকন জেনারেটর', asm='ফেভিকন জেনেৰেটৰ',
    es='Generador de favicon', pt='Gerador de favicon', fr='Générateur de favicon', ar='مولّد الأيقونات',
    ur='فیویکان جنریٹر', zh='网站图标生成器', ja='ファビコン生成', ko='파비콘 생성기',
    ru='Генератор favicon', id='Generator favicon', de='Favicon-Generator', tr='Favicon Oluşturucu',
    it='Generatore di favicon', vi='Tạo favicon', th='สร้างฟาวิคอน', ta='ஃபேவிகான் உருவாக்கி')
add('favicon-generator', 'desc', hi='अपनी इमेज से सभी साइज़ के फेविकॉन आइकन बनाएँ।',
    bn='আপনার ছবি থেকে সব সাইজের ফেভিকন আইকন বানান।', asm='আপোনাৰ ছবিৰ পৰা সকলো আকাৰৰ ফেভিকন আইকন বনাওক।',
    es='Genera iconos favicon en todos los tamaños desde tu imagen.', pt='Gere ícones favicon em todos os tamanhos da sua imagem.',
    fr='Générez des favicons dans toutes les tailles depuis votre image.', ar='أنشئ أيقونات الموقع بجميع الأحجام من صورتك.',
    ur='اپنی تصویر سے تمام سائز کے فیویکان آئیکن بنائیں۔', zh='从图片生成各种尺寸的网站图标。',
    ja='画像から全サイズのファビコンアイコンを生成。', ko='이미지에서 모든 크기의 파비콘 아이콘 생성.',
    ru='Создавайте favicon-иконки всех размеров из изображения.', id='Buat ikon favicon semua ukuran dari gambar.',
    de='Erzeugen Sie Favicon-Symbole in allen Größen aus Ihrem Bild.', tr='Görselinizden tüm boyutlarda favicon simgeleri oluşturun.',
    it='Genera icone favicon in tutte le dimensioni dalla tua immagine.', vi='Tạo biểu tượng favicon mọi kích cỡ từ ảnh.',
    th='สร้างไอคอนฟาวิคอนทุกขนาดจากรูปภาพของคุณ', ta='உங்கள் படத்திலிருந்து அனைத்து அளவு ஃபேவிகான் ஐகான்களை உருவாக்குங்கள்.')

# image-to-text
add('image-to-text', 'name', hi='इमेज से टेक्स्ट', bn='ইমেজ থেকে টেক্সট', asm='ইমেজৰ পৰা টেক্সট',
    es='Imagen a texto', pt='Imagem para texto', fr='Image vers texte', ar='صورة إلى نص',
    ur='تصویر سے متن', zh='图片转文字', ja='画像からテキスト', ko='이미지 텍스트 추출',
    ru='Изображение в текст', id='Gambar ke teks', de='Bild zu Text', tr='Görselden Metin',
    it='Immagine in testo', vi='Ảnh sang chữ', th='รูปเป็นข้อความ', ta='படம் உரையாக')
add('image-to-text', 'desc', hi='OCR से अपनी इमेज से टेक्स्ट निकालें।',
    bn='OCR দিয়ে ছবি থেকে টেক্সট বের করুন।', asm='OCR ৰে ছবিৰ পৰা টেক্সট উলিয়াওক।',
    es='Extrae texto de tus imágenes con OCR.', pt='Extraia texto das imagens com OCR.',
    fr='Extrayez le texte de vos images par OCR.', ar='استخرج النص من صورك بتقنية OCR.',
    ur='OCR سے تصاویر سے متن نکالیں۔', zh='用 OCR 从图片中提取文字。',
    ja='OCRで画像からテキストを抽出。', ko='OCR로 이미지에서 텍스트 추출.',
    ru='Извлекайте текст из изображений с помощью OCR.', id='Ekstrak teks dari gambar dengan OCR.',
    de='Extrahieren Sie Text aus Bildern mit OCR.', tr="OCR ile görsellerden metin çıkarın.",
    it='Estrai il testo dalle immagini con l’OCR.', vi='Trích xuất văn bản từ ảnh bằng OCR.',
    th='แยกข้อความจากรูปภาพด้วย OCR', ta='OCR மூலம் படங்களிலிருந்து உரையைப் பிரித்தெடுக்கவும்.')

# gif-maker
add('gif-maker', 'name', hi='GIF मेकर', bn='GIF মেকার', asm='GIF মেকাৰ',
    es='Creador de GIF', pt='Criador de GIF', fr='Créateur de GIF', ar='صانع GIF',
    ur='GIF میکر', zh='GIF 制作器', ja='GIFメーカー', ko='GIF 메이커',
    ru='Создать GIF', id='Pembuat GIF', de='GIF-Ersteller', tr='GIF Yapıcı',
    it='Creatore di GIF', vi='Tạo GIF', th='สร้าง GIF', ta='GIF உருவாக்கி')
add('gif-maker', 'desc', hi='अपनी इमेज से एनिमेटेड GIF बनाएँ।',
    bn='আপনার ছবি থেকে অ্যানিমেটেড GIF বানান।', asm='আপোনাৰ ছবিৰ পৰা এনিমেটেড GIF বনাওক।',
    es='Crea un GIF animado a partir de tus imágenes.', pt='Crie um GIF animado a partir das suas imagens.',
    fr='Créez un GIF animé à partir de vos images.', ar='أنشئ صورة GIF متحركة من صورك.',
    ur='اپنی تصاویر سے متحرک GIF بنائیں۔', zh='用图片制作动态 GIF。',
    ja='画像からアニメーションGIFを作成。', ko='이미지로 애니메이션 GIF 만들기.',
    ru='Создавайте анимированный GIF из изображений.', id='Buat GIF animasi dari gambar.',
    de='Erstellen Sie ein animiertes GIF aus Ihren Bildern.', tr="Görsellerinizden animasyonlu GIF oluşturun.",
    it='Crea una GIF animata dalle tue immagini.', vi='Tạo ảnh GIF động từ hình ảnh.',
    th='สร้าง GIF แบบเคลื่อนไหวจากรูปภาพของคุณ', ta='உங்கள் படங்களிலிருந்து அனிமேஷன் GIF உருவாக்குங்கள்.')

# html-to-image
add('html-to-image', 'name', hi='HTML से IMAGE', bn='HTML থেকে IMAGE', asm='HTML ৰ পৰা IMAGE',
    es='HTML a IMAGE', pt='HTML para IMAGE', fr='HTML vers IMAGE', ar='HTML إلى IMAGE',
    ur='HTML سے IMAGE', zh='HTML 转图片', ja='HTMLから画像', ko='HTML 이미지 변환',
    ru='HTML в IMAGE', id='HTML ke IMAGE', de='HTML zu IMAGE', tr="HTML'den IMAGE",
    it='HTML in IMAGE', vi='HTML sang IMAGE', th='HTML เป็น IMAGE', ta='HTML படமாக')
add('html-to-image', 'desc', hi='अपने HTML कोड को PNG इमेज में बदलें।',
    bn='আপনার HTML কোডকে PNG ছবিতে বদলান।', asm='আপোনাৰ HTML ক’ডক PNG ছবিলৈ সলনি কৰক।',
    es='Convierte tu código HTML en una imagen PNG.', pt='Converta seu código HTML em uma imagem PNG.',
    fr='Convertissez votre code HTML en image PNG.', ar='حوّل كود HTML إلى صورة PNG.',
    ur='اپنے HTML کوڈ کو PNG تصویر میں بدلیں۔', zh='将 HTML 代码转换为 PNG 图片。',
    ja='HTMLコードをPNG画像に変換。', ko='HTML 코드를 PNG 이미지로 변환.',
    ru='Преобразуйте HTML-код в PNG-изображение.', id='Ubah kode HTML menjadi gambar PNG.',
    de='Wandeln Sie HTML-Code in ein PNG-Bild um.', tr="HTML kodunuzu PNG görsele dönüştürün.",
    it='Converti il codice HTML in un’immagine PNG.', vi='Chuyển mã HTML thành ảnh PNG.',
    th='แปลงโค้ด HTML เป็นรูปภาพ PNG', ta='உங்கள் HTML குறியீட்டை PNG படமாக மாற்றுங்கள்.')
