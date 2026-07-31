(() => {
  const GISCUS = {
    repo: "Acidache/ai-dialogues-zh",
    repoId: "R_kgDOToycww",
    category: "General",
    categoryId: "DIC_kwDOToycw84DCW3P"
  };

  const canonicalPath = new URL(
    document.querySelector('link[rel="canonical"]')?.href || window.location.href
  ).pathname.replace(/^\/+/, "");
  const pageTerm = document.querySelector(
    '#discussion-panel script[data-term], .discussion-shell script[data-term]'
  )?.dataset.term || canonicalPath;
  const pageRoot = document.querySelector(".phone-frame, .phone");
  const messageRows = [...document.querySelectorAll(".message-row, .msg-row")]
    .filter((row) => row.querySelector(".bubble"));

  if (!pageTerm || !pageRoot || !messageRows.length) return;

  document.body.classList.add("inline-review-ready");

  const layout = document.createElement("div");
  layout.className = "reading-layout";
  pageRoot.parentNode.insertBefore(layout, pageRoot);
  layout.appendChild(pageRoot);

  const panel = document.createElement("aside");
  panel.className = "inline-comment-panel";
  panel.setAttribute("aria-label", "气泡批注");
  panel.innerHTML = `
    <div class="inline-panel-header">
      <div class="inline-panel-heading">
        <p class="inline-panel-kicker">INLINE REVIEW</p>
        <h2 class="inline-panel-title">针对这段留言</h2>
      </div>
      <button class="inline-panel-close" type="button">关闭</button>
    </div>
    <blockquote class="comment-context">选择任意一条对话进行评论。</blockquote>
    <div class="inline-giscus-host">
      <p class="inline-panel-empty">评论会与当前气泡绑定，并公开保存在 GitHub Discussions。登录后可以回复和点赞。</p>
    </div>
  `;
  layout.appendChild(panel);

  const context = panel.querySelector(".comment-context");
  const host = panel.querySelector(".inline-giscus-host");
  const closeButton = panel.querySelector(".inline-panel-close");
  const buttonByTerm = new Map();
  let selectedRow = null;
  let wholeCommentHost = null;

  const createGiscus = (term, target) => {
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.dataset.repo = GISCUS.repo;
    script.dataset.repoId = GISCUS.repoId;
    script.dataset.category = GISCUS.category;
    script.dataset.categoryId = GISCUS.categoryId;
    script.dataset.mapping = "specific";
    script.dataset.term = term;
    script.dataset.strict = "1";
    script.dataset.reactionsEnabled = "1";
    script.dataset.emitMetadata = "1";
    script.dataset.inputPosition = "top";
    script.dataset.theme = "light";
    script.dataset.lang = "zh-CN";
    script.crossOrigin = "anonymous";
    script.async = true;
    target.appendChild(script);
  };

  const setGiscusTerm = (term) => {
    const iframe = document.querySelector("iframe.giscus-frame");
    iframe?.contentWindow?.postMessage({
      giscus: {
        setConfig: {
          mapping: "specific",
          term,
          strict: "1"
        }
      }
    }, "https://giscus.app");
  };

  const moveGiscus = (term, target) => {
    const iframe = document.querySelector("iframe.giscus-frame");
    const mount = iframe?.closest(".giscus");
    if (mount) {
      if (mount.parentElement !== target) target.replaceChildren(mount);
      setGiscusTerm(term);
      return;
    }

    const existingScript = document.querySelector('script[src="https://giscus.app/client.js"]');
    if (!existingScript) createGiscus(term, target);
    window.setTimeout(() => {
      const delayedFrame = document.querySelector("iframe.giscus-frame");
      const delayedMount = delayedFrame?.closest(".giscus");
      if (delayedMount) target.replaceChildren(delayedMount);
      setGiscusTerm(term);
    }, 500);
  };

  const closePanel = () => {
    layout.classList.remove("comments-open");
    selectedRow?.classList.remove("is-commenting");
    selectedRow = null;
    if (wholeCommentHost) moveGiscus(pageTerm, wholeCommentHost);
  };

  messageRows.forEach((row, index) => {
    const messageId = `message-${String(index + 1).padStart(3, "0")}`;
    const term = `${pageTerm}::${messageId}`;
    const bubble = row.querySelector(".bubble");
    const button = document.createElement("button");
    button.className = "inline-comment-button";
    button.type = "button";
    button.dataset.commentTerm = term;
    button.textContent = "评论 0";
    button.setAttribute("aria-label", `评论第 ${index + 1} 条对话`);
    row.classList.add("reviewable-message");
    row.dataset.commentId = messageId;
    row.appendChild(button);
    buttonByTerm.set(term, button);

    button.addEventListener("click", () => {
      selectedRow?.classList.remove("is-commenting");
      selectedRow = row;
      selectedRow.classList.add("is-commenting");
      const quote = bubble.textContent.replace(/\s+/g, " ").trim();
      context.textContent = quote.length > 220 ? `${quote.slice(0, 220)}…` : quote;
      layout.classList.add("comments-open");
      moveGiscus(term, host);
      if (window.innerWidth <= 980) panel.scrollIntoView({ block: "end", behavior: "smooth" });
    });
  });

  closeButton.addEventListener("click", closePanel);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && layout.classList.contains("comments-open")) closePanel();
  });

  const legacyPanel = document.getElementById("discussion-panel");
  const legacyCard = legacyPanel?.querySelector(".discussion-card");
  const legacySection = document.querySelector(".discussion-shell");
  const whole = document.createElement("section");
  whole.className = "whole-discussion";
  whole.id = "discussion";
  whole.innerHTML = `
    <h2>整篇留言</h2>
    <p class="whole-discussion-lead">这里适合讨论整篇对话。针对某一句或某一段的观点，请使用气泡旁的“评论”按钮。</p>
  `;
  if (legacyCard) whole.appendChild(legacyCard);
  else if (legacySection) {
    const legacyGiscus = legacySection.querySelector(".giscus");
    const legacyNote = legacySection.querySelector(".discussion-note");
    const sectionHost = document.createElement("div");
    sectionHost.className = "discussion-card whole-giscus-host";
    if (legacyGiscus) sectionHost.appendChild(legacyGiscus);
    whole.appendChild(sectionHost);
    if (legacyNote) whole.appendChild(legacyNote);
    legacySection.remove();
  }
  else {
    const wholeHost = document.createElement("div");
    wholeHost.className = "discussion-card";
    whole.appendChild(wholeHost);
    createGiscus(pageTerm, wholeHost);
  }
  wholeCommentHost = whole.querySelector(".discussion-card, .giscus") || whole;
  pageRoot.appendChild(whole);
  legacyPanel?.close?.();

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".js-open-discussion, a[href='#discussion']");
    if (!trigger) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    closePanel();
    whole.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", "#discussion");
  }, true);

  window.addEventListener("message", (event) => {
    if (event.origin !== "https://giscus.app") return;
    const discussion = event.data?.giscus?.discussion;
    if (!discussion?.title) return;
    const button = buttonByTerm.get(discussion.title);
    if (!button) return;
    const count = Number(discussion.totalCommentCount || 0);
    button.textContent = `评论 ${count}`;
    button.classList.toggle("has-comments", count > 0);
  });

  fetch("../../assets/discussion-counts.json", { cache: "no-store" })
    .then((response) => response.ok ? response.json() : null)
    .then((data) => {
      if (!data?.byTerm) return;
      buttonByTerm.forEach((button, term) => {
        const count = Number(data.byTerm[term] || 0);
        button.textContent = `评论 ${count}`;
        button.classList.toggle("has-comments", count > 0);
      });
    })
    .catch(() => {});
})();
