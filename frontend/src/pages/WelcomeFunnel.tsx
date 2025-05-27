import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { 
  ClipboardDocumentListIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function WelcomeFunnel() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [step, setStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: 'Willkommen bei der Kinderkleiderbörse',
      description: 'Wir freuen uns, dass Sie dabei sind! Lassen Sie uns gemeinsam Ihre Kleidung zum Verkauf anbieten.',
      action: 'Erste Schritte',
    },
    {
      id: 2,
      title: 'So funktioniert der Verkauf',
      description: 'Sie können Ihre Kleidung einfach registrieren und mit einem Preis versehen. Wir kümmern uns um den Verkauf.',
      action: 'Verstanden',
    },
    {
      id: 3,
      title: 'Jetzt Kleidung registrieren',
      description: 'Beginnen Sie mit der Registrierung Ihrer Kleidungsstücke. Sie benötigen dafür:',
      bullets: [
        'Beschreibung des Kleidungsstücks',
        'Größe',
        'Gewünschter Verkaufspreis',
        'Zustand des Kleidungsstücks'
      ],
      action: 'Los geht\'s',
    }
  ];

  const currentStep = steps[step - 1];

  const handleNext = () => {
    if (step === steps.length) {
      localStorage.setItem('hasCompletedWelcome', 'true');
      navigate('/items/new');
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          {/* Progress bar */}
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-8">
              {steps.map((s) => (
                <div key={s.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full 
                      ${s.id < step ? 'bg-green-500' : s.id === step ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  >
                    {s.id < step ? (
                      <CheckCircleIcon className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-white font-medium">{s.id}</span>
                    )}
                  </div>
                  {s.id !== steps.length && (
                    <div
                      className={`w-full h-1 mx-4 ${
                        s.id < step ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="text-center">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-indigo-600" />
              <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
                {currentStep.title}
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                {currentStep.description}
              </p>

              {/* Bullets if present */}
              {currentStep.bullets && (
                <ul className="mt-6 text-left max-w-md mx-auto">
                  {currentStep.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start mt-2">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-500">
                        <CheckCircleIcon className="h-4 w-4" />
                      </span>
                      <span className="ml-3 text-gray-500">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Action Button */}
              <button
                onClick={handleNext}
                className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {currentStep.action}
                <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 