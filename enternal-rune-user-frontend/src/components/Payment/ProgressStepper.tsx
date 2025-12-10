import React from 'react'

interface Step {
    number: number;
    name: string;
    key: string;
}

interface ProgressStepperProps {
    currentStep: number;
    steps: Step[];
}

const ProgressStepper = ({ currentStep, steps }: ProgressStepperProps) => {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                                    currentStep > step.number
                                        ? 'bg-green-500 text-white'
                                        : currentStep === step.number
                                        ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                                        : 'bg-gray-300 text-gray-600'
                                }`}
                            >
                                {currentStep > step.number ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    step.number
                                )}
                            </div>
                            <span className={`mt-1.5 text-xs font-medium text-center ${
                                currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                                {step.name}
                            </span>
                        </div>

                        {index < steps.length - 1 && (
                            <div className={`w-12 sm:w-20 h-1 mx-2 transition-all duration-300 ${
                                currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

export default ProgressStepper
