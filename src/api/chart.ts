const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface ChartData {
  stats: { label: string; value: string; trend: string; up: boolean }[]
  line: { labels: string[]; visit: number[]; register: number[] }
  bar: { labels: string[]; data: number[] }
  pie: { name: string; value: number }[]
  stackedBar: { labels: string[]; series: { name: string; data: number[] }[] }
  radar: { indicators: { name: string; max: number }[]; data: number[] }
  gauge: { value: number; name: string }
}

export const fetchChartData = async (): Promise<ChartData> => {
  await delay(600)
  return {
    stats: [
      { label: '今日访问', value: '12,846', trend: '+12.5%', up: true },
      { label: '新增用户', value: '3,241', trend: '+8.2%', up: true },
      { label: '订单数量', value: '1,893', trend: '-3.1%', up: false },
      { label: '营业额', value: '¥98,234', trend: '+21.3%', up: true },
    ],
    line: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
      visit: [820, 932, 901, 934, 1290, 1330, 1320],
      register: [320, 432, 501, 434, 790, 830, 820],
    },
    bar: {
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      data: [120, 200, 150, 80, 70, 110, 130],
    },
    pie: [
      { name: '直接访问', value: 335 },
      { name: '邮件营销', value: 310 },
      { name: '联盟广告', value: 234 },
      { name: '视频广告', value: 135 },
      { name: '搜索引擎', value: 1548 },
    ],
    stackedBar: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        { name: '商品销售', data: [320, 480, 410, 560, 720, 680] },
        { name: '广告收入', data: [120, 160, 200, 180, 240, 210] },
        { name: '会员费用', data: [80, 90, 110, 130, 150, 140] },
      ],
    },
    radar: {
      indicators: [
        { name: '活跃度', max: 100 },
        { name: '留存率', max: 100 },
        { name: '转化率', max: 100 },
        { name: '满意度', max: 100 },
        { name: '传播力', max: 100 },
        { name: '复购率', max: 100 },
      ],
      data: [85, 72, 63, 90, 58, 76],
    },
    gauge: { value: 68, name: '转化率' },
  }
}
