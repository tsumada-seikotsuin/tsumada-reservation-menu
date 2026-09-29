'use strict';
(() => {
  const gymNote = '前後の予約状況により、数分お待たせする場合があります。';
  const deskNotes = ['メディセルを肩甲骨周辺に使用します。', '女性はエステタオルへの着替えが必要です。'];
  ReservationGuide.menus = {
    first: { name: '初回・再初検の方はこちらを選択ください', duration: '目安30分', description: 'カウンセリング検査＋施術' },
    guardian: { name: '保護者代理初診予約', description: '保護者がお子さんの初回予約をする場合のメニューです。' },
    standard: { name: 'スタンダード', price: 3850, duration: '15分' },
    total: { name: 'トータル', price: 5500, duration: '20分' },
    premium: { name: 'プレミアム', price: 7700, duration: '30分' },
    desk: { name: 'デスクワーク肩凝り', price: 5500, duration: '施術15分＋メディセル5分', notes: deskNotes },
    postpartum: { name: '産後骨盤', description: '産後の骨盤が気になる方', notes: ['産後1か月健診が終了している方の予約をご案内しています。'] },
    body: { name: 'ボディバランスケア', description: '姿勢・身体の左右差、ボディライン（くびれ、肋骨）などが気になる方' },
    face: { name: 'フェイスバランスケア', description: '顔まわり・フェイスライン・眉の高さなど左右差が気になる方' },
    oxygen: { name: '酸素ルーム', price: 2200, description: '回復・コンディション、自律神経の乱れが気になる方' },
    hydrogen: { name: '水素吸引', price: 1100, duration: '30分', description: '生理に伴う不調・花粉の時期・慢性的な炎症などが気になる方', notes: ['治療効果を保証するものではありません。'] },
    cube: { name: 'キューブトロン', price: 1320, description: 'EMSによる筋肉運動・引き締めを目的とする方' },
    mediface: { name: 'メディセル美顔', price: 2750, duration: '30分枠', description: '顔の筋肉のハリにアプローチし、たるみ・ほうれい線・シワなどが気になる方' },
    director: { name: '院長施術＋メディセル', price: 4950, duration: '通常施術＋メディセル5分', description: '身体の張り・動き・筋出力などが気になる方' },
    carbon: { name: '施術＋炭酸フィジオロジー', duration: '施術時間内で対応', description: '炭酸フィジオロジーは単独予約ではなく、施術などと組み合わせるメニューです。', notes: ['※オプションで簡単に追加できます'] },
    gymJoin: { name: 'TFRジム入会', price: 7700, duration: '30分', notes: [gymNote] },
    gymOne: { name: 'TFRジム使用 1セット', price: 1100, duration: '30分', notes: [gymNote] },
    gymTwo: { name: 'TFRジム使用 2セット', price: 2200, duration: '60分', notes: [gymNote] },
    gymPersonal: { name: 'TFRパーソナル15分', price: 4950, duration: '15分', description: '入会後でも、使い方をもう一度確認したい、自分に合った身体の動かし方を教えてほしい方が利用できます。', notes: [gymNote] },
    home: { name: '自宅ケアトレパーソナル', price: 3850, description: '自分の身体に合わせたセルフケアやトレーニングを知りたい方', notes: ['自宅や職場で続けられる「賢いケア」をパーソナルでご案内します。'] },
    counseling: { name: 'カウンセリング検査', price: 2200, duration: '15分', description: '対面で時間を確保して、症状や希望について相談したい方', notes: ['ヒアリング・必要な検査を行い、予約メニュー選びをサポートします。'] }
  };
  ReservationGuide.devices = ['oxygen', 'hydrogen', 'cube', 'mediface'];
  ReservationGuide.bookingName = id => ReservationGuide.config.bookingNameOverrides[id] || ReservationGuide.menus[id].name;
})();
