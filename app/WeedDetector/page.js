'use client'
import { useState } from "react";
import { Upload, Image as ImageIcon, Video, Info, Leaf, Camera, Sun, FileVideo, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "../components/Header";

export default function WeedDetector() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type.startsWith("image") ? "image" : "video");
      setResult(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    // Simulating API call for weed detection
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setResult("Weed detected in the bottom-left quadrant of your field. (Simulation hai, dummy)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl mt-12 font-bold tracking-tight text-green-600 dark:text-green-400 mb-4">
            <Leaf className="inline-block mr-2 h-12 w-12" />
            Farm Weed Detector
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Harness the power of AI to spot weeds in your field. Upload an image or video and let our advanced technology do the rest!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-xl bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <CardHeader className="bg-green-500 text-white">
              <CardTitle className="flex items-center text-2xl">
                <Upload className="mr-2 h-6 w-6" />
                Upload Field Media
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="field-media" className="text-lg font-semibold">Choose Image or Video</Label>
                  <div className="flex items-center space-x-2">
                    <Camera className="text-green-500 dark:text-green-400" />
                    <FileVideo className="text-green-500 dark:text-green-400" />
                  </div>
                  <div className="relative">
                    <Input
                      id="field-media"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="field-media"
                      className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed border-green-300 dark:border-green-600 rounded-lg p-4 transition-colors duration-300 hover:bg-green-50 dark:hover:bg-green-900"
                    >
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-green-500 dark:text-green-400 mb-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {file ? file.name : "Click or drag file to upload"}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-300" 
                  type="submit" 
                  disabled={!file}
                >
                  {file ? 'Detect Weeds' : 'Select a file to begin'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <CardHeader className="bg-blue-500 text-white">
              <CardTitle className="flex items-center text-2xl">
                {fileType === "image" ? <ImageIcon className="mr-2 h-6 w-6" /> : <Video className="mr-2 h-6 w-6" />}
                Preview and Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {file && (
                <div className="mb-6 border-2 border-blue-200 dark:border-blue-700 rounded-lg overflow-hidden">
                  {fileType === "image" ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Field preview"
                      className="w-full h-auto"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="w-full h-auto"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
              {result && (
                <div className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg shadow">
                  <h3 className="font-semibold mb-2 flex items-center text-lg">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Detection Results:
                  </h3>
                  <p>{result}</p>
                </div>
              )}
              {!file && !result && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                  <ImageIcon className="mx-auto h-16 w-16 mb-4 text-gray-300 dark:text-gray-600" />
                  <p>No file uploaded yet. Upload a file to see the preview and results here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-12 max-w-2xl mx-auto shadow-xl bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <CardHeader className="bg-yellow-500 text-white">
            <CardTitle className="flex items-center text-2xl">
              <Sun className="mr-2 h-6 w-6" />
              Tips for Best Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-center"><Sun className="mr-2 h-5 w-5 text-yellow-500" /> Ensure your image or video is clear and well-lit</li>
              <li className="flex items-center"><Camera className="mr-2 h-5 w-5 text-blue-500" /> Try to capture a good overview of your field</li>
              <li className="flex items-center"><Video className="mr-2 h-5 w-5 text-red-500" /> If using video, pan slowly across the area of concern</li>
              <li className="flex items-center"><Sun className="mr-2 h-5 w-5 text-orange-500" /> For best results, take photos or videos during daylight hours</li>
              <li className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-purple-500" /> Make sure the file size is under 50MB for faster processing</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}