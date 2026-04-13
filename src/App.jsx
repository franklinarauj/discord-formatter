import { useState, useEffect, useRef } from 'react';
import { Copy, Check, TerminalSquare, Sparkles, Settings2, History, AlertTriangle, Bold, Underline, UserRound, Code2, Trash2, WandSparkles } from 'lucide-react';
import flourite from 'flourite';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  { value: 'ansi', label: 'Discord ANSI (Cores)' },
];

const ANSI_STYLES = [
  { label: 'Negrito', code: '1', icon: <Bold className="w-3 h-3" /> },
  { label: 'Sublinhado', code: '4', icon: <Underline className="w-3 h-3" /> },
];

const ANSI_COLORS = [
  { label: 'Cinza', code: '30', bg: 'bg-gray-500' },
  { label: 'Vermelho', code: '31', bg: 'bg-red-500' },
  { label: 'Verde', code: '32', bg: 'bg-green-500' },
  { label: 'Amarelo', code: '33', bg: 'bg-yellow-500' },
  { label: 'Azul', code: '34', bg: 'bg-blue-500' },
  { label: 'Rosa', code: '35', bg: 'bg-pink-500' },
  { label: 'Ciano', code: '36', bg: 'bg-cyan-500' },
  { label: 'Branco', code: '37', bg: 'bg-white' },
];

// Parser para renderizar ANSI real no React
function renderAnsiToReact(text) {
  if (!text) return null;
  // eslint-disable-next-line no-control-regex
  const regex = /\x1b\[([0-9;]*)m/g;
  const result = [];
  let lastIndex = 0;
  let currentStyles = {};
  let match;

  const styleMap = {
    '1': { fontWeight: 'bold' },
    '4': { textDecoration: 'underline' },
    '30': { color: '#6b737f' },
    '31': { color: '#f23f42' },
    '32': { color: '#23a559' },
    '33': { color: '#f0b232' },
    '34': { color: '#5865f2' },
    '35': { color: '#eb459e' },
    '36': { color: '#00bcd4' },
    '37': { color: '#ffffff' },
  };

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(
        <span style={{ ...currentStyles }} key={lastIndex}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }
    const codes = match[1].split(';');
    for (const code of codes) {
      if (code === '0' || code === '') {
        currentStyles = {}; // Reset
      } else if (styleMap[code]) {
        currentStyles = { ...currentStyles, ...styleMap[code] };
      }
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    result.push(
      <span style={{ ...currentStyles }} key={lastIndex}>
        {text.substring(lastIndex)}
      </span>
    );
  }
  return result;
}

const loadDraft = () => {
  try {
    const draft = localStorage.getItem('discord-formatter-draft');
    return draft ? JSON.parse(draft) : null;
  } catch {
    return null;
  }
};

function App() {
  const initialDraft = loadDraft();
  
  const [code, setCode] = useState(initialDraft?.code || '');
  const [language, setLanguage] = useState(initialDraft?.language || 'javascript');
  const [isAuto, setIsAuto] = useState(initialDraft?.isAuto !== undefined ? initialDraft.isAuto : true);
  const [copied, setCopied] = useState(false);
  const [ansiPreviewMode, setAnsiPreviewMode] = useState('raw'); // 'raw' | 'rendered'
  
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('discord-formatter-history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);
  
  const textareaRef = useRef(null);
  const historyRef = useRef(null);

  // Close history dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (historyRef.current && !historyRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Save drafts persistently in real-time
  useEffect(() => {
    localStorage.setItem('discord-formatter-draft', JSON.stringify({ code, language, isAuto }));
  }, [code, language, isAuto]);

  // Efeito para detecção automática
  useEffect(() => {
    if (isAuto && code.trim().length > 0) {
      const detect = setTimeout(() => {
        // Ignorar Auto-detect quando estivemos usando ansi que deve ser estritamente manual 
        if (language === 'ansi') return; 
        
        const result = flourite(code, { shiki: true, noUnknown: true });
        if (result && result.language) {
          setLanguage(result.language.toLowerCase());
        }
      }, 400); 
      return () => clearTimeout(detect);
    }
  }, [code, isAuto, language]);

  const handleTabChange = (auto) => {
    setIsAuto(auto);
    if (!auto && language === 'ansi') {
      // Keep ansi if manual
    } else if (auto && code.trim().length > 0) {
      const result = flourite(code, { shiki: true, noUnknown: true });
      if (result && result.language) {
        setLanguage(result.language.toLowerCase());
      } else {
        setLanguage('javascript'); // default fallback
      }
    }
  };

  const formattedCode = code ? `\`\`\`${language}\n${code}\n\`\`\`` : '';
  const charCount = formattedCode.length;
  const isOverLimit = charCount > 2000;

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(formattedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Save History (Max 5)
      const newEntry = { 
        id: Date.now(),
        code, 
        language, 
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      };
      
      setHistory(prev => {
        const next = [newEntry, ...prev.filter(h => h.code !== code)].slice(0, 5);
        localStorage.setItem('discord-formatter-history', JSON.stringify(next));
        return next;
      });

    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const loadHistoryItem = (item) => {
    setCode(item.code);
    setLanguage(item.language);
    setIsAuto(false);
    setShowHistory(false);
  };

  const insertAnsi = (ansiCode) => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd } = textareaRef.current;
    
    const selectedText = code.substring(selectionStart, selectionEnd);
    const before = code.substring(0, selectionStart);
    const after = code.substring(selectionEnd);
    
    // Note: using the actual escape character \u001b
    const insertion = `\x1b[${ansiCode}m${selectedText}\x1b[0m`;
    const newCode = before + insertion + after;
    
    setCode(newCode);
    
    setTimeout(() => {
      textareaRef.current.focus();
      const newCursor = selectedText 
        ? selectionStart + insertion.length 
        : selectionStart + ansiCode.length + 3; // +3 for \x1b[ m
      textareaRef.current.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('discord-formatter-history');
  };

  return (
    <div className="min-h-screen bg-discord-bg text-discord-text p-4 md:p-8 flex flex-col items-center">
      <header className="mb-10 w-full max-w-6xl flex flex-col md:flex-row items-center md:justify-between gap-6 relative">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-discord-blue rounded-2xl shadow-lg shadow-discord-blue/20 flex items-center justify-center">
            <TerminalSquare className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Discord Formatter</h1>
            <p className="text-sm text-gray-400 mt-1 font-medium">Formate blocos de código Markdown facilmente</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative" ref={historyRef}>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-1.5 rounded-lg bg-discord-sidebar border border-discord-divider text-gray-300 text-sm font-medium hover:bg-[#3F4147] transition-colors flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              Recentes
            </button>
            {showHistory && (
              <div className="absolute top-full mt-2 right-0 w-64 bg-discord-sidebar border border-discord-divider rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-discord-divider bg-[#232428] flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Histórico</span>
                  {history.length > 0 && (
                    <button 
                      onClick={handleClearHistory}
                      title="Limpar Histórico"
                      className="p-1 hover:bg-[#3F4147] rounded-md text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {history.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-500 italic">Nenhum histórico recente</div>
                  ) : (
                    history.map(item => (
                      <button 
                        key={item.id} 
                        onClick={() => loadHistoryItem(item)}
                        className="w-full text-left px-3 py-2.5 border-b border-discord-divider/50 hover:bg-[#3F4147] transition-colors flex flex-col gap-1 last:border-0"
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-semibold text-discord-blue">{item.language}</span>
                          <span className="text-[10px] text-gray-500">{item.timestamp}</span>
                        </div>
                        <span className="text-[11px] text-gray-300 font-mono truncate opacity-80 select-none">
                          {item.code}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <a 
            href="https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-discord-blue hover:text-discord-blue-hover transition-colors font-medium hover:underline flex items-center gap-1"
          >
            Guia Markdown do Discord
          </a>
        </div>
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
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      if (e.target.value === 'ansi') setIsAuto(false);
                    }}
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
                    {isAuto ? <WandSparkles className="h-3.5 w-3.5" /> : <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>}
                  </div>
                </div>
              </div>
            </div>
            
            {/* ANSI Toolbar */}
            {language === 'ansi' && (
              <div className="px-4 py-2 bg-[#2B2D31] border-b border-discord-divider flex items-center gap-3 overflow-x-auto">
                <span className="text-[11px] font-bold text-gray-400 tracking-wider">ESTILOS ANSI:</span>
                <div className="flex gap-1">
                  {ANSI_STYLES.map(style => (
                    <button
                      key={style.label}
                      onClick={() => insertAnsi(style.code)}
                      title={style.label}
                      className="p-1.5 rounded bg-[#1E1F22] text-gray-300 hover:text-white hover:bg-discord-blue transition-colors border border-transparent shadow-sm"
                    >
                      {style.icon}
                    </button>
                  ))}
                </div>
                <div className="w-px h-4 bg-discord-divider mx-1"></div>
                <div className="flex gap-1.5 items-center">
                  {ANSI_COLORS.map(color => (
                    <button
                      key={color.label}
                      onClick={() => insertAnsi(color.code)}
                      title={color.label}
                      className={`w-5 h-5 rounded-full ${color.bg} shadow-sm border border-black/20 hover:scale-110 transition-transform`}
                    />
                  ))}
                  <button
                    onClick={() => insertAnsi('0')}
                    title="Resetar Formatação"
                    className="ml-1 text-[10px] font-bold text-gray-400 hover:text-white px-2 py-1 bg-[#1E1F22] rounded cursor-pointer"
                  >
                    RESET
                  </button>
                </div>
              </div>
            )}

            <div className="p-1 bg-discord-sidebar flex-grow">
              <textarea
                ref={textareaRef}
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
            <div className={`p-4 border-b border-discord-divider bg-[#232428] flex justify-between items-center shadow-sm box-border ${language === 'ansi' ? 'h-[171px]' : 'h-[133px]'} transition-all duration-300`}>
              <div className="h-full flex flex-col justify-end pb-1 w-full">
                
                {/* Character Counter Indicator */}
                <div className="mb-2 self-end text-xs font-mono font-medium flex items-center gap-1.5">
                  <span className={isOverLimit ? 'text-red-500' : 'text-gray-400'}>
                    {charCount} <span className="opacity-50">/</span> 2000
                  </span>
                  {isOverLimit && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                </div>

                <div className="flex justify-between items-center w-full mt-auto">
                  {language === 'ansi' ? (
                    <div className="flex bg-[#1E1F22] p-1 rounded-lg">
                      <button 
                        onClick={() => setAnsiPreviewMode('raw')} 
                        className={`px-3 py-1 text-xs rounded transition-all font-medium flex items-center gap-1.5 ${ansiPreviewMode === 'raw' ? 'bg-[#3F4147] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                      >
                        <Code2 className="w-3 h-3" />
                        Código Bruto
                      </button>
                      <button 
                        onClick={() => setAnsiPreviewMode('rendered')} 
                        className={`px-3 py-1 text-xs rounded transition-all font-medium flex items-center gap-1.5 ${ansiPreviewMode === 'rendered' ? 'bg-discord-blue text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                      >
                        <UserRound className="w-3 h-3" />
                        Visão do Usuário
                      </button>
                    </div>
                  ) : (
                    <h2 className="font-semibold text-sm text-gray-300 uppercase tracking-wider flex items-center gap-2">
                      Preview Final
                    </h2>
                  )}

                  <button
                    onClick={handleCopy}
                    disabled={!code || isOverLimit}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                      isOverLimit 
                        ? 'bg-red-500/20 text-red-400 cursor-not-allowed border border-red-500/30'
                        : copied 
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
                  <>
                    {language === 'ansi' && ansiPreviewMode === 'rendered' ? (
                       <div className="text-[#DBDEE1] font-mono whitespace-pre-wrap">
                          {renderAnsiToReact(code)}
                       </div>
                    ) : language === 'ansi' ? (
                      <pre className="text-[#DBDEE1] m-0 p-0 font-mono">
                        <span className="text-gray-500 block mb-2 select-none opacity-80">{`\`\`\`ansi`}</span>
                        <code className="text-[#DBDEE1] block min-w-full" style={{ whiteSpace: 'pre-wrap' }}>
                          {/* eslint-disable-next-line no-control-regex */}
                          {code.replace(/\x1b/g, '\\u001b')}
                        </code>
                        <span className="text-gray-500 block mt-2 select-none opacity-80">{`\`\`\``}</span>
                      </pre>
                    ) : (
                      <pre className="text-[#DBDEE1] m-0 p-0 font-mono">
                        <span className="text-gray-500 block mb-2 select-none opacity-80">{`\`\`\`${language}`}</span>
                        <SyntaxHighlighter
                          language={language}
                          style={vscDarkPlus}
                          PreTag="div"
                          CodeTag="code"
                          customStyle={{ margin:0, padding:0, backgroundColor:'transparent', overflow:'visible' }}
                          wrapLines={false}
                          wrapLongLines={true}
                        >
                          {code}
                        </SyntaxHighlighter>
                        <span className="text-gray-500 block mt-2 select-none opacity-80">{`\`\`\``}</span>
                      </pre>
                    )}
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 italic opacity-60 px-4 text-center">
                    O preview renderizado com syntax highlighting vai aparecer aqui.
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
