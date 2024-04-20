"use client";

import Editor, { useMonaco } from "@monaco-editor/react";
import { useCallback, useEffect, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
// import { useLocalStorage } from "react-use";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useSearchParams } from "next/navigation";
import { ExternalLink, LinkIcon, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

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
  const [srcDocValue, setSrcDocValue] = useState("");
  const [shareLabel, setShareLabel] = useState("Share");
  const [loading, setLoading] = useState(false);
  const [loadingShareCode, setLoadingShareCode] = useState(false);
  const [code, setCode] = useState<HtmlCode>({
    html: "<h1>Hello world!</h1>",
    css: "",
    js: "",
  });

  // const [code, setCode, remove] = useLocalStorage(
  //   "codeHtml",
  //   (queryCode &&
  //     (JSON.parse(
  //       Buffer.from(queryCode as string, "base64").toString()
    //   ) as HtmlCode)) || {
    //   html: "<h1>Hello world!</h1>",
    //   css: "",
    //   js: "",
    // }
  // );

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

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-2">
      <div className="w-full h-screen p-2 border-r">
        <Tabs defaultValue="html" className="relative">
          <div className="flex">
            <TabsList>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="js">Javascript</TabsTrigger>

              <div className="absolute right-0">
                <p className="text-sm px-2">
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
        </Tabs>
      </div>
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
