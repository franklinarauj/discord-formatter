import { useState, useEffect } from 'react';
import { Copy, Check, TerminalSquare, Sparkles, Settings2 } from 'lucide-react';
import flourite from 'flourite';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'sql', label: 'SQL' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'bash', label: 'Bash' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'yaml', label: 'YAML' },
];

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [copied, setCopied] = useState(false);
  const [isAuto, setIsAuto] = useState(true);

  // Efeito para detecção automática
  useEffect(() => {
    if (isAuto && code.trim().length > 0) {
      // Aplicar um debounce suave
      const detect = setTimeout(() => {
        // Obter linguagem e usar compatibilidade com formato "shiki" (que combina melhor com markdown)
        const result = flourite(code, { shiki: true, noUnknown: true });
        if (result && result.language) {
          setLanguage(result.language.toLowerCase());
        }
      }, 400); 
      return () => clearTimeout(detect);
    }
  }, [code, isAuto]);

  const handleTabChange = (auto) => {
    setIsAuto(auto);
    if (auto && code.trim().length > 0) {
      const result = flourite(code, { shiki: true, noUnknown: true });
      if (result && result.language) {
        setLanguage(result.language.toLowerCase());
      }
    }
  };

  const formattedCode = code ? `\`\`\`${language}\n${code}\n\`\`\`` : '';

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(formattedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="min-h-screen bg-discord-bg text-discord-text p-4 md:p-8 flex flex-col items-center">
      <header className="mb-10 w-full max-w-6xl flex flex-col md:flex-row items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-discord-blue rounded-2xl shadow-lg shadow-discord-blue/20 flex items-center justify-center">
            <TerminalSquare className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Discord Formatter</h1>
            <p className="text-sm text-gray-400 mt-1 font-medium">Formate blocos de código Markdown facilmente</p>
          </div>
        </div>
        
        <a 
          href="https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-discord-blue hover:text-discord-blue-hover transition-colors font-medium hover:underline flex items-center gap-1"
        >
          Guia Markdown do Discord
        </a>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-grow">
        
        {/* Lado Esquerdo - Editor */}
        <section className="flex flex-col">
          <div className="bg-discord-sidebar rounded-2xl border border-discord-divider overflow-hidden shadow-2xl transition-all duration-300 flex flex-col h-[600px]">
            
            <div className="p-4 border-b border-discord-divider bg-[#232428] flex flex-col gap-4 shadow-sm">
              <div className="flex bg-[#1E1F22] p-1 rounded-lg self-start">
                <button
                  onClick={() => handleTabChange(true)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    isAuto ? 'bg-[#3F4147] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Automático
                </button>
                <button
                  onClick={() => handleTabChange(false)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    !isAuto ? 'bg-[#3F4147] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Settings2 className="w-4 h-4" />
                  Manual
                </button>
              </div>

              <div className="flex justify-between items-center">
                <label htmlFor="language-select" className="font-semibold text-sm text-gray-300 uppercase tracking-wider">
                  Linguagem {isAuto && <span className="text-discord-blue tracking-normal normal-case text-xs ml-2 font-normal">(Detectada pelo Robô)</span>}
                </label>
                <div className="relative">
                  <select
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={isAuto}
                    className={`appearance-none text-sm rounded-lg pl-3 pr-8 py-2 outline-none focus:ring-2 focus:ring-discord-blue focus:border-transparent transition-all font-medium ${
                      isAuto 
                        ? 'bg-[#1E1F22] border border-transparent text-discord-blue opacity-100 cursor-not-allowed shadow-inner' 
                        : 'bg-discord-code-bg border border-discord-divider text-gray-200 cursor-pointer'
                    }`}
                  >
                    {!LANGUAGES.find(l => l.value === language) && (
                      <option value={language}>{language.charAt(0).toUpperCase() + language.slice(1)}</option>
                    )}
                    {LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${isAuto ? 'text-discord-blue' : 'text-gray-400'}`}>
                    {isAuto ? <Sparkles className="h-3.5 w-3.5" /> : <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-1 bg-discord-sidebar flex-grow">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Cole ou digite seu código bruto aqui... a sintaxe será detectada."
                className="w-full h-full bg-discord-code-bg border border-transparent rounded-lg p-5 font-mono text-[14px] leading-relaxed resize-none outline-none focus:ring-2 focus:ring-discord-blue/50 transition-all text-gray-300 placeholder-gray-500"
                spellCheck="false"
              />
            </div>
          </div>
        </section>

        {/* Lado Direito - Preview & Ações */}
        <section className="flex flex-col">
          <div className="bg-discord-sidebar rounded-2xl border border-discord-divider overflow-hidden shadow-2xl flex flex-col h-[600px] relative">
            <div className="p-4 border-b border-discord-divider bg-[#232428] flex justify-between items-center shadow-sm h-[133px] box-border">
              {/* Box border is used to make both headers match height if necessary. 
                  Given the left header is taller because of tabs, let's just make it center or use flex. 
                  Wait, explicitly adjusting height might break responsiveness. Let's just use flex. */}
              <div className="h-full flex flex-col justify-end pb-1 w-full">
                <div className="flex justify-between items-center w-full mt-auto">
                  <h2 className="font-semibold text-sm text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    Preview Final
                  </h2>
                  <button
                    onClick={handleCopy}
                    disabled={!code}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                      copied 
                        ? 'bg-green-600 text-white' 
                        : !code 
                          ? 'bg-discord-blue/30 text-white/40 cursor-not-allowed'
                          : 'bg-discord-blue text-white hover:bg-discord-blue-hover shadow-lg hover:shadow-discord-blue/30'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado!' : 'Copiar p/ Markdown'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-discord-sidebar flex-grow overflow-hidden flex flex-col">
              <div className="bg-[#1E1F22] border border-[#1E1F22] rounded-lg p-4 font-mono text-[13px] leading-relaxed overflow-auto shadow-inner flex-grow relative group">
                {code ? (
                  <pre className="text-[#DBDEE1]">
                    <span className="text-gray-500 block mb-2 select-none opacity-80">{`\`\`\`${language}`}</span>
                    <code className="text-[#DBDEE1] block min-w-full">
                      {code}
                    </code>
                    <span className="text-gray-500 block mt-2 select-none opacity-80">{`\`\`\``}</span>
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 italic opacity-60 px-4 text-center">
                    O preview com a sintaxe vai renderizar aqui. Cole para analisar.
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </section>

      </main>
      
      <footer className="mt-12 text-center text-gray-500 text-xs shadow-black">
        Feito para organizar e facilitar o envio de código com a sintaxe do Discord
      </footer>
    </div>
  );
}

export default App;
