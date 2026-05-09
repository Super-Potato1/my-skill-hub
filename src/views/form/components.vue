<script setup lang="ts">
import { ref, reactive } from 'vue'

const input = ref('')
const inputNum = ref<number>()
const select = ref('')
const multiSelect = ref<string[]>([])
const radio = ref('a')
const checkbox = ref<string[]>(['a'])
const switchVal = ref(true)
const slider = ref(40)
const rate = ref(3)
const date = ref('')
const dateRange = ref<string[]>([])
const color = ref('#6366f1')
const textarea = ref('')
const transfer = reactive({
  data: Array.from({ length: 8 }, (_, i) => ({ key: i, label: `选项 ${i + 1}`, disabled: i === 3 })),
  value: [1, 2],
})
</script>

<template>
  <div class="form-page">
    <div class="page-header">
      <h2 class="page-title">组件展示</h2>
      <p class="page-desc">Element Plus 常用表单组件一览</p>
    </div>

    <div class="components-grid">
      <div class="comp-card">
        <div class="section-title">输入框</div>
        <div class="comp-row">
          <el-input v-model="input" placeholder="基础输入框" clearable />
          <el-input v-model="input" placeholder="带前缀" prefix-icon="Search" />
          <el-input v-model="inputNum" type="number" placeholder="数字输入" />
          <el-input v-model="input" placeholder="禁用状态" disabled />
        </div>
      </div>

      <div class="comp-card">
        <div class="section-title">选择器</div>
        <div class="comp-row">
          <el-select v-model="select" placeholder="单选" style="width:100%">
            <el-option v-for="i in 4" :key="i" :label="`选项 ${i}`" :value="`opt${i}`" />
          </el-select>
          <el-select v-model="multiSelect" multiple placeholder="多选" style="width:100%">
            <el-option v-for="i in 4" :key="i" :label="`选项 ${i}`" :value="`opt${i}`" />
          </el-select>
        </div>
      </div>

      <div class="comp-card">
        <div class="section-title">单选 / 多选</div>
        <div class="comp-row">
          <el-radio-group v-model="radio">
            <el-radio value="a">选项 A</el-radio>
            <el-radio value="b">选项 B</el-radio>
            <el-radio value="c">选项 C</el-radio>
          </el-radio-group>
          <el-checkbox-group v-model="checkbox">
            <el-checkbox value="a">选项 A</el-checkbox>
            <el-checkbox value="b">选项 B</el-checkbox>
            <el-checkbox value="c">选项 C</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="comp-card">
        <div class="section-title">开关 / 滑块 / 评分</div>
        <div class="comp-row">
          <div class="inline-row">
            <span class="comp-label">开关</span>
            <el-switch v-model="switchVal" active-color="#6366f1" />
          </div>
          <div class="inline-row">
            <span class="comp-label">滑块</span>
            <el-slider v-model="slider" style="flex:1" />
          </div>
          <div class="inline-row">
            <span class="comp-label">评分</span>
            <el-rate v-model="rate" />
          </div>
        </div>
      </div>

      <div class="comp-card">
        <div class="section-title">日期选择</div>
        <div class="comp-row">
          <el-date-picker v-model="date" type="date" placeholder="选择日期" style="width:100%" value-format="YYYY-MM-DD" />
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%" />
        </div>
      </div>

      <div class="comp-card">
        <div class="section-title">颜色选择 / 文本域</div>
        <div class="comp-row">
          <div class="inline-row">
            <span class="comp-label">颜色</span>
            <el-color-picker v-model="color" />
            <span class="color-val">{{ color }}</span>
          </div>
          <el-input v-model="textarea" type="textarea" :rows="3" placeholder="文本域输入" maxlength="100" show-word-limit />
        </div>
      </div>

      <div class="comp-card wide">
        <div class="section-title">穿梭框</div>
        <el-transfer
          v-model="transfer.value"
          :data="transfer.data"
          :titles="['待选项', '已选项']"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './form-shared';

.components-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.comp-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);

  &.wide { grid-column: 1 / -1; }
}

.comp-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.inline-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comp-label {
  font-size: 13px;
  color: #8a8fa8;
  width: 36px;
  flex-shrink: 0;
}

.color-val {
  font-size: 13px;
  color: #5a6080;
}
</style>
