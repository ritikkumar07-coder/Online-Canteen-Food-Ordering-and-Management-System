import './OrderTracker.css';

const steps = [
  { key: 'pending', label: 'Placed', icon: '📝' },
  { key: 'confirmed', label: 'Confirmed', icon: '✓' },
  { key: 'preparing', label: 'Cooking', icon: '👨‍🍳' },
  { key: 'ready', label: 'Ready', icon: '🔔' },
  { key: 'completed', label: 'Picked Up', icon: '✅' },
];

export default function OrderTracker({ status = 'pending', currentStep = 0 }) {
  const getStepIndex = (status) => {
    return steps.findIndex(s => s.key === status);
  };

  const stepIndex = getStepIndex(status);

  return (
    <div className="order-tracker">
      <div className="tracker-line">
        <div 
          className="tracker-progress"
          style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }}
        />
      </div>

      <div className="tracker-steps">
        {steps.map((step, index) => (
          <div 
            key={step.key}
            className={`tracker-step ${index <= stepIndex ? 'completed' : ''} ${index === stepIndex ? 'current' : ''}`}
          >
            <div className="step-dot">
              <span className="step-icon">{step.icon}</span>
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
