"use client";

import Editor, { useMonaco } from "@monaco-editor/react";
import { useCallback, useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, LinkIcon, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { emmetHTML, emmetCSS } from "emmet-monaco-es";
import ChatUI from "./chat-ui";
import clsx from "clsx";

type HtmlCode = {
  html: string;
  css: string;
  js: string;
};

async function fetchCode(id?: string) {
  if (!id) return;
  return fetch("https://api.ahmadrosid.com/html/playgrounds/" + id).then(
    (res) => res.json()
  );
}

async function saveCode({ html, css, js }: HtmlCode) {
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
  });
}

export default function HtmlEditor({ id }: { id?: string }) {
  const router = useRouter();
  const monaco = useMonaco();

  const [hideEditor, setHideEditor] = useState(false);
  const [srcDocValue, setSrcDocValue] = useState("");
  const [shareLabel, setShareLabel] = useState("Share");
  const [loading, setLoading] = useState(false);
  const [loadingShareCode, setLoadingShareCode] = useState(false);
  const [code, setCode] = useState<HtmlCode>({
    html: "<h1>Hello world!</h1>",
    css: "",
    js: "",
  });

  const [htmlValue, setHtmlValue] = useState("");
  const debounceHtmlValue = useDebounce(htmlValue, 850);

  const [cssValue, setCssValue] = useState("");
  const debounceCssValue = useDebounce(cssValue, 850);

  const [jsValue, setJsValue] = useState("");
  const debounceJsValue = useDebounce(jsValue, 850);

  useEffect(() => {
    if (debounceHtmlValue) {
      updateSrcValue();
    }
  }, [debounceHtmlValue]);

  useEffect(() => {
    if (debounceCssValue) {
      updateSrcValue();
    }
  }, [debounceCssValue]);

  useEffect(() => {
    if (debounceJsValue) {
      updateSrcValue();
    }
  }, [debounceJsValue]);

  const handleCodeUpdate = useCallback(() => {
    if (!code) return;

    setSrcDocValue(
      `<script type="application/javascript">document.addEventListener("DOMContentLoaded", function(event) { ${code.js} });</script>\n` +
        `<style>${code.css}</style>\n` +
        code.html
    );

    if (cssValue == "") {
      setCssValue(code.css);
    }
    if (jsValue === "") {
      setJsValue(code.js);
    }
    if (htmlValue === "") {
      setHtmlValue(code.html);
    }
  }, [code, cssValue, jsValue, htmlValue, setSrcDocValue]);

  const submitShare = useCallback(() => {
    if (!code) return;
    setLoadingShareCode(true);
    saveCode(code)
      .then((response) => response.json())
      .then((data) => {
        router.push(data.data.id);
      })
      .finally(() => setLoadingShareCode(false));
  }, [code, router]);

  useEffect(() => {
    handleCodeUpdate();
  }, [handleCodeUpdate]);

  const updateSrcValue = () => {
    setCode({
      html: htmlValue,
      css: cssValue,
      js: jsValue,
    });
  };

  useEffect(() => {
    if (id) {
      setCode({
        html: "",
        css: "",
        js: "",
      });
      setLoading(true);
      fetchCode(id)
        .then((data) => {
          setCode(data.data);
          setCssValue(data.data.css);
          setJsValue(data.data.js);
          setHtmlValue(data.data.html);
        })
        .finally(() => setLoading(false));
    }
  }, [id, setCode]);

  const toggleEditorView = useCallback(() => {
    setHideEditor(prev => !prev);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check for Ctrl+\ or Cmd+\
      if ((event.ctrlKey || event.metaKey) && event.key === '\\') {
        toggleEditorView();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [toggleEditorView]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "w-full grid",
        hideEditor ? "grid-cols-1" : "grid-cols-2"
      )}
    >
      {hideEditor ? null : (
        <div className="w-full h-screen p-2 border-r relative">
          <Tabs defaultValue="html" className="relative">
            <div className="flex">
              <TabsList>
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="js">Javascript</TabsTrigger>
                {/* <TabsTrigger value="ai">AI Chat</TabsTrigger> */}

                <div className="absolute right-0">
                  <p className="text-sm px-2 inline-flex items-center gap-1">
                    Made with ❤️ by{" "}
                    <a
                      target="_blank"
                      href="https://ahmadrosid.com"
                      className="text-black font-semibold hover:text-blue-700 inline-flex gap-1 items-center"
                    >
                      ahmadrosid
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </TabsList>
              <div className="px-2 bg-white flex gap-2 items-center">
                <Button disabled={loadingShareCode} onClick={submitShare}>
                  {shareLabel}
                </Button>
                {id ? (
                  <p
                    onClick={() => {
                      setShareLabel("Copied!");
                      navigator.clipboard
                        .writeText(window.origin + "/" + id)
                        .then(() => {
                          setTimeout(() => setShareLabel("Share"), 2000);
                        });
                    }}
                    className="px-2 inline-flex items-center cursor-pointer text-gray-500"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>../{id}</span>
                  </p>
                ) : null}
              </div>
            </div>
            <TabsContent className="p-0 border-none rounded-none" value="html">
              {monaco && (
                <Editor
                  theme="light"
                  height="93vh"
                  language="html"
                  options={{
                    minimap: {
                      enabled: false,
                    },
                  }}
                  defaultValue={htmlValue}
                  onMount={(editor, monaco) => emmetHTML(monaco)}
                  onChange={(val) => setHtmlValue(val || "")}
                />
              )}
              {!monaco && <Loader2 className="animate-spin w-6 h-6" />}
            </TabsContent>
            <TabsContent className="p-0 border-none rounded-none" value="css">
              {monaco && (
                <Editor
                  theme="light"
                  height="93vh"
                  language="css"
                  options={{
                    minimap: {
                      enabled: false,
                    },
                  }}
                  defaultValue={cssValue}
                  onMount={(editor, monaco) => emmetCSS(monaco)}
                  onChange={(val) => setCssValue(val || "")}
                />
              )}
              {!monaco && <Loader2 className="animate-spin w-6 h-6" />}
            </TabsContent>
            <TabsContent className="p-0 border-none rounded-none" value="js">
              {monaco && (
                <Editor
                  theme="light"
                  height="93vh"
                  language="javascript"
                  options={{
                    minimap: {
                      enabled: false,
                    },
                  }}
                  defaultValue={jsValue}
                  onChange={(val) => setJsValue(val || "")}
                />
              )}
              {!monaco && <Loader2 className="animate-spin w-6 h-6" />}
            </TabsContent>
            <TabsContent className="p-0 border-none rounded-none" value="ai">
              <ChatUI />
            </TabsContent>
          </Tabs>
        </div>
      )}
      <div className="bg-white">
        <iframe
          width="100%"
          height="100%"
          className="h-screen"
          sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals"
          srcDoc={srcDocValue}
        />
      </div>
    </div>
  );
}
