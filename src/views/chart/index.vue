<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { fetchChartData, type ChartData } from '@/api/chart'

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']
const STACK_COLORS = ['#6366f1', '#10b981', '#f59e0b']

const loading = ref(true)
const stats = ref<ChartData['stats']>([])

const lineRef = ref<HTMLElement>()
const barRef = ref<HTMLElement>()
const pieRef = ref<HTMLElement>()
const stackedRef = ref<HTMLElement>()
const radarRef = ref<HTMLElement>()
const gaugeRef = ref<HTMLElement>()

let charts: echarts.ECharts[] = []

const darkTooltip = {
  backgroundColor: '#1a1a2e',
  borderColor: 'rgba(99,102,241,0.3)',
  textStyle: { color: '#fff', fontSize: 13 },
}

const initCharts = (data: ChartData) => {
  const lineChart = echarts.init(lineRef.value!)
  lineChart.setOption({
    tooltip: { trigger: 'axis', ...darkTooltip },
    legend: {
      data: ['访问量', '注册量'],
      bottom: 0,
      textStyle: { color: '#8a8fa8' },
      icon: 'roundRect',
      itemWidth: 16,
      itemHeight: 4,
    },
    grid: { top: 20, left: 48, right: 16, bottom: 48 },
    xAxis: {
      type: 'category',
      data: data.line.labels,
      axisLine: { lineStyle: { color: '#e4e7f0' } },
      axisTick: { show: false },
      axisLabel: { color: '#8a8fa8', fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8a8fa8', fontSize: 12 },
      splitLine: { lineStyle: { color: '#f0f0f5', type: 'dashed' } },
      axisLine: { show: false },
    },
    series: [
      {
        name: '访问量', type: 'line', smooth: true, symbol: 'circle', symbolSize: 7,
        data: data.line.visit,
        lineStyle: { color: '#6366f1', width: 3 },
        itemStyle: { color: '#6366f1', borderColor: '#fff', borderWidth: 2 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(99,102,241,0.28)' }, { offset: 1, color: 'rgba(99,102,241,0)' }]) },
      },
      {
        name: '注册量', type: 'line', smooth: true, symbol: 'circle', symbolSize: 7,
        data: data.line.register,
        lineStyle: { color: '#8b5cf6', width: 3 },
        itemStyle: { color: '#8b5cf6', borderColor: '#fff', borderWidth: 2 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(139,92,246,0.2)' }, { offset: 1, color: 'rgba(139,92,246,0)' }]) },
      },
    ],
  })

  const barChart = echarts.init(barRef.value!)
  barChart.setOption({
    tooltip: { trigger: 'axis', ...darkTooltip },
    grid: { top: 20, left: 48, right: 16, bottom: 32 },
    xAxis: {
      type: 'category',
      data: data.bar.labels,
      axisLine: { lineStyle: { color: '#e4e7f0' } },
      axisTick: { show: false },
      axisLabel: { color: '#8a8fa8', fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8a8fa8', fontSize: 12 },
      splitLine: { lineStyle: { color: '#f0f0f5', type: 'dashed' } },
      axisLine: { show: false },
    },
    series: [{
      type: 'bar',
      data: data.bar.data.map((val, i) => ({
        value: val,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: i % 2 === 0 ? '#6366f1' : '#8b5cf6' },
            { offset: 1, color: i % 2 === 0 ? '#8b5cf6' : '#a78bfa' },
          ]),
        },
      })),
      barMaxWidth: 44,
      itemStyle: { borderRadius: [8, 8, 0, 0] },
      showBackground: true,
      backgroundStyle: { color: 'rgba(99,102,241,0.05)', borderRadius: [8, 8, 0, 0] },
    }],
  })

  const pieChart = echarts.init(pieRef.value!)
  pieChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}<br/>{d}%  ({c})', ...darkTooltip },
    legend: {
      orient: 'vertical', right: 8, top: 'center',
      textStyle: { color: '#5a6080', fontSize: 12 },
      icon: 'circle', itemWidth: 10, itemHeight: 10, itemGap: 12,
    },
    series: [{
      type: 'pie',
      radius: ['48%', '72%'],
      center: ['36%', '50%'],
      data: data.pie.map((item, i) => ({ ...item, itemStyle: { color: PIE_COLORS[i] } })),
      label: { show: false },
      emphasis: {
        scale: true, scaleSize: 6,
        itemStyle: { shadowBlur: 16, shadowColor: 'rgba(99,102,241,0.4)' },
      },
    }],
  })

  const stackedChart = echarts.init(stackedRef.value!)
  stackedChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, ...darkTooltip },
    legend: {
      bottom: 0, textStyle: { color: '#8a8fa8' },
      icon: 'roundRect', itemWidth: 12, itemHeight: 12,
    },
    grid: { top: 20, left: 48, right: 16, bottom: 48 },
    xAxis: {
      type: 'category',
      data: data.stackedBar.labels,
      axisLine: { lineStyle: { color: '#e4e7f0' } },
      axisTick: { show: false },
      axisLabel: { color: '#8a8fa8', fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8a8fa8', fontSize: 12 },
      splitLine: { lineStyle: { color: '#f0f0f5', type: 'dashed' } },
      axisLine: { show: false },
    },
    series: data.stackedBar.series.map((s, i) => ({
      name: s.name,
      type: 'bar',
      stack: 'total',
      data: s.data,
      barMaxWidth: 48,
      itemStyle: {
        color: STACK_COLORS[i],
        borderRadius: i === data.stackedBar.series.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0],
      },
    })),
  })

  const radarChart = echarts.init(radarRef.value!)
  radarChart.setOption({
    tooltip: { ...darkTooltip },
    radar: {
      indicator: data.radar.indicators,
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: '#8a8fa8', fontSize: 12 },
      splitLine: { lineStyle: { color: 'rgba(99,102,241,0.15)' } },
      splitArea: { areaStyle: { color: ['rgba(99,102,241,0.04)', 'rgba(99,102,241,0.02)'] } },
      axisLine: { lineStyle: { color: 'rgba(99,102,241,0.2)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: data.radar.data,
        name: '用户画像',
        areaStyle: { color: 'rgba(99,102,241,0.2)' },
        lineStyle: { color: '#6366f1', width: 2 },
        itemStyle: { color: '#6366f1' },
        symbol: 'circle',
        symbolSize: 6,
      }],
    }],
  })

  const gaugeChart = echarts.init(gaugeRef.value!)
  gaugeChart.setOption({
    series: [{
      type: 'gauge',
      startAngle: 210,
      endAngle: -30,
      min: 0,
      max: 100,
      radius: '80%',
      progress: {
        show: true,
        width: 14,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#6366f1' },
            { offset: 1, color: '#10b981' },
          ]),
        },
      },
      axisLine: { lineStyle: { width: 14, color: [[1, 'rgba(99,102,241,0.1)']] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      pointer: { show: false },
      anchor: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 32,
        fontWeight: 700,
        color: '#1a1a2e',
        formatter: '{value}%',
        offsetCenter: [0, '10%'],
      },
      title: { fontSize: 13, color: '#8a8fa8', offsetCenter: [0, '40%'] },
      data: [{ value: data.gauge.value, name: data.gauge.name }],
    }],
  })

  charts = [lineChart, barChart, pieChart, stackedChart, radarChart, gaugeChart]
}

const onResize = () => charts.forEach(c => c.resize())

onMounted(async () => {
  const data = await fetchChartData()
  stats.value = data.stats
  loading.value = false
  await new Promise(r => setTimeout(r, 0))
  initCharts(data)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  charts.forEach(c => c.dispose())
})
</script>

<template>
  <div class="chart-page">
    <div class="page-header">
      <h2 class="page-title">数据图表</h2>
      <p class="page-desc">数据可视化展示，包含折线图、柱状图、饼图等</p>
    </div>

    <template v-if="loading">
      <div class="stats-row">
        <div v-for="i in 4" :key="i" class="stat-card skeleton"></div>
      </div>
      <div class="charts-grid">
        <div class="chart-card wide skeleton-chart"></div>
        <div v-for="i in 5" :key="i" class="chart-card skeleton-chart"></div>
      </div>
    </template>

    <template v-else>
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
          <div ref="lineRef" class="echart"></div>
        </div>
        <div class="chart-card">
          <div class="chart-title">每周活跃（柱状图）</div>
          <div ref="barRef" class="echart"></div>
        </div>
        <div class="chart-card">
          <div class="chart-title">流量来源（饼图）</div>
          <div ref="pieRef" class="echart"></div>
        </div>
        <div class="chart-card wide">
          <div class="chart-title">月度营收构成（堆叠柱状图）</div>
          <div ref="stackedRef" class="echart"></div>
        </div>
        <div class="chart-card">
          <div class="chart-title">用户画像（雷达图）</div>
          <div ref="radarRef" class="echart"></div>
        </div>
        <div class="chart-card">
          <div class="chart-title">整体转化率（仪表盘）</div>
          <div ref="gaugeRef" class="echart"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@mixin shimmer {
  background: linear-gradient(90deg, #f0f0f5 25%, #e8e8f0 50%, #f0f0f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.chart-page {
  padding: 32px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.page-header { margin-bottom: 28px; }

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
  border-left: 4px solid #6366f1;

  &:nth-child(2) { border-left-color: #8b5cf6; }
  &:nth-child(3) { border-left-color: #ef4444; }
  &:nth-child(4) { border-left-color: #10b981; }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(99, 102, 241, 0.14);
  }

  &.skeleton {
    height: 96px;
    border-left: none;
    @include shimmer;
  }
}

.stat-label { font-size: 13px; color: #8a8fa8; margin-bottom: 8px; }

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 6px;
  letter-spacing: -0.5px;
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
  transition: box-shadow 0.2s;

  &:hover { box-shadow: 0 6px 28px rgba(99, 102, 241, 0.1); }
  &.wide { grid-column: 1 / -1; }

  &.skeleton-chart {
    height: 300px;
    @include shimmer;
    &.wide { height: 320px; }
  }
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 16px;
}

.echart {
  width: 100%;
  height: 260px;
}

@mixin shimmer {
  background: linear-gradient(90deg, #f0f0f5 25%, #e8e8f0 50%, #f0f0f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
