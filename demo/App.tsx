import { useState } from 'react'
import { LayoutGrid, LayoutList, Server, Settings } from 'lucide-react'
import { NavRail, ThemeSwitcher, Toaster, TooltipProvider, type NavRailItem } from '../src'
import { GalleryView } from './views/gallery'
import { OperationsView } from './views/operations'
import { SettingsView } from './views/settings'
import { TaskDetailView } from './views/task-detail'

type View = 'gallery' | 'operations' | 'detail' | 'settings'

/**
 * Demo shell. The NavRail switches between the component gallery and a
 * Torque-shaped Operations route (with a drill-in task detail page). The
 * theme switcher and a Settings entry are pinned to the rail's footer.
 */
export function App() {
  const [view, setView] = useState<View>('gallery')
  const [taskId, setTaskId] = useState<string | null>(null)

  const nav: NavRailItem[] = [
    {
      key: 'gallery',
      label: 'Component Gallery',
      icon: <LayoutGrid className="h-4 w-4" />,
      active: view === 'gallery',
      onSelect: () => setView('gallery'),
    },
    {
      key: 'operations',
      label: 'Operations (Torque-shaped)',
      icon: <LayoutList className="h-4 w-4" />,
      active: view === 'operations' || view === 'detail',
      onSelect: () => setView('operations'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      footer: true,
      active: view === 'settings',
      onSelect: () => setView('settings'),
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
        <div className="min-w-0 flex-1">
          {view === 'gallery' ? <GalleryView /> : null}
          {view === 'operations' ? (
            <OperationsView
              onOpenTask={(id) => {
                setTaskId(id)
                setView('detail')
              }}
            />
          ) : null}
          {view === 'detail' && taskId ? (
            <TaskDetailView taskId={taskId} onBack={() => setView('operations')} />
          ) : null}
          {view === 'settings' ? <SettingsView /> : null}
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  )
}
