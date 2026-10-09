import type { Dict } from './en';

const dict: Dict = {
  meta: {
    siteName: 'ImgLove',
    homeTitle: 'ImgLove — Strumenti gratuiti online per le immagini',
    homeDesc:
      'Comprimi, ridimensiona, ritaglia, converti e modifica immagini online gratis. Veloce, privato e semplice — i tuoi file non lasciano mai il tuo dispositivo.',
  },
  nav: {
    home: 'Home',
    tools: 'Strumenti',
    features: 'Funzionalità',
    faq: 'Domande frequenti',
    login: 'Accedi',
    signup: 'Registrati',
    menu: 'Menu',
    close: 'Chiudi',
  },
  account: {
    title: 'Nessun account richiesto',
    desc: 'Tutti gli strumenti di ImgLove sono gratuiti e funzionano nel tuo browser — senza registrazione, senza accesso, mai.',
    ok: 'Capito',
  },
  hero: {
    title: 'Tutti gli strumenti per lavorare con le immagini',
    subtitle:
      'Comprimi, ridimensiona, ritaglia, converti e modifica le tue immagini online. Gratis, veloce e sicuro — direttamente nel tuo browser.',
  },
  toolsSection: {
    title: 'Tutti gli strumenti per immagini in un unico posto',
    subtitle: 'Scegli uno strumento per iniziare. Non serve registrarsi.',
  },
  filters: {
    all: 'Tutti',
    optimize: 'Ottimizza',
    create: 'Crea',
    edit: 'Modifica',
    convert: 'Converti',
    security: 'Sicurezza',
  },
  tools: {
    'compress-image': {
      name: 'Comprimi IMAGE',
      desc: 'Riduci il peso delle tue immagini mantenendo la qualità.',
    },
    'resize-image': {
      name: 'Ridimensiona IMAGE',
      desc: 'Cambia le dimensioni delle immagini in pixel o in percentuale.',
    },
    'crop-image': {
      name: 'Ritaglia IMAGE',
      desc: 'Ritaglia la cornice perfetta dalle tue immagini.',
    },
    'convert-image': {
      name: 'Converti IMAGE',
      desc: 'Converti le immagini tra JPG, PNG, WEBP e altro.',
    },
    'rotate-image': {
      name: 'Ruota IMAGE',
      desc: 'Ruota le immagini a destra, a sinistra o capovolgile.',
    },
    'watermark-image': {
      name: 'Filigrana IMAGE',
      desc: 'Aggiungi una filigrana di testo per proteggere le tue immagini.',
    },
    'meme-generator': {
      name: 'Generatore di meme',
      desc: 'Aggiungi scritte in alto e in basso per creare meme in pochi secondi.',
    },
    'photo-editor': {
      name: 'Editor foto',
      desc: 'Applica filtri e regola luminosità, contrasto e altro.',
    },
  },
  features: {
    title: 'Perché tutti amano ImgLove',
    items: [
      {
        title: '100% gratis',
        desc: 'Tutti gli strumenti sono gratuiti, senza filigrane e senza registrazione.',
      },
      {
        title: 'Privato per progettazione',
        desc: 'Le tue immagini vengono elaborate direttamente nel tuo browser. Nulla viene mai caricato su un server.',
      },
      {
        title: 'Funziona ovunque',
        desc: 'Nessun software da installare. Funziona su telefono, tablet o computer.',
      },
    ],
  },
  faq: {
    title: 'Domande frequenti',
    items: [
      {
        q: 'Questi strumenti per immagini sono davvero gratuiti?',
        a: 'Sì. Tutti gli strumenti di ImgLove sono completamente gratuiti, senza limiti nascosti e senza filigrane sulle tue immagini.',
      },
      {
        q: 'Le mie immagini vengono caricate su un server?',
        a: 'No. Ogni strumento funziona interamente nel tuo browser grazie alle moderne tecnologie web. I tuoi file non lasciano mai il tuo dispositivo.',
      },
      {
        q: 'Quali formati di immagine sono supportati?',
        a: 'JPG, PNG, WEBP, GIF, AVIF e HEIC (foto iPhone) in input. Puoi esportare in JPG, PNG o WEBP.',
      },
      {
        q: 'C’è un limite alla dimensione dei file?',
        a: 'Non c’è un limite lato server perché nulla viene caricato. Immagini molto grandi potrebbero richiedere più tempo sui dispositivi più lenti.',
      },
    ],
  },
  work: {
    title: 'Lavora a modo tuo',
    cards: [
      {
        title: 'Elaborazione in batch',
        desc: 'Elabora più immagini insieme e scaricale tutte in un unico ZIP.',
        link: 'convert-image',
      },
      {
        title: 'Funziona su qualsiasi dispositivo',
        desc: 'Nessuna installazione, nessuna configurazione. Apri ImgLove su telefono, tablet o computer.',
        link: '',
      },
      {
        title: 'Gratis per sempre',
        desc: 'Tutti gli strumenti sono gratuiti, senza filigrane né limiti nascosti.',
        link: '',
      },
    ],
  },
  trust: {
    title: 'Il tuo editor di immagini online di fiducia',
    desc: 'ImgLove è la soluzione semplice per modificare le immagini online. Accedi a ogni strumento direttamente dal web — con la privacy garantita, perché i file non lasciano mai il tuo dispositivo.',
    badge1: '100% NEL BROWSER',
    badge2: 'NESSUN CARICAMENTO · NESSUNA REGISTRAZIONE',
  },
  footer: {
    colProduct: 'Prodotto',
    tagline:
      'Strumenti online gratuiti per comprimere, ridimensionare, ritagliare, convertire e modificare immagini.',
    colTools: 'Strumenti per immagini',
    colCompany: 'Azienda',
    colLegal: 'Legale',
    about: 'Chi siamo',
    contact: 'Contatti',
    privacy: 'Informativa sulla privacy',
    terms: 'Termini di servizio',
    language: 'Lingua',
    rights: 'Tutti i diritti riservati.',
  },
  common: {
    selectImages: 'Seleziona immagini',
    dropTitle: 'Trascina qui le tue immagini',
    dropSub: 'oppure',
    supported: 'Supporta JPG, PNG, WEBP, GIF, AVIF, HEIC',
    processing: 'Elaborazione…',
    download: 'Scarica',
    downloadAll: 'Scarica tutto',
    startOver: 'Ricomincia',
    addMore: 'Aggiungi altre immagini',
    original: 'Originale',
    result: 'Risultato',
    images: 'immagini',
    image: 'immagine',
    errorGeneric: 'Qualcosa è andato storto. Prova con un’altra immagine.',
    errorType: 'Seleziona un file immagine valido.',
    back: 'Indietro',
    apply: 'Applica',
    reset: 'Reimposta',
    quality: 'Qualità',
    width: 'Larghezza',
    height: 'Altezza',
    pixels: 'px',
  },
  toolPage: {
    howItWorks: 'Come funziona',
    steps: ['Seleziona le tue immagini', 'Regola le impostazioni', 'Scarica il risultato'],
  },
  compress: {
    title: 'Comprimi IMAGE',
    desc: 'Riduci il peso delle immagini senza perdere qualità visibile.',
    qualityLabel: 'Livello di compressione',
    saved: 'risparmiato',
    compressMore: 'Comprimi',
  },
  resize: {
    title: 'Ridimensiona IMAGE',
    desc: 'Ridimensiona le immagini in pixel o in percentuale.',
    mode: 'Ridimensiona per',
    byPixels: 'Pixel',
    byPercent: 'Percentuale',
    percent: 'Percentuale',
    lockAspect: 'Blocca proporzioni',
    resizeBtn: 'Ridimensiona immagini',
  },
  crop: {
    title: 'Ritaglia IMAGE',
    desc: 'Trascina sull’immagine per selezionare l’area da mantenere.',
    aspect: 'Proporzioni',
    free: 'Libero',
    square: 'Quadrato 1:1',
    wide: 'Panoramico 16:9',
    classic: 'Classico 4:3',
    portrait: 'Verticale 3:4',
    cropBtn: 'Ritaglia immagine',
    hint: 'Trascina sull’immagine per disegnare l’area di ritaglio',
  },
  convert: {
    title: 'Converti IMAGE',
    desc: 'Converti le tue immagini in JPG, PNG o WEBP.',
    format: 'Converti in',
    convertBtn: 'Converti immagini',
  },
  rotate: {
    title: 'Ruota IMAGE',
    desc: 'Ruota o capovolgi le tue immagini.',
    left: 'Ruota a sinistra',
    right: 'Ruota a destra',
    flipH: 'Specchia orizzontale',
    flipV: 'Specchia verticale',
    applyBtn: 'Applica',
  },
  watermark: {
    title: 'Filigrana IMAGE',
    desc: 'Aggiungi una filigrana di testo personalizzata alle tue immagini.',
    text: 'Testo filigrana',
    textPh: '© Il tuo nome',
    position: 'Posizione',
    opacity: 'Opacità',
    size: 'Dimensione testo',
    color: 'Colore',
    white: 'Bianco',
    black: 'Nero',
    posTL: 'In alto a sinistra',
    posTC: 'In alto al centro',
    posTR: 'In alto a destra',
    posBL: 'In basso a sinistra',
    posBC: 'In basso al centro',
    posBR: 'In basso a destra',
    applyBtn: 'Aggiungi filigrana',
  },
  meme: {
    title: 'Generatore di meme',
    desc: 'Aggiungi scritte alle tue immagini e crea meme.',
    top: 'Testo in alto',
    bottom: 'Testo in basso',
    topPh: 'TESTO IN ALTO',
    bottomPh: 'TESTO IN BASSO',
    applyBtn: 'Crea meme',
  },
  editor: {
    title: 'Editor foto',
    desc: 'Applica filtri e ottimizza le tue foto.',
    filters: 'Filtri',
    none: 'Nessuno',
    grayscale: 'B/N',
    sepia: 'Seppia',
    invert: 'Inverti',
    vintage: 'Vintage',
    cool: 'Freddo',
    warm: 'Caldo',
    adjust: 'Regolazioni',
    brightness: 'Luminosità',
    contrast: 'Contrasto',
    saturate: 'Saturazione',
    blur: 'Sfocatura',
    applyBtn: 'Applica modifiche',
  },
  about: {
    title: 'Chi siamo',
    body1:
      'ImgLove è una raccolta gratuita di strumenti online per le immagini. La nostra missione è semplice: rendere le attività quotidiane con le immagini — compressione, ridimensionamento, ritaglio, conversione e modifiche leggere — veloci e accessibili a tutti.',
    body2:
      'A differenza della maggior parte degli strumenti online, tutto su ImgLove funziona direttamente nel tuo browser. Le tue immagini non vengono mai caricate sui nostri server: i tuoi file restano privati e gli strumenti sono ancora più veloci.',
  },
  privacy: {
    title: 'Informativa sulla privacy',
    body1:
      'ImgLove elabora le tue immagini interamente nel tuo browser web. Non carichiamo, archiviamo né trasmettiamo i tuoi file immagine ad alcun server.',
    body2:
      'Potremmo raccogliere statistiche d’uso anonime e aggregate per migliorare il sito. Non vendiamo dati personali. Se ci contatti via email, useremo il tuo indirizzo solo per risponderti.',
  },
  terms: {
    title: 'Termini di servizio',
    body1:
      'ImgLove fornisce strumenti gratuiti online per le immagini “così come sono”, senza garanzie di alcun tipo. Sei responsabile delle immagini che elabori e devi assicurarti di avere i diritti per utilizzarle.',
    body2:
      'Non usare ImgLove per scopi illeciti. Possiamo aggiornare questi termini in qualsiasi momento; continuare a usare il sito significa accettare la versione corrente.',
  },
  notFound: {
    title: 'Pagina non trovata',
    desc: 'La pagina che stai cercando non esiste.',
    backHome: 'Torna alla home',
  },
};

export default dict;
