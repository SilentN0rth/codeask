# 🚀 CodeAsk - Portfolio Project

<div align="center">

![CodeAsk Logo](public/Logo.svg)

**Nowoczesna platforma Q&A dla programistów**  
_Zadawaj pytania, dziel się wiedzą i rozwijaj się razem z społecznością_

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.50.0-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 🎯 O projekcie

**CodeAsk** to pełnofunkcjonalna platforma Q&A (Questions & Answers) stworzona dla programistów. Projekt demonstruje zaawansowane umiejętności w zakresie nowoczesnego developmentu webowego, wykorzystując najnowsze technologie i najlepsze praktyki.

### 🏆 Kluczowe osiągnięcia

- **Pełnofunkcjonalna aplikacja** z systemem autoryzacji, czatem w czasie rzeczywistym i zaawansowanym UI
- **Nowoczesny stack technologiczny** - Next.js 15, React 19, TypeScript, Supabase
- **Responsywny design** z płynnymi animacjami i intuicyjnym UX
- **Real-time funkcjonalności** - czat, powiadomienia, status online/offline
- **Zaawansowane funkcje** - system punktów, odznak, wyszukiwanie, filtry

---

## 🚀 Szybki start dla rekruterów

### ⚡ Demo w 3 krokach

1. **Sklonuj repozytorium**

```bash
git clone https://github.com/SilentN0rth/codeask.git
cd codeask
```

2. **Zainstaluj i uruchom**

```bash
npm i
npm run dev
```

3. **Otwórz aplikację**

```
http://localhost:3000
```

### 🔑 Dane testowe

**Dostępne konta do testowania:**

#### 👤 Konto Demo
```
📧 Email: demo@codeask.com
🔒 Hasło: demo123456
```

#### 👨‍💼 Konto Administratora
```
📧 Email: admin@codeask.com
🔒 Hasło: admin123456
```

> **💡 Wskazówka:** Po zalogowaniu możesz od razu testować wszystkie funkcje - zadawanie pytań, odpowiadanie, czat, system punktów. Konto administratora ma dodatkowe uprawnienia do zarządzania platformą.

---

## 🌐 Live Preview

### 🚀 Demo aplikacji

**Aplikacja jest dostępna online pod adresem:**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-blue?style=for-the-badge&logo=vercel)](https://codeask.vercel.app)

**🔗 Link:** https://codeask.vercel.app

### 📱 Co możesz przetestować online:

- ✅ **Rejestracja i logowanie** - Pełny flow autoryzacji
- ✅ **Tworzenie pytań** - Zaawansowany edytor z podglądem
- ✅ **System odpowiedzi** - Głosowanie i komentarze
- ✅ **Real-time czat** - Messaging między użytkownikami
- ✅ **Profile użytkowników** - Edycja danych i statystyki
- ✅ **Wyszukiwanie i filtry** - Zaawansowane opcje wyszukiwania
- ✅ **Responsywny design** - Test na mobile/tablet/desktop
- ✅ **System punktów** - Gamifikacja i ranking

### 🎯 Testowanie online:

> **💡 Wskazówka:** Demo używa tej samej bazy danych co lokalna wersja, więc możesz testować funkcje real-time między różnymi sesjami. Użyj danych testowych z sekcji powyżej.

---

## 🛠️ Stack technologiczny

### Frontend

- **Next.js 15.3.2** - App Router, Server Components, Middleware
- **React 19.1.0** - Najnowsza wersja z Concurrent Features
- **TypeScript** - Pełne typowanie, strict mode
- **Tailwind CSS** - Utility-first CSS, custom design system
- **HeroUI** - Nowoczesne komponenty UI
- **Framer Motion** - Zaawansowane animacje i transitions

### Backend & Database

- **Supabase** - Backend-as-a-Service, Auth, Real-time
- **PostgreSQL** - Relacyjna baza danych
- **Real-time subscriptions** - WebSocket connections
- **Row Level Security (RLS)** - Bezpieczeństwo na poziomie bazy

### Narzędzia deweloperskie

- **ESLint + Prettier** - Code quality i formatting
- **TypeScript** - Type safety i IntelliSense
- **Next.js Middleware** - Route protection i redirects

---

## 📱 Główne funkcjonalności

### 🔐 System autoryzacji

- Rejestracja i logowanie przez email/hasło
- Protected routes z middleware
- Context API dla zarządzania stanem użytkownika
- Automatyczne przekierowania

### ❓ System pytań i odpowiedzi

- **Tworzenie pytań** z zaawansowanym edytorem TinyMCE
- **System tagów** z automatycznym sugerowaniem
- **Głosowanie** (like/dislike) z real-time updates
- **Odpowiedzi** z możliwością edycji
- **Wyszukiwanie** z filtrami i sortowaniem

### 💬 Czat w czasie rzeczywistym

- **Real-time messaging** przez Supabase Realtime
- **Status online/offline** użytkowników
- **Historia konwersacji** z paginacją
- **Powiadomienia** o nowych wiadomościach

### 👥 System użytkowników

- **Profile użytkowników** z edycją danych
- **System obserwowania** (follow/unfollow)
- **Historia aktywności** z timeline
- **Statystyki** - punkty, pytania, odpowiedzi

### 🏆 System gamifikacji

- **Punkty** za aktywność (pytania, odpowiedzi, głosy)
- **Odznaki** za osiągnięcia
- **Tablica wyników** z rankingiem
- **System poziomów** użytkowników

### 🎨 UI/UX

- **Responsywny design** - mobile-first approach
- **Tryb ciemny** z system theme
- **Płynne animacje** z Framer Motion
- **Loading states** i error handling
- **Toast notifications** dla feedback

---

## 🏗️ Architektura projektu

```
codeask/
├── app/                 # Next.js 15 App Router
│   ├── (login)/         # Route groups
│   ├── (register)/
│   ├── api/             # API routes
│   ├── questions/       # Dynamic routes [slug]
│   ├── users/           # User profiles
│   └── chat/            # Real-time chat
├── components/
│   ├── layout/          # Layout components
│   └── ui/              # Reusable UI components
├── supabase/            # Database services
│   ├── client/          # Client-side functions
│   └── server/          # Server-side functions
├── hooks/               # Custom React hooks
├── context/             # React Context providers
├── lib/                 # Utilities, schemas, helpers
└── types/               # TypeScript definitions
```

### 🔧 Kluczowe wzorce architektoniczne

- **Server/Client Components** - Optymalizacja wydajności
- **Custom Hooks** - Logika biznesowa w hookach
- **Context API** - Global state management
- **TypeScript** - Type safety w całej aplikacji
- **Middleware** - Route protection i redirects

---

## 🎯 Funkcjonalności do testowania

### ✅ Co można przetestować od razu:

1. **Rejestracja/Logowanie** - Użyj danych testowych powyżej
2. **Tworzenie pytań** - Edytor TinyMCE z podglądem
3. **System tagów** - Automatyczne sugerowanie i filtrowanie
4. **Głosowanie** - Like/dislike z real-time updates
5. **Czat** - Real-time messaging między użytkownikami
6. **Profil użytkownika** - Edycja danych, statystyki
7. **Wyszukiwanie** - Filtry, sortowanie, paginacja
8. **Responsywność** - Test na różnych urządzeniach

### 🔍 Szczegóły techniczne do oceny:

- **Performance** - Server Components, lazy loading
- **SEO** - Metadata, structured data
- **Accessibility** - ARIA labels, keyboard navigation
- **Error handling** - Try/catch, error boundaries
- **Code quality** - TypeScript, ESLint, clean code

---

## 📊 Metryki projektu

- **~180+ komponentów** React
- **~10+ custom hooks**
- **~20+ plików API endpoints**
- **~15+ plików typów TypeScript**
- **100% TypeScript coverage**
- **Responsive design** (mobile, tablet, desktop)
- **Real-time features** (chat)

---

## 🚀 Deployment

Aplikacja jest gotowa do deploymentu na:

- **Vercel** (zalecane dla Next.js)
- **Netlify**
- **Docker** (z odpowiednią konfiguracją)

---

## 📞 Kontakt

**Autor:** Maksymilian Szewczyk</br>
**Email:** <a href="mailto:max.szewczyk@interia.pl">max.szewczyk@interia.pl</a></br>
**LinkedIn:** https://www.linkedin.com/in/maksymilian-szewczyk/</br>

<!-- **Portfolio:** </br> -->

---

<div align="center">

**Dziękuję za zainteresowanie projektem!** 🚀

_Zapraszam do testowania i oceny kodu_

</div>
