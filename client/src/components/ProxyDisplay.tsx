import { getProxyUrl } from "@/lib/proxy";

interface ProxyDisplayProps {
  url: string | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onRefresh: () => void;
}

export default function ProxyDisplay({ 
  url, 
  loading, 
  error, 
  onRetry, 
  onRefresh 
}: ProxyDisplayProps) {
  // Determine which state to show
  const showEmptyState = !loading && !error && !url;
  const showLoadingState = loading;
  const showErrorState = !loading && error;
  const showProxyFrame = !loading && !error && url;

  return (
    <div className="relative">
      {/* Empty State */}
      {showEmptyState && (
        <div className="text-center p-12 border border-secondary rounded-lg bg-secondary/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-primary opacity-50 mb-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
          <h3 className="text-xl font-bold text-primary">No Website Loaded</h3>
          <p className="mt-2 opacity-70">Enter a URL above to view it through our secure proxy.</p>
        </div>
      )}
      
      {/* Loading State */}
      {showLoadingState && (
        <div className="text-center p-12 border border-secondary rounded-lg bg-secondary/30">
          <div className="mx-auto mb-4 h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-primary">Loading website through secure proxy...</p>
        </div>
      )}
      
      {/* Error State */}
      {showErrorState && (
        <div className="text-center p-12 border border-secondary rounded-lg bg-secondary/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-primary opacity-50 mb-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h3 className="text-xl font-bold text-primary">Unable to Load Website</h3>
          <p className="mt-2 opacity-70">{error}</p>
          <button 
            onClick={onRetry}
            className="mt-4 bg-secondary hover:bg-gray-800 text-primary font-bold py-2 px-4 rounded-md border border-primary transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Proxy Frame */}
      {showProxyFrame && url && (
        <div>
          <div className="bg-secondary p-3 rounded-t-md flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2 shadow-[0_0_5px_#ff0043,0_0_15px_#ff0043]"></div>
              <p className="text-sm truncate max-w-xs md:max-w-lg">{url}</p>
            </div>
            <button 
              onClick={onRefresh}
              className="text-primary hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <iframe 
            className="w-full h-[60vh] bg-white border border-primary rounded-b-md shadow-[0_0_10px_rgba(255,0,67,0.5)]"
            src={getProxyUrl(url)}
          ></iframe>
        </div>
      )}
    </div>
  );
}
