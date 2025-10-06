# Swiss Dental Solutions CMS Backend

Bu proje, Swiss Dental Solutions web sitesinin içeriklerini yönetebilmek için hazırlanmış Next.js tabanlı bir CMS / Admin panelidir. Yönetim paneli sayesinde yeni sayfalar oluşturabilir, var olan sayfaları düzenleyebilir veya silebilirsiniz. Oluşturulan sayfalar anında frontend projesine `/slug` formatıyla yansır.

## Özellikler

- Modern ve responsive yönetim paneli arayüzü
- Taslak / yayımlanmış durumları ile içerik kontrolü
- Markdown destekli içerik editörü
- Hero başlık, alt başlık ve görsel alanları
- SEO başlığı ve açıklaması tanımlayabilme
- PostgreSQL + Prisma tabanlı kalıcı veri katmanı
- Sayfa şablonları desteği (ör. `benefits_for_patients`) ve şablona özel alanlar
- REST API üzerinden içeriklere erişim: `GET /api/pages`, `POST /api/pages`, `PUT /api/pages/:slug`, `DELETE /api/pages/:slug`

## Başlangıç

1. Ortam dosyasını oluşturun ve veritabanı bağlantısını ayarlayın:

   ```bash
   cd swissdentalsolutionsbackend
   cp .env.example .env
   # .env içindeki DATABASE_URL değerini kendi Postgres bilgilerinizle güncelleyin
   ```

2. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

3. Prisma client dosyalarını üretin ve şemayı veritabanına uygulayın:

   ```bash
   npm run prisma:generate
   npm run db:push      # veya npm run db:migrate -- --name init
   npm run db:seed
   ```

4. Geliştirme sunucusunu başlatın:

   ```bash
   npm run dev
   ```

   Varsayılan olarak panel `http://localhost:4000` adresinde açılır. Portu değiştirmek isterseniz `package.json` içindeki `dev` scriptini güncellemeniz yeterli.

5. İlk açılışta "Test Page" isimli örnek bir kayıt göreceksiniz. Bu kayıt sayesinde frontend tarafında `/test` URL'i otomatik olarak çalışır.

### Dosya Yapısı

- `app/` – Next.js App Router yapısı ve admin ekranları
- `app/api/` – İçerik CRUD işlemlerini sağlayan REST API uçları
- `components/` – UI bileşenleri ve dashboard modülleri
- `lib/storage/page-store.ts` – Prisma ile veritabanı CRUD işlemlerini yöneten yardımcı fonksiyonlar
- `lib/prisma.ts` – Tekil Prisma Client instance'ı
- `prisma/schema.prisma` – Veritabanı şeması ve enum tanımları
- `prisma/seed.cjs` – Test kaydı oluşturan seed betiği

### API Örnekleri

- **Tüm sayfaları listele**

  ```http
  GET http://localhost:4000/api/pages
  ```

- **Yayımlanmış sayfaları listele**

  ```http
  GET http://localhost:4000/api/pages?status=published
  ```

- **Yeni sayfa oluştur**

  ```http
  POST http://localhost:4000/api/pages
  Content-Type: application/json

  {
    "slug": "ornek-sayfa",
    "title": "Örnek Sayfa",
    "content": "### Yeni içerik...",
    "status": "published"
  }
  ```

## Frontend ile Entegrasyon

- Frontend projesi (`swissdentalsolutions`) CMS'e `CMS_BASE_URL` ortam değişkeni üzerinden bağlanır. `.env` dosyasına aşağıdaki satır eklendi:

  ```env
  CMS_BASE_URL=http://localhost:4000
  ```

- Admin panelinde yayımlanan her sayfa, frontend tarafında `/slug` formatında otomatik olarak oluşturulur. Örneğin panelde `slug` değeri `test` olan bir kayıt oluşturduğunuzda, Next.js uygulamasında `http://localhost:3000/test` adresi çalışır.

## Sonraki Adımlar

- Kullanıcı & rol bazlı kimlik doğrulama eklenebilir.
- PostgreSQL üzerinde şema sürümlemeyi otomatize etmek için `prisma migrate` akışları CI/CD'ye entegre edilebilir.
- İçerikler için önizleme modu ve planlanmış yayınlama tarihleri eklenebilir.
