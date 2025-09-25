/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-empty */
/* eslint-disable no-console */
/* eslint-disable quotes */
import hljs from 'highlight.js';

// Załaduj potrzebne języki
import 'highlight.js/lib/languages/css';
import 'highlight.js/lib/languages/javascript';
import 'highlight.js/lib/languages/typescript';
import 'highlight.js/lib/languages/xml';
import 'highlight.js/lib/languages/python';
import 'highlight.js/lib/languages/cpp';
import 'highlight.js/lib/languages/java';
import 'highlight.js/lib/languages/php';
import 'highlight.js/lib/languages/ruby';
import 'highlight.js/lib/languages/go';
import 'highlight.js/lib/languages/rust';
import 'highlight.js/lib/languages/sql';
import 'highlight.js/lib/languages/json';
import 'highlight.js/lib/languages/yaml';
import 'highlight.js/lib/languages/bash';
import 'highlight.js/lib/languages/markdown';

/**
 * Deescapuje HTML entities w kodzie
 * @param code - kod z HTML entities
 * @returns kod z prawdziwymi znakami HTML
 */
function unescapeHtml(code: string): string {
  return code
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}

/**
 * Konwertuje klasy highlight.js na klasy token Prism.js
 * @param hljsContent - zawartość z highlight.js
 * @returns zawartość z klasami token
 */
function convertHljsToPrismTokens(hljsContent: string): string {
  const classMap: Record<string, string> = {
    'hljs-selector-tag': 'token selector',
    'hljs-selector-class': 'token selector',
    'hljs-selector-id': 'token selector',
    'hljs-selector-attr': 'token selector',
    'hljs-selector-pseudo': 'token selector',
    'hljs-attribute': 'token property',
    'hljs-value': 'token string',
    'hljs-keyword': 'token keyword',
    'hljs-string': 'token string',
    'hljs-number': 'token number',
    'hljs-function': 'token function',
    'hljs-title': 'token function',
    'hljs-title function_': 'token function',
    'hljs-params': 'token punctuation',
    'hljs-comment': 'token comment',
    'hljs-name': 'token tag',
    'hljs-tag': 'token tag',
    'hljs-attr': 'token attr-name',
    'hljs-built_in': 'token builtin',
    'hljs-type': 'token type',
    'hljs-variable': 'token variable',
    'hljs-literal': 'token literal',
    'hljs-symbol': 'token symbol',
    'hljs-regexp': 'token regex',
    'hljs-meta': 'token meta',
  };

  let result = hljsContent;

  for (const [hljsClass, tokenClass] of Object.entries(classMap)) {
    const regex = new RegExp(`<span class="${hljsClass}">`, 'g');
    result = result.replace(regex, `<span class="${tokenClass}">`);
  }

  {
  }
  result = result.replace(
    /<span class="hljs-([^"]*)">/g,
    '<span class="token $1">'
  );

  return result;
}

/**
 * Konwertuje HTML z kodami na HTML z klasami token
 * Działa zarówno po stronie serwera jak i klienta
 * @param html - HTML zawierający <pre class="language-*"><code>
 * @returns HTML z <span class="token *"> elementami
 */
export async function highlightCodeInHTML(html: string): Promise<string> {
  if (!html) return html;

  try {
    {
    }
    const preCodeRegex =
      /<pre class="language-([^"]+)"><code>([^<]*)<\/code><\/pre>/g;

    const result = Array.from(html.matchAll(preCodeRegex)).map((match) => {
      const [fullMatch, language, code] = match;

      try {
        {
        }
        const languageMap: Record<string, string> = {
          markup: 'xml', // TinyMCE używa 'markup' dla HTML/XML
          html: 'xml',
          xml: 'xml',
          svg: 'xml',
        };

        const hljsLanguage = languageMap[language] || language;

        {
        }
        const unescapedCode = unescapeHtml(code);

        {
        }
        const highlighted = hljs.highlight(unescapedCode, {
          language: hljsLanguage as any,
        });

        const convertedContent = convertHljsToPrismTokens(highlighted.value);

        const finalContent = unescapeHtml(convertedContent);

        return `<pre class="language-${language}"><code>${finalContent}</code></pre>`;
      } catch (error) {
        console.warn(`Nie można stylować kodu dla języka: ${language}`, error);
        return fullMatch;
      }
    });

    let index = 0;
    return html.replace(preCodeRegex, () => result[index++]);
  } catch (error) {
    console.error('Błąd w highlightCodeInHTML:', error);
    return html;
  }
}

/**
 * Konwertuje pojedynczy blok kodu na HTML z klasami token
 * @param code - kod do stylowania
 * @param language - język programowania
 * @returns HTML z klasami token
 */
export async function highlightCode(
  code: string,
  language: string
): Promise<string> {
  try {
    {
    }
    const languageMap: Record<string, string> = {
      markup: 'xml', // TinyMCE używa 'markup' dla HTML/XML
      html: 'xml',
      xml: 'xml',
      svg: 'xml',
    };

    const hljsLanguage = languageMap[language] || language;

    {
    }
    const unescapedCode = unescapeHtml(code);

    const highlighted = hljs.highlight(unescapedCode, {
      language: hljsLanguage as any,
    });
    const convertedContent = convertHljsToPrismTokens(highlighted.value);

    {
    }
    return unescapeHtml(convertedContent);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Nie można stylować kodu dla języka: ${language}`, error);
    return code;
  }
}
