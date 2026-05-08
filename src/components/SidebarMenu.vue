<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/stores'

const props = defineProps<{ collapsed: boolean }>()

const route = useRoute()
const router = useRouter()
const { permission } = useStore()

const menuList = computed(() => permission.menuList)
const activeMenu = computed(() => route.path)

const navigate = (path: string) => {
  router.push(`/home/${path}`)
}
</script>

<template>
  <nav class="sidebar-nav">
    <div
      v-for="menu in menuList"
      :key="menu.name as string"
      class="nav-item"
      :class="{ active: activeMenu === `/home/${menu.path}` }"
      @click="navigate(menu.path as string)"
      :title="props.collapsed ? menu.meta.title : ''"
    >
      <span class="nav-icon">{{ menu.meta.icon }}</span>
      <Transition name="label-fade">
        <span v-if="!props.collapsed" class="nav-label">{{ menu.meta.title }}</span>
      </Transition>
      <div v-if="!props.collapsed && activeMenu === `/home/${menu.path}`" class="active-indicator"></div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.sidebar-nav {
  flex: 1;
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  transition: background 0.2s, transform 0.15s;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    transform: translateX(2px);
  }

  &.active {
    background: rgba(99, 102, 241, 0.2);

    .nav-icon,
    .nav-label {
      color: #a5b4fc;
    }
  }
}

.nav-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.nav-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
}

.active-indicator {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: #6366f1;
  border-radius: 2px 0 0 2px;
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
