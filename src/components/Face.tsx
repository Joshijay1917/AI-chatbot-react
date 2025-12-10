import { useEffect, useRef, useState } from 'react'
import Mouth, { type MouthRef } from './Mouth'
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit'
import { useChat } from '../hooks/useChat'
import "./Face.css"

const Face = () => {
    const mouthRef = useRef<MouthRef>(null);
    // const speakText = "Hello human I am VirtuAI? How Can i help you?"
    const silenceTimer = useRef<any>(null);
    const [eyeAnim, seteyeAnim] = useState('')
    const [query, setquery] = useState('')
    const { askAI } = useChat()
    const { speak, voices } = useSpeechSynthesis({
        onEnd: () => {
            // This code runs ONLY when the AI finishes speaking
            console.log("AI finished speaking. Now listening...");
            listen({ lang: 'en-US', interimResults: true });
        }
    });
    const { listen, listening, stop } = useSpeechRecognition({
        onResult: (result) => {
            setquery(prev => prev + " " + result);
            if (silenceTimer.current) clearTimeout(silenceTimer.current);
            silenceTimer.current = setTimeout(() => {
                // 3. SILENCE DETECTED: User stopped talking for 2 seconds
                speakNow(query);
            }, 2000);
        },
    });

    const speakNow = async (userText: string) => {
        stop()
        // const userText = "Hello AI";
        const aiReply = await askAI(userText);
        console.log("AIREPLAY:", aiReply);
        mouthRef.current?.speak(aiReply);
        speak({ 
            text: aiReply,
            voice: voices[2]
        });
        console.log(listening);
    }

    useEffect(() => {
        speakNow("Hello AI");
        let mainTimer: any;
        let openTimer: any;

        const blink = () => {
            seteyeAnim('close');

            // 1. Timer to open the eye back up
            openTimer = setTimeout(() => {
                seteyeAnim('open');
            }, 150);

            // 2. Timer to schedule the next blink recursively
            const nextBlinkDelay = Math.random() * 4000 + 2000;
            mainTimer = setTimeout(blink, nextBlinkDelay);
        };

        // Start the first blink
        mainTimer = setTimeout(blink, 2000);

        // Cleanup: Clear BOTH timers to stop the loop and prevent errors on unmount
        return () => {
            clearTimeout(mainTimer);
            clearTimeout(openTimer);
        };
    }, []);


    return (
        <div className='container min-h-screen flex bg-[#06b6d4] items-center justify-center'>
            <div className='faceContainer flex flex-col gap-5 items-center justify-center'>
                <div className='browRow w-3/4 h-5 flex gap-6'>
                    <div className='eyeBrow w-full bg-white rounded-2xl'></div>
                    <div className='eyeBrow w-full bg-white rounded-2xl'></div>
                </div>

                <div className='eyeRow h-[160px] items-center justify-center flex gap-10'>
                    <div className={`w-[60px] h-[160px] bg-white rounded-2xl ${eyeAnim}`}></div>
                    <div className={`w-[60px] h-[160px] bg-white rounded-2xl ${eyeAnim}`}></div>
                </div>

                <Mouth ref={mouthRef} />

                {/* <button onClick={speakNow}>Speak</button> */}
                {/* <p>{query}</p> */}
            </div>
        </div>
    )
}

export default Face
