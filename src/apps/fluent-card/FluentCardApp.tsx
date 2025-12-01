import { AppLayout } from './app/AppLayout';
import { useFluentStore } from './store/useFluentStore';
import { Onboarding } from './components/Onboarding/Onboarding';

export const FluentCardApp: React.FC = () => {
  const hasOnboarded = useFluentStore((state) => state.hasOnboarded);

  return (
    <div className="w-full h-full bg-black overflow-hidden relative">
      {hasOnboarded ? <AppLayout /> : <Onboarding />}
    </div>
  );
};
