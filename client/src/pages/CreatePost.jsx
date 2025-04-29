import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import preview from '../assets/preview.png';
import getRandomPrompt from '../utils/index.js';
import { FormField, Loader } from "../components";

// Mock image generation function - returns a placeholder image with prompt text
const mockGenerateImage = (prompt) => {
  // Generate a random color scheme for variety
  const colors = [
    ['#6469ff', '#323680'], // Blue
    ['#ff6464', '#803232'], // Red
    ['#64ff64', '#328032'], // Green
    ['#ff64ff', '#803280'], // Purple
    ['#ffff64', '#808032']  // Yellow
  ];
  
  const randomColorScheme = colors[Math.floor(Math.random() * colors.length)];
  
  // Create an SVG with the prompt text and random gradient
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
    <defs>
      <linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${randomColorScheme[0]}"/>
        <stop offset="100%" stop-color="${randomColorScheme[1]}"/>
      </linearGradient>
    </defs>
    <path fill="url(#a)" d="M0 0h512v512H0z"/>
    <text x="50%" y="45%" font-family="Arial" font-size="18" fill="white" text-anchor="middle" dy=".3em">
      AI Generated: ${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}
    </text>
    <text x="50%" y="55%" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dy=".3em">
      (Frontend-only mode)
    </text>
  </svg>`;
  
  // Convert SVG to base64
  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
};

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: ''
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!form.name.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!form.prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    if (!form.photo) {
      alert('Please generate an image first');
      return;
    }

    setLoading(true);

    try {
      // Get existing posts from localStorage or initialize empty array
      const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      
      // Add new post to the array
      const newPost = {
        ...form,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      // Save back to localStorage
      localStorage.setItem('posts', JSON.stringify([newPost, ...existingPosts]));
      
      // Trigger storage event for cross-tab communication
      window.dispatchEvent(new Event('storage'));
      
      // Navigate to home page after short delay to simulate server response
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
    catch (err) {
      alert("Error saving your creation");
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generatingImage = async () => {
    if (!form.prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    
    try {
      setGeneratingImg(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use our mock function with the actual prompt
      const imageData = mockGenerateImage(form.prompt);
      
      setForm({ ...form, photo: imageData });
    }
    catch (err) {
      alert("Failed to generate image. Please try again.");
      console.error(err);
    }
    finally {
      setGeneratingImg(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Create
        </h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
          Create imaginative and visually stunning
          images with AI and share them with the 
          community
        </p>

        <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <FormField 
              labelname='Your Name' 
              type='text' 
              name='name' 
              placeholder='John Doe' 
              value={form.name} 
              handleChange={handleChange} 
              required
            />
            <FormField 
              labelname='Prompt' 
              type='text' 
              name='prompt' 
              placeholder='A painting of a fox in the style of Starry Night...' 
              value={form.prompt} 
              handleChange={handleChange} 
              isSurpriseMe
              handleSurpriseMe={handleSurpriseMe} 
              required
            />

            <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center"> 
              {form.photo ? (
                <img src={form.photo} alt={form.prompt} className="w-full h-full object-contain" />
              ) : (
                <img src={preview} alt="preview" className="w-9/12 h-9/12 object-contain" />
              )}

              {generatingImg && 
                <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                  <Loader />
                </div>
              }
            </div>
          </div>

          <div className="mt-5 flex gap-5">
              <button 
                type="button" 
                onClick={generatingImage} 
                className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                disabled={generatingImg}
              >
                {generatingImg ? 'Generating...' : 'Generate'}
              </button>
          </div>

          <div className="mt-10">
              <p className="mt-2 text-[#666e75] text-[14px]">
                Once you have created the image you want, you can share it with others in the community
              </p>
              <button 
                type="submit" 
                className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                disabled={loading}
              >
                {loading ? 'Sharing...' : 'Share with the community'}
              </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;

