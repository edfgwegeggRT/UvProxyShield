import { useEffect } from "react";
import ProxyForm from "@/components/ProxyForm";
import ProxyDisplay from "@/components/ProxyDisplay";
import { useState } from "react";
import { isValidUrl } from "@/lib/proxy";

export default function Home() {
  const [proxyState, setProxyState] = useState<{
    loading: boolean;
    error: string | null;
    url: string | null;
  }>({
    loading: false,
    error: null,
    url: null,
  });

  const handleProxyRequest = async (url: string) => {
    if (!isValidUrl(url)) {
      return false;
    }

    setProxyState({
      loading: true,
      error: null,
      url,
    });

    try {
      // The actual proxy request is handled in the iframe src
      // We're just updating the state to show loading and then the iframe
      setTimeout(() => {
        setProxyState((prev) => ({
          ...prev,
          loading: false,
        }));
      }, 500);
      return true;
    } catch (error) {
      setProxyState({
        loading: false,
        error: "Failed to load the requested website. Please try again.",
        url,
      });
      return false;
    }
  };

  const retryRequest = () => {
    if (proxyState.url) {
      handleProxyRequest(proxyState.url);
    }
  };

  const refreshProxy = () => {
    if (proxyState.url) {
      handleProxyRequest(proxyState.url);
    }
  };

  return (
    <div className="bg-background min-h-screen font-mono text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary flicker shadow-[0_0_5px_rgba(255,0,67,1),0_0_15px_rgba(255,0,67,0.7)]">
            CYBER<span className="text-primary">PROXY</span>
          </h1>
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
            Access websites through a UV static proxy with enhanced privacy and no restrictions.
          </p>
        </header>

        <ProxyForm onSubmit={handleProxyRequest} />

        <ProxyDisplay 
          url={proxyState.url} 
          loading={proxyState.loading} 
          error={proxyState.error}
          onRetry={retryRequest}
          onRefresh={refreshProxy}
        />

        <footer className="text-center mt-16 opacity-70 text-sm">
          <p>CyberProxy &copy; {new Date().getFullYear()} | Secured with UV static proxy technology</p>
          <p className="mt-2">Use responsibly. We are not responsible for content accessed through this service.</p>
        </footer>
      </div>
    </div>
  );
}
