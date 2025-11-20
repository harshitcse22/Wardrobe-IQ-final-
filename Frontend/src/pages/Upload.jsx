import { useState } from 'react';
import { Upload as UploadIcon, Camera, Loader, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [adding, setAdding] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const token = localStorage.getItem('token');
      console.log('Sending token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wardrobe/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: formData
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        const text = await response.text();
        console.error('Response text:', text.substring(0, 200));
        throw new Error('Server returned invalid response');
      }
      console.log('Upload response:', response.status, data);
      
      if (response.ok) {
        console.log('Analysis successful:', data);
        setAiResults(data.detection);
      } else {
        console.error('Analysis failed:', data);
        console.error('Response status:', response.status);
        alert(`Analysis failed: ${data.message || data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      // Check if response is HTML (server error page)
      if (error.message.includes('Unexpected token')) {
        alert('Server error occurred. Please check the backend console for details.');
      } else {
        alert(`Network error: ${error.message}. Please check if the server is running.`);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const addToWardrobe = async () => {
    if (!aiResults) return;

    setAdding(true);
    try {
      console.log('Adding to wardrobe:', aiResults);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wardrobe/add-to-wardrobe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: `${aiResults.color.primary} ${aiResults.type}`,
          type: aiResults.type,
          category: aiResults.category,
          color: aiResults.color,
          fabric: aiResults.fabric,
          imageUrl: preview
        })
      });

      const data = await response.json();
      console.log('Add to wardrobe response:', data);

      if (response.ok) {
        alert('Item added to wardrobe successfully!');
        // Reset form
        setSelectedFile(null);
        setPreview(null);
        setAiResults(null);
      } else {
        alert(`Failed to add item: ${data.message}`);
      }
    } catch (error) {
      console.error('Add to wardrobe error:', error);
      alert('Network error. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload & Scan</h1>
          <p className="text-gray-600">Upload a photo of your clothing item for AI analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Drag & Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-indigo-300 rounded-3xl p-12 text-center hover:border-indigo-500 transition-all duration-300 cursor-pointer bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100"
            >
              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg mx-auto"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                      setAiResults(null);
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                    <UploadIcon size={36} className="text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Drop your image here</p>
                    <p className="text-gray-500">or click to browse</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 cursor-pointer font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Camera size={20} className="mr-2" />
                    Choose Image
                  </label>
                </div>
              )}
            </div>

            {/* Analyze Button */}
            {preview && !aiResults && (
              <button
                onClick={analyzeImage}
                disabled={analyzing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {analyzing ? (
                  <>
                    <Loader size={20} className="mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  'Analyze Using AI'
                )}
              </button>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analyzing && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            )}

            {aiResults && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Results</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{aiResults.type}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">{aiResults.category}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Primary Color:</span>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: aiResults.color.primary }}
                      ></div>
                      <span className="font-medium capitalize">{aiResults.color.primary}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fabric:</span>
                    <span className="font-medium capitalize">{aiResults.fabric}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-medium">{Math.round(aiResults.confidence * 100)}%</span>
                  </div>
                </div>

                <button
                  onClick={addToWardrobe}
                  disabled={adding}
                  className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {adding ? (
                    <>
                      <Loader size={20} className="mr-2 animate-spin" />
                      Adding to Wardrobe...
                    </>
                  ) : (
                    <>
                      <Plus size={20} className="mr-2" />
                      Add to My Wardrobe
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;