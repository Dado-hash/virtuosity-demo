import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Camera, 
  Scan, 
  MapPin, 
  Send, 
  Image, 
  Lightbulb, 
  Trash2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportData {
  type: string;
  description: string;
  location: string;
  photo?: string;
  coordinates?: { lat: number; lng: number };
}

const CitizenReporting = () => {
  const { toast } = useToast();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData>({
    type: '',
    description: '',
    location: ''
  });
  const [detectedObject, setDetectedObject] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const reportTypes = [
    { id: 'lampione', label: 'Lampione', icon: Lightbulb, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'cassonetto', label: 'Cassonetto Rifiuti', icon: Trash2, color: 'bg-green-100 text-green-800' },
    { id: 'strada', label: 'Strada/Marciapiede', icon: MapPin, color: 'bg-blue-100 text-blue-800' },
    { id: 'altro', label: 'Altro', icon: AlertCircle, color: 'bg-gray-100 text-gray-800' }
  ];

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Errore Camera",
        description: "Impossibile accedere alla fotocamera",
        variant: "destructive"
      });
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(photoDataUrl);
        
        // Mock object detection
        simulateObjectDetection();
        
        // Stop camera
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setIsCapturing(false);
      }
    }
  };

  const simulateObjectDetection = () => {
    // Simulate AI object detection
    const detectedObjects = ['lampione', 'cassonetto', 'strada'];
    const randomObject = detectedObjects[Math.floor(Math.random() * detectedObjects.length)];
    setDetectedObject(randomObject);
    setReportData(prev => ({ ...prev, type: randomObject }));
    
    toast({
      title: "Oggetto Rilevato",
      description: `Rilevato: ${reportTypes.find(t => t.id === randomObject)?.label}`,
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setReportData(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          toast({
            title: "Posizione Acquisita",
            description: "Coordinate GPS salvate con la segnalazione",
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Errore GPS",
            description: "Impossibile acquisire la posizione",
            variant: "destructive"
          });
        }
      );
    }
  };

  const submitReport = () => {
    console.log('Submit button clicked');
    
    if (!reportData.type || !reportData.description) {
      toast({
        title: "Campi Mancanti",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive"
      });
      return;
    }

    // Mock submission
    console.log('Submitting report:', reportData);
    
    // Show success dialog
    console.log('Setting showSuccessDialog to true');
    setShowSuccessDialog(true);

    // Reset form
    setReportData({ type: '', description: '', location: '' });
    setCapturedPhoto(null);
    setDetectedObject(null);
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Segnala Problema al Comune</span>
            </CardTitle>
            <CardDescription>
              Scatta una foto o scansiona l'oggetto da segnalare
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera Section */}
            <div className="space-y-4">
              {!isCapturing && !capturedPhoto && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    onClick={startCamera}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                    size="lg"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Scatta Foto
                  </Button>
                  <Button 
                    onClick={getCurrentLocation}
                    variant="outline"
                    size="lg"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Rileva Posizione
                  </Button>
                </div>
              )}

              {isCapturing && (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video 
                      ref={videoRef}
                      className="w-full max-h-64 object-cover"
                      autoPlay
                      playsInline
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-white/50 m-4 rounded-lg flex items-center justify-center">
                      <Scan className="h-12 w-12 text-white/70" />
                    </div>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button onClick={capturePhoto} size="lg">
                      <Camera className="h-5 w-5 mr-2" />
                      Cattura
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsCapturing(false);
                        if (videoRef.current?.srcObject) {
                          const stream = videoRef.current.srcObject as MediaStream;
                          stream.getTracks().forEach(track => track.stop());
                        }
                      }}
                    >
                      Annulla
                    </Button>
                  </div>
                </div>
              )}

              {capturedPhoto && (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={capturedPhoto} 
                      alt="Foto catturata" 
                      className="w-full max-h-64 object-cover rounded-lg"
                    />
                    {detectedObject && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Rilevato
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setCapturedPhoto(null);
                      setDetectedObject(null);
                    }}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Scatta Nuova Foto
                  </Button>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Report Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Tipo di Segnalazione *</label>
              <div className="grid grid-cols-2 gap-3">
                {reportTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <Button
                      key={type.id}
                      variant={reportData.type === type.id ? "default" : "outline"}
                      className={`h-auto p-3 ${reportData.type === type.id ? 'bg-blue-600 text-white' : ''}`}
                      onClick={() => setReportData(prev => ({ ...prev, type: type.id }))}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <IconComponent className="h-5 w-5" />
                        <span className="text-xs">{type.label}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Location Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Indirizzo/Località</label>
              <Input
                placeholder="es. Via Roma 123, Piazza Duomo..."
                value={reportData.location}
                onChange={(e) => setReportData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrizione Problema *</label>
              <Textarea
                placeholder="Descrivi il problema in dettaglio..."
                value={reportData.description}
                onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <Button 
              onClick={submitReport}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
              size="lg"
            >
              <Send className="h-5 w-5 mr-2" />
              Invia Segnalazione
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-600">
              Grazie per la segnalazione!
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6 py-6">
            <p className="text-center text-gray-700">
              Questo è il tuo badge premio:
            </p>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                <img 
                  src="/lovable-uploads/photo-1500673922987-e212871fec22" 
                  alt="Cittadino Virtuoso Badge" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-lg font-bold">
                Cittadino Virtuoso
              </Badge>
            </div>
            
            <Button 
              onClick={() => setShowSuccessDialog(false)}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              Chiudi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CitizenReporting;
