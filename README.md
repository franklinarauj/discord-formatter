# ✨ Formatador de Código para Discord

Uma ferramenta veloz e moderna para transformar seu código-fonte em um bloco perfeito e compatível com a formatação Markdown do Discord. Cansado de digitar as famosas "crases triplas"? O Formatador faz isso por você de maneira mágica.

## 🚀 Funcionalidades

- **Detecção Automática (Magia!)**: Com a ajuda do robô (via biblioteca `flourite`), o app consegue identificar a linguagem do seu código e formatá-lo automaticamente, sem você precisar suar.
- **Modo Manual**: Prefere controlar as engrenagens? Sem problemas. Troque para a aba Manual e selecione entre mais de 15 linguagens otimizadas (`JavaScript, Python, C#, Rust, Go, e muito mais...`).
- **Preview em Tempo Real**: Enquanto você digita, o app utiliza um Dark Theme fiel ao Discord para te mostrar o resultado exato. O que você vê no preview é o que será enviado no chat!
- **Copiar e Colar (One-click)**: Com um único clique, o seu código será formatado, empacotado e enviado diretamente para a sua Área de Transferência. É só abrir seu servidor preferido no Discord e colar (`Ctrl+V`).

## 🛠 Tecnologias Utilizadas

Este projeto foi construído usando tecnologias modernas focando no desempenho de renderização da UI:
- **[React](https://react.dev/) + [Vite(v8)](https://vitejs.dev/)**: Para uma inicialização extremamente rápida e uma otimização de build aprimorada.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Nova versão simplificada de desenvolvimento utilizando utilitários de Design e variáveis que emulam ativamente a paleta visual do próprio Discord.
- **[Flourite](https://github.com/teknologi-umum/flourite)**: Um modelo heurístico ultraleve utilizado no sub-sistema da aba "Automático" para interpretar seu código ao vivo.
- **[Lucide React](https://lucide.dev/)**: Biblioteca de ícones limpos e responsivos.

## 💻 Como Rodar este Projeto (Guia Para Devs)

> [!WARNING]
> **Aviso de Versão da Engine (Importante):**  
> Para garantir a compatibilidade e a compilação do `Vite 8` e `Tailwind 4`, certifique-se que você esteja utilizando o **Node.js** em uma versão igual ou superior à `v22.12.0` no seu ecossistema. Use utilitários como o `nvm` para isso!

### 1. Preparação
Clone o projeto para a sua máquina ou baixe o zip:
```bash
git clone https://github.com/SeuUsuario/discord-formatter.git
cd discord-formatter
```

### 2. Instalação das Dependências
Instale todos os pacotes necessários:
```bash
npm install
```

### 3. Rodando o Servidor de Desenvolvimento
Inicie a aplicação utilizando o builder nativo do Vite:
```bash
npm run dev
```

Basta acessar no seu navegador o endereço (geralmente [http://localhost:5173/](http://localhost:5173/)) que aparecerá na tela do seu terminal para testar o formato mágico!

## 🧩 Tutorial de Uso Básíco

1. **Abra o Aplicação** e escolha a sua aba de preferência: `Automático ✨` ou `Manual 🛠`.
2. **Caixa da Esquerda**: Cole ou digite seu snippet de código livremente.
3. Observe que no Preview (Caixa Direta inferior), seu bloco será encapsulado na estrutura apropriada usando as *Crases Triplas* e a syntax flag equivalente (ex: ` ```javascript `).
4. Clique em **"Copiar p/ Markdown"**.
5. Aproveite, o texto com a sintaxe certa e todo o Highlight está pronto.

---

Feito primorosamente focado em desenvolvedores e envio de snippets via Discord. 🚀🎮
