
import GreekTranslator from '@/components/GreekTranslator';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 greek-pattern opacity-30 pointer-events-none"></div>
      
      {/* Main Content */}
      <div className="relative z-10 py-8">
        <GreekTranslator />
      </div>
    </div>
  );
};

export default Index;
