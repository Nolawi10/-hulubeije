import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const VoiceMode = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: 'Speech Recognition Not Supported',
        description: 'Your browser does not support the Web Speech API',
        variant: 'destructive',
      });
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(prev => prev + finalTranscript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast({
        title: 'Error',
        description: `Speech recognition error: ${event.error}`,
        variant: 'destructive',
      });
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = () => {
    if (!transcript.trim()) return;
    
    const utterance = new SpeechSynthesisUtterance(transcript);
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copied!',
        description: 'Transcript copied to clipboard',
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: 'Error',
        description: 'Failed to copy text',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Voice Mode</h1>
          <div className="flex gap-2">
            <Button
              variant={isListening ? 'destructive' : 'default'}
              onClick={toggleListening}
              className="gap-2"
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Start Listening
                </>
              )}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Voice Transcription</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  disabled={!transcript}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={speak}
                  disabled={!transcript}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Speak
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your voice transcription will appear here..."
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Voice Commands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">"New note"</p>
                <p className="text-sm text-muted-foreground">Starts a new note</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">"Clear"</p>
                <p className="text-sm text-muted-foreground">Clears the current transcription</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">"Search for [query]"</p>
                <p className="text-sm text-muted-foreground">Searches the app</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Speak clearly</p>
                <p className="text-sm text-muted-foreground">For best results, speak clearly and at a moderate pace</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Use punctuation</p>
                <p className="text-sm text-muted-foreground">Say "period", "comma", "question mark" for punctuation</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Edit as needed</p>
                <p className="text-sm text-muted-foreground">You can always edit the transcription manually</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceMode;
