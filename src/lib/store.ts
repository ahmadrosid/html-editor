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
    return `<script type="application/javascript">document.addEventListener("DOMContentLoaded", function(event) { ${code.js} });</script>\n` +
        `<style>${code.css}</style>\n` +
        code.html;
}