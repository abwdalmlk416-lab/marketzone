import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Language } from "@/lib/i18n";

interface LanguageSwitcherProps {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export function LanguageSwitcher({ variant = "default", size = "default" }: LanguageSwitcherProps) {
  const { language, setLanguage, dir } = useLanguage();

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: "ar", name: "Arabic", nativeName: "العربية" },
    { code: "en", name: "English", nativeName: "English" },
  ];

  const currentLang = languages.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="gap-2"
        >
          <Globe className="w-4 h-4" />
          {size !== "icon" && (
            <>
              <span className="hidden sm:inline">{currentLang?.nativeName}</span>
              <span className="sm:hidden uppercase">{language}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${
              language === lang.code ? "bg-primary/10 font-semibold" : ""
            }`}
          >
            <span className="ml-2">{lang.code === "ar" ? "🇮🇶" : "🇺🇸"}</span>
            {lang.nativeName}
            <span className="mr-auto text-muted-foreground text-xs">
              {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

