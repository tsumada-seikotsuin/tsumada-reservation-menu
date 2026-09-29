'use strict';
(() => {
  const G = ReservationGuide;
  const go = (label, next, detail = '') => ({ label, next, detail });
  const menu = (id, label) => ({ label: label || G.menus[id].name, menu: id, detail: G.menus[id].description || '' });
  G.treatmentGroups = { usual: 'スタンダード／トータル／プレミアム', balance: '産後／ボディバランス（美尻）／フェイス' };
  G.initialState = () => ({ screen: 'top', mode: 'single', treatment: null, results: [] });
  const historyChoices = [go('初めて', 'first'), go('前回から180日以上空いている', 'first'), go('180日以内に施術を受けている', 'concern')];
  G.getScreen = s => {
    const screens = {
      top: { title: '予約メニュー案内', intro: 'どのメニューで予約すればいいか迷ったときに、当てはまるものを選んでください。', choices: [
        go('身体の痛み・不調', 'person'), go('産後・ボディライン・フェイス', 'beautyHistory'), go('医療機器', 'devices'), go('セットメニュー', 'sets'), go('ケア・トレーニング', 'care'), go('施術＋医療機器を予約したい', 'combined', '施術と医療機器を同日に、それぞれ予約'), go('どれを選べばいいか分からない', 'help') ] },
      person: { title: 'ご予約される方について教えてください', choices: [go('自分の予約をする', 'history'), menu('guardian', '保護者がお子さんの初回予約をする')] },
      history: { title: '当院で施術を受けるのは？', choices: historyChoices.map(c => s.mode === 'combined' && c.next === 'concern' ? { ...c, next: 'currentMenu' } : c) },
      currentMenu: { title: '現在のメニューを確認させてください', choices: [{ label: G.treatmentGroups.usual, group: 'usual' }, { label: G.treatmentGroups.balance, group: 'balance' }, go('メニューが分からない', 'concern')] },
      concern: { title: s.mode === 'combined' ? '現在のお悩みについてお教えください' : '現在のお悩みを確認させてください', choices: [go('以前相談した悩み・徐々に気になってきた', 'count'), go('痛みの箇所が変わった・増えた', 'count'), go('急激な痛み、腫れ、炎症や熱がある状態', 'safety')] },
      count: { title: '現在、気になる症状はいくつありますか？', choices: [go('1症状', 'area'), menu('total', '2症状'), menu('premium', '3症状以上／全身をみてほしい')] },
      area: { title: '気になる症状の部位は？', choices: ['首・肩','腰','股関節','膝','足・足首','肘・手','その他'].map((label, i) => i === 0 && s.mode !== 'combined' ? go(label, 'shoulder') : menu('standard', label)) },
      shoulder: { title: 'どちらをご希望ですか？', choices: [menu('standard', '通常の施術'), menu('desk'), go('違いを見て決めたい', 'compare')] },
      compare: { title: '2つのメニューの違い', intro: '内容をご確認のうえ、ご希望のメニューを選んでください。', compare: ['standard','desk'], choices: [menu('standard', 'スタンダードを選ぶ'), menu('desk', 'デスクワーク肩凝りを選ぶ')] },
      beautyHistory: { title: '当院で施術を受けるのは？', choices: [go('初めて', 'first'), go('前回から180日以上空いている', 'first'), go('180日以内に施術を受けている', 'beauty')] },
      beauty: { title: 'ご希望のメニューを選んでください', choices: [go('産後骨盤', 'postpartum', G.menus.postpartum.description), menu('body'), menu('face')] },
      postpartum: { title: '産後1か月健診は終了していますか？', choices: [menu('postpartum', '終了している'), go('まだ', 'postpartumWait')] },
      devices: { title: 'ご希望の医療機器を選んでください', intro: '単独で予約できる医療機器です。', choices: G.devices.map(id => menu(id)) },
      addDevice: { title: '一緒に利用する医療機器を選んでください', intro: '施術と医療機器は、それぞれのメニューでご予約ください。', choices: G.devices.map(id => menu(id)) },
      sets: { title: 'ご希望のセットメニューは？', choices: ['director','desk','carbon'].map(id => menu(id)) },
      care: { title: 'ご希望のケア・トレーニングは？', choices: [go('操作性ジム（TFRジム）', 'gymHistory'), menu('home')] },
      gymHistory: { title: '操作性ジムの利用は初めてですか？', choices: [menu('gymJoin', '初めて'), go('入会済み', 'gym')] },
      gym: { title: 'ご希望の利用方法は？', intro: '前後の予約状況により、数分お待たせする場合があります。', choices: [menu('gymOne', '30分利用'), menu('gymTwo', '60分利用'), menu('gymPersonal', 'パーソナルで教えてほしい')] },
      help: { title: 'ご希望の相談方法を選んでください', choices: [go('LINEで相談する', 'consult', '予約前にLINEチャットで確認したい方'), menu('counseling')] },
      consult: { title: 'LINEで相談する', intro: 'ご予約の前に、気になることやご希望をLINEでご相談ください。', link: 'consultationUrl', linkLabel: '相談LINEを開く' },
      safety: { title: '今の症状をLINEで相談してみませんか？', intro: '急な痛みや腫れ、炎症、熱がある場合は、予約メニューを選ぶ前に現在の状態をお知らせください。\n\n院長・スタッフが内容を確認し、状態に応じたご案内をいたします。', link: 'consultationUrl', linkLabel: '今の症状をLINEで相談する', note: '※強い症状や緊急性が高いと感じる場合は、LINEの返信を待たず、救急要請や医療機関への受診をご検討ください。' },
      postpartumWait: { title: '1か月健診終了後を目安にご予約ください', intro: '産後骨盤のご予約は、産後1か月健診が終了してからを目安にしてください。ご不明な点はLINEでご相談ください。', link: 'consultationUrl', linkLabel: 'LINEで相談する' },
      faq: { title: '予約活用ガイド', intro: 'よくある質問をまとめました。質問をタップすると回答が開きます。' },
      result: { title: 'あなたの予約メニュー' }
    };
    return screens[s.screen];
  };
  // ①と⑥が共用する唯一の遷移関数。⑥ではセット商品の選択を禁止。
  G.transition = (state, choice) => {
    const s = { ...state, results: [...state.results] };
    if (choice.next === 'combined') return { ...G.initialState(), screen: 'history', mode: 'combined' };
    if (choice.group) return { ...s, treatment: null, treatmentGroup: choice.group, screen: 'addDevice' };
    const id = choice.menu || (choice.next === 'first' ? 'first' : null);
    if (id) {
      if (s.mode === 'combined' && ['desk','director','carbon'].includes(id)) throw new Error('セットメニューは同日追加の施術候補に含めません。');
      if (s.mode === 'combined' && id === 'first') return { ...s, screen: 'result', treatment: null, results: ['first'] };
      if (s.mode === 'combined' && s.screen !== 'addDevice') return { ...s, treatment: id, screen: 'addDevice' };
      return { ...s, screen: 'result', results: s.mode === 'combined' ? [s.treatment, id] : [id] };
    }
    return { ...s, screen: choice.next };
  };
})();
