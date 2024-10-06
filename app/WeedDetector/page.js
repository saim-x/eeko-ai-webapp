'use client'
import { useState } from "react";
import { Leaf, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "../components/Header";

export default function WeedDetector() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);

  const images = [
    { id: 1, src: "/input1.jpg", result: "/output1.jpg", weeds: ["Dandelion", "Crabgrass"] },
    { id: 2, src: "/input2.jpg", result: "/output2.png", weeds: [] },
  ];

  const handleImageSelect = (image) => {
    setSelectedImage(image.src);
    setResult({ src: image.result, weeds: image.weeds });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg">
          <p className="font-semibold">Disclaimer:</p>
          <p className="text-sm sm:text-base">This page requires extensive hardware resources. It is implemented on localhost for performance reasons and is shown here for demonstration purposes.</p>
        </div>
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 sm:p-6 mb-8 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Why Weed Detection Matters</h2>
          <p className="mb-4 text-sm sm:text-base">
            Weeds in farms pose significant challenges to crop growth and yield:
          </p>
          <ul className="list-disc list-inside mb-4 text-sm sm:text-base">
            <li>They compete with crops for nutrients, water, and sunlight</li>
            <li>Weeds can harbor pests and diseases that harm crops</li>
            <li>Some weeds release chemicals that inhibit crop growth</li>
            <li>Uncontrolled weeds can significantly reduce crop yields and quality</li>
          </ul>
          <p className="font-semibold text-sm sm:text-base">
            Early detection of weeds is crucial for effective management, reducing herbicide use, and improving overall farm productivity.
          </p>
        </div>
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl mt-8 sm:mt-12 font-bold tracking-tight text-green-600 dark:text-green-400 mb-4">
            <Leaf className="inline-block mr-2 h-8 w-8 sm:h-12 sm:w-12" />
            Farm Weed Detector
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select an image to see weed detection results!
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-xl bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <CardHeader className="bg-green-500 text-white">
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                Select Input Image
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {images.map((image) => (
                  <Button
                    key={image.id}
                    onClick={() => handleImageSelect(image)}
                    className="p-0 h-auto"
                  >
                    <img
                      src={image.src}
                      alt={`Input ${image.id}`}
                      className="w-full h-auto rounded-lg"
                    />
                  </Button>
                ))}
              </div>
              {selectedImage && (
                <div className="mt-4">
                  {/* <h3 className="font-semibold mb-2 text-base sm:text-lg">
                    Selected Input Image:
                  </h3> */}
                  {/* <img
                    src={selectedImage}
                    alt="Selected Input Image"
                    className="w-full h-auto rounded-lg"
                  /> */}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <CardHeader className="bg-blue-500 text-white">
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                Detection Result
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {result ? (
                <div>
                  <img
                    src={result.src}
                    alt="Detection Result"
                    className="w-full h-auto rounded-lg mb-4"
                  />
                  <div className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg shadow">
                    <h3 className="font-semibold mb-2 flex items-center text-base sm:text-lg">
                      <AlertTriangle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Detection Results:
                    </h3>
                    {result.weeds.length > 0 ? (
                      <p className="text-sm sm:text-base">Detected weeds: {result.weeds.join(", ")}</p>
                    ) : (
                      <p className="text-sm sm:text-base">No weeds detected</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8 sm:py-12">
                  <p className="text-sm sm:text-base">Select an input image to see the detection result.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}