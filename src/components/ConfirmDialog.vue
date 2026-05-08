<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

withDefaults(defineProps<{
  visible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}>(), {
  confirmText: '确认',
  cancelText: '取消',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('cancel')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div v-if="visible" class="dialog-overlay" @click="emit('cancel')">
        <Transition name="dialog-pop" appear>
          <div v-if="visible" class="dialog-card" @click.stop>
            <div class="dialog-header">
              <span class="dialog-title">{{ title }}</span>
              <button class="dialog-close" @click="emit('cancel')">✕</button>
            </div>

            <div class="dialog-body">
              <span class="dialog-icon">⚠</span>
              <span class="dialog-message">{{ message }}</span>
            </div>

            <div class="dialog-footer">
              <button class="btn btn-cancel" @click="emit('cancel')">{{ cancelText }}</button>
              <button class="btn btn-confirm" @click="emit('confirm')">{{ confirmText }}</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dialog-card {
  background: #16213e;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(99, 102, 241, 0.08);
  width: 360px;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 12px;
}

.dialog-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.dialog-close {
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.35);
  font-size: 14px;
  padding: 4px;
  border-radius: 4px;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: rgba(255, 255, 255, 0.75);
  }
}

.dialog-body {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 24px 24px;
}

.dialog-icon {
  font-size: 18px;
  color: #a78bfa;
  flex-shrink: 0;
}

.dialog-message {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 24px 24px;
}

.btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  outline: none;
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.45);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.25);
    color: rgba(255, 255, 255, 0.7);
  }
}

.btn-confirm {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-weight: 600;

  &:hover {
    opacity: 0.88;
  }
}

/* 遮罩淡入淡出 */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.2s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* 卡片弹出动画 */
.dialog-pop-enter-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dialog-pop-enter-from,
.dialog-pop-leave-to {
  opacity: 0;
  transform: scale(0.94) translateY(8px);
}
</style>
