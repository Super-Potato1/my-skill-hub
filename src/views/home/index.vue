<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/stores'
import SidebarMenu from '@/components/SidebarMenu.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const router = useRouter()
const route = useRoute()
const { userInfo, permission } = useStore()

const collapsed = ref(false)
const sidebarWidth = ref(220)
const isResizing = ref(false)

const MIN_WIDTH = 160

const onResizeStart = (e: MouseEvent) => {
  if (collapsed.value) return
  isResizing.value = true
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  const startX = e.clientX
  const startWidth = sidebarWidth.value

  const onMove = (ev: MouseEvent) => {
    const maxWidth = Math.floor(window.innerWidth * 0.3)
    const next = startWidth + (ev.clientX - startX)
    sidebarWidth.value = Math.min(maxWidth, Math.max(MIN_WIDTH, next))
  }

  const onUp = () => {
    isResizing.value = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

const currentTitle = computed(() => {
  const matched = permission.menuList.find((m) => `/home/${m.path}` === route.path)
  return matched?.meta.title ?? '概览'
})

const showLogoutDialog = ref(false)

const logout = () => {
  showLogoutDialog.value = true
}

const onLogoutConfirm = () => {
  showLogoutDialog.value = false
  userInfo.logout()
  permission.resetRoutes()
  router.push('/')
}
</script>

<template>
  <div class="home-layout">
    <aside
      class="sidebar"
      :class="{ collapsed, resizing: isResizing }"
      :style="!collapsed ? { width: sidebarWidth + 'px', minWidth: sidebarWidth + 'px' } : {}"
    >
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">✦</span>
          <Transition name="label-fade">
            <span v-if="!collapsed" class="logo-text">Skill Hub</span>
          </Transition>
        </div>
        <button class="collapse-btn" @click="collapsed = !collapsed">
          <span class="collapse-icon" :class="{ rotated: collapsed }">‹</span>
        </button>
      </div>

      <SidebarMenu :collapsed="collapsed" />

      <div v-if="!collapsed" class="resize-handle" @mousedown.prevent="onResizeStart"></div>

      <div class="sidebar-footer">
        <div class="user-info" v-if="!collapsed">
          <div class="user-avatar">{{ userInfo.userName?.[0] ?? '?' }}</div>
          <div class="user-detail">
            <div class="user-name">{{ userInfo.userName || '用户' }}</div>
            <div class="user-status">在线</div>
          </div>
        </div>
        <div v-else class="user-avatar small">{{ userInfo.userName?.[0] ?? '?' }}</div>
        <button class="logout-btn" @click="logout" :title="collapsed ? '退出' : ''">
          <span>⎋</span>
          <Transition name="label-fade">
            <span v-if="!collapsed">退出</span>
          </Transition>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <div class="content-header">
        <div class="breadcrumb">
          <span class="breadcrumb-home">首页</span>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">{{ currentTitle }}</span>
        </div>
      </div>

      <div class="content-body">
        <RouterView v-slot="{ Component }">
          <Transition name="fade-slide" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </div>
    </main>

    <ConfirmDialog
      :visible="showLogoutDialog"
      title="退出确认"
      message="确定要退出登录吗？"
      confirm-text="退出"
      cancel-text="取消"
      @confirm="onLogoutConfirm"
      @cancel="showLogoutDialog = false"
    />
  </div>
</template>

<style scoped lang="scss">
.home-layout {
  display: flex;
  width: 100%;
  height: 100%;
  background: #f4f5fb;
}

/* ── Sidebar ── */
.sidebar {
  width: 220px;
  min-width: 220px;
  height: 100%;
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
  z-index: 10;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);

  &.collapsed {
    width: 68px;
    min-width: 68px;
  }

  &.resizing {
    transition: none;
    user-select: none;
  }
}

.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  cursor: col-resize;
  z-index: 20;
  transition: background 0.2s;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 40px;
    border-radius: 2px;
    background: transparent;
    transition: background 0.2s;
  }

  &:hover,
  &:active {
    background: rgba(99, 102, 241, 0.15);

    &::after {
      background: #6366f1;
    }
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  min-height: 64px;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  white-space: nowrap;
}

.logo-icon {
  font-size: 20px;
  color: #6366f1;
  flex-shrink: 0;
}

.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.2s;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}

.collapse-icon {
  display: block;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1;

  &.rotated {
    transform: rotate(180deg);
  }
}

.sidebar-footer {
  padding: 16px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.small {
    margin: 0 auto;
  }
}

.user-detail {
  overflow: hidden;
}

.user-name {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  white-space: nowrap;
}

.user-status {
  font-size: 11px;
  color: #10b981;
  margin-top: 1px;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 9px;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.3);
    color: #fca5a5;
  }
}

/* ── Main Content ── */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.content-header {
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 28px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.breadcrumb-home {
  color: #8a8fa8;
}

.breadcrumb-sep {
  color: #c8cad8;
}

.breadcrumb-current {
  color: #1a1a2e;
  font-weight: 600;
}

.content-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* ── Transitions ── */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

.label-fade-enter-active,
.label-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.label-fade-enter-from,
.label-fade-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
