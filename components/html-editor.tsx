"use client";

import Editor, { useMonaco } from "@monaco-editor/react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/use-debounce";
import { useLocalStorage } from "react-use";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { ExternalLink, Loader2 } from "lucide-react";

type HtmlCode = {
  html: string;
  css: string;
  js: string;
};

export default function HtmlEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryCode = searchParams.get("codeHtml");
  const monaco = useMonaco();
  const [srcDocValue, setSrcDocValue] = useState("");
  const [code, setCode, remove] = useLocalStorage(
    "codeHtml",
    (queryCode &&
      (JSON.parse(
        Buffer.from(queryCode as string, "base64").toString()
      ) as HtmlCode)) || {
      html: "<h1>Hello world!</h1>",
      css: "",
      js: "",
    }
  );

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

  return (
    <div className="w-full grid grid-cols-2">
      <div className="w-full h-screen p-2 border-r">
        <Tabs defaultValue="html" className="relative">
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
