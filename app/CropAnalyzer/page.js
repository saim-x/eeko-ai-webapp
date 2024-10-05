'use client';
import { useState } from "react";
import { Upload, Camera, Leaf, Bug, Satellite } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Inter } from 'next/font/google';

export default function CropAnalyzer() {
  const [file, setFile] = useState(null); // Removed TypeScript type annotation
  const [analysis, setAnalysis] = useState(null); // Removed TypeScript type annotation

  const handleFileChange = (event) => { // Removed TypeScript type annotation
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleAnalysis = () => {
    // Placeholder for actual analysis logic
    setAnalysis(
      "Analysis in progress... This is where the results of the crop health and insect detection would appear, along with suggested solutions."
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl font-inter">
      <h1 className="text-3xl font-bold text-center mb-8">
        Crop Health & Insect Detection
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Upload images or videos of your crops for instant analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Upload a photo or video of your crops</li>
            <li>Our AI analyzes the data using NASA satellite information</li>
            <li>
              Receive insights on crop health and potential insect infestations
            </li>
            <li>Get tailored solutions and recommendations</li>
          </ol>
        </CardContent>
      </Card>

      <Tabs defaultValue="upload" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="capture">Capture</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image or Video</CardTitle>
              <CardDescription>Select a file from your device</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="file-upload" className="block mb-2">
                Choose File
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleAnalysis} disabled={!file}>
                <Upload className="mr-2 h-4 w-4" /> Analyze Crop
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="capture">
          <Card>
            <CardHeader>
              <CardTitle>Capture Image or Video</CardTitle>
              <CardDescription>Use your device's camera</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Camera className="mr-2 h-4 w-4" /> Open Camera
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={analysis} readOnly className="min-h-[100px]" />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Leaf className="mr-2 h-5 w-5 text-green-500" />
              Crop Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Assess the overall health and vitality of your crops.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bug className="mr-2 h-5 w-5 text-red-500" />
              Insect Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Identify potential insect infestations early.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Satellite className="mr-2 h-5 w-5 text-blue-500" />
              Satellite Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Leverage NASA satellite data for accurate analysis.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}