describe('index.js', () => {
  const App = require('..');
  it('should be defined', () => {
    expect(App).toBeDefined();
  });
})

describe('ptt_boards.js', () => {
  it('should be import', () => {
    const ptt_boards = require('../static/ptt_boards')
    expect(ptt_boards).toEqual([
      'Gossiping',
      'Beauty',
      'iOS',
      'NBA',
      'Lifeismoney',
      'Tech_Job',
      'movie',
      'PlayStation'
    ]);
  })
})

describe('counties.js', () => {
  const { Counties, Area } = require('../static/counties')
  it('Counties should be import', () => {
    expect(Counties).toEqual({
      "北部": ["臺北市", "新北市", "基隆市", "桃園市", "新竹縣", "苗栗縣", "宜蘭縣", "新竹市"],
      "中部": ["臺中市", "彰化縣", "南投縣", "雲林縣"],
      "南部": ["臺南市", "高雄市", "嘉義縣", "嘉義市", "屏東縣", "澎湖縣"],
      "東部": ["花蓮縣", "臺東縣"],
      "外島": ["金門縣", "連江縣"],
    });
  })
  it('Area should be import', () => {
    expect(Area).toEqual(["北部", "中部", "南部", "東部", "外島"]);
  })
})

describe('handleWeather.js', () => {
  const { getWeather } = require('../handleWeather')
  it('weather API should return right object', () => {
    getWeather('屏東縣')
      .then(result => {
        expect(result.locationName).toBe('屏東縣')
      })
  })
})