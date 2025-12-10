import React, { useImperativeHandle, forwardRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { getMouthShape } from './CharacterToMouth';

// Define the Interface (Same as before)
export interface MouthRef {
  speak: (text: string) => void;
}

const Mouth = forwardRef<MouthRef, {}>((props, ref) => {
  // 1. Replace useSharedValue with useMotionValue
  const mouthWidth = useMotionValue(70); 
  const mouthHeight = useMotionValue(10); 

  useImperativeHandle(ref, () => ({
    speak: async (text: string) => {
      // Loop character by character
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const target = getMouthShape(char);

        // 2. Replace .value = withTiming() with animate()
        // We don't await these specifically because we want them to happen 
        // while we wait for the thread delay below.
        animate(mouthWidth, target.width, { duration: 0.1 });
        animate(mouthHeight, target.height, { duration: 0.1 });

        // Wait a tiny bit before next character (simulating speech speed)
        await new Promise((resolve) => setTimeout(resolve, 80));
      }

      // Return to Neutral after speaking
      animate(mouthWidth, 70, { duration: 0.2 });
      animate(mouthHeight, 10, { duration: 0.2 });
    },
  }));

  // 3. Replace useAnimatedProps with useTransform
  // This calculates the SVG path string purely in the animation layer 
  // without triggering React Component re-renders.
  const pathD = useTransform([mouthWidth, mouthHeight], ([w, h]: any) => {
    // Calculate points centered at (150, 0)
    // Start Point: (150 - w/2, 0)
    // Control Point: (150, h * 2) -> Pulls the curve down
    // End Point: (150 + w/2, 0)
    
    const startX = 150 - w / 2;
    const endX = 150 + w / 2;
    
    // The "d" string for SVG
    return `M ${startX} 50 Q 150 ${50 + h * 2.5} ${endX} 50`;
  });

  return (
    // 4. Replace View/StyleSheet with div/style objects
    <div style={styles.container}>
      <svg height="200" width="300" viewBox="0 0 300 200">
        {/* 5. Replace AnimatedPath with motion.path */}
        <motion.path
          d={pathD}
          stroke="white"
          strokeWidth="12"
          strokeLinecap="round" 
          fill="none" 
        />
      </svg>
    </div>
  );
});

export default Mouth;

// CSS-in-JS style object
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '150px',
    backgroundColor: '#06b6d4', // Added dark background so white stroke is visible
  } as React.CSSProperties,
};