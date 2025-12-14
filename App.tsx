import React, { useState, useRef, useEffect } from 'react';
import { Button } from './components/Button';
import { editImageWithGemini, extractBase64Data } from './services/geminiService';
import { AppStatus } from './types';
import { DEFAULT_PROMPT, PRESET_PROMPTS } from './constants';
import { 
  CloudArrowUpIcon, 
  PhotoIcon, 
  SparklesIcon, 
  ArrowPathIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { 
  SiReact, 
  SiJavascript, 
  SiTypescript, 
  SiPython, 
  SiHtml5, 
  SiCss3, 
  SiNodedotjs, 
  SiGithub 
} from 'react-icons/si';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Tech Stack Options
  const techStacks = [
    { id: 'react', Icon: SiReact, label: 'React', color: 'group-hover:text-[#61DAFB]', text: "Include a glowing React.js atom logo." },
    { id: 'js', Icon: SiJavascript, label: 'JS', color: 'group-hover:text-[#F7DF1E]', text: "Add the JavaScript (JS) logo." },
    { id: 'ts', Icon: SiTypescript, label: 'TS', color: 'group-hover:text-[#3178C6]', text: "Feature the TypeScript logo." },
    { id: 'html', Icon: SiHtml5, label: 'HTML', color: 'group-hover:text-[#E34F26]', text: "Include the HTML5 badge." },
    { id: 'css', Icon: SiCss3, label: 'CSS', color: 'group-hover:text-[#1572B6]', text: "Include the CSS3 badge." },
    { id: 'node', Icon: SiNodedotjs, label: 'Node', color: 'group-hover:text-[#339933]', text: "Add the Node.js logo." },
    { id: 'python', Icon: SiPython, label: 'Python', color: 'group-hover:text-[#3776AB]', text: "Include the Python snake logo." },
    { id: 'github', Icon: SiGithub, label: 'GitHub', color: 'group-hover:text-white', text: "Add the GitHub Octocat logo." },
  ];

  // Auto-scroll to preview on mobile when generation finishes
  useEffect(() => {
    if (status === AppStatus.SUCCESS && window.innerWidth < 1024) {
      previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [status]);

  // Handle File Upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG).');
      return;
    }

    // Reset state for new image
    setStatus(AppStatus.IDLE);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCurrentImage(result);
      setOriginalImage(result); // Keep original for reference or reset
    };
    reader.readAsDataURL(file);
  };

  // Trigger File Input Click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle Image Generation/Editing
  const handleGenerate = async () => {
    if (!currentImage || !prompt) return;

    setStatus(AppStatus.PROCESSING);
    setError(null);

    try {
      const { data, mimeType } = extractBase64Data(currentImage);
      
      const newImageData = await editImageWithGemini(data, mimeType, prompt);
      
      // Construct the new data URL
      const newImageSrc = `data:image/png;base64,${newImageData}`;
      
      setCurrentImage(newImageSrc);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate banner. Please try again.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setCurrentImage(originalImage);
    setStatus(AppStatus.IDLE);
    setPrompt(DEFAULT_PROMPT);
  };

  const addTechToPrompt = (text: string) => {
    setPrompt((prev) => {
      // Avoid duplicates roughly
      if (prev.includes(text)) return prev;
      return `${prev} ${text}`;
    });
  };

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-dark-800 bg-dark-900/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-brand-600 to-purple-600 p-1.5 sm:p-2 rounded-lg">
              <CodeBracketIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-purple-400">
              DevBanner AI
            </h1>
          </div>
          <div className="text-xs sm:text-sm text-gray-400 hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            
            {/* Upload Section */}
            <div className="bg-dark-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800 shadow-xl">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <PhotoIcon className="w-5 h-5 text-brand-500" />
                Source Image
              </h2>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {!currentImage ? (
                <div 
                  onClick={handleUploadClick}
                  className="border-2 border-dashed border-gray-700 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-dark-800/50 transition-all group"
                >
                  <CloudArrowUpIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 group-hover:text-brand-500 transition-colors mb-2 sm:mb-3" />
                  <p className="text-sm font-medium text-gray-300">Tap to upload photo</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              ) : (
                <div className="relative group rounded-xl overflow-hidden border border-gray-700">
                  <img src={currentImage} alt="Source" className="w-full h-40 sm:h-48 object-cover opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" onClick={handleUploadClick} className="text-xs px-3 py-2">
                      Change Photo
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Section */}
            <div className="bg-dark-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800 shadow-xl">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-purple-500" />
                Banner Instructions
              </h2>

              <div className="space-y-4">
                
                {/* Style Presets */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_PROMPTS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setPrompt(opt.text)}
                        className="text-xs text-left p-2.5 rounded bg-dark-900 border border-gray-700 hover:border-brand-500 hover:text-brand-400 transition-colors active:bg-dark-800"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Icons */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Add Tech Icons</label>
                  <div className="grid grid-cols-4 gap-2">
                    {techStacks.map((tech) => (
                      <button
                        key={tech.id}
                        onClick={() => addTechToPrompt(tech.text)}
                        title={`Add ${tech.label} to banner`}
                        className="group flex flex-col items-center justify-center p-2 rounded bg-dark-900 border border-gray-700 hover:border-gray-500 hover:bg-dark-800 transition-all active:scale-95"
                      >
                        <tech.Icon className={`w-5 h-5 mb-1 text-gray-400 ${tech.color} transition-colors`} />
                        <span className="text-[10px] text-gray-400 group-hover:text-gray-200">{tech.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Custom Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none h-24 sm:h-32"
                    placeholder="Describe how you want to transform this image..."
                  />
                </div>

                <Button 
                  onClick={handleGenerate} 
                  isLoading={status === AppStatus.PROCESSING}
                  disabled={!currentImage}
                  className="w-full py-3 sm:py-2.5"
                >
                  {status === AppStatus.PROCESSING ? 'Generating...' : 'Generate Banner'}
                </Button>

                {status === AppStatus.SUCCESS && (
                   <Button variant="secondary" onClick={handleReset} className="w-full py-3 sm:py-2.5">
                     <ArrowPathIcon className="w-4 h-4" /> Reset to Original
                   </Button>
                )}
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-8" ref={previewRef}>
            <div className="bg-dark-800 rounded-xl sm:rounded-2xl p-1 border border-gray-800 shadow-2xl h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] flex flex-col transition-all">
               <div className="flex-1 bg-dark-900 rounded-xl overflow-hidden relative flex items-center justify-center p-2 sm:p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                 {!currentImage ? (
                   <div className="text-center p-6 sm:p-8">
                     <div className="inline-block p-3 sm:p-4 rounded-full bg-dark-800 mb-3 sm:mb-4 animate-pulse">
                       <PhotoIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700" />
                     </div>
                     <h3 className="text-lg sm:text-xl font-medium text-gray-400">No Image Selected</h3>
                     <p className="text-sm sm:text-base text-gray-600 mt-2">Upload an image to start designing your banner.</p>
                   </div>
                 ) : (
                   <div className="relative w-full max-w-4xl shadow-2xl rounded-lg overflow-hidden ring-1 ring-gray-700">
                     <img 
                      src={currentImage} 
                      alt="Banner Preview" 
                      className={`w-full h-auto object-contain transition-all duration-500 ${status === AppStatus.PROCESSING ? 'opacity-50 blur-sm scale-[0.98]' : 'scale-100'}`} 
                     />
                     
                     {/* Processing Overlay */}
                     {status === AppStatus.PROCESSING && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                         <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
                         <p className="text-brand-400 font-mono text-sm sm:text-base animate-pulse">Gemini is designing...</p>
                       </div>
                     )}
                   </div>
                 )}
               </div>

               {/* Toolbar (Download) */}
               {currentImage && status === AppStatus.SUCCESS && (
                 <div className="p-3 sm:p-4 bg-dark-800 border-t border-gray-700 flex justify-end gap-3">
                   <a 
                    href={currentImage} 
                    download="dev-banner.png"
                    className="w-full sm:w-auto justify-center bg-green-600 hover:bg-green-500 text-white px-4 py-3 sm:py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm sm:text-base"
                   >
                     Download Banner
                   </a>
                 </div>
               )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;