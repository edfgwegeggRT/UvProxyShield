import { getProxyUrl } from "@/lib/proxy";

interface ProxyDisplayProps {
  url: string | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onRefresh: () => void;
}

export default function ProxyDisplay({ url, loading, error, onRetry, onRefresh }: ProxyDisplayProps) {
  if (!url) return null;

  if (loading) {
    return (
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-8 text-center">
        <div className="animate-spin w-8 h-8 border-t-2 border-primary rounded-full mx-auto mb-4"></div>
        <p>Loading your request...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-8 text-center">
        <h3 className="text-xl mb-2 text-red-500">Error</h3>
        <p className="mb-4">{error}</p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const proxyUrl = getProxyUrl(url);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between bg-black/30 backdrop-blur-sm p-2 rounded-t-md border-b border-primary">
        <div className="text-sm truncate max-w-[70%]">{url}</div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onRefresh}
            className="p-1 text-primary/70 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <iframe 
        className="w-full h-[60vh] md:h-[70vh] bg-white border border-primary rounded-b-md shadow-[0_0_10px_rgba(255,0,67,0.5)]" 
        src={proxyUrl}
        allowFullScreen={true}
      />
    </div>
  );
}