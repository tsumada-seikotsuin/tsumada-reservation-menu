'use strict';
(() => {
  const G = ReservationGuide, screen = document.getElementById('screen');
  let state = G.initialState(), trail = [];
  const el = (tag, text, className) => { const n = document.createElement(tag); if (text) n.textContent = text; if (className) n.className = className; return n; };
  const external = (label, url) => { const a = el('a', label); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; };
  function card(id, comparison = false) {
    const m = G.menus[id], c = el('article', '', 'result-card');
    const booking = G.bookingName(id);
    if (!comparison) c.append(el('p', '予約専用LINEで選ぶメニュー', 'eyebrow'));
    c.append(el('h2', comparison ? m.name : booking, 'menu-name'));
    if (booking !== m.name && !comparison) c.append(el('p', `このガイドでの名称：${m.name}`, 'muted'), el('p', `予約専用LINEでは「${booking}」を選択してください。`, 'booking-note'));
    if (comparison && id === 'standard') c.append(el('p', '通常の施術（1症状）'));
    if (m.description) c.append(el('p', m.description));
    if (m.price != null || m.duration) {
      const facts = el('dl', '', 'result-facts');
      for (const [label, value] of [['料金', m.price == null ? null : `${m.price.toLocaleString('ja-JP')}円`], ['時間', m.duration]]) if (value) { const item = el('div'); item.append(el('dt', label), el('dd', value)); facts.append(item); }
      c.append(facts);
    }
    if (m.notes) { const notes = el('ul', '', 'notes'); m.notes.forEach(t => notes.append(el('li', t))); c.append(notes); }
    return c;
  }
  function render(focus = true) {
    const data = G.getScreen(state); screen.replaceChildren();
    screen.className = state.screen === 'top' ? 'start-screen' : '';
    document.getElementById('navigation').hidden = !trail.length;
    screen.append(el('div', '', 'accent-rule'), el('p', state.screen === 'top' ? 'ご予約の前に' : state.mode === 'combined' ? '施術＋医療機器のご予約' : '予約メニューを選ぶ', 'eyebrow'));
    const heading = el('h1', data.title, 'screen-heading'); heading.id = 'screen-heading'; heading.tabIndex = -1; screen.append(heading);
    if (data.intro) screen.append(el('p', data.intro, 'intro'));
    if (data.compare) data.compare.forEach(id => screen.append(card(id, true)));
    if (state.screen === 'addDevice') screen.append(el('p', state.treatmentGroup ? `現在の施術メニュー：${G.treatmentGroups[state.treatmentGroup]}` : `選択した施術：${G.bookingName(state.treatment)}`, 'selection-note'));
    if (state.screen === 'result') {
      const combined = state.results.length === 2;
      screen.append(el('p', combined ? '2つのメニューをご予約ください' : '予約専用LINEでは、次のメニューを選択してください。', 'intro'));
      state.results.forEach((id, i) => {
        if (i) screen.append(el('div', '＋', 'plus'));
        if (id) screen.append(card(id));
        else {
          const current = el('article', '', 'result-card');
          current.append(el('h2', '現在ご利用中の施術メニュー', 'menu-name'), el('p', G.treatmentGroups[state.treatmentGroup], 'muted'), el('p', '予約専用LINEでは、現在ご利用中の施術メニューを選択してください。'));
          screen.append(current);
        }
      });
      if (combined) screen.append(el('p', '予約専用LINEから、それぞれのメニューをご予約ください。', 'booking-note'));
      if (state.mode === 'combined' && state.results[0] === 'first') screen.append(el('p', '初回・再初検の方は、カウンセリング検査後の2回目以降に医療機器の選択が可能となります。', 'selection-note'));
      const cta = el('div', '', 'cta');
      if (G.config.reservationUrl) cta.append(external('予約専用LINEで予約する', G.config.reservationUrl));
      else screen.append(el('p', '予約専用LINEで、上記のメニュー名を選んでご予約ください。', 'booking-note'));
      cta.append(external('予約についてLINEで相談する', G.config.consultationUrl)); screen.append(cta, el('p', 'LINEが別のタブで開きます。この画面では予約は確定しません。', 'external-note'));
    }
    if (state.screen === 'result') {
      const guide = el('div', '', 'guide-entry');
      guide.append(el('p', '予約について分からないことはありませんか？'));
      const button = el('button', '予約活用ガイドを見る', 'choice'); button.type = 'button';
      button.addEventListener('click', () => { trail.push(state); state = { ...state, screen: 'faq' }; render(); });
      guide.append(button); screen.append(guide);
    }
    if (state.screen === 'faq') {
      const list = el('div', '', 'faq-list');
      G.faqs.forEach(item => {
        const details = el('details', '', 'faq-item');
        details.append(el('summary', item.question));
        const answer = el('div', '', 'faq-answer');
        item.answer.split('\n\n').forEach(paragraph => answer.append(el('p', paragraph)));
        details.append(answer); list.append(details);
      });
      screen.append(list);
      const contacts = el('section', '', 'guide-entry'); contacts.append(el('h2', 'ご連絡・お問い合わせ', 'menu-name'));
      const links = el('div', '', 'cta');
      links.append(external('予約専用LINEを開く', G.config.reservationUrl), external('相談・問い合わせLINEを開く', G.config.consultationUrl));
      const phone = el('a', '電話する：046-295-1541'); phone.href = G.config.phoneUrl; links.append(phone);
      contacts.append(links); screen.append(contacts);
    }
    if (data.choices) {
      const choices = el('div', '', 'choices');
      data.choices.forEach(choice => { const b = el('button', '', 'choice'); b.type = 'button'; const content = el('span', choice.label); if (choice.detail) content.append(el('span', choice.detail, 'choice-detail')); b.append(content); b.addEventListener('click', () => { trail.push(state); state = G.transition(state, choice); render(); }); choices.append(b); });
      screen.append(choices);
    }
    if (data.link) { const cta = el('div', '', 'cta'); cta.append(external(data.linkLabel, G.config[data.link])); screen.append(cta); }
    if (data.note) screen.append(el('p', data.note, 'external-note'));
    if (focus) { heading.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
  }
  document.getElementById('back').addEventListener('click', () => { if (trail.length) state = trail.pop(); render(); });
  document.getElementById('restart').addEventListener('click', () => { state = G.initialState(); trail = []; render(); });
  render(false);
})();
