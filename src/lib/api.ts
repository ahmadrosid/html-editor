import type { Source } from "./store";

export async function fetchCode(id?: string) {
  if (!id) return;
  return fetch("https://api.ahmadrosid.com/html/playgrounds/" + id).then(
    (res) => res.json()
  );
}

export async function saveCode({ html, css, js }: Source) {
  return fetch("https://api.ahmadrosid.com/html/playgrounds", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: html,
      css: css,
      js: js,
    }),
  }).then(
    (res) => res.json()
  );
}
