import { useState } from 'react';
import { Upload as UploadIcon, Camera, Loader, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [serverImageUrl, setServerImageUrl] = useState(null);
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
      console.log('🔵 [UPLOAD] Starting upload...');
      console.log('🔵 [UPLOAD] File:', selectedFile.name);
      console.log('🔵 [UPLOAD] Token:', token ? 'Present' : 'Missing');
      
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
        console.error('❌ [UPLOAD] Failed to parse response as JSON:', parseError);
        const text = await response.text();
        console.error('❌ [UPLOAD] Response text:', text.substring(0, 200));
        throw new Error('Server returned invalid response');
      }
      console.log('🔵 [UPLOAD] Response status:', response.status);
      console.log('🔵 [UPLOAD] Response data:', data);
      
      if (response.ok) {
        console.log('✅ [UPLOAD] Analysis successful!');
        console.log('✅ [UPLOAD] Detection:', data.detection);
        console.log('✅ [UPLOAD] Server Image URL:', data.imageUrl);
        setAiResults(data.detection);
        setServerImageUrl(data.imageUrl);
        console.log('✅ [UPLOAD] State updated. Now click "Add to Wardrobe" button!');
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
    if (!aiResults) {
      console.error('❌ [ADD] No AI results available!');
      return;
    }

    if (!serverImageUrl) {
      console.error('❌ [ADD] No server image URL available!');
      alert('Error: Image URL missing. Please upload again.');
      return;
    }

    setAdding(true);
    try {
      const itemData = {
        name: `${aiResults.color.primary} ${aiResults.type}`,
        type: aiResults.type,
        category: aiResults.category,
        color: aiResults.color,
        fabric: aiResults.fabric,
        imageUrl: serverImageUrl
      };

      console.log('🟢 [ADD] Adding to wardrobe...');
      console.log('🟢 [ADD] Item data:', itemData);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wardrobe/add-to-wardrobe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(itemData)
      });

      const data = await response.json();
      console.log('🟢 [ADD] Response status:', response.status);
      console.log('🟢 [ADD] Response data:', data);

      if (response.ok) {
        console.log('✅ [ADD] Item added successfully!');
        console.log('✅ [ADD] Item ID:', data.item?._id);
        console.log('✅ [ADD] Item category:', data.item?.category);
        alert('✅ Item added to wardrobe successfully! Check "Your Wardrobe" page.');
        // Reset form
        setSelectedFile(null);
        setPreview(null);
        setAiResults(null);
        setServerImageUrl(null);
      } else {
        console.error('❌ [ADD] Failed:', data.message);
        alert(`Failed to add item: ${data.message}`);
      }
    } catch (error) {
      console.error('❌ [ADD] Network error:', error);
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
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Pro Tip:</strong> For better detection, name your files descriptively!
              <br />
              <span className="text-blue-600">Examples: "blue-jeans.jpg", "red-shirt.png", "black-shoes.jpg"</span>
            </p>
          </div>
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
                      setServerImageUrl(null);
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
                <p className="text-sm text-gray-500 mb-4">Review and edit if needed</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Type:</label>
                    <select
                      value={aiResults.type}
                      onChange={(e) => setAiResults({...aiResults, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none capitalize"
                    >
                      <option value="shirt">Shirt</option>
                      <option value="t-shirt">T-Shirt</option>
                      <option value="jeans">Jeans</option>
                      <option value="pants">Pants</option>
                      <option value="shorts">Shorts</option>
                      <option value="dress">Dress</option>
                      <option value="skirt">Skirt</option>
                      <option value="jacket">Jacket</option>
                      <option value="sweater">Sweater</option>
                      <option value="shoes">Shoes</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Category:</label>
                    <select
                      value={aiResults.category}
                      onChange={(e) => setAiResults({...aiResults, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none capitalize"
                    >
                      <option value="tops">Tops</option>
                      <option value="bottoms">Bottoms</option>
                      <option value="dresses">Dresses</option>
                      <option value="outerwear">Outerwear</option>
                      <option value="shoes">Shoes</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Primary Color:</label>
                    <select
                      value={aiResults.color.primary}
                      onChange={(e) => setAiResults({...aiResults, color: {...aiResults.color, primary: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none capitalize"
                    >
                      <option value="black">Black</option>
                      <option value="white">White</option>
                      <option value="blue">Blue</option>
                      <option value="red">Red</option>
                      <option value="green">Green</option>
                      <option value="yellow">Yellow</option>
                      <option value="gray">Gray</option>
                      <option value="brown">Brown</option>
                      <option value="pink">Pink</option>
                      <option value="purple">Purple</option>
                      <option value="orange">Orange</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Fabric:</label>
                    <select
                      value={aiResults.fabric}
                      onChange={(e) => setAiResults({...aiResults, fabric: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none capitalize"
                    >
                      <option value="cotton">Cotton</option>
                      <option value="denim">Denim</option>
                      <option value="silk">Silk</option>
                      <option value="wool">Wool</option>
                      <option value="polyester">Polyester</option>
                      <option value="linen">Linen</option>
                      <option value="leather">Leather</option>
                      <option value="synthetic">Synthetic</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-600">AI Confidence:</span>
                    <span className="text-sm font-medium">{Math.round(aiResults.confidence * 100)}%</span>
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