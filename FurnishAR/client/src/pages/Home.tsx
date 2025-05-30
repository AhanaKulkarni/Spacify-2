import { useAppStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { ProjectEditor } from '@/components/ProjectEditor';
import { NewProjectModal } from '@/components/modals/NewProjectModal';
import { SubscriptionModal } from '@/components/modals/SubscriptionModal';

export function Home() {
  const { currentProject, showNewProjectModal, showSubscriptionModal } = useAppStore();

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentProject ? <ProjectEditor /> : <Dashboard />}
      </main>

      {/* Modals */}
      {showNewProjectModal && <NewProjectModal />}
      {showSubscriptionModal && <SubscriptionModal />}
    </div>
  );
}
