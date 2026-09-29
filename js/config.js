'use strict';
window.ReservationGuide = window.ReservationGuide || {};
ReservationGuide.config = {
  // 既存来院ガイド outputs/guide/dist/app.js の reservationUrl を参照（2026-09-28）。
  reservationUrl: 'https://lin.ee/xCqS4jo',
  consultationUrl: 'https://lin.ee/z1OAkFu',
  phoneUrl: 'tel:0462951541',
  // LINE側の名称変更後は対象行を削除するか、値を新名称に変更してください。
  bookingNameOverrides: { body: '美尻矯正', face: '小顔矯正' }
};
