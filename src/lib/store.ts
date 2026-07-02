import { writable } from "svelte/store";

export type Source = {
  html: string;
  css: string;
  js: string;
};

const initialSourceCode: Source = {
  html: "<!-- HTML code goes here, use Cmd+\\ or Ctrl+\\ to show or hide editor view! -->\n",
  css: '',
  js: '',
};

export const sourceCode = writable<Source>(initialSourceCode);

export function formatCode(code: Source) {
  const style = code.css.trim() ? `<style>${code.css}</style>` : "";
  const script = code.js.trim() ? `<script>${code.js}</script>` : "";
  const html = code.html.trim();

  if (/<!doctype|<html[\s>]/i.test(html)) {
    let document = html;

    document = /<\/head>/i.test(document)
      ? document.replace(/<\/head>/i, `${style}\n</head>`)
      : `${style}\n${document}`;

    document = /<\/body>/i.test(document)
      ? document.replace(/<\/body>/i, `${script}\n</body>`)
      : `${document}\n${script}`;

    return document;
  }

  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    ${style}
  </head>
  <body>
    ${code.html}
    ${script}
  </body>
</html>`;
}
