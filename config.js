// Config versi 50 Etalase (versi bersih dan lengkap)

module.exports = {
  tiktokUsername: 'yourtiktokusername',
  websocketURL: 'ws://localhost:XXXX',

  obs: {
    url: 'ws://XXX.X.X.X:XXXX',
    password: 'PASSWORD_OBS_WEBSOCKET',
  },

  scenes: {
    idle: 'Idle',

    etalase: Object.fromEntries(
      Array.from({ length: 50 }, (_, i) => {
        const num = (i + 1).toString();
        return [num, `Etalase${num}`];
      })
    ),

    interaksi: {
      ventela: 'VentelaReady',
      compass: 'CompassReady',
      brodo: 'BrodoReady',
      aerostreet: 'AerostreetReady',
      ortuseight: 'OrtuseightReady',
      specs: 'SpecsReady',
      mills: 'MillsReady',
      ardiles: 'ArdilesReady',
      patrobas: 'PatrobasReady',
      panarbody: 'PanarbodyReady',
    },

    brandLainnyaScene: 'BrandLainnyaInfo',
    displayTopScene: 'DisplayTop',
    displayLeftScene: 'DisplayLeft',
    displayRightScene: 'DisplayRight',
    displayBottomScene: 'DisplayBottom',
  },

  durasi: {}, // Durasi akan diisi otomatis oleh getAllVideoDurations()

  brandTriggers: [
    { keyword: /ventela|fentela|pentela|ventella/i, scene: 'VentelaReady', etalaseRange: [1, 7] },
    { keyword: /compass|kompas/i, scene: 'CompassReady', etalaseRange: [8, 12] },
    { keyword: /brodo|brdo|brodho/i, scene: 'BrodoReady', etalaseRange: [13, 17] },
    { keyword: /aerostreet|aero\s?street|aerostrit/i, scene: 'AerostreetReady', etalaseRange: [18, 22] },
    { keyword: /ortuseight|ortus\s?eight|ortuseit/i, scene: 'OrtuseightReady', etalaseRange: [23, 27] },
    { keyword: /specs|spek|speks/i, scene: 'SpecsReady', etalaseRange: [28, 30] },
    { keyword: /mills|milz|milss/i, scene: 'MillsReady', etalaseRange: [31, 37] },
    { keyword: /ardiles|ardiless|ardilas/i, scene: 'ArdilesReady', etalaseRange: [38, 42] },
    { keyword: /patrobas|patrobass|patro/i, scene: 'PatrobasReady', etalaseRange: [43, 47] },
    { keyword: /panarbody|panar\s?body|panarbo/i, scene: 'PanarbodyReady', etalaseRange: [48, 50] },
  ],

  displayTopTriggers: [
    /yang.*(atas|di atas|atasan)/i,
    /pojok.*atas/i,
    /gambar.*(atas|di atas)/i
  ],

  displayLeftTriggers: [
    /yang.*(kiri|di kiri)/i,
    /pojok.*kiri/i,
    /gambar.*(kiri|di kiri)/i
  ],

  displayRightTriggers: [
    /yang.*(kanan|di kanan)/i,
    /pojok.*kanan/i,
    /gambar.*(kanan|di kanan)/i
  ],

  displayBottomTriggers: [
    /yang.*(bawah|di bawah|bawahan)/i,
    /pojok.*bawah/i,
    /gambar.*(bawah|di bawah)/i
  ],

  blacklistBrandTriggers: [
    /\beiger\b/i, /\bconsina\b/i, /\basics\b/i, /\bunder\s?armour\b/i,
    /\bsaucony\b/i, /\bbrooks\b/i, /\bmerrell\b/i, /\btimberland\b/i,
    /\bclarks\b/i, /\bdr\s?martens\b/i, /\bgucci\b/i, /\bprada\b/i,
    /\bversace\b/i, /\bzamber\b/i, /\bcaterpillar\b/i, /\bforward\b/i,
    /\bgeofactory\b/i, /\bsole.?id\b/i, /\bellyz\b/i, /\bazarine\b/i,
    /\bimperfect\b/i, /\bwardah\b/i, /\bumbro\b/i, /\bpayless\b/i,
    /\baldo\b/i, /\becco\b/i, /\bkeen\b/i, /\bdanner\b/i,
    /\bred\s?wing\b/i, /\bhyperlocal\b/i, /\bkillers\b/i,
    /\brexus\b/i, /\bimperial\b/i, /\bjoger\b/i, /\bchippewa\b/i,
    /\bsam\s?edelman\b/i, /\balexander\s?mcqueen\b/i, /\bdolce\b/i,
    /\bmartens\b/i, /\bthorogood\b/i, /\bcolumbia\b/i, /\bjoma\b/i,
    /\bkappa\b/i, /\bblackkelly\b/i, /\bbata\b/i, /\bwakai\b/i
  ],

  triggers: {
    spillPrefix: 'spill etalase',
  }
};
