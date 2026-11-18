# Dreamy Romantic Experience

Mobil öncelikli, animasyon ağırlıklı romantik web deneyimi.

## Başlatma

```bash
npm install
npm run dev
```

## Kişiselleştirme

Tüm metinler, renkler ve animasyon yoğunluğu:

`src/config/experience.ts`

Özellikle:
- `hiddenHeart.message` — gizli köşe kalbi
- `holdRain` — basılı tut yağmuru
- `finale` — final sahnesi metinleri

Opsiyonel müzik: `public/music/` + `music.src`. Boşsa ambient Web Audio kullanılır.

Mobil öncelikli: mouse / hover yok; tap, uzun basma ve sürpriz butonları.

## Build

```bash
npm run build
npm run preview
```
