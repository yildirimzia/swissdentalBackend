# 🎯 Seçici Bileşen Sistemi - Kullanım Kılavuzu

## 📋 Yapılan Değişiklikler

### Backend Değişiklikleri

#### 1. **Prisma Schema Güncellemesi**
```prisma
model Page {
  // ... diğer alanlar
  selectedComponents String[] @default([])  // ✨ YENİ ALAN
}
```

#### 2. **Form Schema Güncellemesi**
- `selectedComponents` alanı eklendi
- Seçilen bileşenler array olarak saklanıyor

#### 3. **Page Dashboard Güncellemeleri**
- Bileşen seçimi state'e kaydediliyor
- Form submit'te selectedComponents gönderiliyor
- Sayfa yüklendiğinde seçili bileşenler restore ediliyor

### Frontend Değişiklikleri

#### 1. **Template Component**
- `selectedComponents` prop'u eklendi
- Sadece seçili bileşenler render ediliyor
- Backward compatibility için boş array kontrolü

#### 2. **Dynamic Page ([slug]/page.tsx)**
- `selectedComponents` API'den alınıyor
- Template'e prop olarak gönderiliyor

## 🚀 Kurulum Adımları

### 1. Veritabanı Migration

Backend klasöründe şu komutu çalıştırın:

```bash
cd /Users/ziyayildirim/Desktop/Swisss/swissdentalsolutionsbackend
npx prisma migrate dev --name add_selected_components
```

veya

```bash
npx prisma db push
```

### 2. Prisma Client Güncelleme

```bash
npx prisma generate
```

## 💡 Nasıl Kullanılır?

### Admin Panelinde Sayfa Oluşturma

1. **Şablon Seçimi**
   - SEO & Şablon bölümünde **"+ Şablon"** butonuna tıklayın
   - Modal açılır

2. **Sol Menüden Şablon Seçin**
   - 📄 Serbest İçerik Sayfası
   - 🏥 Hasta Faydaları Sayfası

3. **Sağ Taraftan Bileşenleri Seçin**
   - İstediğiniz bileşenleri tıklayarak seçin/kaldırın
   - Seçili bileşen sayısını görün
   - "Tümünü Temizle" ile tüm seçimleri kaldırın

4. **Şablonu Uygula**
   - **"Şablonu Uygula"** butonuna tıklayın
   - Modal kapanır
   - Sadece seçili bileşenlerin formları görünür

5. **İçerikleri Doldurun**
   - Her bileşenin kendi alanlarını doldurun
   - Sayfayı kaydedin

### Frontend'te Görüntüleme

- Sayfa otomatik olarak sadece seçili bileşenleri gösterir
- Bileşenler seçim sırasına göre görüntülenir
- Hiç bileşen seçilmemişse tüm bileşenler gösterilir (eski davranış)

## 🎨 Bileşen Listesi

| ID | İsim | Açıklama |
|---|---|---|
| `hero` | 🎯 Hero Alanı | Ana başlık ve görsel alanı |
| `whyCeramic` | 📋 Neden Seramik Kartları | Özellik kartları |
| `introText` | 📝 Giriş Paragrafı | Tanıtım metni |
| `sectionImage` | 🖼️ Arka Plan Görseli | Görsel alan |
| `ceramicAdvantages` | ⭐ Seramik Avantajları | Numaralı avantaj kartları |
| `serviceBlock` | 🏥 Hizmet Bloğu | Hizmet tanıtım bloğu |
| `slider` | 💬 Referans Slider | Hasta referansları |
| `pioneeringWork` | 🚀 Öncü Çalışma | Swiss Biohealth Clinic |
| `doctor` | 👨‍⚕️ Doktor Bilgisi | Uzman profili |

## 📝 API Response Örneği

```json
{
  "page": {
    "id": "...",
    "slug": "test-sayfa",
    "template": "benefits_for_patients",
    "selectedComponents": [
      "hero",
      "whyCeramic",
      "ceramicAdvantages",
      "slider"
    ],
    "templateData": {
      "hero": { ... },
      "whyCeramic": { ... },
      "ceramicAdvantages": { ... },
      "slider": { ... }
    }
  }
}
```

## ⚠️ Önemli Notlar

1. **Backward Compatibility**: 
   - Eski sayfalar `selectedComponents` olmadan çalışmaya devam eder
   - Boş array durumunda tüm bileşenler gösterilir

2. **Veritabanı**:
   - Migration çalıştırılmalı
   - Default değer boş array (`[]`)

3. **Bileşen Sıralaması**:
   - Bileşenler seçim sırasına göre gösterilir
   - Array sırası korunur

## 🐛 Troubleshooting

### Problem: Bileşenler görünmüyor
**Çözüm**: Migration çalıştırıldığından emin olun

### Problem: Tüm bileşenler gösteriliyor
**Çözüm**: selectedComponents'ın doğru kaydedildiğini kontrol edin

### Problem: Admin panelde seçimler kaybolmuyor
**Çözüm**: State'in doğru güncellendiğini kontrol edin

## 📚 Geliştirici Notları

- Template component'i `shouldRender` fonksiyonu ile kontrol eder
- State `Set<BenefitsComponentType>` olarak tutulur
- API'ye gönderilirken `Array.from()` ile dönüştürülür
- Frontend'te direkt array olarak kullanılır
