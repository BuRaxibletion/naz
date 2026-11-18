/**
 * ═══════════════════════════════════════════════════════════
 *  KİŞİSELLEŞTİRME — Tüm metinler, renkler ve ayarlar burada
 * ═══════════════════════════════════════════════════════════
 *  Bu dosyayı düzenlemen yeterli; tasarım bozulmaz.
 */

export const experience = {
  /** Karşı tarafın adı (boş bırakılabilir) */
  recipientName: '',

  /** Tarayıcı sekmesi başlığı */
  pageTitle: 'NAZ içinn ❤️',

  opening: {
    greeting: 'Senin için MINICIK bir sürprizim var…',
    cta: 'EKRANA TIKLAAAA',
  },

  /** Ana sahnede sırayla görünen mesajlar */
  messages: [
    ' prensesler günün kutlu olsun prensess. iyi ki tanımışım senii',
    ' bir insanın gülümsemesi tüm günümü güzelleştirebiliyormuş',
    'bu küçük dünyanın enn güzel detayı sensin.',
    ' bazı güzellikler kelimelerle anlatılamaz.',
    'bu sayfayı senin için hazırladımm — her dokunuşta biraz daha sen varsın :))',
  ],

  letter: {
    buttonLabel: ' küçük bir not...',
    title: ' bitanem bebeğim naz,',
    body: `bazen kelimeler yetmez.

ama yine de denemek istedim —
gülümsemenin, varlığının ve
bana hissettirdiklerinin ne kadar
özel olduğunu söylemek için.

bu küçük dünya sadece sana ait.
 …`,
    signOff: 'bugrann ❤️',
  },

  wish: {
    buttonLabel: 'bir dilek tutt',
    message: 'dileğini yıldızlara yolladımm.\numarım en güzel haliyle gerçek olurr.',
  },

  surprises: {
    moreSurprise: 'ask bombardımanı ahwsdahfssa…',
    releaseHearts: 'kalpleri serbest bırakmak ıcın tıklaa',
  },

  /** Köşedeki gizli kalbe dokununca çıkan sürpriz */
  hiddenHeart: {
    message: 'seni fark ettiğim an,\nbütün sıradanlıklar bitti.',
  },

  /** Basılı tutunca kalp yağmuru */
  holdRain: {
    buttonLabel: 'basılı tutt kalpler yağmur olsunn',
    hint: ' basılı tuttt',
  },

  /** Tüm sürprizler keşfedilince açılan final sahne */
  finale: {
    unlockHint: ' bir sürpriz daha varr',
    openLabel: 'finali aç',
    replayLabel: 'finali tekrar izle',
    title: 'vveee son olarak…',
    message: 'sen, bu dünyada\nen güzel rastlantısın..',
    thanks:
      ' küçük sürprizimi sonuna kadar incelediğin için teşekkür ederim. iyi ki varsın.. ❤️',
  },

  music: {
    /** public/ klasöründeki dosya yolu — boşsa yumuşak ambient sentez kullanılır */
    src: '',
    labelOn: 'Müzik açık',
    labelOff: 'Müzik kapalı',
  },

  theme: {
    colors: {
      deep: '#070308',
      wine: '#1a0812',
      burgundy: '#4c152a',
      mulberry: '#7a2f52',
      rose: '#e8a0b8',
      blush: '#ffc8d9',
      soft: '#f7dce6',
      glowPink: 'rgba(255, 140, 185, 0.45)',
      glowViolet: 'rgba(150, 70, 130, 0.28)',
      gold: '#f0d4a8',
    },
  },

  animation: {
    /** 'low' | 'medium' | 'high' — parçacık yoğunluğu */
    density: 'medium' as 'low' | 'medium' | 'high',
    floatingHeartCount: 14,
    backgroundStarCount: 60,
  },
} as const

export type ExperienceConfig = typeof experience
export type AnimationDensity = (typeof experience.animation)['density']
