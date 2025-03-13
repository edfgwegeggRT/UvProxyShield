import { useState } from "react";
import { isValidUrl } from "@/lib/proxy";

interface ProxyFormProps {
  onSubmit: (url: string) => Promise<boolean>;
}

export default function ProxyForm({ onSubmit }: ProxyFormProps) {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset validation state
    setValidationError(null);
    
    // Check if URL is empty
    if (!url.trim()) {
      setValidationError("Please enter a URL");
      return;
    }
    
    // Validate URL format
    if (!isValidUrl(url)) {
      setValidationError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }
    
    // Submit the URL to the parent component
    const success = await onSubmit(url);
    
    // If the submission was successful, we could clear the form if needed
    if (success) {
      // Optional: clear the form or keep the URL visible
      // setUrl("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mb-10">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          </div>
          <input 
            type="url" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-md focus:outline-none shadow-[0_0_5px_#ff0043,0_0_15px_#ff0043] hover:shadow-[0_0_10px_#ff0043,0_0_20px_#ff0043,0_0_30px_#ff0043] focus:shadow-[0_0_10px_#ff0043,0_0_20px_#ff0043,0_0_30px_#ff0043] transition-all duration-300 bg-muted border border-primary ${validationError ? 'animate-[shake_0.5s] border-destructive' : ''}`}
            placeholder="Enter URL (e.g., https://example.com)" 
            required
          />
          {validationError && (
            <div className="mt-2 text-primary text-sm">{validationError}</div>
          )}
        </div>
        <button 
          type="submit" 
          className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md transition-all duration-300 shadow-[0_0_5px_#ff0043,0_0_15px_#ff0043] hover:shadow-[0_0_10px_#ff0043,0_0_20px_#ff0043,0_0_30px_#ff0043]"
        >
          PROXY
        </button>
      </form>
      <div className="text-sm opacity-70 text-center md:text-left">
        <p>Enter any URL to view it through our secure proxy service. Stay anonymous and bypass restrictions.</p>
      </div>
    </div>
  );
}
