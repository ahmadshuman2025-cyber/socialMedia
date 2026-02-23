import { useEffect, useRef } from "react";

export default function GoogleTranslate() {
  const divRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "ar,en,fr,es,de,tr",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        divRef.current?.id
      );
    };

    return () => {
      const banner = document.querySelector(".goog-te-banner-frame");
      if (banner) banner.remove();
    };
  }, []);

  return (
    <div className="mx-6 mt-6 p-3 rounded-lg border border-gray-200 bg-gray-50">
      <div className="text-sm font-medium text-gray-700 mb-2">Translate</div>
      <div id="gt-container" ref={divRef} />
      <p className="mt-2 text-[11px] text-gray-500">
        Powered by Google Translate
      </p>
    </div>
  );
}
