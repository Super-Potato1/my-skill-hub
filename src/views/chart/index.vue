<script setup lang="ts">
import { ref, onMounted } from 'vue'

const lineData = ref({
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  datasets: [
    { label: '访问量', data: [820, 932, 901, 934, 1290, 1330, 1320] },
    { label: '注册量', data: [320, 432, 501, 434, 790, 830, 820] },
  ],
})

const barData = ref({
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  data: [120, 200, 150, 80, 70, 110, 130],
})

const pieData = ref([
  { name: '直接访问', value: 335, color: '#6366f1' },
  { name: '邮件营销', value: 310, color: '#8b5cf6' },
  { name: '联盟广告', value: 234, color: '#a78bfa' },
  { name: '视频广告', value: 135, color: '#c4b5fd' },
  { name: '搜索引擎', value: 1548, color: '#ddd6fe' },
])

const stats = ref([
  { label: '今日访问', value: '12,846', trend: '+12.5%', up: true },
  { label: '新增用户', value: '3,241', trend: '+8.2%', up: true },
  { label: '订单数量', value: '1,893', trend: '-3.1%', up: false },
  { label: '营业额', value: '¥98,234', trend: '+21.3%', up: true },
])

const maxBarValue = Math.max(...barData.value.data)
const totalPie = pieData.value.reduce((s, d) => s + d.value, 0)

const getPieSegments = () => {
  let cumulative = 0
  return pieData.value.map((item) => {
    const startAngle = (cumulative / totalPie) * 360
    cumulative += item.value
    const endAngle = (cumulative / totalPie) * 360
    const start = polarToCartesian(50, 50, 40, startAngle - 90)
    const end = polarToCartesian(50, 50, 40, endAngle - 90)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return {
      ...item,
      d: `M 50 50 L ${start.x} ${start.y} A 40 40 0 ${largeArc} 1 ${end.x} ${end.y} Z`,
      percent: ((item.value / totalPie) * 100).toFixed(1),
    }
  })
}

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
  const rad = (angle * Math.PI) / 180
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) }
}

const pieSegments = getPieSegments()
</script>

<template>
  <div class="chart-page">
    <div class="page-header">
      <h2 class="page-title">数据图表</h2>
      <p class="page-desc">数据可视化展示，包含折线图、柱状图、饼图等</p>
    </div>

    <div class="stats-row">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-trend" :class="stat.up ? 'up' : 'down'">
          <span>{{ stat.up ? '↑' : '↓' }}</span> {{ stat.trend }}
        </div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card wide">
        <div class="chart-title">访问趋势（折线图）</div>
        <div class="line-chart">
          <svg viewBox="0 0 600 200" preserveAspectRatio="none" class="line-svg">
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#6366f1" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
              </linearGradient>
              <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0" />
              </linearGradient>
            </defs>
            <template v-for="(dataset, di) in lineData.datasets" :key="di">
              <polyline
                :points="dataset.data.map((v, i) => `${(i / (dataset.data.length - 1)) * 560 + 20},${180 - (v / 1400) * 160}`).join(' ')"
                fill="none"
                :stroke="di === 0 ? '#6366f1' : '#8b5cf6'"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                v-for="(v, i) in dataset.data"
                :key="i"
                :cx="(i / (dataset.data.length - 1)) * 560 + 20"
                :cy="180 - (v / 1400) * 160"
                r="4"
                :fill="di === 0 ? '#6366f1' : '#8b5cf6'"
              />
            </template>
          </svg>
          <div class="line-labels">
            <span v-for="label in lineData.labels" :key="label">{{ label }}</span>
          </div>
          <div class="chart-legend">
            <span v-for="(ds, i) in lineData.datasets" :key="i" class="legend-item">
              <i :style="{ background: i === 0 ? '#6366f1' : '#8b5cf6' }"></i>{{ ds.label }}
            </span>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-title">每周活跃（柱状图）</div>
        <div class="bar-chart">
          <div v-for="(val, i) in barData.data" :key="i" class="bar-item">
            <div class="bar-wrap">
              <div
                class="bar"
                :style="{ height: (val / maxBarValue) * 140 + 'px' }"
              ></div>
            </div>
            <div class="bar-label">{{ barData.labels[i] }}</div>
          </div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-title">流量来源（饼图）</div>
        <div class="pie-chart">
          <svg viewBox="0 0 100 100" class="pie-svg">
            <path
              v-for="(seg, i) in pieSegments"
              :key="i"
              :d="seg.d"
              :fill="seg.color"
              class="pie-seg"
            />
            <circle cx="50" cy="50" r="22" fill="white" />
            <text x="50" y="53" text-anchor="middle" font-size="8" fill="#5a6080" font-weight="600">来源</text>
          </svg>
          <div class="pie-legend">
            <div v-for="seg in pieSegments" :key="seg.name" class="pie-legend-item">
              <i :style="{ background: seg.color }"></i>
              <span class="pie-name">{{ seg.name }}</span>
              <span class="pie-pct">{{ seg.percent }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart-page {
  padding: 32px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.page-header {
  margin-bottom: 28px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 8px;
}

.page-desc {
  font-size: 14px;
  color: #8a8fa8;
  margin: 0;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 24px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(99, 102, 241, 0.12);
  }
}

.stat-label {
  font-size: 13px;
  color: #8a8fa8;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 6px;
}

.stat-trend {
  font-size: 13px;
  font-weight: 500;

  &.up { color: #10b981; }
  &.down { color: #ef4444; }
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);

  &.wide {
    grid-column: 1 / -1;
  }
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 20px;
}

.line-chart {
  position: relative;
}

.line-svg {
  width: 100%;
  height: 200px;
}

.line-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 12px;
  color: #8a8fa8;
  margin-top: 4px;
}

.chart-legend {
  display: flex;
  gap: 20px;
  margin-top: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #5a6080;

  i {
    display: inline-block;
    width: 12px;
    height: 3px;
    border-radius: 2px;
  }
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 180px;
  padding-bottom: 24px;
  position: relative;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}

.bar-wrap {
  flex: 1;
  display: flex;
  align-items: flex-end;
  width: 100%;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #6366f1, #8b5cf6);
  border-radius: 6px 6px 0 0;
  transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-height: 4px;
}

.bar-label {
  font-size: 12px;
  color: #8a8fa8;
  margin-top: 6px;
}

.pie-chart {
  display: flex;
  align-items: center;
  gap: 24px;
}

.pie-svg {
  width: 160px;
  height: 160px;
  flex-shrink: 0;
}

.pie-seg {
  transition: opacity 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}

.pie-legend {
  flex: 1;
}

.pie-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 13px;

  i {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
}

.pie-name {
  flex: 1;
  color: #5a6080;
}

.pie-pct {
  color: #1a1a2e;
  font-weight: 600;
}
</style>
