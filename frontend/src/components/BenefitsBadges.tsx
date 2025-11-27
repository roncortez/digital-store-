export default function BenefitsBadges() {
  return (
    <div className="pt-8 border-t border-gray-100">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center group">
          <div className="w-10 h-10 mx-auto bg-brand-dark rounded-full flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-gray-900">100% Seguro</p>
        </div>
        
        <div className="text-center group">
          <div className="w-10 h-10 mx-auto bg-brand-dark rounded-full flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-gray-900">Verificado</p>
        </div>
        
        <div className="text-center group">
          <div className="w-10 h-10 mx-auto bg-brand-dark rounded-full flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-gray-900">Envío Rápido</p>
        </div>
      </div>
    </div>
  );
}
