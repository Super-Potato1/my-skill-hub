<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/stores'

const props = defineProps<{ collapsed: boolean }>()

const route = useRoute()
const router = useRouter()
const { permission } = useStore()

const menuList = computed(() => permission.menuList)
const activeMenu = computed(() => route.path)

const expandedMenus = ref<Set<string>>(new Set(['form']))

const toggleExpand = (name: string) => {
  if (expandedMenus.value.has(name)) {
    expandedMenus.value.delete(name)
  } else {
    expandedMenus.value.add(name)
  }
}

const navigate = (path: string) => {
  router.push(`/home/${path}`)
}

const isParentActive = (menu: { path: string; children?: unknown[] }) =>
  !!menu.children && activeMenu.value.startsWith(`/home/${menu.path}`)

const hoveredMenu = ref<string | null>(null)
const flyoutTop = ref(0)
let hideTimer: ReturnType<typeof setTimeout> | null = null

const onParentEnter = (e: MouseEvent, name: string) => {
  if (!props.collapsed) return
  if (hideTimer) clearTimeout(hideTimer)
  hoveredMenu.value = name
  flyoutTop.value = (e.currentTarget as HTMLElement).getBoundingClientRect().top
}

const onParentLeave = () => {
  hideTimer = setTimeout(() => { hoveredMenu.value = null }, 100)
}

const onFlyoutEnter = () => {
  if (hideTimer) clearTimeout(hideTimer)
}

const onFlyoutLeave = () => {
  hoveredMenu.value = null
}
</script>

<template>
  <nav class="sidebar-nav">
    <template v-for="menu in menuList" :key="menu.name as string">
      <!-- 父菜单（有子菜单） -->
      <template v-if="menu.children?.length">
        <div
          class="nav-item"
          :class="{ active: isParentActive(menu) }"
          :title="props.collapsed ? menu.meta.title : ''"
          @click="!props.collapsed ? toggleExpand(menu.name as string) : navigate(`${menu.path}/${menu.children[0].path}`)"
          @mouseenter="onParentEnter($event, menu.name as string)"
          @mouseleave="onParentLeave"
        >
          <span class="nav-icon">{{ menu.meta.icon }}</span>
          <Transition name="label-fade">
            <span v-if="!props.collapsed" class="nav-label">{{ menu.meta.title }}</span>
          </Transition>
          <Transition name="label-fade">
            <span v-if="!props.collapsed" class="expand-arrow" :class="{ expanded: expandedMenus.has(menu.name as string) }">›</span>
          </Transition>
        </div>

        <!-- 子菜单 -->
        <Transition name="submenu">
          <div v-if="!props.collapsed && expandedMenus.has(menu.name as string)" class="submenu">
            <div
              v-for="child in menu.children"
              :key="child.name as string"
              class="nav-item sub"
              :class="{ active: activeMenu === `/home/${menu.path}/${child.path}` }"
              @click="navigate(`${menu.path}/${child.path}`)"
            >
              <span class="nav-icon sub-icon">{{ child.meta.icon }}</span>
              <span class="nav-label">{{ child.meta.title }}</span>
              <div v-if="activeMenu === `/home/${menu.path}/${child.path}`" class="active-indicator"></div>
            </div>
          </div>
        </Transition>
      </template>

      <!-- 普通菜单 -->
      <div
        v-else
        class="nav-item"
        :class="{ active: activeMenu === `/home/${menu.path}` }"
        :title="props.collapsed ? menu.meta.title : ''"
        @click="navigate(menu.path as string)"
      >
        <span class="nav-icon">{{ menu.meta.icon }}</span>
        <Transition name="label-fade">
          <span v-if="!props.collapsed" class="nav-label">{{ menu.meta.title }}</span>
        </Transition>
        <div v-if="!props.collapsed && activeMenu === `/home/${menu.path}`" class="active-indicator"></div>
      </div>
    </template>
  </nav>

  <Teleport to="body">
    <Transition name="flyout">
    <div
      v-if="props.collapsed && hoveredMenu"
      class="flyout-menu"
      :style="{ top: flyoutTop + 'px' }"
      @mouseenter="onFlyoutEnter"
      @mouseleave="onFlyoutLeave"
    >
      <template v-for="menu in menuList" :key="menu.name as string">
        <template v-if="menu.children?.length && hoveredMenu === (menu.name as string)">
          <div class="flyout-title">{{ menu.meta.title }}</div>
          <div
            v-for="child in menu.children"
            :key="child.name as string"
            class="flyout-item"
            :class="{ active: activeMenu === `/home/${menu.path}/${child.path}` }"
            @click="navigate(`${menu.path}/${child.path}`)"
          >
            <span class="nav-icon sub-icon">{{ child.meta.icon }}</span>
            <span class="nav-label">{{ child.meta.title }}</span>
            <div v-if="activeMenu === `/home/${menu.path}/${child.path}`" class="active-indicator"></div>
          </div>
        </template>
      </template>
    </div>
    </Transition>
  </Teleport>
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

  &:hover { background: rgba(255, 255, 255, 0.07); }

  &.active {
    background: rgba(99, 102, 241, 0.2);
    .nav-icon, .nav-label { color: #a5b4fc; }
  }

  &.sub {
    padding: 9px 12px 9px 16px;
    border-radius: 8px;
  }
}

.nav-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.sub-icon { font-size: 15px; }

.nav-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
  flex: 1;
}

.expand-arrow {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.35);
  transition: transform 0.25s;
  flex-shrink: 0;

  &.expanded { transform: rotate(90deg); }
}

.submenu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 8px;
  overflow: hidden;
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

/* flyout submenu (collapsed state) */
.flyout-enter-active,
.flyout-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.flyout-enter-from,
.flyout-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

.flyout-menu {
  position: fixed;
  left: 68px;
  background: #1a1a2e;
  border-radius: 10px;
  padding: 6px;
  box-shadow: 6px 6px 24px rgba(0, 0, 0, 0.35);
  z-index: 9999;
  min-width: 160px;
}

.flyout-title {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  padding: 4px 10px 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.flyout-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover { background: rgba(255, 255, 255, 0.07); }

  &.active {
    background: rgba(99, 102, 241, 0.2);
    .nav-icon, .nav-label { color: #a5b4fc; }
  }
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

.submenu-enter-active,
.submenu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
