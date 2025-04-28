
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

interface HeaderProps {
  mode: "hiring" | "searching";
  setMode: (mode: "hiring" | "searching") => void;
}

const Header = ({ mode, setMode }: HeaderProps) => {
  const { t, changeLanguage, availableLanguages, language } = useLanguage();

  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8 border-b">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start">
          <h1 className="text-3xl font-bold text-primary">{t('appName')}</h1>
          <p className="text-sm text-gray-600">{t('tagline')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex bg-secondary rounded-lg p-1">
            <Button
              variant={mode === "hiring" ? "default" : "ghost"}
              onClick={() => setMode("hiring")}
              className="rounded-md px-4"
            >
              {t('imHiring')}
            </Button>
            <Button
              variant={mode === "searching" ? "default" : "ghost"}
              onClick={() => setMode("searching")}
              className="rounded-md px-4"
            >
              {t('lookingForJob')}
            </Button>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(availableLanguages).map(([code, name]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => changeLanguage(code)}
                  className={language === code ? "bg-secondary" : ""}
                >
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
