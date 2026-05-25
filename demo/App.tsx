import { useState } from 'react'
import { Activity, LayoutGrid, LayoutList, Server, Settings } from 'lucide-react'
import { NavRail, ThemeSwitcher, Toaster, TooltipProvider, type NavRailItem } from '../src'
import { createRouter } from '../src/api'
import { GalleryView } from './views/gallery'
import { OperationsView } from './views/operations'
import { OverviewView } from './views/overview'
import { SettingsView } from './views/settings'
import { TaskDetailView } from './views/task-detail'

// ---------------------------------------------------------------------------
// Router — defined outside the component so the hook identity is stable.
// On first load: reads the current URL to restore the active route.
// On navigate: pushes a new history entry (no page reload).
// On refresh: URL is preserved so the same route is restored.
// On back/forward: popstate listener updates the route automatically.
// ---------------------------------------------------------------------------
const useRoute = createRouter({
  routes: ['overview', 'operations', 'gallery', 'settings'] as const,
  default: 'overview',
  // basePath: '/operations',  // ← set this for Go-embedded apps with a sub-path
})

export function App() {
  const { route, navigate } = useRoute()
  // Task detail is an overlay on Operations, not a URL route — keeping
  // drill-down state local is the right pattern for panel/drawer UIs.
  const [taskId, setTaskId] = useState<string | null>(null)

  const nav: NavRailItem[] = [
    {
      key: 'overview',
      label: 'Overview (dashboard)',
      icon: <Activity className="h-4 w-4" />,
      active: route === 'overview',
      onSelect: () => navigate('overview'),
    },
    {
      key: 'operations',
      label: 'Operations (list + detail)',
      icon: <LayoutList className="h-4 w-4" />,
      active: route === 'operations',
      onSelect: () => { navigate('operations'); setTaskId(null) },
    },
    {
      key: 'gallery',
      label: 'Component Gallery',
      icon: <LayoutGrid className="h-4 w-4" />,
      active: route === 'gallery',
      onSelect: () => navigate('gallery'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      footer: true,
      active: route === 'settings',
      onSelect: () => navigate('settings'),
    },
  ]

  return (
    <TooltipProvider>
      <div className="flex h-full">
        <NavRail
          items={nav}
          logo={<Server className="h-4 w-4" />}
          logoLabel="sysop-ui demo"
          footerExtra={<ThemeSwitcher />}
        />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {route === 'overview' ? <OverviewView /> : null}
          {route === 'operations' && !taskId ? (
            <OperationsView onOpenTask={(id) => setTaskId(id)} />
          ) : null}
          {route === 'operations' && taskId ? (
            <TaskDetailView taskId={taskId} onBack={() => setTaskId(null)} />
          ) : null}
          {route === 'gallery' ? <GalleryView /> : null}
          {route === 'settings' ? <SettingsView /> : null}
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  )
}
