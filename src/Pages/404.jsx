import { useEffect, useRef } from "react";

export default function ErrorPage() {
  const codeRefs = [useRef(null), useRef(null), useRef(null)];
  const css = `
    @import url("https://fonts.googleapis.com/css?family=Bevan");

    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    p {
        font-family: "Bevan", cursive;
        font-size: 130px;
        margin: 10vh 0 0;
        text-align: center;
        letter-spacing: 5px;
        background-color: black;
        color: transparent;
        text-shadow: 2px 2px 3px rgba(255, 255, 255, 0.1);
        -webkit-background-clip: text;
        background-clip: text;
    }

    p span {
        font-size: 1.2em;
    }

    code {
        color: #bdbdbd;
        text-align: center;
        display: block;
        font-size: 16px;
        margin: 0 30px 25px;
    }

    code span {
        color: #f0c674;
    }

    code i {
        color: #b5bd68;
    }

    code em {
        color: #b294bb;
        font-style: unset;
    }

    code b {
        color: #81a2be;
        font-weight: 500;
    }

    a {
        color: #8abeb7;
        font-family: monospace;
        font-size: 20px;
        text-decoration: underline;
        margin-top: 10px;
        display: inline-block;
        cursor: pointer;
    }

    @media screen and (max-width: 880px) {
        p {
            font-size: 14vw;
        }
    }
  `;
  
  function highlight(text) {
  return text
    .replace(/(true|false|null)/g, `<span style="color:#ff79c6">$1</span>`)
    .replace(/(if|else|return|window|alert)/g, `<span style="color:#8be9fd">$1</span>`)
    .replace(/("[^"]*"|'[^']*')/g, `<span style="color:#f1fa8c">$1</span>`)
    .replace(/([{}()])/g, `<span style="color:#50fa7b">$1</span>`)
    .replace(/(you_spelt_it_wrong|this_page|home|try_again)/g, `<span style="color:#bd93f9">$1</span>`);
}


function typeEffect(el, originalText, delay) {
  if (!el) return;

  const highlighted = highlight(originalText);

  let i = 0;
  el.innerHTML = "";

  setTimeout(() => {
    const timer = setInterval(() => {
      const visiblePart = originalText.slice(0, i);

      const safeHTML = highlight(visiblePart);

      el.innerHTML = safeHTML + `<span style="opacity:0.3">|</span>`;
      i++;

      if (i > originalText.length) {
        clearInterval(timer);
        el.innerHTML = highlighted;
      }
    }, 25);
  }, delay);
}


useEffect(() => {
  const texts = [
    'this_page.not_found = true;',
    'if (you_spelt_it_wrong) { try_again(); }',
    'else if (we_screwed_up) { alert("We\'re really sorry about that."); window.location = home; }'
  ];

  typeEffect(codeRefs[0].current, texts[0], 0);
  typeEffect(codeRefs[1].current, texts[1], 600);
  typeEffect(codeRefs[2].current, texts[2], 1200);
}, []);

  return (
    <>
      <style>{css}</style>


      <p>HTTP: <span>404</span></p>

      <code ref={codeRefs[0]}></code>
      <code ref={codeRefs[1]}></code>
      <code ref={codeRefs[2]}></code>

      <div style={{ textAlign: "center" }}>
      </div>
    </>
  );
}
