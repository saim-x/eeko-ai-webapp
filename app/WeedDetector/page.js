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
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg">
          <p className="font-semibold">Disclaimer:</p>
          <p>This page requires extensive hardware resources. It is implemented on localhost for performance reasons and is shown here for demonstration purposes.</p>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-5xl mt-12 font-bold tracking-tight text-green-600 dark:text-green-400 mb-4">
            <Leaf className="inline-block mr-2 h-12 w-12" />
            Farm Weed Detector
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select an image to see weed detection results!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-xl bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <CardHeader className="bg-green-500 text-white">
              <CardTitle className="flex items-center text-2xl">
                Select Input Image
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
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
                  <h3 className="font-semibold mb-2 text-lg">
                    Selected Input Image:
                  </h3>
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
              <CardTitle className="flex items-center text-2xl">
                Detection Result
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {result ? (
                <div>
                  <img
                    src={result.src}
                    alt="Detection Result"
                    className="w-full h-auto rounded-lg mb-4"
                  />
                  <div className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg shadow">
                    <h3 className="font-semibold mb-2 flex items-center text-lg">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      Detection Results:
                    </h3>
                    {result.weeds.length > 0 ? (
                      <p>Detected weeds: {result.weeds.join(", ")}</p>
                    ) : (
                      <p>No weeds detected</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                  <p>Select an input image to see the detection result.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}